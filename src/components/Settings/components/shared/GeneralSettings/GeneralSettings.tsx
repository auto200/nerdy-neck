import { Box } from "@chakra-ui/react";
import React from "react";
import { CheckPoseIntervalInput } from "../../shared";
import { AdditionalSettings } from "./components";

type GeneralSettingsProps = {};

export const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  return (
    <Box border="1px solid gray" borderRadius="md" p="3">
      <CheckPoseIntervalInput />
      <AdditionalSettings />
    </Box>
  );
};
