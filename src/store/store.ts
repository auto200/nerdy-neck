import { configureStore } from "@reduxjs/toolkit";
import sideModeSettingsSlice from "./slices/sideModeSettingsSlice";

export const store = configureStore({
  reducer: {
    sideModeSettings: sideModeSettingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const selectSideModeSettings = (state: RootState) =>
  state.sideModeSettings;
