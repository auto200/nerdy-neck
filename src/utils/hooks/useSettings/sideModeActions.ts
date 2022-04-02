import {
  setAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS,
  setSelectedCamId,
  toggleAdditionalSoundEnabled,
  toggleAdditionalOnErrorRetry,
  setAdditionalOnErrorRetryIntervalInS,
} from "store/slices/sideModeSettingsSlice";
import { CommonActions } from "./useSettings";

export const sideModeActions: CommonActions = {
  setAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore,
  setGetPoseIntervalInS,
  setSelectedCamId,
  toggleAdditionalSoundEnabled,
  toggleAdditionalOnErrorRetry,
  setAdditionalOnErrorRetryIntervalInS,
};
