import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
} from "@chakra-ui/react";
import { Switch } from "components/shared";
import { useDispatch } from "react-redux";
import { AppMode } from "store/enums";
import { useSettings } from "utils/hooks/useSettings";
import { ModelDetectionThreshold } from "./ModelDetectionThreshold";
import { OnError } from "./OnError";

export const AdditionalSettings = () => {
  const {
    settings: { additional },
    appMode,
    actions: {
      setAdditionalMinLowerBodyKeypointScore,
      setAdditionalMinUpperBodyKeypointScore,
      toggleAdditionalSoundEnabled,
    },
  } = useSettings();

  const dispatch = useDispatch();

  const onSoundEnabledChange = () => {
    dispatch(toggleAdditionalSoundEnabled());
  };
  const onMinUpperBodyKeypointScoreChange = (val: number) => {
    dispatch(setAdditionalMinUpperBodyKeypointScore(val));
  };
  const onMinLowerBodyKeypointScoreChange = (val: number) => {
    dispatch(setAdditionalMinLowerBodyKeypointScore(val));
  };

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
              label="On error sound"
              isChecked={additional.sound.enabled}
              onChange={onSoundEnabledChange}
            />
            <Divider my="2" />
            <ModelDetectionThreshold
              tooltip="ear, shoulder, elbow and wrist | Higher = less sensitive"
              label="Upper body detection threshold"
              value={additional.minUpperBodyKeypointScore}
              onChange={onMinUpperBodyKeypointScoreChange}
            />
            {appMode === AppMode.SIDE && (
              <>
                <Divider my="2" />
                <ModelDetectionThreshold
                  tooltip="knees and angles | Higher = less sensitive"
                  label="Lower body detection threshold"
                  value={additional.minLowerBodyKeypointScore}
                  onChange={onMinLowerBodyKeypointScoreChange}
                />
              </>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
