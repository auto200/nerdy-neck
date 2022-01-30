import { Box } from "@chakra-ui/react";
import React from "react";
import { CheckPoseIntervalInput } from "../shared";
import { CheckPoseIntervalInputProps } from "../shared/CheckPoseIntervalInput";
import { AdditionalSettings } from "./components";

type GeneralSettingsProps = {
  checkPoseIntervalInput: CheckPoseIntervalInputProps;
};

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  checkPoseIntervalInput,
}) => {
  return (
    <Box border="1px solid gray" borderRadius="md" p="3">
      <CheckPoseIntervalInput
        value={checkPoseIntervalInput.value}
        onChange={checkPoseIntervalInput.onChange}
      />
      <AdditionalSettings />
    </Box>
  );
};
