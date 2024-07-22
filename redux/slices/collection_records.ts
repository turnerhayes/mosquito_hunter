import { PhotoId } from "@/app/photos.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CollectionRecord {
    timestamp: number;
    numMosquitoes: number;
    photoId?: PhotoId;
}

export interface CollectionRecordsState {
  records: CollectionRecord[];
}

const initialState: CollectionRecordsState = {
  records: [],
};

export const collectionRecordsSlice = createSlice({
  name: "collection_records",
  initialState,
  reducers: {
    addRecord(state, { payload }: PayloadAction<CollectionRecord>) {
      state.records.push(payload);
    },
  },
});

export const { addRecord } = collectionRecordsSlice.actions;

export const collectionRecordsReducer = collectionRecordsSlice.reducer;
