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
