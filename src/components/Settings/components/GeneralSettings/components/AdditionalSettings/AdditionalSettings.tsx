import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdditional,
  setAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore,
  toggleAdditionalSoundEnabled,
} from "store/slices/sideModeSettingsSlice";
import { Switch } from "../../../shared";
import { ModelDetectionThreshold, OnError } from "./components";

export const AdditionalSettings = () => {
  const additional = useSelector(selectAdditional);
  const dispatch = useDispatch();

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
              isChecked={additional.sound.enabled}
              onChange={() => dispatch(toggleAdditionalSoundEnabled())}
            />
            <Divider my="2" />
            <ModelDetectionThreshold
              tooltip="ear, shoulder, elbow and wrist | Higher = less sensitive"
              label="Upper body detection threshold"
              value={additional.minUpperBodyKeypointScore}
              onChange={(val) =>
                dispatch(setAdditionalMinUpperBodyKeypointScore(val))
              }
            />
            <Divider my="2" />
            <ModelDetectionThreshold
              tooltip="knees and angles | Higher = less sensitive"
              label="Lower body detection threshold"
              value={additional.minLowerBodyKeypointScore}
              onChange={(val) =>
                dispatch(setAdditionalMinLowerBodyKeypointScore(val))
              }
            />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
