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
import { useDispatch, useSelector } from "react-redux";
import { selectAppState } from "store";
import { AppMode } from "store/enums";
import {
  selectAdditional as frontSelectAdditional,
  setAdditionalMinLowerBodyKeypointScore as frontSetAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore as frontSetAdditionalMinUpperBodyKeypointScore,
  toggleAdditionalSoundEnabled as frontToggleAdditionalSoundEnabled,
} from "store/slices/frontModeSettingsSlice";
import {
  selectAdditional as sideSelectAdditional,
  setAdditionalMinLowerBodyKeypointScore as sideSetAdditionalMinLowerBodyKeypointScore,
  setAdditionalMinUpperBodyKeypointScore as sideSetAdditionalMinUpperBodyKeypointScore,
  toggleAdditionalSoundEnabled as sideToggleAdditionalSoundEnabled,
} from "store/slices/sideModeSettingsSlice";
import { ModelDetectionThreshold, OnError } from "./components";

export const AdditionalSettings = () => {
  const { appMode } = useSelector(selectAppState);
  const additional = useSelector(
    appMode === AppMode.FRONT ? frontSelectAdditional : sideSelectAdditional
  );
  const dispatch = useDispatch();

  const onSoundEnabledChange = () => {
    dispatch(
      appMode === AppMode.FRONT
        ? frontToggleAdditionalSoundEnabled()
        : sideToggleAdditionalSoundEnabled()
    );
  };
  const onMinUpperBodyKeypointScoreChange = (val: number) => {
    dispatch(
      appMode === AppMode.FRONT
        ? frontSetAdditionalMinUpperBodyKeypointScore(val)
        : sideSetAdditionalMinUpperBodyKeypointScore(val)
    );
  };
  const onMinLowerBodyKeypointScoreChange = (val: number) => {
    dispatch(
      appMode === AppMode.FRONT
        ? frontSetAdditionalMinLowerBodyKeypointScore(val)
        : sideSetAdditionalMinLowerBodyKeypointScore(val)
    );
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
              id="sound-enabled-switch"
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
            {appMode === AppMode.FRONT && (
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
