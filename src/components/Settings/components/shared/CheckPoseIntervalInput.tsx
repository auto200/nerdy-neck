import { NumberInput } from "components/shared";
import React from "react";
import { useDispatch } from "react-redux";
import { AppMode } from "store/enums";
import { setGetPoseIntervalInS as frontSetGetPoseIntervalInS } from "store/slices/frontModeSettingsSlice";
import { setGetPoseIntervalInS as sideSetGetPoseIntervalInS } from "store/slices/sideModeSettingsSlice";
import { useSettings } from "utils/hooks/useSettings";

export type CheckPoseIntervalInputProps = {};

export const CheckPoseIntervalInput: React.FC<
  CheckPoseIntervalInputProps
> = () => {
  const { settings, appMode } = useSettings();

  const getPoseIntervalInS = settings.getPoseIntervalInS;

  const onChange = (val: number) => {
    dispatch(
      appMode === AppMode.FRONT
        ? frontSetGetPoseIntervalInS(val)
        : sideSetGetPoseIntervalInS(val)
    );
  };

  const dispatch = useDispatch();
  return (
    <NumberInput
      id="check-pose-interval"
      label="Check pose interval (in sec)"
      value={getPoseIntervalInS}
      onChange={onChange}
    />
  );
};
