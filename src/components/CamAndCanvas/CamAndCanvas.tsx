import { Box } from "@chakra-ui/react";
import { load as loadPosenet, Pose, PoseNet } from "@tensorflow-models/posenet";
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
import {
  CamPermissionNotGranted,
  Canvas,
  PoseCheckCountdown,
  PoseErrors,
} from "./components";
import { getCameraPemission, getCams, getStream } from "./utils";

const CamAndCanvas = () => {
  const { camPermissionGranted, running, mediaLoaded } =
    useSelector(selectAppState);
  const { selectedCamId } = useSelector(selectSideModeSettings);
  const sideModeSettings = useSelector(selectSideModeSettings);
  const dispatch = useDispatch();

  const [poseNet, setPoseNet] = useState<PoseNet>();
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
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (camPermissionGranted && poseNet) {
      dispatch(setAppReady(true));
    } else {
      dispatch(setAppReady(false));
    }
  }, [camPermissionGranted, poseNet, dispatch]);

  useEffect(() => {
    if (!camPermissionGranted || !camVideoElRef.current) return;

    getStream(selectedCamId).then((stream) => {
      camVideoElRef.current!.srcObject = stream;
    });
  }, [selectedCamId, camPermissionGranted]);

  useEffect(() => {
    clearInterval(getPoseIntervalRef.current);

    if (!running || !poseNet || !camVideoElRef.current || !mediaLoaded) return;

    const getPose = async () => {
      try {
        const startTime = performance.now();
        const pose = await poseNet.estimateSinglePose(camVideoElRef.current!);
        console.log(performance.now() - startTime);
        setPose(pose);
      } catch (err) {
        console.log(err);
      }
    };

    const intervalTimeout = getIntervalTimeout();

    getPoseIntervalRef.current = window.setInterval(
      getPose,
      //minimal value in case of empty interval field so app do not freeze
      //browser/tab ;not the best way to do it;
      intervalTimeout || 1000
    );
  }, [
    poseNet,
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
