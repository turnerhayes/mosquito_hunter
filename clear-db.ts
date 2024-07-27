import { clearDb } from "./app/server/db";

clearDb().then(() => {
    console.log("Finished clearing DB");
}).catch((err) => {
    console.error("Error clearing  DB:", err);
}).finally(() => {
    process.exit();
});
