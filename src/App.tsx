import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import { load as loadPosenet, PoseNet, Pose } from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import {
  Box,
  Button,
  Code,
  Flex,
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";
import { useConfig } from "./contexts/ConfigContext";
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

const App: React.FC = () => {
  const [camPermissionGranted, setCamPermissionGranted] = useState(false);
  const [cams, setCams] = useState<MediaDeviceInfo[]>();
  const [currentCamIndex, setCurrentCamIndex] = useState(() =>
    parseInt(window.localStorage.getItem("currentCamIndex") || "0")
  );
  const [net, setNet] = useState<PoseNet>();
  const [loadingNet, setLoadingNet] = useState(false);
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

        camPermission.addEventListener("change", async (e) => {
          if ((e.target as PermissionStatus).state === "granted") {
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
    clearInterval(getPoseIntervalRef.current);
    clearInterval(timerIntervalToPoseCheckRef.current);

    if (!running || !net || !mediaRef.current) return;

    let startCountdownToPoseCheckTs = Date.now();

    const getPose = async () => {
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

    getPoseIntervalRef.current = window.setInterval(getPose, intervalTimeout);
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
            {running && (
              <Box pos="absolute" bottom="5px" right="5px">
                <Heading
                  variant="h2"
                  color="blackAlpha.500"
                  sx={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.7)" }}
                >
                  {secToPoseCheck}
                </Heading>
              </Box>
            )}
          </Box>
          <Flex m="10px">
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
          <Text ml="5px" color="chartreuse">
            Please make sure to have{" "}
            <Code colorScheme="messenger">Hardware Acceleration</Code> turned on
            in chrome settings
          </Text>
        </Box>
        {/* config ui */}
        <Config />
      </Flex>
      <PanicButton />
    </>
  );
};

export default App;
