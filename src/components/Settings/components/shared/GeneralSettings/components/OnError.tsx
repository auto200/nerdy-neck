import { Collapse } from "@chakra-ui/react";
import { NumberInput, Switch } from "@components/shared";
import { useDispatch } from "react-redux";
import { useSettings } from "@hooks/useSettings";

export const OnError = () => {
  const {
    settings: { additional },
    actions: {
      toggleAdditionalOnErrorRetry,
      setAdditionalOnErrorRetryIntervalInS,
    },
  } = useSettings();

  const dispatch = useDispatch();

  return (
    <>
      <Switch
        label="On error interval"
        isChecked={additional.onErrorRetry.enabled}
        onChange={() => dispatch(toggleAdditionalOnErrorRetry())}
      />
      <Collapse in={additional.onErrorRetry.enabled}>
        <NumberInput
          label="Retry interval (in sec)"
          value={additional.onErrorRetry.intervalInS}
          onChange={(val) => {
            dispatch(setAdditionalOnErrorRetryIntervalInS(val));
          }}
        />
      </Collapse>
    </>
  );
};
