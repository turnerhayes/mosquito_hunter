import { LatLngTuple } from "leaflet";
import localforage from "localforage";
import {Photo, PhotoId} from "@/app/photos.d";


const PHOTOS_STORAGE_KEY_PREFIX = "photos > ";

export const takePhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    return new Promise<File>((resolve, reject) => {
        const handler = (event: Event) => {
            input.removeEventListener("change", handler);
            const file = (event.target as HTMLInputElement).files?.[0];
            
            if (!file) {
                return reject(new Error("No file selected"));
            }
            return resolve(file);
        };
        
        input.addEventListener("change", handler);
        input.click();
    });
};

export const getPhotoId = (photo: File): PhotoId => {
    return `${photo.name}--${photo.lastModified}`;
};

export const getPhotos = async (): Promise<Photo[]> => {
    const keys = await localforage.keys();
    const photos: Photo[] = [];

    for (const key of keys) {
        let id: string = "";

        if (key.startsWith(PHOTOS_STORAGE_KEY_PREFIX)) {
            id = key.substring(PHOTOS_STORAGE_KEY_PREFIX.length);
            const {
                file,
                location,
            } = await localforage.getItem(key) as Pick<Photo, "file"|"location">;
            photos.push({
                id,
                file,
                location,
            });
        }
    }
    return photos;
};

export const savePhoto = async (photo: File, location: LatLngTuple): Promise<PhotoId> => {
    const photoId = getPhotoId(photo);
    await localforage.setItem(`${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`, {
        file: photo,
        location,
    });
    return photoId;
};
