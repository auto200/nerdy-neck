import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useConfig } from "../contexts/Config";

const CustomSwitch = ({
  id,
  label,
  ...rest
}: {
  id: string;
  label: string;
  [rest: string]: any;
}) => {
  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <Switch id={id} mr="1" {...rest} />
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
    </FormControl>
  );
};

const CustomInput = ({
  id,
  label,
  value,
  onChange,
  addDegreeSign = true,
  ...rest
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
  addDegreeSign?: boolean;
  [rest: string]: any;
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <NumberInput
        id={id}
        mr="1"
        value={value + `${addDegreeSign ? "°" : ""}`}
        onChange={onChange}
        {...rest}
        min={0}
      >
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );
};

const Config = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <VStack p="5" pt="0" ml="2" w="400px">
      <Heading as="h1">config:</Heading>
      <Box w="100%">
        <FormControl my={6}>
          <FormLabel htmlFor="body-side-switch" m="0">
            Body side
          </FormLabel>
          <Box>
            <chakra.span color={config.bodySide === "left" ? "blue.200" : ""}>
              Left
            </chakra.span>
            <Switch
              id="body-side-switch"
              mx={2}
              isChecked={config.bodySide === "right"}
              onChange={() => dispatchConfig({ type: "TOGGLE_BODY_SIDE" })}
              sx={{
                "& span[data-checked]": {
                  background: "rgba(255, 255, 255, 0.24)",
                },
                "& span span": {
                  background: "blue.200",
                },
                "& span[data-checked] span": {
                  background: "blue.200",
                },
              }}
            />
            <chakra.span color={config.bodySide === "right" ? "blue.200" : ""}>
              Right
            </chakra.span>
          </Box>
        </FormControl>

        <Box border="1px solid gray" borderRadius="md" p="3">
          <CustomInput
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

          <Accordion allowToggle mt="1">
            <AccordionItem borderBottom="none">
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Additional settings
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box>
                  <CustomSwitch
                    id="on-error-retry-switch"
                    label="On error interval"
                    isChecked={config.onErrorRetry.enabled}
                    onChange={() =>
                      dispatchConfig({
                        type: "TOGGLE_ON_ERROR_RETRY",
                      })
                    }
                  />
                  <Collapse in={config.onErrorRetry.enabled}>
                    <CustomInput
                      addDegreeSign={false}
                      id="on-error-retry-interval"
                      label="Retry interval (in sec)"
                      value={config.onErrorRetry.intervalInS}
                      onChange={(val) => {
                        dispatchConfig({
                          type: "SET_ON_ERROR_RETRY_INTERVAL_IN_S",
                          payload: val,
                        });
                      }}
                    />
                  </Collapse>

                  <CustomSwitch
                    id="sound-enabled-switch"
                    label="On error sound"
                    isChecked={config.sound.enabled}
                    onChange={() =>
                      dispatchConfig({ type: "TOGGLE_SOUND_ENABLED" })
                    }
                  />

                  <Divider my="2" />

                  <Tooltip label="ear, shoulder, elbow and wrist | Higher = less sensitive">
                    <Box>
                      Upper body detection threshold{" "}
                      <Box as="span" fontWeight="bold">
                        | {config.minUpperBodyKeypointScore}
                      </Box>
                    </Box>
                  </Tooltip>
                  <Slider
                    value={config.minUpperBodyKeypointScore}
                    onChange={(val) =>
                      dispatchConfig({
                        type: "SET_MIN_UPPER_BODY_KEYPOINT_SCORE",
                        payload: val,
                      })
                    }
                    aria-label="Upper body detection threshold slider"
                    min={0}
                    max={1}
                    step={0.05}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Divider my="2" />
                  <Tooltip label="knees and angles | Higher = less sensitive">
                    <Box>
                      Lower body detection threshold{" "}
                      <Box as="span" fontWeight="bold">
                        | {config.minLowerBodyKeypointScore}
                      </Box>
                    </Box>
                  </Tooltip>
                  <Slider
                    value={config.minLowerBodyKeypointScore}
                    onChange={(val) =>
                      dispatchConfig({
                        type: "SET_MIN_LOWER_BODY_KEYPOINT_SCORE",
                        payload: val,
                      })
                    }
                    aria-label="Lower body detection threshold slider"
                    min={0}
                    max={1}
                    step={0.05}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        <CustomSwitch
          id="neck-monitoring-switch"
          label="Neck angle monitoring"
          isChecked={config.neckMonitoring.enabled}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_NECK_MONITORING",
            })
          }
        />
        <Collapse in={config.neckMonitoring.enabled}>
          <CustomInput
            id="neck-angle"
            label="Desired angle"
            value={config.neckMonitoring.desiredAngle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_NECK_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="neck-tolerance"
            label="Tolerance"
            value={config.neckMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_NECK_TOLERANCE",
                payload: val,
              })
            }
          />
        </Collapse>

        <CustomSwitch
          id="elbow-switch"
          label="Elbow angle monitoring"
          isChecked={config.elbowMonitoring.enabled}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_ELBOW_MONITORING",
            })
          }
        />
        <Collapse in={config.elbowMonitoring.enabled}>
          <CustomInput
            id="elbow-angle"
            label="Desired angle"
            value={config.elbowMonitoring.desiredAngle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_ELBOW_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="elbow-tolerance"
            label="Tolerance"
            value={config.elbowMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_ELBOW_TOLERANCE",
                payload: val,
              })
            }
          />
        </Collapse>

        <CustomSwitch
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
