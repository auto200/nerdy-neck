import { Collapse } from "@chakra-ui/react";
import { NumberInput, Switch } from "components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdditional,
  setAdditionalOnErrorRetryIntervalInS,
  toggleAdditionalOnErrorRetry,
} from "store/slices/sideModeSettingsSlice";

const OnError = () => {
  const additional = useSelector(selectAdditional);
  const dispatch = useDispatch();

  return (
    <>
      <Switch
        id="on-error-retry-switch"
        label="On error interval"
        isChecked={additional.onErrorRetry.enabled}
        onChange={() => dispatch(toggleAdditionalOnErrorRetry())}
      />
      <Collapse in={additional.onErrorRetry.enabled}>
        <NumberInput
          id="on-error-retry-interval"
          label="Retry interval (in sec)"
          value={additional.onErrorRetry.intervalInS || ""}
          onChange={(val) => {
            dispatch(setAdditionalOnErrorRetryIntervalInS(val));
          }}
        />
      </Collapse>
    </>
  );
};

export default OnError;
