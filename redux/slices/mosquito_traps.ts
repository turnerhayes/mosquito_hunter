import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";


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
  },
});

export const { addMosquitoTrap } = mosquitoTrapsSlice.actions;

export const mosquitoTrapsReducer = mosquitoTrapsSlice.reducer;
