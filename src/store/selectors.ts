import { RootState } from "store";

export const selectAppState = (state: RootState) => state.appState;

export const selectSideModeSettings = (state: RootState) =>
  state.sideModeSettings;

export const selectFrontModeSettings = (state: RootState) =>
  state.frontModeSettings;
