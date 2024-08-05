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

    // console.log(`\n\n=========\n\n${res["file"]}\n\n=========\n\n`);

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
