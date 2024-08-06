"use server";

import {Client} from "pg";
import { promisify } from "node:util";
import getImageSize from "image-size";


let client: Client|null = null;

const getClient = async () => {
    if (!client) {
        client = new Client({
            connectionString: process.env.POSTGRES_URL,
        });

        client.connect();
    }

    return client;
};

export const insertPhoto = async (
    {
        file,
        type,
        client,
    }: {
        file: ArrayBufferLike;
        type: string;
        client?: Client;
    }
) => {
    const {width, height} = getImageSize(new Uint8Array(file));
    if (!client) {
        client = await getClient();
    }
    const {rows} = await client.query(`
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

export const removePhoto = async (id: number, client?: Client) => {
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
    const {rows: [res,]} = await client.query(`
        SELECT mime_type, file, width, height FROM photos WHERE id = ${id}
    `);

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
        photo,
        photoType
    }: {
        location: [number, number];
        photo: ArrayBufferLike;
        photoType: string;
    }
): Promise<number> => {
    const client = await getClient();

    await client.query("BEGIN");

    try {
        const photoId = await insertPhoto({
            file: photo,
            type: photoType,
            client,
        });
        const {rows} = await client.query(
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
        const {rows} = await client.query<{
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

        const {photo_id} = rows[0];

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

    const {rows} = await client.query(
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

    const {rows} = await client.query(
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

    const {location, photo_id} = rows[0];

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
        const {rows} = await client.query(
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

    const {rows} = await client.query(
        `
            SELECT
                id,
                location
            FROM
                traps
        `
    );

    return rows.map(({id, location}) => ({
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

    const {rows} = await client.query(
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

    const {location} = rows[0];

    return {
        id,
        location: [location.x, location.y],
    };
};
