import { configureStore } from "@reduxjs/toolkit";
import sideModeSettingsSlice from "./slices/sideModeSettingsSlice";

export const store = configureStore({
  reducer: {
    frontModeSettings: sideModeSettingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
