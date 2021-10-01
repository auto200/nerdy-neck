import { Collapse } from "@chakra-ui/react";
import { useConfig } from "../../../../../contexts/ConfigContext";
import { NumberInput, Switch } from "../../shared";

const OnError = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <>
      <Switch
        id="on-error-retry-switch"
        label="On error interval"
        isChecked={config.additional.onErrorRetry.enabled}
        onChange={() =>
          dispatchConfig({
            type: "TOGGLE_ADDITIONAL_ON_ERROR_RETRY",
          })
        }
      />
      <Collapse in={config.additional.onErrorRetry.enabled}>
        <NumberInput
          addDegreeSign={false}
          id="on-error-retry-interval"
          label="Retry interval (in sec)"
          value={config.additional.onErrorRetry.intervalInS}
          onChange={(val) => {
            dispatchConfig({
              type: "SET_ADDITIONAL_ON_ERROR_RETRY_INTERVAL_IN_S",
              payload: val,
            });
          }}
        />
      </Collapse>
    </>
  );
};

export default OnError;
