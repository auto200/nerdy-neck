import { combineReducers } from "redux";
import appStateSlice from "./slices/appStateSlice";
import sideModeSettingsSlice from "./slices/sideModeSettingsSlice";

export const rootReducer = combineReducers({
  sideModeSettings: sideModeSettingsSlice,
  appState: appStateSlice,
});
