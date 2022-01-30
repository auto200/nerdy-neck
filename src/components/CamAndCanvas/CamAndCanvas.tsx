import { Box } from "@chakra-ui/react";
import { Pose } from "@tensorflow-models/pose-detection";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PoseDetectionService } from "services/PoseDetectionService";
import { selectAppState, selectSideModeSettings } from "store";
import {
  setAppReady,
  setCamPermissionGranted,
  setCams,
  setMediaLoaded,
} from "store/slices/appStateSlice";
import { setSelectedCamId } from "store/slices/sideModeSettingsSlice";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { POSE_ERROR } from "utils/enums";
import {
  CamPermissionNotGranted,
  Canvas,
  PoseCheckCountdown,
  PoseErrors,
} from "./components";
import { getCameraPermission, getCams, getStream } from "./utils";

const poseDetectionService = new PoseDetectionService();

const CamAndCanvas = () => {
  const { camPermissionGranted, running, mediaLoaded } =
    useSelector(selectAppState);
  const sideModeSettings = useSelector(selectSideModeSettings);
  const dispatch = useDispatch();

  const [poseNetLoaded, setPoseNetLoaded] = useState(false);
  const [pose, setPose] = useState<Pose | null>(null);
  const [poseErrors, setPoseErrors] = useState<POSE_ERROR[]>([]);

  const camVideoElRef = useRef<HTMLVideoElement>(null);
  const getPoseTimeoutRef = useRef<number>();

  const intervalTimeout = useMemo(() => {
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
      const camPermissionGranted = await getCameraPermission();
      dispatch(setCamPermissionGranted(camPermissionGranted));
      if (!camPermissionGranted) {
        return;
      }

      const cams = await getCams();
      if (cams.length === 0) {
        //handle case when there are no cams
        console.log("no camera devices detected");
        return;
      }
      dispatch(setCams(cams));

      if (!sideModeSettings.selectedCamId) {
        dispatch(setSelectedCamId(cams[0].id));
      }

      try {
        await poseDetectionService.load();
        setPoseNetLoaded(true);
      } catch (err) {
        setPoseNetLoaded(false);
      }
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

    getStream(sideModeSettings.selectedCamId).then((stream) => {
      camVideoElRef.current!.srcObject = stream;
    });
  }, [sideModeSettings.selectedCamId, camPermissionGranted]);

  useEffect(() => {
    clearTimeout(getPoseTimeoutRef.current);

    if (!running || !poseNetLoaded || !camVideoElRef.current || !mediaLoaded) {
      return;
    }

    const tick = async () => {
      const pose = await poseDetectionService.getPose(camVideoElRef.current!);
      setPose(pose);

      getPoseTimeoutRef.current = window.setTimeout(tick, intervalTimeout);
    };

    tick();
  }, [
    poseNetLoaded,
    running,
    mediaLoaded,
    sideModeSettings.getPoseIntervalInS,
    poseErrors.length,
    sideModeSettings.additional.onErrorRetry,
    intervalTimeout,
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
          {running && !!intervalTimeout && (
            <PoseCheckCountdown
              key={pose?.score}
              seconds={intervalTimeout / 1000}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default CamAndCanvas;
