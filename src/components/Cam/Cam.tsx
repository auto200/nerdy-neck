import { Box } from "@chakra-ui/react";
import { Pose, PoseDetectorInput } from "@tensorflow-models/pose-detection";
import frontHintImg from "@assets/front-angle-hint.jpg";
import sideHintImg from "@assets/side-angle-hint.jpg";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppMode } from "@store/enums";
import { selectAppState } from "@store/index";
import { setAppReady } from "@store/slices/appStateSlice";
import { CAM_HEIGHT, CAM_WIDTH } from "@utils/constants";
import { useSettings } from "@hooks/useSettings";
import { PoseCheckCountdown, PoseErrors } from "./components";

import Canvas from "@components/Canvas/Canvas";
import { POSE_ERROR } from "@utils/enums";

type CamProps = {
  getPose: (mediaInput: PoseDetectorInput) => Promise<Pose | null>;
  stream: MediaProvider | null;
};

export const Cam = ({ getPose, stream }: CamProps) => {
  const { running, appReady, appMode } = useSelector(selectAppState);
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const [pose, setPose] = useState<Pose | null>(null);
  const [poseErrors, setPoseErrors] = useState<POSE_ERROR[]>([]);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const camVideoElRef = useRef<HTMLVideoElement>(null);
  const getPoseTimeoutRef = useRef<number>();

  const intervalTimeoutMS = useMemo(() => {
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
    if (stream && mediaLoaded) {
      dispatch(setAppReady(true));
      return;
    }

    dispatch(setAppReady(false));
  }, [stream, mediaLoaded, dispatch]);

  useEffect(() => {
    if (!stream || !camVideoElRef.current) return;
    camVideoElRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    window.clearTimeout(getPoseTimeoutRef.current);

    if (!running || !appReady || !camVideoElRef.current) {
      setPose(null);
      setPoseErrors([]);
      return;
    }

    const analyzePose = async () => {
      if (!appReady || !camVideoElRef.current) return;
      const pose = await getPose(camVideoElRef.current);
      setPose(pose);

      getPoseTimeoutRef.current = window.setTimeout(
        analyzePose,
        intervalTimeoutMS
      );
    };

    analyzePose();
  }, [
    appReady,
    running,
    settings.getPoseIntervalInS,
    poseErrors.length,
    settings.additional.onErrorRetry,
    intervalTimeoutMS,
    getPose,
  ]);

  return (
    <Box pos="relative" minW={CAM_WIDTH} minH={CAM_HEIGHT}>
      {stream && (
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
          {running && intervalTimeoutMS > 1 && (
            <PoseCheckCountdown
              key={pose?.score}
              seconds={intervalTimeoutMS / 1000}
            />
          )}
        </>
      )}
    </Box>
  );
};
