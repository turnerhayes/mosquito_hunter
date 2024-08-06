export type PhotoId = number;

export interface PhotoDimensions {
    width: number;
    height: number;
}

export interface PhotoWithDimensions {
    file: File;
    dimensions: PhotoDimensions;
}
