import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import { load as loadPosenet, PoseNet, Pose } from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import { Box, Button, Flex, Select } from "@chakra-ui/react";
import { useConfig } from "./contexts/Config";
import Config from "./components/Config";

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

  const mediaRef = useRef<HTMLVideoElement>(null);
  const runningRef = useRef(running);
  const getPoseIntervalRef = useRef<number>();

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(({ kind }) => kind === "videoinput");
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
      Number(config.getPoseFrequency)
    );
  }, [running, config.getPoseFrequency]);

  return (
    <Flex flexWrap="wrap">
      <Box pos="relative">
        <Canvas pose={pose} width={WIDTH} height={HEIGHT} />
        <video
          autoPlay
          ref={mediaRef}
          width={WIDTH}
          height={HEIGHT}
          onLoadedMetadata={() => setMediaLoaded(true)}
        />
        <Flex>
          {cams?.length && (
            <Select
              w="60"
              value={cams[currentCamIndex]?.label}
              onChange={(e) => {
                const cam = cams.findIndex(
                  ({ label }) => label === e.target.value
                );
                cam && setCurrentCamIndex(cam);
              }}
            >
              {cams.map(({ label }) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </Select>
          )}
          <Button
            disabled={!net || !mediaRef.current || !mediaLoaded}
            onClick={() => setRunning((x) => !x)}
          >
            {running ? "STOP" : "START"}
          </Button>
        </Flex>
      </Box>
      {/* config ui */}
      <Config />
    </Flex>
  );
}

export default App;
