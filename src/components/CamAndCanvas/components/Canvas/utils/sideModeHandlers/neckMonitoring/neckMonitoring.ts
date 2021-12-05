import { Keypoint } from "@tensorflow-models/pose-detection";
import { POSE_ERROR } from "utils/enums";
import {
  angleBetweenPoints,
  drawLine,
  isNumberInTolerance,
  keypointToPosition,
  placeTextBetweenTwoPoints,
} from "../..";
import {
  ERROR_COLOR,
  KEYPOINT_COLOR,
  TEXT_LINE_HEIGHT,
  TEXT_MARGIN,
} from "../../constants";

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
  let lineColor = KEYPOINT_COLOR;
  let error: POSE_ERROR | null = null;

  const neckAngle = angleBetweenPoints(earPos, shoulderPos);
  if (!isNumberInTolerance(neckAngle, desiredAngle, tolerance)) {
    error = POSE_ERROR.EAR_SHOULDER;
    lineColor = ERROR_COLOR;
  }

  drawLine(ctx, earPos, shoulderPos, lineColor);
  placeTextBetweenTwoPoints({
    ctx: ctx,
    text: neckAngle.toString(),
    color: KEYPOINT_COLOR,
    start: earPos,
    end: shoulderPos,
    shiftX: TEXT_MARGIN,
    shiftY: TEXT_LINE_HEIGHT,
  });

  return error;
};
