import {
  setAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS,
  setSelectedCamId,
  toggleAdditionalSoundEnabled,
  toggleAdditionalOnErrorRetry,
  setAdditionalOnErrorRetryIntervalInS,
} from "@store/slices/frontModeSettingsSlice";
import { CommonActions } from "./useSettings";

export const frontModeActions: CommonActions = {
  setAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS,
  setSelectedCamId,
  toggleAdditionalSoundEnabled,
  toggleAdditionalOnErrorRetry,
  setAdditionalOnErrorRetryIntervalInS,
};
