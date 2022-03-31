import { Keypoint } from "@tensorflow-models/pose-detection";
import { POSE_ERROR } from "utils/enums";
import {
  ERROR_COLOR,
  KEYPOINT_COLOR,
  TEXT_LINE_HEIGHT,
  TEXT_MARGIN,
} from "./constants";
import { drawLine, placeTextBetweenTwoPoints } from "./drawUtils";
import { angleBetweenPoints, isNumberInTolerance } from "./mathUtils";
import { keypointToPosition } from "./transformUtils";

export const handleShoulderLevelMonitoring = ({
  ctx,
  shoulderKeypoints,
  tolerance,
  desiredAngle,
}: {
  ctx: CanvasRenderingContext2D;
  shoulderKeypoints: [Keypoint, Keypoint];
  tolerance: number;
  desiredAngle: number;
}): POSE_ERROR | null => {
  const leftShoulderPos = keypointToPosition(shoulderKeypoints[0]);
  const rightShoulderPos = keypointToPosition(shoulderKeypoints[1]);

  const neckAngle = angleBetweenPoints(leftShoulderPos, rightShoulderPos);
  const error = isNumberInTolerance(neckAngle, desiredAngle, tolerance)
    ? null
    : POSE_ERROR.SHOULDERS_LEVEL;
  const lineColor = error ? ERROR_COLOR : KEYPOINT_COLOR;

  drawLine(ctx, leftShoulderPos, rightShoulderPos, lineColor);
  placeTextBetweenTwoPoints({
    ctx,
    text: neckAngle.toString(),
    color: KEYPOINT_COLOR,
    start: leftShoulderPos,
    end: rightShoulderPos,
    shiftX: TEXT_MARGIN,
    shiftY: TEXT_LINE_HEIGHT,
  });

  return error;
};
