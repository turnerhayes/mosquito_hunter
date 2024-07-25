import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export enum SettingName {
    SHOW_EDUCATION = "show_education",
}

const settingDefaults = {
    [SettingName.SHOW_EDUCATION]: true,
};

export type SettingsState = Partial<{ [settingName in SettingName]: typeof settingDefaults[settingName] }>;

const initialState: SettingsState = {
    ...settingDefaults,
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateSettings(state, { payload }: PayloadAction<SettingsState>) {
            for (const settingName in payload) {
                if (!payload.hasOwnProperty(settingName)) {
                    continue;
                }
                state[settingName as SettingName] = payload[
                    settingName as SettingName
                ];
            }
        },
    },
});

export const { updateSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
