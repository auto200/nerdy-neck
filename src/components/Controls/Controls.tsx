import { Box, Button, Flex, Select, Text, Tooltip } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { selectAppState } from "@store/index";
import { setRunning } from "@store/slices/appStateSlice";
import { useSettings } from "@hooks/useSettings";
import HardwareAccelerationNotice from "./HardwareAccelerationNotice";
import { UseCamControllerReturnType } from "@hooks/useCamController";

type ControlsProps = {
  camController: UseCamControllerReturnType;
};

const Controls = ({ camController }: ControlsProps) => {
  const { appReady, running } = useSelector(selectAppState);
  const {
    settings: { selectedCamId },
    actions: { setSelectedCamId },
  } = useSettings();
  const dispatch = useDispatch();

  if (camController.isPermissionGranted === null) {
    return (
      <Text>Please permit cam to be used so You can monitor Your posture</Text>
    );
  }

  if (camController.isPermissionGranted === false) {
    return null;
  }

  if (camController.cams.length === 0) {
    return <Text>No cameras detected</Text>;
  }

  return (
    <Flex m="10px" mr="0">
      <Select
        w="60"
        value={selectedCamId}
        onChange={(e) => dispatch(setSelectedCamId(e.target.value))}
      >
        {camController.cams.map(({ label, id }) => (
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

      {appReady && (
        <Box ml="auto" fontSize="xl">
          <Tooltip
            hasArrow
            label={<HardwareAccelerationNotice />}
            shouldWrapChildren
          >
            <AiOutlineInfoCircle />
          </Tooltip>
        </Box>
      )}
    </Flex>
  );
};

export default Controls;
