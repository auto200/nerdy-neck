import { NumberInput } from "components/shared";
import React from "react";

export type CheckPoseIntervalInputProps = {
  value: number | string;
  onChange: (value: number) => void;
};

export const CheckPoseIntervalInput: React.FC<CheckPoseIntervalInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <NumberInput
      id="check-pose-interval"
      label="Check pose interval (in sec)"
      value={value || ""}
      addDegreeSign={false}
      onChange={onChange}
    />
  );
};
