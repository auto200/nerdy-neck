import { Keypoint } from "@tensorflow-models/pose-detection";
import { POSE_ERROR } from "utils/enums";
import {
  ERROR_COLOR,
  FONT_SIZE,
  KEYPOINT_COLOR,
  TEXT_LINE_HEIGHT,
  TEXT_MARGIN,
} from "./constants";
import { drawLine, placeTextBetweenTwoPoints } from "./drawUtils";
import { angleBetweenPoints, isNumberInTolerance } from "./mathUtils";
import { keypointToPosition } from "./transformUtils";

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

  const elbowAngle =
    angleBetweenPoints(shoulderPos, elbowPos) +
    angleBetweenPoints(elbowPos, wristPos); // dunno why this mathematically works but looks ok, so yea ¯\_(ツ)_/¯
  const error = isNumberInTolerance(elbowAngle, desiredAngle, tolerance)
    ? null
    : POSE_ERROR.SHOULDER_WRIST;
  const lineColor = error ? ERROR_COLOR : KEYPOINT_COLOR;

  drawLine(ctx, elbowPos, wristPos, lineColor);
  drawLine(ctx, shoulderPos, elbowPos, lineColor);

  ctx.font = `${FONT_SIZE} serif`;
  ctx.fillStyle = KEYPOINT_COLOR;
  ctx.fillText(elbowAngle.toString(), elbowPos.x + 10, elbowPos.y - 10);

  return error;
};

export const handleNeckMonitoring = ({
  ctx,
  earAndShoulderKeypoints,
  tolerance,
  desiredAngle,
}: {
  ctx: CanvasRenderingContext2D;
  earAndShoulderKeypoints: [Keypoint, Keypoint];
  tolerance: number;
  desiredAngle: number;
}): POSE_ERROR | null => {
  const earPos = keypointToPosition(earAndShoulderKeypoints[0]);
  const shoulderPos = keypointToPosition(earAndShoulderKeypoints[1]);

  const neckAngle = angleBetweenPoints(earPos, shoulderPos);
  const error = isNumberInTolerance(neckAngle, desiredAngle, tolerance)
    ? null
    : POSE_ERROR.EAR_SHOULDER;
  const lineColor = error ? ERROR_COLOR : KEYPOINT_COLOR;

  drawLine(ctx, earPos, shoulderPos, lineColor);
  placeTextBetweenTwoPoints({
    ctx,
    text: neckAngle.toString(),
    color: KEYPOINT_COLOR,
    start: earPos,
    end: shoulderPos,
    shiftX: TEXT_MARGIN,
    shiftY: TEXT_LINE_HEIGHT,
  });

  return error;
};
