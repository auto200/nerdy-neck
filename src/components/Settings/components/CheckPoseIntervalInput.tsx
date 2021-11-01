import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGetPoseIntervalInS,
  setGetPoseIntervalInS,
} from "store/slices/sideModeSettingsSlice";
import { NumberInput } from "./shared";

const CheckPoseIntervalInput: React.FC = () => {
  const getPoseIntervalInS = useSelector(selectGetPoseIntervalInS);
  const dispatch = useDispatch();

  return (
    <NumberInput
      id="check-pose-interval"
      label="Check pose interval (in sec)"
      value={getPoseIntervalInS || ""}
      addDegreeSign={false}
      onChange={(val) => dispatch(setGetPoseIntervalInS(val))}
    />
  );
};
export default CheckPoseIntervalInput;
