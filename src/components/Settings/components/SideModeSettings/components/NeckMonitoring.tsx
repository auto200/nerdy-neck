import { Collapse } from "@chakra-ui/react";
import { NumberInput, Switch } from "components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNeckMonitoring,
  setNeckDesiredAngle,
  setNeckTolerance,
  toggleNeckMonitoring,
} from "store/slices/sideModeSettingsSlice";

export const NeckMonitoring = () => {
  const neckMonitoring = useSelector(selectNeckMonitoring);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        label="Neck angle monitoring"
        isChecked={neckMonitoring.enabled}
        onChange={() => dispatch(toggleNeckMonitoring())}
      />
      <Collapse in={neckMonitoring.enabled}>
        <NumberInput
          label="Desired angle°"
          value={neckMonitoring.desiredAngle}
          onChange={(val) => dispatch(setNeckDesiredAngle(val))}
        />
        <NumberInput
          label="Tolerance°"
          value={neckMonitoring.tolerance}
          onChange={(val) => dispatch(setNeckTolerance(val))}
        />
      </Collapse>
    </>
  );
};
