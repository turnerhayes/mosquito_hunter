import { initDb } from "./app/server/db";

initDb().then(() => {
    console.log("Finished setting up DB");
}).catch((err) => {
    console.error("Error setting up DB:", err);
}).finally(() => {
    process.exit();
});
