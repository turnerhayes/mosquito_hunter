import { Pool } from "pg";

let pool: Pool | null = null;

export const getClient = async () => {
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
