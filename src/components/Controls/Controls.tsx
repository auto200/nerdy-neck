import { Flex } from "@chakra-ui/react";
import { useStore } from "../../contexts/store";
import CamPermissionNotGrantedNotice from "../CamPermissionNotGrantedNotice";
import CamSelect from "./CamSelect";
import ControlButton from "./ControlButton";

const Controls = () => {
  const {
    store: { cams, currentCamId, appReady, running, camPermissionGranted },
    storeHandlers: { setCurrentCamId, setRunning },
  } = useStore();
  return (
    <Flex m="10px">
      {cams.length !== 0 && (
        <>
          <CamSelect
            cams={cams}
            currentCamId={currentCamId}
            setCurrentCamId={setCurrentCamId}
          />

          <ControlButton
            onClick={() => setRunning(!running)}
            isLoading={!appReady}
            running={running}
          />
        </>
      )}
      {camPermissionGranted === false && <CamPermissionNotGrantedNotice />}
    </Flex>
  );
};

export default Controls;
