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
          label="Ban knee and ankle"
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
