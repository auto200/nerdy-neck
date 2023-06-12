import {
  MoveNetModelConfig,
  Pose,
  PoseDetector,
  PoseDetectorInput,
  SupportedModels,
  createDetector,
  movenet,
} from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import { useEffect, useRef, useState } from "react";

type PoseDetectorState = "loading" | "error" | "ready";

export type UsePoseDetectorReturnType =
  | { state: "loading" | "error" }
  | {
      state: "ready";
      getPose: (mediaInput: PoseDetectorInput) => Promise<Pose | null>;
    };

//TODO: make it possible to pass config object
const loadModel = async () => {
  const config: MoveNetModelConfig = {
    modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
  };

  await tf.setBackend("webgl");
  const detector = await createDetector(SupportedModels.MoveNet, config);

  //warm up
  //https://github.com/tensorflow/tfjs-models/blob/9b5d3b663638752b692080145cfb123fa324ff11/pose-detection/demos/upload_video/src/index.js#L181
  const warmUpTensor = tf.fill([500, 600, 3], 0, "float32");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await detector.estimatePoses(warmUpTensor as any);
  warmUpTensor.dispose();

  return detector;
};

export const usePoseDetector = (): UsePoseDetectorReturnType => {
  const [state, setState] = useState<PoseDetectorState>("loading");

  const detectorRef = useRef<PoseDetector | null>(null);

  //TODO: pass `flipHorizontal`
  const getPose = async (
    mediaInput: PoseDetectorInput
  ): Promise<Pose | null> => {
    if (!detectorRef.current) {
      throw new Error("You need to load model first.");
    }

    try {
      const pose = await detectorRef.current.estimatePoses(mediaInput, {});
      return pose[0] ?? null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  useEffect(() => {
    loadModel()
      .then((detector) => {
        detectorRef.current = detector;
        setState("ready");
      })
      .catch((err) => {
        console.log(err);
        setState("error");
      });
  }, []);

  return { state, getPose };
};
