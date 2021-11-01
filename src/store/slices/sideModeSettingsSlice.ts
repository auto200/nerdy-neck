import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

interface SideModeSettings {
  selectedCamId: string;
  bodySide: "left" | "right";
  getPoseIntervalInS: number;
  additional: {
    onErrorRetry: {
      enabled: boolean;
      intervalInS: number;
    };
    sound: {
      enabled: boolean;
    };
    minUpperBodyKeypointScore: number;
    minLowerBodyKeypointScore: number;
  };
  neckMonitoring: {
    enabled: boolean;
    desiredAngle: number;
    tolerance: number;
  };
  elbowMonitoring: {
    enabled: boolean;
    desiredAngle: number;
    tolerance: number;
  };
  banKneesAndAnkles: boolean;
}

const initialSideModeSettings: SideModeSettings = {
  selectedCamId: "",
  bodySide: "right",
  getPoseIntervalInS: 5,
  additional: {
    onErrorRetry: {
      enabled: false,
      intervalInS: 5,
    },
    minUpperBodyKeypointScore: 0.6,
    minLowerBodyKeypointScore: 0.2,
    sound: {
      enabled: false,
    },
  },

  neckMonitoring: {
    enabled: true,
    desiredAngle: 15,
    tolerance: 5,
  },
  elbowMonitoring: {
    enabled: false,
    desiredAngle: 90,
    tolerance: 10,
  },
  banKneesAndAnkles: false,
};

const sideModeSettingsSlice = createSlice({
  name: "sideModeSettings",
  initialState: initialSideModeSettings,
  reducers: {
    setSelectedCamId: (state, action: PayloadAction<string>) => {
      state.selectedCamId = action.payload;
    },
    toggleBodySide: (state) => {
      state.bodySide = state.bodySide === "left" ? "right" : "left";
    },
    setGetPoseIntervalInS: (state, action: PayloadAction<number>) => {
      state.getPoseIntervalInS = action.payload;
    },

    toggleAdditionalSoundEnabled: (state) => {
      state.additional.sound.enabled = !state.additional.sound.enabled;
    },
    toggleAdditionalOnErrorRetry: (state) => {
      state.additional.onErrorRetry.enabled =
        !state.additional.onErrorRetry.enabled;
    },
    setAdditionalOnErrorRetryIntervalInS: (
      state,
      action: PayloadAction<number>
    ) => {
      state.additional.onErrorRetry.intervalInS = action.payload;
    },
    setAdditionalMinUpperBodyKeypoinScore: (
      state,
      action: PayloadAction<number>
    ) => {
      state.additional.minUpperBodyKeypointScore = action.payload;
    },
    setAdditionalMinLowerBodyKeypoinScore: (
      state,
      action: PayloadAction<number>
    ) => {
      state.additional.minLowerBodyKeypointScore = action.payload;
    },

    toggleNeckMonitoring: (state) => {
      state.neckMonitoring.enabled = !state.neckMonitoring.enabled;
    },
    setNeckDesiredAngle: (state, action: PayloadAction<number>) => {
      state.neckMonitoring.desiredAngle = action.payload;
    },
    setNeckTolerance: (state, action: PayloadAction<number>) => {
      state.neckMonitoring.tolerance = action.payload;
    },

    toggleElbowMonitoring: (state) => {
      state.elbowMonitoring.enabled = !state.elbowMonitoring.enabled;
    },
    setElbowAngle: (state, action: PayloadAction<number>) => {
      state.elbowMonitoring.desiredAngle = action.payload;
    },
    setElbowTolerance: (state, action: PayloadAction<number>) => {
      state.elbowMonitoring.tolerance = action.payload;
    },

    toggleBanKneesAndAnkles: (state) => {
      state.banKneesAndAnkles = !state.banKneesAndAnkles;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedCamId,
  toggleBodySide,
  setGetPoseIntervalInS,
  toggleAdditionalSoundEnabled,
  setAdditionalMinLowerBodyKeypoinScore,
  setAdditionalMinUpperBodyKeypoinScore,
  setAdditionalOnErrorRetryIntervalInS,
  toggleAdditionalOnErrorRetry,
  setNeckDesiredAngle,
  setNeckTolerance,
  toggleNeckMonitoring,
  setElbowAngle,
  setElbowTolerance,
  toggleBanKneesAndAnkles,
  toggleElbowMonitoring,
} = sideModeSettingsSlice.actions;

export default sideModeSettingsSlice.reducer;

export const selectBodySide = (state: RootState) =>
  state.sideModeSettings.bodySide;
export const selectGetPoseIntervalInS = (state: RootState) =>
  state.sideModeSettings.getPoseIntervalInS;
export const selectAdditional = (state: RootState) =>
  state.sideModeSettings.additional;
export const selectNeckMonitoring = (state: RootState) =>
  state.sideModeSettings.neckMonitoring;
export const selectElbowMonitoring = (state: RootState) =>
  state.sideModeSettings.elbowMonitoring;
export const selectBanKneesAndAnkles = (state: RootState) =>
  state.sideModeSettings.banKneesAndAnkles;
