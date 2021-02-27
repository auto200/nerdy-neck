import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useConfig } from "./contexts/Config";

const WIDTH = 600;
const HEIGHT = 500;

function App() {
  const [cams, setCams] = useState<MediaDeviceInfo[]>();
  const [cam, setCam] = useState<MediaDeviceInfo>();
  const [net, setNet] = useState<posenet.PoseNet>();
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [pose, setPose] = useState<posenet.Pose>();
  const [running, setRunning] = useState<boolean>(false);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const runningRef = useRef(running);
  const getPoseIntervalRef = useRef<number>();
  const { config, dispatch: dispatchConfig } = useConfig();

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(({ kind }) => kind === "videoinput");
        setCams(cams);
        setCam(cams[0]);

        setNet(await posenet.load());
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!cam) return;

    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: WIDTH,
            height: HEIGHT,
            deviceId: cam.deviceId,
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
  }, [cam]);

  useEffect(() => {
    runningRef.current = running;
    clearInterval(getPoseIntervalRef.current);
    if (!running || !net) return;

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
              value={cam?.label}
              onChange={(e) => {
                const cam = cams.find(({ label }) => label === e.target.value);
                cam && setCam(cam);
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

      <VStack p="5">
        <Heading as="h1">config:</Heading>
        <Box>
          <FormControl mt="6" mb="6">
            <FormLabel htmlFor="body-side-switch" m="0">
              body side
            </FormLabel>
            <Box>
              Left
              <Switch
                id="body-side-switch"
                ml="2"
                mr="2"
                isChecked={config.bodySide === "right"}
                onChange={() => dispatchConfig({ type: "TOGGLE_BODY_SIDE" })}
                sx={{
                  "& span[data-checked]": {
                    background: "rgba(255, 255, 255, 0.24)",
                  },
                  "& span[data-checked] span": {
                    background: "white",
                  },
                }}
              />
              Right
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="frequency">frequency</FormLabel>
            <Input
              id="frequency"
              value={config.getPoseFrequency.toString()}
              onChange={(e) =>
                dispatchConfig({
                  type: "SET_GET_POSE_FREQUENCY",
                  payload: Number(e.target.value),
                })
              }
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mt="6">
            <Switch
              id="ear-shoulder-monitoring-switch"
              mr="1"
              isChecked={config.earShoulderMonitoring.enabled}
              onChange={() =>
                dispatchConfig({
                  type: "TOGGLE_EAR_SHOULDER_MONITORING",
                })
              }
            />
            <FormLabel htmlFor="ear-shoulder-monitoring-switch" m="0">
              ear-shoulder angle monitoring
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="ear-shoulder-angle" m="0">
              desired angle
            </FormLabel>
            <Input id="ear-shoulder-angle" mr="1" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="ear-shoulder-tolerance" m="0">
              tolerance
            </FormLabel>
            <Input id="ear-shoulder-tolerance" mr="1" />
          </FormControl>

          <FormControl display="flex" alignItems="center" mt="6">
            <Switch
              id="shoulder-wrist-switch"
              mr="1"
              isChecked={config.shoulderWristMonitoring.enabled}
              onChange={() =>
                dispatchConfig({
                  type: "TOGGLE_SHOULDER_WRIST_MONITORING",
                })
              }
            />
            <FormLabel htmlFor="shoulder-wrist-switch" m="0">
              shoulder-wrist angle monitoring
            </FormLabel>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="shoulder-wrist-angle" m="0">
              desired angle
            </FormLabel>
            <Input id="shoulder-wrist-angle" mr="1" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="shoulder-wrist-tolerance" m="0">
              tolerance
            </FormLabel>
            <Input id="shoulder-wrist-tolerance" mr="1" />
          </FormControl>

          <FormControl display="flex" alignItems="center" mt="6">
            <Switch
              id="ban-knee-and-ankle-switch"
              mr="1"
              isChecked={config.banKneeAndAnkle}
              onChange={() =>
                dispatchConfig({
                  type: "TOGGLE_BAN_KNEE_AND_ANKLE",
                })
              }
            />
            <FormLabel htmlFor="ban-knee-and-ankle-switch" m="0">
              ban-knee-and-ankle
            </FormLabel>
          </FormControl>
        </Box>
      </VStack>
    </Flex>
  );
}

export default App;
