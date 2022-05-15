import { Collapse } from "@chakra-ui/react";
import { NumberInput, Switch } from "components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  selectElbowMonitoring,
  setElbowAngle,
  setElbowTolerance,
  toggleElbowMonitoring,
} from "store/slices/sideModeSettingsSlice";

export const ElbowMonitoring = () => {
  const elbowMonitoring = useSelector(selectElbowMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        label="Elbow angle monitoring"
        isChecked={elbowMonitoring.enabled}
        onChange={() => dispatch(toggleElbowMonitoring())}
      />
      <Collapse in={elbowMonitoring.enabled}>
        <NumberInput
          label="Desired angle°"
          value={elbowMonitoring.desiredAngle}
          onChange={(val) => dispatch(setElbowAngle(val))}
        />
        <NumberInput
          label="Tolerance°"
          value={elbowMonitoring.tolerance}
          onChange={(val) => dispatch(setElbowTolerance(val))}
        />
      </Collapse>
    </>
  );
};
