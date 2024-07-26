export type PhotoId = string;

export interface PhotoDimensions {
    width: number;
    height: number;
}

export interface PhotoWithDimensions {
    file: File;
    dimensions: PhotoDimensions;
}
