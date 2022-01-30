import { Heading } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGetPoseIntervalInS,
  setGetPoseIntervalInS,
} from "store/slices/frontModeSettingsSlice";
import { GeneralSettings } from "../GeneralSettings";
import { ShoulderLevelMonitoring } from "./components";

export const FrontModeSettings: React.FC = () => {
  const getPoseIntervalInS = useSelector(selectGetPoseIntervalInS);
  const dispatch = useDispatch();
  return (
    <>
      <Heading as="h2" fontSize="2xl" textAlign="center" mb="5">
        Front Mode Settings:
      </Heading>
      <GeneralSettings
        checkPoseIntervalInput={{
          value: getPoseIntervalInS,
          onChange: (val) => dispatch(setGetPoseIntervalInS(val)),
        }}
      />
      <ShoulderLevelMonitoring />
    </>
  );
};
