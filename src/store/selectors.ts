import { RootState } from "store";

export const selectSideModeSettings = (state: RootState) =>
  state.sideModeSettings;

export const selectAppState = (state: RootState) => state.appState;
