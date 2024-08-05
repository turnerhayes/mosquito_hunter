"use server";

import {Client} from "pg";

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
    }: {
        file: ArrayBufferLike;
        type: string;
    }
) => {
    const client = await getClient();
    const {rows} = await client.query(`
        INSERT INTO photos (
            file,
            mime_type
        ) VALUES (
            $1,
            $2
        )
        RETURNING id
    `,
        [
            Buffer.from(file),
            type,
        ]
    );
    const id = rows[0].id;

    return id;
};

export const getPhoto = async (id: number) => {
    const client = await getClient();
    const {rows: [res,]} = await client.query(`
        SELECT filename, mime_type, file FROM photos WHERE id = ${id}
    `);

    const buff = Buffer.from(res["file"], "hex");

    const file = new File(
        [buff],
        res["filename"],
        {
            type: res["mime_type"],
        }
    );
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
