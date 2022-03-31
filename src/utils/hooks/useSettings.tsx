import { useSelector } from "react-redux";
import { selectFrontModeSettings, selectSideModeSettings } from "store";
import { AppMode } from "store/enums";
import { selectAppMode } from "store/slices/appStateSlice";
import {
  setAdditionalMinLowerBodyKeypointScore as frontSetAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore as frontSetAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS as frontSetGetPoseIntervalInS,
  setSelectedCamId as frontSetSelectedCamId,
  toggleAdditionalSoundEnabled as frontToggleAdditionalSoundEnabled,
} from "store/slices/frontModeSettingsSlice";
import {
  setAdditionalMinLowerBodyKeypointScore as sideSetAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore as sideSetAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS as sideSetGetPoseIntervalInS,
  setSelectedCamId as sideSetSelectedCamId,
  toggleAdditionalSoundEnabled as sideToggleAdditionalSoundEnabled,
} from "store/slices/sideModeSettingsSlice";

export const useSettings = () => {
  const sideModeSettings = useSelector(selectSideModeSettings);
  const frontModeSettings = useSelector(selectFrontModeSettings);
  const appMode = useSelector(selectAppMode);

  const isFrontMode = appMode === AppMode.FRONT;

  const settings = isFrontMode ? frontModeSettings : sideModeSettings;

  const actions = {
    setSelectedCamId: isFrontMode
      ? frontSetSelectedCamId
      : sideSetSelectedCamId,
    toggleSoundEnabled: isFrontMode
      ? frontToggleAdditionalSoundEnabled
      : sideToggleAdditionalSoundEnabled,
    setMinUpperBodyKeypointScore: isFrontMode
      ? frontSetAdditionalMinUpperBodyKeypointScore
      : sideSetAdditionalMinUpperBodyKeypointScore,

    setMinLowerBodyKeypointScore: isFrontMode
      ? frontSetAdditionalMinLowerBodyKeypointScore
      : sideSetAdditionalMinLowerBodyKeypointScore,
    setGetPoseIntervalInS: isFrontMode
      ? frontSetGetPoseIntervalInS
      : sideSetGetPoseIntervalInS,
  };

  return {
    sideModeSettings,
    frontModeSettings,
    appMode,
    settings,
    actions,
  };
};
