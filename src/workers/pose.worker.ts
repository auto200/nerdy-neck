import { load as loadPosenetModel, PoseNet } from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { GetPose, LoadPoseNet } from "./types";

let poseNet: PoseNet | null = null;

export const loadPoseNet: LoadPoseNet = async () => {
  try {
    poseNet = await loadPosenetModel({
      architecture: "ResNet50",
      inputResolution: {
        width: CAM_WIDTH,
        height: CAM_HEIGHT,
      },
      outputStride: 32,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getPose: GetPose = async (mediaInput) => {
  try {
    const startTime = performance.now();
    const pose = await poseNet?.estimateSinglePose(mediaInput);
    console.log(performance.now() - startTime);
    return pose;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
