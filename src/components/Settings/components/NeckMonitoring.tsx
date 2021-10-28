import { Collapse } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNeckMonitoring,
  setNeckDesiredAngle,
  setNeckTolerance,
  toggleNeckMonitoring,
} from "store/slices/sideModeSettingsSlice";
import { NumberInput, Switch } from "./shared";
const NeckMonitoring = () => {
  const neckMonitoring = useSelector(selectNeckMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        id="neck-monitoring-switch"
        label="Neck angle monitoring"
        isChecked={neckMonitoring.enabled}
        onChange={() => dispatch(toggleNeckMonitoring())}
      />
      <Collapse in={neckMonitoring.enabled}>
        <NumberInput
          id="neck-angle"
          label="Desired angle"
          value={neckMonitoring.desiredAngle || ""}
          onChange={(val) => dispatch(setNeckDesiredAngle(val))}
        />
        <NumberInput
          id="neck-tolerance"
          label="Tolerance"
          value={neckMonitoring.tolerance || ""}
          onChange={(val) => dispatch(setNeckTolerance(val))}
        />
      </Collapse>
    </>
  );
};

export default NeckMonitoring;
