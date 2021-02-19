import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Canvas from "./components/Canvas";

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

  useEffect(() => {
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(({ kind }) => kind === "videoinput");
        setCams(cams);
        setCam(cams[0]);

        setNet(
          await posenet.load({
            architecture: "ResNet50",
            outputStride: 32,
            inputResolution: { width: WIDTH, height: HEIGHT },
          })
        );
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
    if (!running || !net) return;

    const getPose = async () => {
      try {
        const pose = await net.estimateSinglePose(mediaRef.current!);
        setPose(pose);
      } catch (err) {
        console.log(err);
      }

      if (runningRef.current) {
        requestAnimationFrame(getPose);
      }
    };

    getPose();
    // setInterval(getPose, 3000);
  }, [running]);

  return (
    <>
      <div style={{ position: "relative", width: WIDTH, height: HEIGHT }}>
        <Canvas pose={pose} width={WIDTH} height={HEIGHT} />
        <video
          autoPlay
          ref={mediaRef}
          width={WIDTH}
          height={HEIGHT}
          onLoadedMetadata={() => setMediaLoaded(true)}
        />
      </div>
      {cams?.length && (
        <select
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
        </select>
      )}
      <button
        disabled={!net || !mediaRef.current || !mediaLoaded}
        onClick={() => setRunning((x) => !x)}
      >
        {running ? "STOP" : "START"}
      </button>
    </>
  );
}

export default App;
