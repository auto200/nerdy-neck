import { Box } from "@chakra-ui/react";
import React from "react";
import { CheckPoseIntervalInput, AdditionalSettings } from "./components";

export const GeneralSettings: React.FC = () => {
  return (
    <Box border="1px solid gray" borderRadius="md" p="3">
      <CheckPoseIntervalInput />
      <AdditionalSettings />
    </Box>
  );
};
