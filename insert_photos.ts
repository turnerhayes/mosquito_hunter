import { readFile } from "node:fs/promises";
import {resolve} from "node:path";
import { insertPhoto } from "./app/server/db";

const getFile = async (path: string) => {
    const buff = await readFile(path);

    return {
        file: buff,
        filename: "plasmodium.jpg",
        type: "image/jpeg",
    };
};

getFile(resolve(__dirname, "public/plasmodium.jpg")).then((file) => {
    return insertPhoto(file);
}).then(() => {
    console.log("Finished inserting photos");
}).catch((err) => {
    console.error("Error inserting photos:", err);
}).finally(() => {
    process.exit();
});
