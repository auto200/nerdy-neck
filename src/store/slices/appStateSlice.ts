import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cam } from "utils/interfaces";

interface AppState {
  camPermissionGranted: boolean | null;
  cams: Cam[];
  mediaLoaded: boolean;
  running: boolean;
  appReady: boolean;
}

const initialAppState: AppState = {
  camPermissionGranted: null,
  cams: [],
  mediaLoaded: false,
  running: false,
  appReady: false,
};

export const appStateSlice = createSlice({
  name: "appState",
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
  },
});

// Action creators are generated for each case reducer function
export const {
  setCamPermissionGranted,
  setAppReady,
  setCams,
  setMediaLoaded,
  setRunning,
} = appStateSlice.actions;

export default appStateSlice.reducer;
