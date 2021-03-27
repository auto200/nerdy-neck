import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import { load as loadPosenet, PoseNet, Pose } from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import { Box, Button, Flex, Heading, Select } from "@chakra-ui/react";
import { useConfig } from "./contexts/Config";
import Config from "./components/Config";
import GithubLink from "./components/GithubLink";
import badPostureSound from "./assets/Chaturbate - Tip Sound - Small.mp3";
import PanicButton from "./components/PanicButton";

const WIDTH = 600;
const HEIGHT = 500;

const promptCameraPemission = () => {
  window.navigator.mediaDevices.getUserMedia({
    video: true,
  });
};

const getCams = async () => {
  const devices = await window.navigator.mediaDevices.enumerateDevices();
  const cams = devices.filter(
    ({ kind, deviceId, label }) => kind === "videoinput" && deviceId && label
  );
  return cams;
};

function App() {
  const [camPermissionGranted, setCamPermissionGranted] = useState<boolean>(
    false
  );
  const [cams, setCams] = useState<MediaDeviceInfo[]>();
  const [currentCamIndex, setCurrentCamIndex] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem("currentCamIndex"));
    return !isNaN(stored) ? stored : 0;
  });
  const [net, setNet] = useState<PoseNet>();
  const [loadingNet, setLoadingNet] = useState<boolean>(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [pose, setPose] = useState<Pose>();
  const [running, setRunning] = useState<boolean>(false);
  const { config } = useConfig();
  const [poseErrors, setPoseErrors] = useState<string[]>([]);

  const mediaRef = useRef<HTMLVideoElement>(null);
  const runningRef = useRef(running);
  const getPoseIntervalRef = useRef<number>();
  const audioRef = useRef(new Audio(badPostureSound));

  useEffect(() => {
    const init = async () => {
      try {
        //tested on chrome, 4sure not working on firefox
        const camPermission = await window.navigator.permissions.query({
          name: "camera",
        });

        if (camPermission.state === "granted") {
          setCamPermissionGranted(true);
          setCams(await getCams());
        } else {
          promptCameraPemission();
        }

        camPermission.addEventListener("change", async function () {
          if (this.state === "granted") {
            setCamPermissionGranted(true);
            setCams(await getCams());
          } else {
            setCamPermissionGranted(false);
          }
        });
      } catch (err) {
        console.log(err);
      }

      try {
        setLoadingNet(true);
        const net = await loadPosenet({
          architecture: "ResNet50",
          inputResolution: {
            width: WIDTH,
            height: HEIGHT,
          },
          outputStride: 16,
        });
        setNet(net);
        setLoadingNet(false);
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const getStream = async () => {
      if (!camPermissionGranted || !cams) return;

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
    runningRef.current = running;
    clearInterval(getPoseIntervalRef.current);
    if (!running || !net || !mediaRef.current) return;

    const getPose = async () => {
      try {
        const pose = await net.estimateSinglePose(mediaRef.current!);
        setPose(pose);
      } catch (err) {
        console.log(err);
      }
    };

    if (config.additional.onErrorRetry.enabled && poseErrors.length) {
      getPoseIntervalRef.current = window.setInterval(
        getPose,
        Number(config.additional.onErrorRetry.intervalInS) * 1000
      );
    } else {
      getPoseIntervalRef.current = window.setInterval(
        getPose,
        Number(config.getPoseIntervalInS) * 1000
      );
    }
  }, [
    running,
    config.getPoseIntervalInS,
    poseErrors.length,
    config.additional.onErrorRetry,
  ]);

  useEffect(() => {
    window.localStorage.setItem("currentCamIndex", currentCamIndex.toString());
  }, [currentCamIndex]);

  useEffect(() => {
    if (!poseErrors.length) return;

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
              onLoadedMetadata={() => setMediaLoaded(true)}
            />
            <Box pos="absolute" top="0" left="2">
              {poseErrors.map((err, i) => (
                <Box
                  key={i}
                  color="red.500"
                  fontSize="3xl"
                  fontWeight="bold"
                  sx={{ WebkitTextStroke: "1px rgba(0, 0, 0, 0.7)" }}
                >
                  {err}
                </Box>
              ))}
            </Box>
          </Box>
          <Flex>
            {!!cams?.length && (
              <>
                <Select
                  w="60"
                  value={cams[currentCamIndex]?.deviceId}
                  onChange={(e) => {
                    const camIndex = cams.findIndex(
                      ({ deviceId }) => deviceId === e.target.value
                    );
                    camIndex > -1 && setCurrentCamIndex(camIndex);
                  }}
                >
                  {cams.map(({ label, deviceId }) => (
                    <option key={deviceId} value={deviceId}>
                      {label}
                    </option>
                  ))}
                </Select>
                <Button
                  disabled={
                    !running && (!net || !mediaRef.current || !mediaLoaded)
                  }
                  onClick={() => setRunning((x) => !x)}
                  isLoading={loadingNet}
                  loadingText="Loading"
                >
                  {running ? "STOP" : "START"}
                </Button>
              </>
            )}
            {!camPermissionGranted && (
              <Heading variant="h1" color="yellow.400">
                You need to grant permission to use your cam
              </Heading>
            )}
          </Flex>
        </Box>
        {/* config ui */}
        <Config />
      </Flex>
      <PanicButton />
    </>
  );
}

export default App;
