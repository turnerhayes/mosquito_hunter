import {PhotoDimensions} from "@/app";

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
