import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./slices/appStateSlice";
import generalStateSlice from "./slices/generalStateSlice";
import sideModeSettingsSlice from "./slices/sideModeSettingsSlice";

export const store = configureStore({
  reducer: {
    sideModeSettings: sideModeSettingsSlice,
    appState: appStateSlice,
    generalAppState: generalStateSlice,
  },
  // middleware:(getDefaultMiddleware)=>getDefaultMiddleware().prepend
});

export type RootState = ReturnType<typeof store.getState>;

export const selectSideModeSettings = (state: RootState) =>
  state.sideModeSettings;

export const selectAppState = (state: RootState) => state.appState;

export const selectGeneralAppState = (state: RootState) =>
  state.generalAppState;
