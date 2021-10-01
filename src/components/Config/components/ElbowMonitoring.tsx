import { Box, Collapse } from "@chakra-ui/react";
import { useConfig } from "../../../contexts/ConfigContext";
import { NumberInput, Switch } from "./shared";

const ElbowMonitoring = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <>
      <Switch
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
        <NumberInput
          id="elbow-angle"
          label="Desired angle"
          value={config.elbowMonitoring.desiredAngle || ""}
          onChange={(_, numVal) =>
            dispatchConfig({
              type: "SET_ELBOW_ANGLE",
              payload: numVal,
            })
          }
        />
        <NumberInput
          id="elbow-tolerance"
          label="Tolerance"
          value={config.elbowMonitoring.tolerance || ""}
          onChange={(_, numVal) =>
            dispatchConfig({
              type: "SET_ELBOW_TOLERANCE",
              payload: numVal,
            })
          }
        />
      </Collapse>
    </>
  );
};

export default ElbowMonitoring;
