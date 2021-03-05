import {
  Box,
  chakra,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  Switch,
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
    <VStack p="5" pt="0">
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
          label="Check pose interval"
          value={config.getPoseInterval}
          addDegreeSign={false}
          onChange={(val) =>
            dispatchConfig({
              type: "SET_GET_POSE_INTERVAL",
              payload: val,
            })
          }
        />

        <CustomSwitch
          id="ear-shoulder-monitoring-switch"
          label="Ear-shoulder angle monitoring"
          isChecked={config.earShoulderMonitoring.enabled}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_EAR_SHOULDER_MONITORING",
            })
          }
        />
        <Collapse in={config.earShoulderMonitoring.enabled}>
          <CustomInput
            id="ear-shoulder-angle"
            label="Desired angle"
            value={config.earShoulderMonitoring.desiredAngle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_EAR_SHOULDER_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="ear-shoulder-tolerance"
            label="Tolerance"
            value={config.earShoulderMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_EAR_SHOULDER_TOLERANCE",
                payload: val,
              })
            }
          />
        </Collapse>

        <CustomSwitch
          id="shoulder-wrist-switch"
          label="Shoulder-wrist angle monitoring"
          isChecked={config.shoulderWristMonitoring.enabled}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_SHOULDER_WRIST_MONITORING",
            })
          }
        />
        <Collapse in={config.shoulderWristMonitoring.enabled}>
          <CustomInput
            id="shoulder-wrist-angle"
            label="Desired angle"
            value={config.shoulderWristMonitoring.desiredAngle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_SHOULDER_WRIST_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="shoulder-wrist-tolerance"
            label="Tolerance"
            value={config.shoulderWristMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_SHOULDER_WRIST_TOLERANCE",
                payload: val,
              })
            }
          />
        </Collapse>

        <CustomSwitch
          id="ban-knee-and-ankle-switch"
          label="Ban-knee-and-ankle"
          isChecked={config.banKneeAndAnkle}
          onChange={() =>
            dispatchConfig({
              type: "TOGGLE_BAN_KNEE_AND_ANKLE",
            })
          }
        />
      </Box>
    </VStack>
  );
};

export default Config;
