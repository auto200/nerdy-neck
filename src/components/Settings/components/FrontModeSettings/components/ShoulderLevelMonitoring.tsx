import { Collapse } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShoulderLevelMonitoring,
  setShoulderLevelDesiredAngle,
  setShoulderLevelTolerance,
  toggleShoulderLevelMonitoring,
} from "store/slices/frontModeSettingsSlice";
import { NumberInput, Switch } from "../../shared";

export const ShoulderLevelMonitoring = () => {
  const shoulderLevelMonitoring = useSelector(selectShoulderLevelMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        id="elbow-switch"
        label="Elbow angle monitoring"
        isChecked={shoulderLevelMonitoring.enabled}
        onChange={() => dispatch(toggleShoulderLevelMonitoring())}
      />
      <Collapse in={shoulderLevelMonitoring.enabled}>
        <NumberInput
          id="elbow-angle"
          label="Desired angle"
          value={shoulderLevelMonitoring.desiredAngle || ""}
          onChange={(val) => dispatch(setShoulderLevelDesiredAngle(val))}
        />
        <NumberInput
          id="elbow-tolerance"
          label="Tolerance"
          value={shoulderLevelMonitoring.tolerance || ""}
          onChange={(val) => dispatch(setShoulderLevelTolerance(val))}
        />
      </Collapse>
    </>
  );
};
