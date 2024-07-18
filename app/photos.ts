import localforage from "localforage";
import {PhotoId} from "@/app/photos.d";
import { Submission } from "@/redux/slices/submissions";


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

export const getPhotosForSubmissions = async (
    submissions: Submission[]
): Promise<{[photoId: PhotoId]: File}> => {
    const files: {[photoId: PhotoId]: File} = {};

    for (const submission of submissions) {
        const photo = await localforage.getItem(
            `${PHOTOS_STORAGE_KEY_PREFIX}${submission.photoId}`
        ) as File;
        files[submission.photoId] = photo;
    }

    return files;
};

export const savePhoto = async (photo: File): Promise<PhotoId> => {
    const photoId = getPhotoId(photo);
    await localforage.setItem(`${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`, photo);
    return photoId;
};
