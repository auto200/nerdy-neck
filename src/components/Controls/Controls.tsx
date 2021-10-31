import { Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppState, selectGeneralAppState } from "store";
import { setRunning } from "store/slices/appStateSlice";
import { setCurrentCamId } from "store/slices/generalStateSlice";
import CamSelect from "./CamSelect";
import ControlButton from "./ControlButton";

const Controls = () => {
  const { cams, appReady, running } = useSelector(selectAppState);
  const { currentCamId } = useSelector(selectGeneralAppState);
  const dispatch = useDispatch();

  return (
    <Flex m="10px">
      {cams.length !== 0 && (
        <>
          <CamSelect
            cams={cams}
            currentCamId={currentCamId}
            setCurrentCamId={(id: string) => dispatch(setCurrentCamId(id))}
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
