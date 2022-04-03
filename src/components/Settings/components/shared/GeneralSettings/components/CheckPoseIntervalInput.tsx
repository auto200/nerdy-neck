import { NumberInput } from "components/shared";
import React from "react";
import { useDispatch } from "react-redux";
import { useSettings } from "utils/hooks/useSettings";

export const CheckPoseIntervalInput: React.FC = () => {
  const {
    settings,
    actions: { setGetPoseIntervalInS },
  } = useSettings();

  const getPoseIntervalInS = settings.getPoseIntervalInS;

  const onChange = (val: number) => {
    dispatch(setGetPoseIntervalInS(val));
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
