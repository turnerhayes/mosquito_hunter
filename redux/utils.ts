import { LatLngTuple } from "leaflet";

export const areLocationsEqual = (loc1: LatLngTuple, loc2: LatLngTuple) => {
    return loc1[0] === loc2[0] && loc1[1] === loc2[1];
};