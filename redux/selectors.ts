import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { SettingName } from "./slices/settings_slice";

export const getSettings = (state: RootState) =>
  state.settings;

export const getSetting = createSelector(
  [
    getSettings,
    (_state: RootState, settingName: SettingName) => settingName,
  ],
  (settings, settingName) => settings[settingName]
);
