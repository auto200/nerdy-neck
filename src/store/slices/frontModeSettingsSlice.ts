import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { SliceName } from "store/enums";

interface FrontModeSettings {
  selectedCamId: string;
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
  };
  shouldersLevelMonitoring: {
    enabled: boolean;
    desiredAngle: number;
    tolerance: number;
  };
}

const initialFrontModeSettings: FrontModeSettings = {
  selectedCamId: "",
  getPoseIntervalInS: 5,
  additional: {
    onErrorRetry: {
      enabled: false,
      intervalInS: 5,
    },
    minUpperBodyKeypointScore: 0.6,
    sound: {
      enabled: false,
    },
  },
  shouldersLevelMonitoring: {
    enabled: true,
    desiredAngle: 0,
    tolerance: 3,
  },
};

const frontModeSettingsSlice = createSlice({
  name: SliceName.frontModeSettings,
  initialState: initialFrontModeSettings,
  reducers: {
    setSelectedCamId: (state, action: PayloadAction<string>) => {
      state.selectedCamId = action.payload;
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
    setAdditionalMinUpperBodyKeypointScore: (
      state,
      action: PayloadAction<number>
    ) => {
      state.additional.minUpperBodyKeypointScore = action.payload;
    },

    toggleShoulderLevelMonitoring: (state) => {
      state.shouldersLevelMonitoring.enabled =
        !state.shouldersLevelMonitoring.enabled;
    },
    setShoulderLevelDesiredAngle: (state, action: PayloadAction<number>) => {
      state.shouldersLevelMonitoring.desiredAngle = action.payload;
    },
    setShoulderLevelTolerance: (state, action: PayloadAction<number>) => {
      state.shouldersLevelMonitoring.tolerance = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  //core
  setSelectedCamId,
  setGetPoseIntervalInS,
  //TODO: additional -- how about abstracting those and sharing with side mode
  //settings (sharing logic, not actual state)
  toggleAdditionalSoundEnabled,
  setAdditionalMinUpperBodyKeypointScore,
  setAdditionalOnErrorRetryIntervalInS,
  toggleAdditionalOnErrorRetry,
  //specific
  toggleShoulderLevelMonitoring,
  setShoulderLevelDesiredAngle,
  setShoulderLevelTolerance,
} = frontModeSettingsSlice.actions;

export default frontModeSettingsSlice.reducer;

export const selectGetPoseIntervalInS = (state: RootState) =>
  state.frontModeSettings.getPoseIntervalInS;
export const selectAdditional = (state: RootState) =>
  state.frontModeSettings.additional;
export const selectShoulderLevelMonitoring = (state: RootState) =>
  state.frontModeSettings.shouldersLevelMonitoring;
