import { Box, Heading, VStack } from "@chakra-ui/react";
import {
  AdditionalSettings,
  BodySideSwitch,
  ElbowMonitoring,
  NeckMonitoring,
} from "./components";
import BanKneesAndAnkles from "./components/BanKneesAndAnkles";
import CheckPoseIntervalInput from "./components/CheckPoseIntervalInput";

const Settings = () => {
  return (
    <VStack p="5" pt="0" ml="2" w="400px">
      <Heading as="h1">Settings:</Heading>
      <Box w="100%">
        <BodySideSwitch />
        <Box border="1px solid gray" borderRadius="md" p="3">
          <CheckPoseIntervalInput />
          <AdditionalSettings />
        </Box>
        <NeckMonitoring />
        <ElbowMonitoring />
        <BanKneesAndAnkles />
      </Box>
    </VStack>
  );
};

export default Settings;
