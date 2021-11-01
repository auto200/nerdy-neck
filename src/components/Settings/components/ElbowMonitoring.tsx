import { Collapse } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectElbowMonitoring,
  setElbowAngle,
  setElbowTolerance,
  toggleElbowMonitoring,
} from "store/slices/sideModeSettingsSlice";
import { NumberInput, Switch } from "./shared";

const ElbowMonitoring = () => {
  const elbowMonitoring = useSelector(selectElbowMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        id="elbow-switch"
        label="Elbow angle monitoring"
        isChecked={elbowMonitoring.enabled}
        onChange={() => dispatch(toggleElbowMonitoring())}
      />
      <Collapse in={elbowMonitoring.enabled}>
        <NumberInput
          id="elbow-angle"
          label="Desired angle"
          value={elbowMonitoring.desiredAngle || ""}
          onChange={(val) => dispatch(setElbowAngle(val))}
        />
        <NumberInput
          id="elbow-tolerance"
          label="Tolerance"
          value={elbowMonitoring.tolerance || ""}
          onChange={(val) => dispatch(setElbowTolerance(val))}
        />
      </Collapse>
    </>
  );
};

export default ElbowMonitoring;
