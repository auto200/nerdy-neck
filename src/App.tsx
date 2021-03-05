import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import { load as loadPosenet, PoseNet, Pose } from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import { Box, Button, Flex, Heading, Select } from "@chakra-ui/react";
import { useConfig } from "./contexts/Config";
import Config from "./components/Config";
import GithubLink from "./components/GithubLink";

const WIDTH = 600;
const HEIGHT = 500;

function App() {
  const [cams, setCams] = useState<MediaDeviceInfo[]>();
  const [currentCamIndex, setCurrentCamIndex] = useState<number>(0);
  const [net, setNet] = useState<PoseNet>();
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [pose, setPose] = useState<Pose>();
  const [running, setRunning] = useState<boolean>(false);
  const { config } = useConfig();
  const [poseErrors, setPoseErrors] = useState<string[]>([]);

  const mediaRef = useRef<HTMLVideoElement>(null);
  const runningRef = useRef(running);
  const getPoseIntervalRef = useRef<number>();

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(
          ({ kind, deviceId, label }) =>
            kind === "videoinput" && deviceId && label
        );
        setCams(cams);

        setNet(await loadPosenet());
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const getStream = async () => {
      if (!cams) return;

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
  }, [cams, currentCamIndex]);

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

    getPoseIntervalRef.current = window.setInterval(
      getPose,
      Number(config.getPoseInterval)
    );
  }, [running, config.getPoseInterval]);

  return (
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
          {cams?.length ? (
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
                disabled={!net || !mediaRef.current || !mediaLoaded}
                onClick={() => setRunning((x) => !x)}
              >
                {running ? "STOP" : "START"}
              </Button>
            </>
          ) : (
            <Heading variant="h1" color="yellow.400">
              Did not find any video devices
            </Heading>
          )}
        </Flex>
      </Box>
      {/* config ui */}
      <Config />
    </Flex>
  );
}

export default App;
