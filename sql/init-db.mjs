import {resolve, dirname} from "node:path";
import { fileURLToPath } from "node:url";
import {config} from "dotenv";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename); // get the name of the directory

const Client = pg.Client;
config({
    path: resolve(__dirname, "../.env.local"),
});


async function run() {
    const client = new Client({
        connectionString: process.env["POSTGRES_URL"],
    });

    client.connect();

    try {
        await client.query("BEGIN");
        await client.query(`
            CREATE TABLE IF NOT EXISTS photos (
                id SERIAL PRIMARY KEY,
                file bytea NOT NULL,
                width int NOT NULL,
                height int NOT NULL,
                mime_type varchar(30) NOT NULL
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS traps (
                id SERIAL PRIMARY KEY,
                location POINT NOT NULL
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS breeding_sites (
                id SERIAL PRIMARY KEY,
                location POINT NOT NULL,
                photo_id INTEGER REFERENCES photos (id) NOT NULL
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS collections (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP NOT NULL,
                mosquito_count INTEGER NOT NULL,
                trap_id INTEGER REFERENCES traps (id),
                photo_id INTEGER REFERENCES photos (id)
            )
        `);
        await client.query("COMMIT");
        console.log("Finished initializing DB");
    }
    catch (ex) {
        await client.query("ROLLBACK");
        throw ex;
    }
    finally {
        await client.end();
    }
}


await run().finally(
    () => {
        process.exit();
    }
);
