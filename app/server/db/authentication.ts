import { getClient } from "../client";


export const getUser = async (
    {
        username,
        password,
    }: {
        username: string;
        password: string;
    }
) => {
    const client = await getClient();

    const {rows, rowCount} = await client.query<{
        id: string,
    }>(
        `
            SELECT id
            FROM users
            WHERE
                username = $1 AND
                password = crypt($2, password)
        `,
        [
            username,
            password,
        ]
    );

    if (rowCount === 0) {
        return null;
    }

    return {
        id: rows[0].id,
        username,
    };
};

export const insertUser = async (
    {
        username,
        password,
    }: {
        username: string;
        password: string;
    }
) => {
    const client = await getClient();

    const {rows, rowCount} = await client.query<{
        id: string;
    }>(
        `
            INSERT INTO users (
                id,
                username,
                password
            ) VALUES (
                gen_random_uuid(),
                $1,
                crypt($2, gen_salt('bf'))
            )
            RETURNING id
        `,
        [
            username,
            password,
        ]
    );

    if (rowCount !== 1) {
        return null;
    }

    return rows[0].id;
};

export const usernameExists = async (username: string) => {
    const client = await getClient();

    const {rowCount} = await client.query(
        `
            SELECT 1 FROM users WHERE username = $1
        `,
        [
            username,
        ]
    );

    return rowCount ?? 0 > 0;
};
