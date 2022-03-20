import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { GeneralSettings } from "../shared/GeneralSettings";
import {
  BanKneesAndAnkles,
  BodySideSwitch,
  ElbowMonitoring,
  NeckMonitoring,
} from "./components";

export const SideModeSettings: React.FC = () => {
  return (
    <>
      <Heading as="h2" fontSize="2xl" textAlign="center">
        Side Mode Settings:
      </Heading>
      <Box>
        <BodySideSwitch />
        <GeneralSettings />
        <NeckMonitoring />
        <ElbowMonitoring />
        <BanKneesAndAnkles />
      </Box>
    </>
  );
};
