import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import { PhotoId } from "@/app/photos.d";


export interface Submission {
  location: LatLngTuple;
  photoId: PhotoId;
}

export interface SubmissionsState {
  submissions: Submission[];
}

const initialState: SubmissionsState = {
  submissions: [],
};

export const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    addSubmission(state, { payload }: PayloadAction<Submission>) {
      state.submissions.push(payload);
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;

export const submissionsReducer = submissionsSlice.reducer;
