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
            DROP TABLE IF EXISTS breeding_sites
        `);
        await client.query(`
            DROP TABLE IF EXISTS collections
        `);
        await client.query(`
            DROP TABLE IF EXISTS traps
        `);
        await client.query(`
            DROP TABLE IF EXISTS photos
        `);
        await client.query("COMMIT");
        console.log("Finished clearing DB");
    }
    catch(ex) {
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
