import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useConfig } from "../../../../contexts/ConfigContext";
import { OnError, ModelDetectionThreshold } from "./components";
import { Switch } from "../shared";

const AdditionalSettings = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <Accordion allowToggle mt="1">
      <AccordionItem borderBottom="none">
        <h2>
          <AccordionButton _focus={{ boxShadow: "" }}>
            <Box flex="1" textAlign="left">
              Additional settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Box>
            <OnError />
            <Switch
              id="sound-enabled-switch"
              label="On error sound"
              isChecked={config.additional.sound.enabled}
              onChange={() =>
                dispatchConfig({
                  type: "TOGGLE_ADDITIONAL_SOUND_ENABLED",
                })
              }
            />
            <Divider my="2" />
            <ModelDetectionThreshold
              tooltip="ear, shoulder, elbow and wrist | Higher = less sensitive"
              label="Upper body detection threshold"
              value={config.additional.minUpperBodyKeypointScore}
              onChange={(val) =>
                dispatchConfig({
                  type: "SET_ADDITIONAL_MIN_UPPER_BODY_KEYPOINT_SCORE",
                  payload: val,
                })
              }
            />
            <Divider my="2" />
            <ModelDetectionThreshold
              tooltip="knees and angles | Higher = less sensitive"
              label="Lower body detection threshold"
              value={config.additional.minLowerBodyKeypointScore}
              onChange={(val) =>
                dispatchConfig({
                  type: "SET_ADDITIONAL_MIN_LOWER_BODY_KEYPOINT_SCORE",
                  payload: val,
                })
              }
            />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
export default AdditionalSettings;
