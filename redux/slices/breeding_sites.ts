import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import { PhotoId } from "@/app/photos.d";


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
  },
});

export const { addBreedingSite } = breedingSitesSlice.actions;

export const breedingSitesReducer = breedingSitesSlice.reducer;
