import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { AppMode } from "store/enums";
import { selectFrontModeSettings, selectSideModeSettings } from "store/index";
import { selectAppMode } from "store/slices/appStateSlice";
import { frontModeActions } from "./frontModeActions";
import { sideModeActions } from "./sideModeActions";

export type CommonActions = {
  setSelectedCamId: ActionCreatorWithPayload<string, string>;
  toggleAdditionalSoundEnabled: ActionCreatorWithoutPayload;
  setAdditionalMinUpperBodyKeypointScore: ActionCreatorWithPayload<number>;
  setAdditionalMinLowerBodyKeypointScore: ActionCreatorWithPayload<number>;
  setGetPoseIntervalInS: ActionCreatorWithPayload<number>;
  toggleAdditionalOnErrorRetry: ActionCreatorWithoutPayload;
  setAdditionalOnErrorRetryIntervalInS: ActionCreatorWithPayload<number>;
};

const settingsActions = {
  [AppMode.FRONT]: frontModeActions,
  [AppMode.SIDE]: sideModeActions,
};

export const useSettings = () => {
  const sideModeSettings = useSelector(selectSideModeSettings);
  const frontModeSettings = useSelector(selectFrontModeSettings);
  const appMode = useSelector(selectAppMode);

  const isFrontMode = appMode === AppMode.FRONT;

  const settings = isFrontMode ? frontModeSettings : sideModeSettings;

  const actions: CommonActions = {
    setSelectedCamId: settingsActions[appMode].setSelectedCamId,
    toggleAdditionalSoundEnabled:
      settingsActions[appMode].toggleAdditionalSoundEnabled,
    setAdditionalMinUpperBodyKeypointScore:
      settingsActions[appMode].setAdditionalMinUpperBodyKeypointScore,
    setAdditionalMinLowerBodyKeypointScore:
      settingsActions[appMode].setAdditionalMinLowerBodyKeypointScore,
    setGetPoseIntervalInS: settingsActions[appMode].setGetPoseIntervalInS,
    toggleAdditionalOnErrorRetry:
      settingsActions[appMode].toggleAdditionalOnErrorRetry,
    setAdditionalOnErrorRetryIntervalInS:
      settingsActions[appMode].setAdditionalOnErrorRetryIntervalInS,
  };

  return {
    sideModeSettings,
    frontModeSettings,
    appMode,
    settings,
    actions,
  };
};
