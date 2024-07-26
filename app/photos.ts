import localforage from "localforage";
import {PhotoDimensions, PhotoId, PhotoWithDimensions} from "@/app/photos.d";
import { BreedingSite } from "@/redux/slices/breeding_sites";


const PHOTOS_STORAGE_KEY_PREFIX = "photos > ";

const useOPFS = Boolean(navigator.storage.getDirectory);

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
    return `${photo.name}--${Date.now()}`;
};

export const getPhotosForBreedingSites = async (
    submissions: BreedingSite[]
): Promise<{[photoId: PhotoId]: PhotoWithDimensions|null}> => {
    const files: {[photoId: PhotoId]: PhotoWithDimensions|null} = {};

    for (const submission of submissions) {
        files[submission.photoId] = await getPhoto(submission.photoId);
    }

    return files;
};

const getFsRoot = async () => {
    if (!navigator.storage.getDirectory) {
        return null;
    }

    const root = await navigator.storage.getDirectory();

    return root;
};

const getPhotosDirectory = async (
    create: boolean = true
): Promise<FileSystemDirectoryHandle|null> => {
    const PHOTO_DIR_NAME = "photos";
    const root = await getFsRoot();

    if (!root) {
        return null;
    }

    for await (const key of root.keys()) {
        if (key === PHOTO_DIR_NAME) {
            return await root.getDirectoryHandle(PHOTO_DIR_NAME);
        }
    }

    if (create) {
        return await root.getDirectoryHandle("photos", {
            create: true,
        });
    }

    return null;
};

const getFile = async (
    parentDir: FileSystemDirectoryHandle,
    filename: string
) => {
    for await (const key of parentDir.keys()) {
        if (key === filename) {
            const handle = await parentDir.getFileHandle(filename);
            return await handle.getFile();
        }
    }

    return null;
};

const writeFile = async (
    parentDir: FileSystemDirectoryHandle,
    filename: string,
    file: File
) => {
    let handle: FileSystemFileHandle|null = null;
    for await (const key of parentDir.keys()) {
        if (key === filename) {
            handle = await parentDir.getFileHandle(filename);
        }
    }
    handle = await parentDir.getFileHandle(filename, {
        create: true,
    });

    const writeable = await handle.createWritable();

    await writeable.write(file);
    await writeable.close();
};

export const getPhoto = async (photoId: PhotoId): Promise<PhotoWithDimensions|null> => {
    let file: File|null = null;
    if (useOPFS) {
        const photosDir = await getPhotosDirectory(false);

        if (!photosDir) {
            return null;
        }

        file = await getFile(photosDir, photoId);

    }
    else {
        file = await localforage.getItem(
            `${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`
        ) as File|null;
    }

    if (!file) {
         return null;
    }

    const dimensions = await getImageDimensions(file);

    return {
        file,
        dimensions,
    };
};

export const getImageDimensions = async (photo: File): Promise<PhotoDimensions> => {
    const img = new Image();
    const photoUrl = URL.createObjectURL(photo);
    const dimPromise = new Promise<{
        width: number;
        height: number;
    }>((resolve) => {
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            img.src = "";
            URL.revokeObjectURL(photoUrl);
        };
    });
    img.src = photoUrl;

    return dimPromise;
};

export const savePhoto = async (photo: File): Promise<PhotoId> => {
    const photoId = getPhotoId(photo);
    if (useOPFS) {
        const photosDir = await getPhotosDirectory(true);

        if (!photosDir) {
            throw new Error("Error saving photo: could not get photos directory from OPFS");
        }

        await writeFile(photosDir, photoId, photo);
    }
    else {
        await localforage.setItem(`${PHOTOS_STORAGE_KEY_PREFIX}${photoId}`, photo);
    }

    return photoId;
};
