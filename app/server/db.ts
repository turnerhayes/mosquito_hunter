"use server";

import { Pool, PoolClient } from "pg";
import getImageSize from "image-size";


interface Point {
    x: number;
    y: number;
}

interface CollectionRow {
    id: number;
    timestamp: number;
    mosquito_count: number;
    trap_id: number;
    photo_id: number;
    photo_width: number;
    photo_height: number;
}

export type CollectionAddArgs = {
    timestamp: number;
    mosquitoCount: number;
    trapId?: number;
} & (
        {
            photoBuffer: ArrayBufferLike;
            photoType: string;
        } | {
            photoBuffer?: never;
            photoType?: never;
        }
    )

let pool: Pool | null = null;

const getClient = async () => {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        pool.on("error", (err) => {
            console.error("Unexpected error on idle client", err);
        });
    }

    return await pool.connect();
};

export const insertPhoto = async (
    {
        file,
        type,
        client,
    }: {
        file: ArrayBufferLike;
        type: string;
        client?: PoolClient;
    }
) => {
    const { width, height } = getImageSize(new Uint8Array(file));
    if (!client) {
        client = await getClient();
    }
    const { rows } = await client.query(`
        INSERT INTO photos (
            file,
            mime_type,
            width,
            height
        ) VALUES (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING id
    `,
        [
            Buffer.from(file),
            type,
            width,
            height
        ]
    );
    const id = rows[0].id;

    return id;
};

export const removePhoto = async (id: number, client?: PoolClient) => {
    if (!client) {
        client = await getClient();
    }

    await client.query(
        'DELETE FROM photos WHERE id=$1',
        [
            id,
        ]
    );
};

export const getPhoto = async (id: number) => {
    const client = await getClient();
    const { rows: [res,], rowCount } = await client.query(`
        SELECT mime_type, file, width, height FROM photos WHERE id = ${id}
    `);

    if (rowCount !== 1) {
        return null;
    }

    const buff = Buffer.from(res["file"], "hex");

    const file = {
        buffer: buff,
        width: res["width"],
        height: res["height"],
        type: res["mime_type"],
    };
    return file;
};

