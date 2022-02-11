import { NumberInput } from "components/shared";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppMode } from "store/enums";
import { selectAppState } from "store/selectors";
import {
  selectGetPoseIntervalInS as frontSelectGetPoseIntervalInS,
  setGetPoseIntervalInS as frontSetGetPoseIntervalInS,
} from "store/slices/frontModeSettingsSlice";
import {
  selectGetPoseIntervalInS as sideSelectGetPoseIntervalInS,
  setGetPoseIntervalInS as sideSetGetPoseIntervalInS,
} from "store/slices/sideModeSettingsSlice";

export type CheckPoseIntervalInputProps = {};

export const CheckPoseIntervalInput: React.FC<
  CheckPoseIntervalInputProps
> = () => {
  const { appMode } = useSelector(selectAppState);
  const getPoseIntervalInS = useSelector(
    appMode === AppMode.FRONT
      ? frontSelectGetPoseIntervalInS
      : sideSelectGetPoseIntervalInS
  );

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
      value={getPoseIntervalInS || ""}
      onChange={onChange}
    />
  );
};
