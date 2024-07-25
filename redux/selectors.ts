import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { SettingName } from "./slices/settings_slice";

export const getBreedingSites = (state: RootState) =>
  state.breedingSites.sites;

export const getMosquitoTraps = (state: RootState) =>
  state.mosquitoTraps.traps;

export const getCollectionRecords = (state: RootState) =>
  state.collectionRecords.records;

export const getSettings = (state: RootState) =>
  state.settings;

export const getSetting = createSelector(
  [
    getSettings,
    (state: RootState, settingName: SettingName) => settingName,
  ],
  (settings, settingName) => settings[settingName]
);
