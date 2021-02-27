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
  NumberInput,
  NumberInputField,
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

      <VStack p="5" pt="0">
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
                  "& span span": {
                    background: "blue.200",
                  },
                  "& span[data-checked] span": {
                    background: "blue.200",
                  },
                }}
              />
              Right
            </Box>
          </FormControl>

          <CustomInput
            id="frequency"
            label="frequency"
            value={config.getPoseFrequency.toString()}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_GET_POSE_FREQUENCY",
                payload: val,
              })
            }
          />

          <CustomSwitch
            id="ear-shoulder-monitoring-switch"
            label="ear-shoulder angle monitoring"
            isChecked={config.earShoulderMonitoring.enabled}
            onChange={() =>
              dispatchConfig({
                type: "TOGGLE_EAR_SHOULDER_MONITORING",
              })
            }
          />
          <CustomInput
            id="ear-shoulder-angle"
            label="desired angle"
            value={config.earShoulderMonitoring.angle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_EAR_SHOULDER_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="ear-shoulder-tolerance"
            label="tolerance"
            value={config.earShoulderMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_EAR_SHOULDER_TOLERANCE",
                payload: val,
              })
            }
          />

          <CustomSwitch
            id="shoulder-wrist-switch"
            label="shoulder-wrist angle monitoring"
            isChecked={config.shoulderWristMonitoring.enabled}
            onChange={() =>
              dispatchConfig({
                type: "TOGGLE_SHOULDER_WRIST_MONITORING",
              })
            }
          />
          <CustomInput
            id="shoulder-wrist-angle"
            label="desired angle"
            value={config.shoulderWristMonitoring.angle}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_SHOULDER_WRIST_ANGLE",
                payload: val,
              })
            }
          />
          <CustomInput
            id="shoulder-wrist-tolerance"
            label="tolerance"
            value={config.shoulderWristMonitoring.tolerance}
            onChange={(val) =>
              dispatchConfig({
                type: "SET_SHOULDER_WRIST_TOLERANCE",
                payload: val,
              })
            }
          />

          <CustomSwitch
            id="ban-knee-and-ankle-switch"
            label="ban-knee-and-ankle"
            isChecked={config.banKneeAndAnkle}
            onChange={() =>
              dispatchConfig({
                type: "TOGGLE_BAN_KNEE_AND_ANKLE",
              })
            }
          />
        </Box>
      </VStack>
    </Flex>
  );
}

export default App;

const CustomSwitch = ({
  id,
  label,
  ...rest
}: {
  id: string;
  label: string;
  [rest: string]: any;
}) => {
  return (
    <FormControl display="flex" alignItems="center" mt="6">
      <Switch id={id} mr="1" {...rest} />
      <FormLabel htmlFor={id} m="0">
        ban-knee-and-ankle
      </FormLabel>
    </FormControl>
  );
};

const CustomInput = ({
  id,
  label,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
  [rest: string]: any;
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <NumberInput
        id={id}
        mr="1"
        value={value}
        onChange={onChange}
        {...rest}
        min={0}
      >
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );
};
