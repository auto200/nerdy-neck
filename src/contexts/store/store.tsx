import { load as loadPosenet, PoseNet } from "@tensorflow-models/posenet";
import { useCallback, useEffect, useReducer } from "react";
import { getCams, promptCameraPemission } from "utils/cams";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { initialStoreState } from "./initialStoreState";
import { localStorageKeys } from "./localStorage.keys";
import { StoreContext } from "./store.context";
import { StoreHandlers } from "./store.handlers";
import { storeReducer } from "./store.reducer";

export interface IStore {
  camPermissionGranted: boolean | null;
  cams: MediaDeviceInfo[];
  currentCamId: string;
  mediaLoaded: boolean;
  running: boolean;
  poseNet: PoseNet | null;
  appReady: boolean;
}

export const StoreContextProvider: React.FC = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStoreState);

  const setCamPermissionGranted = (payload: boolean | null) => {
    dispatch({ action: "SET_CAM_PERMISSION_GRANTED", payload });
  };

  const setCams = (payload: MediaDeviceInfo[]) => {
    dispatch({ action: "SET_CAMS", payload });
  };

  const setCurrentCamId = useCallback(
    (payload: string) => {
      dispatch({ action: "SET_CURRENT_CAM_ID", payload });
    },
    [dispatch]
  );

  const setMediaLoaded = (payload: boolean) => {
    dispatch({ action: "SET_MEDIA_LOADED", payload });
  };

  const setRunning = (payload: boolean) => {
    dispatch({ action: "SET_RUNNING", payload });
  };

  const setPoseNet = (payload: PoseNet) => {
    dispatch({ action: "SET_POSE_NET", payload });
  };

  const setAppReady = (payload: boolean) => {
    dispatch({ action: "SET_APP_READY", payload });
  };

  const storeHandlers: StoreHandlers = {
    setCamPermissionGranted,
    setCams,
    setCurrentCamId,
    setMediaLoaded,
    setRunning,
    setPoseNet,
    setAppReady,
  };

  useEffect(() => {
    const init = async () => {
      try {
        await promptCameraPemission();
        setCamPermissionGranted(true);
        setCams(await getCams());
      } catch (err) {
        console.log(err);
        setCamPermissionGranted(false);
        return;
      }

      try {
        const net = await loadPosenet({
          architecture: "ResNet50",
          inputResolution: {
            width: CAM_WIDTH,
            height: CAM_HEIGHT,
          },
          outputStride: 16,
        });
        setPoseNet(net);
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const storedId = window.localStorage.getItem(
      localStorageKeys.CURRENT_CAM_ID
    );
    setCurrentCamId(storedId || store.cams[0]?.deviceId || "");
  }, [setCurrentCamId, store.cams]);

  useEffect(() => {
    if (!store.currentCamId) return;

    window.localStorage.setItem(
      localStorageKeys.CURRENT_CAM_ID,
      store.currentCamId
    );
  }, [store.currentCamId]);

  useEffect(() => {
    if (store.mediaLoaded && store.poseNet) {
      setAppReady(true);
    }
  }, [store.mediaLoaded, store.poseNet]);

  return (
    <StoreContext.Provider
      value={{
        store,
        storeHandlers,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
