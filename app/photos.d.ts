import { LatLngTuple } from "leaflet";


export type PhotoId = string;

export interface Photo {
    id: PhotoId;
    location: LatLngTuple;
    file: File;
}