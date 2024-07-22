import localforage from "localforage";
import {PhotoId} from "@/app/photos.d";
import { BreedingSite } from "@/redux/slices/breeding_sites";


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

export const getPhotosForBreedingSites = async (
    submissions: BreedingSite[]
): Promise<{[photoId: PhotoId]: File}> => {
    const files: {[photoId: PhotoId]: File} = {};

    for (const submission of submissions) {
        files[submission.photoId] = await getPhoto(submission.photoId);
    }

    return files;
};

export const getPhoto = async (photoId: PhotoId) => {
    const photo = await localforage.getItem(
        `${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`
    ) as File;

    return photo;
};

export const savePhoto = async (photo: File): Promise<PhotoId> => {
    const photoId = getPhotoId(photo);
    await localforage.setItem(`${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`, photo);
    return photoId;
};
