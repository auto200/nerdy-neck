import { Heading } from "@chakra-ui/react";
import React from "react";
import { GeneralSettings } from "../shared/GeneralSettings";
import { ShoulderLevelMonitoring } from "./components";

export const FrontModeSettings: React.FC = () => {
  return (
    <>
      <Heading as="h2" fontSize="2xl" textAlign="center" mb="5">
        Front Mode Settings:
      </Heading>
      <GeneralSettings />
      <ShoulderLevelMonitoring />
    </>
  );
};
