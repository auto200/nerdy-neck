import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGetPoseIntervalInS,
  setGetPoseIntervalInS,
} from "store/slices/sideModeSettingsSlice";
import { GeneralSettings } from "../shared/GeneralSettings";
import {
  BanKneesAndAnkles,
  BodySideSwitch,
  ElbowMonitoring,
  NeckMonitoring,
} from "./components";

export const SideModeSettings: React.FC = () => {
  const getPoseIntervalInS = useSelector(selectGetPoseIntervalInS);
  const dispatch = useDispatch();
  return (
    <>
      <Heading as="h2" fontSize="2xl" textAlign="center">
        Side Mode Settings:
      </Heading>
      <Box>
        <BodySideSwitch />
        <GeneralSettings
          checkPoseIntervalInput={{
            value: getPoseIntervalInS,
            onChange: (val) => dispatch(setGetPoseIntervalInS(val)),
          }}
        />
        <NeckMonitoring />
        <ElbowMonitoring />
        <BanKneesAndAnkles />
      </Box>
    </>
  );
};
