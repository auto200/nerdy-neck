import { Box } from "@chakra-ui/react";
import { Pose } from "@tensorflow-models/pose-detection";
import frontHintImg from "assets/front-angle-hint.jpg";
import sideHintImg from "assets/side-angle-hint.jpg";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PoseDetectionService } from "services/PoseDetectionService";
import { AppMode } from "store/enums";
import { selectAppState } from "store/index";
import {
  setAppReady,
  setCamPermissionGranted,
  setCams,
} from "store/slices/appStateSlice";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { useSettings } from "utils/hooks/useSettings";
import {
  CamPermissionNotGranted,
  PoseCheckCountdown,
  PoseErrors,
} from "./components";
import { getCameraPermission, getCams, getStream } from "./utils";

import Canvas from "components/Canvas/Canvas";
import { POSE_ERROR } from "utils/enums";

const poseDetectionService = new PoseDetectionService();

export const Cam = () => {
  const { camPermissionGranted, running, appReady, appMode } =
    useSelector(selectAppState);
  const {
    settings,
    actions: { setSelectedCamId },
  } = useSettings();
  const dispatch = useDispatch();

  const [pose, setPose] = useState<Pose | null>(null);
  const [poseErrors, setPoseErrors] = useState<POSE_ERROR[]>([]);
  const [poseNetLoaded, setPoseNetLoaded] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const camVideoElRef = useRef<HTMLVideoElement>(null);
  const getPoseTimeoutRef = useRef<number>();

  const intervalTimeout = useMemo(() => {
    if (settings.additional.onErrorRetry.enabled && poseErrors.length) {
      return settings.additional.onErrorRetry.intervalInS * 1000;
    }
    return settings.getPoseIntervalInS * 1000;
  }, [
    settings.getPoseIntervalInS,
    poseErrors.length,
    settings.additional.onErrorRetry,
  ]);

  useEffect(() => {
    (async () => {
      const camPermissionGranted = await getCameraPermission();
      dispatch(setCamPermissionGranted(camPermissionGranted));
      if (!camPermissionGranted) {
        return;
      }

      const cams = await getCams();

      if (cams.length === 0) {
        //TODO: handle case when there are no cams
        console.log("no camera devices detected");
        return;
      }
      dispatch(setCams(cams));

      if (!settings.selectedCamId) {
        dispatch(setSelectedCamId(cams[0].id));
      }

      try {
        await poseDetectionService.load();
        setPoseNetLoaded(true);
      } catch (err) {
        console.log(err);
        setPoseNetLoaded(false);
      }
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (camPermissionGranted && poseNetLoaded && mediaLoaded) {
      dispatch(setAppReady(true));
      return;
    }
    dispatch(setAppReady(false));
  }, [camPermissionGranted, poseNetLoaded, mediaLoaded, dispatch]);

  useEffect(() => {
    (async () => {
      if (!camPermissionGranted || !camVideoElRef.current) return;
      const stream = await getStream(settings.selectedCamId);
      camVideoElRef.current.srcObject = stream;
    })();
  }, [settings.selectedCamId, camPermissionGranted]);

  useEffect(() => {
    window.clearTimeout(getPoseTimeoutRef.current);

    if (!running || !appReady || !camVideoElRef.current) {
      setPose(null);
      setPoseErrors([]);
      return;
    }

    const getPose = async () => {
      if (!appReady || !camVideoElRef.current) return;
      const pose = await poseDetectionService.getPose(camVideoElRef.current);
      setPose(pose);

      getPoseTimeoutRef.current = window.setTimeout(getPose, intervalTimeout);
    };

    getPose();
  }, [
    appReady,
    running,
    settings.getPoseIntervalInS,
    poseErrors.length,
    settings.additional.onErrorRetry,
    intervalTimeout,
  ]);

  return (
    <Box pos="relative" minW={CAM_WIDTH} minH={CAM_HEIGHT}>
      {camPermissionGranted === false && <CamPermissionNotGranted />}
      {camPermissionGranted && (
        <>
          <motion.img
            viewport={{
              once: true,
            }}
            key={appMode}
            src={appMode === AppMode.FRONT ? frontHintImg : sideHintImg}
            initial={{ opacity: 0.9, position: "absolute", height: "100%" }}
            animate={{ opacity: 0 }}
            transition={{ duration: 3.5 }}
          />

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
            onLoadStart={() => setMediaLoaded(false)}
            onLoadedMetadata={() => setMediaLoaded(true)}
          />
          <PoseErrors errors={poseErrors} />
          {running && intervalTimeout > 1 && (
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
