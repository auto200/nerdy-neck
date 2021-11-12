import { Box } from "@chakra-ui/react";
import { Pose } from "@tensorflow-models/pose-detection";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppState, selectSideModeSettings } from "store";
import {
  setAppReady,
  setCamPermissionGranted,
  setCams,
  setMediaLoaded,
} from "store/slices/appStateSlice";
import { setSelectedCamId } from "store/slices/sideModeSettingsSlice";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
// @ts-ignore
//eslint-disable-next-line import/no-webpack-loader-syntax
import poseWorker from "workerize-loader!workers/pose.worker";
import { PoseWorker } from "workers/types";
import {
  CamPermissionNotGranted,
  Canvas,
  PoseCheckCountdown,
  PoseErrors,
} from "./components";
import {
  getCameraPemission,
  getCams,
  getFrameFromVideoEl,
  getStream,
} from "./utils";

const { getPose, loadDetector } = poseWorker() as PoseWorker;

const CamAndCanvas = () => {
  const { camPermissionGranted, running, mediaLoaded } =
    useSelector(selectAppState);
  const { selectedCamId } = useSelector(selectSideModeSettings);
  const sideModeSettings = useSelector(selectSideModeSettings);
  const dispatch = useDispatch();

  const [poseNetLoaded, setPoseNetLoaded] = useState(false);
  const [pose, setPose] = useState<Pose>();
  const [poseErrors, setPoseErrors] = useState<string[]>([]);

  const camVideoElRef = useRef<HTMLVideoElement>(null);
  const getPoseIntervalRef = useRef<number>();

  const getIntervalTimeout = useCallback(() => {
    if (sideModeSettings.additional.onErrorRetry.enabled && poseErrors.length) {
      return sideModeSettings.additional.onErrorRetry.intervalInS * 1000;
    }
    return sideModeSettings.getPoseIntervalInS * 1000;
  }, [
    sideModeSettings.getPoseIntervalInS,
    poseErrors.length,
    sideModeSettings.additional.onErrorRetry,
  ]);

  useEffect(() => {
    const init = async () => {
      const camPermission = await getCameraPemission();
      if (!camPermission) {
        dispatch(setCamPermissionGranted(false));
        return;
      }
      dispatch(setCamPermissionGranted(true));

      const cams = await getCams();
      if (cams.length === 0) {
        //handle case when there are no cams
        console.log("no camera devices detected");
        return;
      }
      dispatch(setCams(cams));

      if (!selectedCamId) {
        dispatch(setSelectedCamId(cams[0].id));
      }

      setPoseNetLoaded(await loadDetector());
    };
    init();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (camPermissionGranted && poseNetLoaded) {
      dispatch(setAppReady(true));
    } else {
      dispatch(setAppReady(false));
    }
  }, [camPermissionGranted, poseNetLoaded, dispatch]);

  useEffect(() => {
    if (!camPermissionGranted || !camVideoElRef.current) return;

    getStream(selectedCamId).then((stream) => {
      camVideoElRef.current!.srcObject = stream;
    });
  }, [selectedCamId, camPermissionGranted]);

  useEffect(() => {
    clearInterval(getPoseIntervalRef.current);

    if (!running || !poseNetLoaded || !camVideoElRef.current || !mediaLoaded)
      return;

    const tick = async () => {
      const frame = getFrameFromVideoEl(camVideoElRef.current!);
      if (!frame) return;

      const pose = await getPose(frame);
      setPose(pose);
    };

    const intervalTimeout = getIntervalTimeout();

    getPoseIntervalRef.current = window.setInterval(
      tick,
      //minimal value in case of empty interval field so app do not freeze
      //browser/tab ;not the best way to do it;
      intervalTimeout || 1000
    );
  }, [
    poseNetLoaded,
    running,
    mediaLoaded,
    sideModeSettings.getPoseIntervalInS,
    poseErrors.length,
    sideModeSettings.additional.onErrorRetry,
    getIntervalTimeout,
  ]);

  return (
    <Box pos="relative" minW={CAM_WIDTH} minH={CAM_HEIGHT}>
      {camPermissionGranted === false && <CamPermissionNotGranted />}
      {camPermissionGranted && (
        <>
          <Canvas
            pose={pose}
            width={CAM_WIDTH}
            height={CAM_HEIGHT}
            setPoseErrors={setPoseErrors}
          />
          <video
            autoPlay
            ref={camVideoElRef}
            width={CAM_WIDTH}
            height={CAM_HEIGHT}
            onLoadStart={() => dispatch(setMediaLoaded(false))}
            onLoadedMetadata={() => dispatch(setMediaLoaded(true))}
          />
          <PoseErrors errors={poseErrors} />
          {running && (
            <PoseCheckCountdown
              key={pose?.score}
              seconds={getIntervalTimeout() / 1000}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default CamAndCanvas;
