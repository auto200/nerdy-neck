import { Box, Image } from "@chakra-ui/react";
import { Pose } from "@tensorflow-models/pose-detection";
import frontHintImg from "assets/front-angle-hint.jpg";
import sideHintImg from "assets/side-angle-hint.jpg";
import Canvas from "components/Canvas";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PoseDetectionService } from "services/PoseDetectionService";
import { selectAppState } from "store";
import { AppMode } from "store/enums";
import {
  setAppReady,
  setCamPermissionGranted,
  setCams,
} from "store/slices/appStateSlice";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { POSE_ERROR } from "utils/enums";
import { useSettings } from "utils/hooks/useSettings";
import {
  CamPermissionNotGranted,
  PoseCheckCountdown,
  PoseErrors,
} from "./components";
import { getCameraPermission, getCams, getStream } from "./utils";

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
    if (!camPermissionGranted || !camVideoElRef.current) return;

    getStream(settings.selectedCamId).then(
      (stream) => (camVideoElRef.current!.srcObject = stream)
    );
  }, [settings.selectedCamId, camPermissionGranted]);

  useEffect(() => {
    clearTimeout(getPoseTimeoutRef.current);

    if (!running || !appReady || !camVideoElRef.current) {
      return;
    }

    const getPose = async () => {
      if (!appReady) return;
      const pose = await poseDetectionService.getPose(camVideoElRef.current!);
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
          {!running && (
            <Image
              as={motion.img}
              key={appMode}
              src={appMode === AppMode.FRONT ? frontHintImg : sideHintImg}
              pos="absolute"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition="4s"
              h="full"
            />
          )}
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
