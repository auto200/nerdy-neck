import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { AppMode, SliceName } from "store/enums";
import { Cam } from "utils/models";

interface AppState {
  camPermissionGranted: boolean | null;
  cams: Cam[];
  mediaLoaded: boolean;
  running: boolean;
  appReady: boolean;
  appMode: AppMode;
}

const initialAppState: AppState = {
  camPermissionGranted: null,
  cams: [],
  mediaLoaded: false,
  running: false,
  appReady: false,
  appMode: AppMode.FRONT,
};

export const appStateSlice = createSlice({
  name: SliceName.appState,
  initialState: initialAppState,
  reducers: {
    setCamPermissionGranted: (state, action: PayloadAction<boolean | null>) => {
      state.camPermissionGranted = action.payload;
    },
    setCams: (state, action: PayloadAction<Cam[]>) => {
      state.cams = action.payload;
    },
    setMediaLoaded: (state, action: PayloadAction<boolean>) => {
      state.mediaLoaded = action.payload;
    },
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
export const {
  setCamPermissionGranted,
  setAppReady,
  setCams,
  setMediaLoaded,
  setRunning,
  setAppMode,
} = appStateSlice.actions;

export default appStateSlice.reducer;

export const selectAppMode = (state: RootState) => state.appState.appMode;
