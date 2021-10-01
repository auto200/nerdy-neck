import { Box, Heading, VStack } from "@chakra-ui/react";
import { useConfig } from "../../contexts/ConfigContext";
import {
  AdditionalSettings,
  BodySideSwitch,
  ElbowMonitoring,
  NeckMonitoring,
} from "./components";
import { NumberInput, Switch } from "./components/shared";

const Config = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <VStack p="5" pt="0" ml="2" w="400px">
      <Heading as="h1">Config:</Heading>
      <Box w="100%">
        <BodySideSwitch />
        <Box border="1px solid gray" borderRadius="md" p="3">
          <NumberInput
            id="check-pose-interval"
            label="Check pose interval (in sec)"
            value={config.getPoseIntervalInS}
            addDegreeSign={false}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_GET_POSE_INTERVAL_IN_S",
                payload: val,
              })
            }
          />
          <AdditionalSettings />
        </Box>
        <NeckMonitoring />
        <ElbowMonitoring />
        <Switch
          id="ban-knee-and-ankle-switch"
          label="Ban knees and ankles"
          isChecked={config.banKneesAndAnkles}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_BAN_KNEES_AND_ANKLES",
            })
          }
        />
      </Box>
    </VStack>
  );
};

export default Config;
