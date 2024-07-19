import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import { PhotoId } from "@/app/photos.d";
import { areLocationsEqual } from "../utils";


export interface BreedingSite {
  location: LatLngTuple;
  photoId: PhotoId;
}

export interface BreedingSitesState {
  sites: BreedingSite[];
}

const initialState: BreedingSitesState = {
  sites: [],
};

export const breedingSitesSlice = createSlice({
  name: "breeding_sites",
  initialState,
  reducers: {
    addBreedingSite(state, { payload }: PayloadAction<BreedingSite>) {
      state.sites.push(payload);
    },

    removeBreedingSite(state, { payload }: PayloadAction<LatLngTuple>) {
      const index = state.sites.findIndex((site) => areLocationsEqual(payload, site.location));

      if (index >= 0) {
        state.sites.splice(index, 1);
      }
    },
  },
});

export const { addBreedingSite, removeBreedingSite } = breedingSitesSlice.actions;

export const breedingSitesReducer = breedingSitesSlice.reducer;
