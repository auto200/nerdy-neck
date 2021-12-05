import { Keypoint } from "@tensorflow-models/pose-detection";
import { POSE_ERROR } from "utils/enums";
import {
  angleBetweenPoints,
  drawLine,
  isNumberInTolerance,
  keypointToPosition,
} from "../..";
import { ERROR_COLOR, FONT_SIZE, KEYPOINT_COLOR } from "../../constants";

export const handleElbowMonitoring = ({
  ctx,
  elbowShoulderAndWristKeypoints,
  tolerance,
  desiredAngle,
}: {
  ctx: CanvasRenderingContext2D;
  elbowShoulderAndWristKeypoints: [Keypoint, Keypoint, Keypoint];
  tolerance: number;
  desiredAngle: number;
}): POSE_ERROR | null => {
  const elbowPos = keypointToPosition(elbowShoulderAndWristKeypoints[0]);
  const shoulderPos = keypointToPosition(elbowShoulderAndWristKeypoints[1]);
  const wristPos = keypointToPosition(elbowShoulderAndWristKeypoints[2]);
  let lineColor = KEYPOINT_COLOR;
  let error: POSE_ERROR | null = null;

  const elbowAngle =
    angleBetweenPoints(shoulderPos, elbowPos) +
    angleBetweenPoints(elbowPos, wristPos); // dunno why this mathematically works but looks ok, so yea ¯\_(ツ)_/¯

  if (!isNumberInTolerance(elbowAngle, desiredAngle, tolerance)) {
    lineColor = ERROR_COLOR;
    error = POSE_ERROR.SHOULER_WRIST;
  }

  drawLine(ctx, elbowPos, wristPos, lineColor);
  drawLine(ctx, shoulderPos, elbowPos, lineColor);

  ctx.font = `${FONT_SIZE} serif`;
  ctx.fillStyle = KEYPOINT_COLOR;
  ctx.fillText(elbowAngle.toString(), elbowPos.x + 10, elbowPos.y - 10);

  return error;
};
