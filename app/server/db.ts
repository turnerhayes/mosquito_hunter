"use server";

import { db, sql, VercelClientBase } from "@vercel/postgres";

let client: VercelClientBase|null = null;

const getClient = async () => {
    if (!client) {
        client = await db.connect();
    }

    return client;
};

const createPhotosTable = async () => {
    const client = await getClient();
    client.sql`
        CREATE TABLE IF NOT EXISTS photos (
            id SERIAL PRIMARY KEY,
            file bytea NOT NULL,
            filename varchar(100) NOT NULL,
            mime_type varchar(30) NOT NULL
        )
    `;
};

const createTrapsTable = async () => {
    const client = await getClient();
    client.sql`
        CREATE TABLE IF NOT EXISTS traps (
            location POINT
        );
    `;
};

const createBreedingSitesTable = async () => {
    const client = await getClient();
    const sql = client.sql`
        CREATE TABLE IF NOT EXISTS breeding_sites (
            location POINT,
            photo_id INTEGER REFERENCES photos (id)
        );
    `;
};

const dropTrapsTable = async () => {
    const client = await getClient();
    client.sql`
        DROP TABLE IF EXISTS traps;
    `
};

const dropBreedingSitesTable = async () => {
    const client = await getClient();
    client.sql`
        DROP TABLE IF EXISTS breeding_sites;
    `
};

const dropPhotosTable = async () => {
    const client = await getClient();
    client.sql`
        DROP TABLE IF EXISTS photos;
    `
};

export const initDb = async () => {
    const client = await getClient();
    await client.sql`BEGIN`;
    try {
        await createPhotosTable();
        await createTrapsTable();
        await createBreedingSitesTable();
        await client.sql`COMMIT`;
    }
    catch (ex) {
        await client.sql`ROLLBACK`;
    }
};

export const clearDb = async () => {
    const client = await getClient();
    await client.sql`BEGIN`;
    try {
        await dropTrapsTable();
        await dropBreedingSitesTable();
        await dropPhotosTable();
        await client.sql`COMMIT`;
    }
    catch (ex) {
        await client.sql`ROLLBACK`;
    }
};

export const insertPhoto = async (
    {
        file,
        filename,
        type,
    }: {
        file: ArrayBufferLike;
        filename: string;
        type: string;
    }
) => {
    const client = await getClient();
    await client.sql`
        INSERT INTO photos (
            file,
            filename,
            mime_type
        ) VALUES (
            ${Buffer.from(file).toString("hex")},
            ${filename},
            ${type}
        )
    `;
};

export const getPhoto = async (id: number) => {
    const client = await getClient();
    const {rows: [res,]} = await client.sql`
        SELECT filename, mime_type, file FROM photos WHERE id = ${id}
    `;

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
