import {
  Box,
  Center,
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
import React from "react";
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
    <VStack p="5" pt="0" ml="2">
      <Heading as="h1">config:</Heading>
      <Box>
        <FormControl mt="6" mb="6">
          <FormLabel htmlFor="body-side-switch" m="0">
            Body side
          </FormLabel>
          <Box>
            <chakra.span color={config.bodySide === "left" ? "blue.200" : ""}>
              Left
            </chakra.span>
            <Switch
              id="body-side-switch"
              ml="2"
              mr="2"
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

        <CustomSwitch
          id="score-sliders"
          label="Show Additional settings"
          isChecked={config.keypointScoreSlidersShown}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_KEYPOINT_SCORE_SLIDERS_SHOWN",
            })
          }
        />
        <Collapse in={config.keypointScoreSlidersShown}>
          <Box p="2" maxW="220px">
            <Tooltip label="ear, shoulder, elbow and wrist" placement="top">
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
            <Tooltip label="knees and angles" placement="top">
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
        </Collapse>

        <Divider height="5" />

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
