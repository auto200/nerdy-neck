import { combineReducers } from "redux";
import { SliceName } from "./enums";
import appStateSlice from "./slices/appStateSlice";
import frontModeSettingsSlice from "./slices/frontModeSettingsSlice";
import sideModeSettingsSlice from "./slices/sideModeSettingsSlice";

export const rootReducer = combineReducers({
  [SliceName.appState]: appStateSlice,
  [SliceName.sideModeSettings]: sideModeSettingsSlice,
  [SliceName.frontModeSettings]: frontModeSettingsSlice,
});
