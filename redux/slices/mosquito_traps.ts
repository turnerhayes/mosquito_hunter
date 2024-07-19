import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import { areLocationsEqual } from "../utils";


export interface MosquitoTrap {
  location: LatLngTuple;
}

export interface MosquitoTrapsState {
  traps: MosquitoTrap[];
}

const initialState: MosquitoTrapsState = {
  traps: [],
};

export const mosquitoTrapsSlice = createSlice({
  name: "mosquito_traps",
  initialState,
  reducers: {
    addMosquitoTrap(state, { payload }: PayloadAction<MosquitoTrap>) {
      state.traps.push(payload);
    },

    removeMosquitoTrap(state, { payload }: PayloadAction<LatLngTuple>) {
      const index = state.traps.findIndex((trap) => areLocationsEqual(payload, trap.location));

      if (index >= 0) {
        state.traps.splice(index, 1);
      }
    },
  },
});

export const { addMosquitoTrap, removeMosquitoTrap } = mosquitoTrapsSlice.actions;

export const mosquitoTrapsReducer = mosquitoTrapsSlice.reducer;
