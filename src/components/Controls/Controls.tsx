import { Button, Flex, Select } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppState } from "store";
import { setRunning } from "store/slices/appStateSlice";
import { useSettings } from "utils/hooks/useSettings";

const Controls = () => {
  const { cams, appReady, running } = useSelector(selectAppState);
  const {
    settings: { selectedCamId },
    actions: { setSelectedCamId },
  } = useSettings();
  const dispatch = useDispatch();

  return (
    <Flex m="10px">
      {cams.length !== 0 && (
        <>
          <Select
            w="60"
            value={selectedCamId}
            onChange={(e) => dispatch(setSelectedCamId(e.target.value))}
          >
            {cams.map(({ label, id }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Select>

          <Button
            onClick={() => dispatch(setRunning(!running))}
            isLoading={!appReady}
            loadingText="Loading"
          >
            {running ? "STOP" : "START"}
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Controls;