export const addBreedingSite = async (
    {
        location,
        photo
    }: {
        location: [number, number];
        photo: File;
    }
): Promise<number> => {
    const client = await getClient();

    await client.query("BEGIN");

    try {
        const buffer = await photo.arrayBuffer();
        const photoId = await insertPhoto({
            file: buffer,
            type: photo.type,
            client,
        });
        const { rows } = await client.query(
            `
                INSERT INTO breeding_sites (
                    location,
                    photo_id
                ) VALUES (
                    $1,
                    $2
                )
                RETURNING id
            `,
            [
                `(${location[0]},${location[1]})`,
                photoId,
            ]
        );
        const id = rows[0].id;
        await client.query("COMMIT");
        return id;
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
};

export const removeBreedingSite = async (id: number) => {
    const client = await getClient();

    await client.query("BEGIN");
    try {
        const { rows } = await client.query<{
            photo_id: number;
        }>(
            `
                DELETE FROM breeding_sites
                WHERE id=$1
                RETURNING photo_id
            `,
            [
                id,
            ]
        );

        if (rows.length !== 1) {
            await client.query("ROLLBACK");
            return false;
        }

        const { photo_id } = rows[0];

        await removePhoto(photo_id, client);
        await client.query("COMMIT");
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
};

export const getAllBreedingSites = async () => {
    const client = await getClient();

    const { rows } = await client.query<{
        id: number;
        location: Point,
        photo_id: number;
        photo_width: number;
        photo_height: number;
    }>(
        `
            SELECT
                bs.id,
                bs.location,
                bs.photo_id,
                p.width AS photo_width,
                p.height AS photo_height
            FROM
                breeding_sites AS bs
            INNER JOIN
                photos AS p
            ON
                bs.photo_id = p.id
        `
    );

    return rows.map(
        (
            {
                id,
                location,
                photo_id,
                photo_width,
                photo_height,
            }
        ) => ({
            id,
            location: [location.x, location.y],
            photo_id,
            photo_width,
            photo_height,
        })
    );
};

export const getBreedingSite = async (
    {
        id,
    }: {
        id: number;
    }
) => {
    const client = await getClient();

    const { rows } = await client.query<{
        location: Point;
        photo_id: number;
    }>(
        `
            SELECT
                location,
                photo_id
            FROM
                breeding_sites
            WHERE
                id = $1
        `,
        [
            id,
        ]
    );

    const { location, photo_id } = rows[0];

    return {
        id,
        location: [location.x, location.y],
        photo_id,
    };
};

export const addTrap = async (
    {
        location,
    }: {
        location: [number, number];
    }
): Promise<number> => {
    const client = await getClient();

    try {
        const { rows } = await client.query<{
            id: number;
        }>(
            `
                INSERT INTO traps (
                    location
                ) VALUES (
                    $1
                )
                RETURNING id
            `,
            [
                `(${location[0]},${location[1]})`,
            ]
        );
        const id = rows[0].id;
        await client.query("COMMIT");
        return id;
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
};

export const getAllTraps = async () => {
    const client = await getClient();

    const { rows } = await client.query<{
        id: number;
        location: Point;
    }>(
        `
            SELECT
                id,
                location
            FROM
                traps
        `
    );

    return rows.map(({ id, location }) => ({
        id,
        location: [location.x, location.y],
    }));
};

export const getTrap = async (
    {
        id,
    }: {
        id: number;
    }
) => {
    const client = await getClient();

    const { rows } = await client.query<{
        location: Point;
    }>(
        `
            SELECT
                location
            FROM
                traps
            WHERE
                id = $1
        `,
        [
            id,
        ]
    );

    const { location } = rows[0];

    return {
        id,
        location: [location.x, location.y],
    };
};

export const removeMosquitoTrap = async (id: number) => {
    const client = await getClient();

    const { rows } = await client.query(
        `
            DELETE FROM traps
            WHERE id=$1
            RETURNING id
        `,
        [
            id,
        ]
    );

    return rows.length == 1;
};

export const getAllCollections = async () => {
    const client = await getClient();

    const { rows } = await client.query<CollectionRow>(
        `
            SELECT
                c.id,
                date_part('epoch', c.timestamp) AS timestamp,
                c.mosquito_count,
                c.trap_id,
                c.photo_id,
                p.width AS photo_width,
                p.height AS photo_height
            FROM
                collections AS c
            LEFT OUTER JOIN
                photos AS p
            ON
                c.photo_id = p.id
        `
    );

    return rows.map(
        ({
            id,
            timestamp,
            mosquito_count,
            trap_id,
            photo_id,
            photo_width,
            photo_height,
        }) => ({
            id,
            timestamp,
            mosquito_count,
            trap_id,
            photo_id,
            photo_width,
            photo_height,
        })
    );
};

export const getCollection = async (id: number) => {
    const client = await getClient();

    const { rows } = await client.query<
        Omit<CollectionRow, "id">
    >(
        `
            SELECT
                date_part('epoch', c.timestamp) AS timestamp,
                c.mosquito_count,
                c.trap_id,
                c.photo_id,
                p.width AS photo_width,
                p.height AS photo_height
            FROM
                collections AS c
            LEFT OUTER JOIN
                photos AS p
            ON
                c.photo_id = p.id
            WHERE c.id = $1
        `,
        [
            id,
        ]
    );

    if (rows.length === 0) {
        return null;
    }

    const {
        timestamp,
        mosquito_count,
        trap_id,
        photo_id,
        photo_width,
        photo_height,
    } = rows[0];

    return {
        id,
        timestamp,
        mosquito_count,
        trap_id,
        photo_id,
        photo_width,
        photo_height,
    };
};

export const addCollection = async (
    {
        timestamp,
        mosquitoCount,
        trapId,
        photoBuffer,
        photoType,
    }: CollectionAddArgs
) => {
    const client = await getClient();

    await client.query("BEGIN");

    try {
        let photoId: number | undefined;
        if (photoBuffer) {
            photoId = await insertPhoto({
                file: photoBuffer,
                type: photoType,
                client,
            });
        }
        const { rows } = await client.query<{
            id: number;
        }>(
            `
                INSERT INTO collections
                (
                    timestamp,
                    mosquito_count,
                    trap_id,
                    photo_id
                ) VALUES (
                    to_timestamp($1),
                    $2,
                    $3,
                    $4
                )
                RETURNING id
            `,
            [
                timestamp,
                mosquitoCount,
                trapId,
                photoId,
            ]
        );
        await client.query("COMMIT");
        return rows[0].id;
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
};

export const removeCollection = async (id: number) => {
    const client = await getClient();

    try {
        const { rows } = await client.query<{
            photo_id: number;
        }>(
            `
                DELETE FROM collections
                WHERE id = $1
                RETURNING photo_id
            `,
            [
                id,
            ]
        );

        if (rows.length !== 1) {
            await client.query("ROLLBACK");
            return false;
        }

        const { photo_id } = rows[0];

        await removePhoto(photo_id, client);
        await client.query("COMMIT");
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
};
