import { Collapse } from "@chakra-ui/react";
import { NumberInput, Switch } from "@components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  selectShoulderLevelMonitoring,
  setShoulderLevelDesiredAngle,
  setShoulderLevelTolerance,
  toggleShoulderLevelMonitoring,
} from "@store/slices/frontModeSettingsSlice";

export const ShoulderLevelMonitoring = () => {
  const shoulderLevelMonitoring = useSelector(selectShoulderLevelMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        label="Shoulder level monitoring"
        isChecked={shoulderLevelMonitoring.enabled}
        onChange={() => dispatch(toggleShoulderLevelMonitoring())}
      />
      <Collapse in={shoulderLevelMonitoring.enabled}>
        <NumberInput
          label="Desired angle°"
          value={shoulderLevelMonitoring.desiredAngle}
          onChange={(val) => dispatch(setShoulderLevelDesiredAngle(val))}
        />
        <NumberInput
          label="Tolerance°"
          value={shoulderLevelMonitoring.tolerance}
          onChange={(val) => dispatch(setShoulderLevelTolerance(val))}
        />
      </Collapse>
    </>
  );
};
