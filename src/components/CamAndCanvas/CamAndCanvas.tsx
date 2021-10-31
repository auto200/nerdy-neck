import { Box } from "@chakra-ui/react";
import { load as loadPosenet, Pose, PoseNet } from "@tensorflow-models/posenet";
import badPostureSound from "assets/on-error-sound.mp3";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAppState,
  selectGeneralAppState,
  selectSideModeSettings,
} from "store";
import {
  setAppReady,
  setCamPermissionGranted,
  setCams,
  setMediaLoaded,
} from "store/slices/appStateSlice";
import { setCurrentCamId } from "store/slices/generalStateSlice";
import { getCams, promptCameraPemission } from "utils/cams";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import CamPermissionNotGranted from "./CamPermissionNotGranted";
import Canvas from "./Canvas";
import PoseErrors from "./PoseErrors";
import SecToPoseCheck from "./SecToPoseCheck";

const CamAndCanvas = () => {
  const { camPermissionGranted, cams, running, mediaLoaded } =
    useSelector(selectAppState);
  const { currentCamId } = useSelector(selectGeneralAppState);
  const dispatch = useDispatch();
  const [poseNet, setPoseNet] = useState<PoseNet>();
  const sideModeSettings = useSelector(selectSideModeSettings);
  const [pose, setPose] = useState<Pose>();
  const [poseErrors, setPoseErrors] = useState<string[]>([]);

  const camVideoElRef = useRef<HTMLVideoElement>(null);
  const getPoseIntervalRef = useRef<number>();
  const audioRef = useRef(new Audio(badPostureSound));

  useEffect(() => {
    console.log("howmany times this is called");
    const init = async () => {
      try {
        await promptCameraPemission();
        dispatch(setCamPermissionGranted(true));
        const cams = await getCams();
        dispatch(setCams(cams));
        if (!currentCamId) {
          dispatch(setCurrentCamId(cams[0].id));
        }
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
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (poseNet && mediaLoaded) {
      dispatch(setAppReady(true));
    }
  }, [poseNet, dispatch, mediaLoaded]);

  useEffect(() => {
    if (!camPermissionGranted || !cams) return;

    const getStream = async () => {
      console.log(currentCamId);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: CAM_WIDTH,
            height: CAM_HEIGHT,
            deviceId: currentCamId,
          },
        });
        if (camVideoElRef.current) {
          camVideoElRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    };
    getStream();
  }, [cams, currentCamId, camPermissionGranted]);

  useEffect(() => {
    clearInterval(getPoseIntervalRef.current);

    if (!running || !poseNet || !camVideoElRef.current) return;

    const getPose = async () => {
      try {
        console.log("getting pose");
        const pose = await poseNet.estimateSinglePose(camVideoElRef.current!);
        setPose(pose);
      } catch (err) {
        console.log(err);
      }
    };

    let intervalTimeout = 0;
    if (sideModeSettings.additional.onErrorRetry.enabled && poseErrors.length) {
      intervalTimeout =
        sideModeSettings.additional.onErrorRetry.intervalInS * 1000;
    } else {
      intervalTimeout = sideModeSettings.getPoseIntervalInS * 1000;
    }

    getPoseIntervalRef.current = window.setInterval(
      getPose,
      //minimal value in case of empty interval field so app do not freeze
      //browser/tab ;not the best way to do it;
      intervalTimeout || 1000
    );
  }, [
    poseNet,
    running,
    sideModeSettings.getPoseIntervalInS,
    poseErrors.length,
    sideModeSettings.additional.onErrorRetry,
  ]);

  useEffect(() => {
    if (poseErrors.length === 0) return;

    if (
      !sideModeSettings.additional.sound.enabled &&
      !audioRef.current.paused
    ) {
      audioRef.current.pause();
      return;
    }

    if (sideModeSettings.additional.sound.enabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [poseErrors, sideModeSettings.additional.sound.enabled]);

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
            <SecToPoseCheck
              key={pose?.score}
              getPoseIntervalInS={sideModeSettings.getPoseIntervalInS}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default CamAndCanvas;
