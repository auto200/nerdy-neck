import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

interface SideModeSettings {
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

export const sideModeSettingsSlice = createSlice({
  name: "frontModeSettings",
  initialState: initialSideModeSettings,
  reducers: {
    toggleBodySide: (state) => {
      state.bodySide = state.bodySide === "left" ? "right" : "left";
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleBodySide } = sideModeSettingsSlice.actions;

export default sideModeSettingsSlice.reducer;

export const selectBodySide = (state: RootState) =>
  state.frontModeSettings.bodySide;
