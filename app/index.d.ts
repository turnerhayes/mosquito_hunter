import { LatLngTuple } from "leaflet";
import { PhotoId } from "./photos";

export enum LoggingType {
    BREEDING_SITE = "breeding_site",
    MOSQUITO_TRAP = "mosquito_trap",
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
