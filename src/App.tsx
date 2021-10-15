import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import { load as loadPosenet, PoseNet, Pose } from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import { Box, Flex } from "@chakra-ui/react";
import { useConfig } from "./contexts/ConfigContext";
import Config from "./components/Config";
import GithubLink from "./components/GithubLink";
import badPostureSound from "./assets/Chaturbate - Tip Sound - Small.mp3";
import PanicButton from "./components/PanicButton";
import { getCams, promptCameraPemission } from "./common";
import HardwareAccelerationNotice from "./components/HardwareAccelerationNotice";
import CamPermissionNotGrantedNotice from "./components/CamPermissionNotGrantedNotice";
import CamSelect from "./components/CamSelect";
import ControlButton from "./components/ControlButton";
import SecToPoseCheck from "./components/SecToPoseCheck";
import PoseErrors from "./components/PoseErrors";

const WIDTH = 600;
const HEIGHT = 500;

const App: React.FC = () => {
  const [camPermissionGranted, setCamPermissionGranted] = useState<
    boolean | null
  >(null);
  const [cams, setCams] = useState<MediaDeviceInfo[]>([]);
  const [currentCamIndex, setCurrentCamIndex] = useState(() =>
    parseInt(window.localStorage.getItem("currentCamIndex") || "0")
  );
  const [net, setNet] = useState<PoseNet>();
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [pose, setPose] = useState<Pose>();
  const [running, setRunning] = useState(false);
  const { config } = useConfig();
  const [poseErrors, setPoseErrors] = useState<string[]>([]);
  const [secToPoseCheck, setSecToPoseCheck] = useState(
    config.getPoseIntervalInS
  );

  const mediaRef = useRef<HTMLVideoElement>(null);
  const getPoseIntervalRef = useRef<number>();
  const timerIntervalToPoseCheckRef = useRef<number>();
  const audioRef = useRef(new Audio(badPostureSound));

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
            width: WIDTH,
            height: HEIGHT,
          },
          outputStride: 16,
        });
        setNet(net);
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!camPermissionGranted || !cams) return;

    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: WIDTH,
            height: HEIGHT,
            deviceId: cams[currentCamIndex]?.deviceId,
          },
        });
        if (mediaRef.current) {
          mediaRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    };
    getStream();
  }, [cams, currentCamIndex, camPermissionGranted]);

  useEffect(() => {
    clearInterval(getPoseIntervalRef.current);
    clearInterval(timerIntervalToPoseCheckRef.current);

    if (!running || !net || !mediaRef.current) return;

    let startCountdownToPoseCheckTs = Date.now();

    const getPose = async () => {
      console.log("called");

      try {
        const pose = await net.estimateSinglePose(mediaRef.current!);
        setPose(pose);
        startCountdownToPoseCheckTs = Date.now();
      } catch (err) {
        console.log(err);
      }
    };

    let intervalTimeout = 0;
    if (config.additional.onErrorRetry.enabled && poseErrors.length) {
      intervalTimeout = config.additional.onErrorRetry.intervalInS * 1000;
    } else {
      intervalTimeout = config.getPoseIntervalInS * 1000;
    }

    timerIntervalToPoseCheckRef.current = window.setInterval(() => {
      const secToPoseCheck =
        Math.abs(
          Math.round(
            (startCountdownToPoseCheckTs + intervalTimeout - Date.now()) / 1000
          ) * 1000
        ) / 1000;
      setSecToPoseCheck(secToPoseCheck);
    }, 1000);
    console.log(intervalTimeout);

    getPoseIntervalRef.current = window.setInterval(
      getPose,
      //minimal value in case of empty interval field so app do not freeze browser/tab
      intervalTimeout || 1000
    );
  }, [
    net,
    running,
    config.getPoseIntervalInS,
    poseErrors.length,
    config.additional.onErrorRetry,
  ]);

  useEffect(() => {
    window.localStorage.setItem("currentCamIndex", currentCamIndex.toString());
  }, [currentCamIndex]);

  useEffect(() => {
    if (poseErrors.length === 0) return;

    if (!config.additional.sound.enabled && !audioRef.current.paused) {
      audioRef.current.pause();
      return;
    }

    if (config.additional.sound.enabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [poseErrors, config.additional.sound.enabled]);

  return (
    <>
      <Flex flexWrap="wrap">
        <GithubLink />
        <Box>
          <Box pos="relative" minW={WIDTH} minH={HEIGHT}>
            <Canvas
              pose={pose}
              width={WIDTH}
              height={HEIGHT}
              setPoseErrors={setPoseErrors}
            />
            <video
              autoPlay
              ref={mediaRef}
              width={WIDTH}
              height={HEIGHT}
              onLoadStart={() => setMediaLoaded(false)}
              onLoadedMetadata={() => setMediaLoaded(true)}
            />
            <PoseErrors errors={poseErrors} />
            {running && <SecToPoseCheck sec={secToPoseCheck} />}
          </Box>
          <Flex m="10px">
            {cams.length !== 0 && (
              <>
                <CamSelect
                  cams={cams}
                  currentCamIndex={currentCamIndex}
                  setCurrentCamIndex={setCurrentCamIndex}
                />
                <ControlButton
                  disabled={
                    !running && (!net || !mediaRef.current || !mediaLoaded)
                  }
                  onClick={() => setRunning((x) => !x)}
                  isLoading={!net}
                  running={running}
                />
              </>
            )}
            {camPermissionGranted === false && (
              <CamPermissionNotGrantedNotice />
            )}
          </Flex>
          <HardwareAccelerationNotice />
        </Box>
        {/* config ui */}
        <Config />
      </Flex>
      <PanicButton />
    </>
  );
};

export default App;
