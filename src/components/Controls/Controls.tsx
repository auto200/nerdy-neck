import { Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppState, selectSideModeSettings } from "store";
import { setRunning } from "store/slices/appStateSlice";
import { setSelectedCamId } from "store/slices/sideModeSettingsSlice";
import CamSelect from "./CamSelect";
import ControlButton from "./ControlButton";

const Controls = () => {
  const { cams, appReady, running } = useSelector(selectAppState);
  const { selectedCamId } = useSelector(selectSideModeSettings);
  const dispatch = useDispatch();

  return (
    <Flex m="10px">
      {cams.length !== 0 && (
        <>
          <CamSelect
            cams={cams}
            selectedCamId={selectedCamId}
            setSelectedCamId={(id: string) => dispatch(setSelectedCamId(id))}
          />

          <ControlButton
            onClick={() => dispatch(setRunning(!running))}
            isLoading={!appReady}
            running={running}
          />
        </>
      )}
    </Flex>
  );
};

export default Controls;
