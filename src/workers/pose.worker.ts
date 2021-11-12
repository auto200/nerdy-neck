import {
  createDetector,
  movenet,
  MoveNetModelConfig,
  PoseDetector,
  SupportedModels,
} from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { GetPose, LoadDetector } from "./types";

let detector: PoseDetector | null = null;

export const loadDetector: LoadDetector = async () => {
  const config: MoveNetModelConfig = {
    modelType: movenet.modelType.SINGLEPOSE_THUNDER,
  };

  try {
    console.log("creating detector");
    detector = await createDetector(SupportedModels.MoveNet, config);

    console.log("detector created");

    //warm up https://github.com/tensorflow/tfjs-models/blob/9b5d3b663638752b692080145cfb123fa324ff11/pose-detection/demos/upload_video/src/index.js#L181
    const warmUpTensor = tf.fill([500, 600, 3], 0, "float32");
    await detector.estimatePoses(warmUpTensor as any);
    warmUpTensor.dispose();

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getPose: GetPose = async (mediaInput) => {
  try {
    const startTime = performance.now();
    const pose = await detector?.estimatePoses(mediaInput);
    console.log(performance.now() - startTime);
    console.log(pose);
    return pose?.[0];
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
