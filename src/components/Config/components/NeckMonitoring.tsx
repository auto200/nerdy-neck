import { Collapse } from "@chakra-ui/react";
import { useConfig } from "../../../contexts/ConfigContext";
import { NumberInput, Switch } from "./shared";

const NeckMonitoring = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <>
      <Switch
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
        <NumberInput
          id="neck-angle"
          label="Desired angle"
          value={config.neckMonitoring.desiredAngle || ""}
          onChange={(_, numVal) =>
            dispatchConfig({
              type: "SET_NECK_ANGLE",
              payload: numVal,
            })
          }
        />
        <NumberInput
          id="neck-tolerance"
          label="Tolerance"
          value={config.neckMonitoring.tolerance || ""}
          onChange={(_, numVal) =>
            dispatchConfig({
              type: "SET_NECK_TOLERANCE",
              payload: numVal,
            })
          }
        />
      </Collapse>
    </>
  );
};

export default NeckMonitoring;
