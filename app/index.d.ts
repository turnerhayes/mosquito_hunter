import { LatLngTuple } from "leaflet";


export type PhotoId = number;

export interface PhotoDimensions {
    width: number;
    height: number;
}

export interface BreedingSite {
    id: number;
    location: LatLngTuple;
    photo_id: PhotoId;
    photo_width: number;
    photo_height: number;
}

export interface MosquitoTrap {
    id: number;
    location: LatLngTuple;
}

export type Collection = {
    id: number;
    timestamp: number;
    mosquito_count: number;
    trap_id?: number;
} & (
    {
        photo_id: number;
        photo_width: number;
        photo_height: number;
    } | {
        photo_id?: never;
        photo_width?: never;
        photo_height?: never;
    }
);
