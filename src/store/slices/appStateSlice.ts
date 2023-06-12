import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppMode, SliceName } from "@store/enums";
import { RootState } from "@store/index";

interface AppState {
  running: boolean;
  appReady: boolean;
  appMode: AppMode;
}

const initialAppState: AppState = {
  running: false,
  appReady: false,
  appMode: AppMode.FRONT,
};

export const appStateSlice = createSlice({
  name: SliceName.appState,
  initialState: initialAppState,
  reducers: {
    setRunning: (state, action: PayloadAction<boolean>) => {
      state.running = action.payload;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.appReady = action.payload;
    },
    setAppMode: (state, action: PayloadAction<AppMode>) => {
      state.appMode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppReady, setRunning, setAppMode } = appStateSlice.actions;

export default appStateSlice.reducer;

export const selectAppMode = (state: RootState) => state.appState.appMode;
