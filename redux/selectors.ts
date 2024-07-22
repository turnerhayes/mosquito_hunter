import { RootState } from "@/redux/store";

export const getBreedingSites = (state: RootState) =>
  state.breedingSites.sites;

export const getMosquitoTraps = (state: RootState) =>
  state.mosquitoTraps.traps;

export const getCollectionRecords = (state: RootState) =>
  state.collectionRecords.records;
