import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import { Vector2D } from "@tensorflow-models/pose-detection/dist/posenet/types";
import { LOWER_BODY, UPPER_BODY } from "./constants";

export const keypointToPosition = (keypoint: Keypoint): Vector2D => {
  return { x: keypoint.x, y: keypoint.y };
};

export const getBodySideKeypoints = (
  pose: Pose,
  bodySide: keyof typeof UPPER_BODY
) => {
  const upperBodySide = UPPER_BODY[bodySide];

  const earAndShoulderKeypoints: [Keypoint, Keypoint] = [
    pose.keypoints[upperBodySide.ear],
    pose.keypoints[upperBodySide.shoulder],
  ];

  const elbowShoulderAndWristKeypoints: [Keypoint, Keypoint, Keypoint] = [
    pose.keypoints[upperBodySide.elbow],
    pose.keypoints[upperBodySide.shoulder],
    pose.keypoints[upperBodySide.wrist],
  ];

  const kneesAndAnklesKeypoints = Object.values(LOWER_BODY).map(
    (keypoint) => pose.keypoints[keypoint]
  );

  return {
    earAndShoulderKeypoints,
    elbowShoulderAndWristKeypoints,
    kneesAndAnklesKeypoints,
  };
};
