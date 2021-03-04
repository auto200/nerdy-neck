import { Pose } from "@tensorflow-models/posenet";
import { useEffect, useRef } from "react";
import { useConfig } from "../../contexts/Config";
import {
  angleBetweenPoints,
  drawLine,
  drawPoint,
  placeTextBetweenTwoPoints,
} from "./utils";

//keypoints[]
// 0	nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle

const FULL_BODY = {
  left: {
    // eye: 1,
    ear: 3,
    shoulder: 5,
    elbow: 7,
    wrist: 9,
    hip: 11,
    knee: 13,
    ankle: 15,
  },
  right: {
    // eye: 2,
    ear: 4,
    shoulder: 6,
    elbow: 8,
    wrist: 10,
    hip: 12,
    knee: 14,
    ankle: 16,
  },
};

const FONT_SIZE = 48;
const TEXT_MARGIN = FONT_SIZE * 0.2;
const TEXT_LINE_HEIGHT = FONT_SIZE / 3;
const KEYPOINT_COLOR = "aqua";
const LINE_COLOR = "red";

interface Props {
  pose: Pose | undefined;
  width: number;
  height: number;
}

const Canvas = ({ pose, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useConfig();

  useEffect(() => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const body = FULL_BODY[config.bodySide];
    ctx.clearRect(0, 0, width, height);

    const earAndShoulderVisible = [
      pose.keypoints[body.ear],
      pose.keypoints[body.shoulder],
    ].every(({ score }) => score >= config.minKeypointScore);

    //check ear-shoulder angle
    if (config.earShoulderMonitoring && earAndShoulderVisible) {
      const earPos = pose.keypoints[body.ear].position;
      const shoulderPos = pose.keypoints[body.shoulder].position;
      const triangle3rdCorner = { x: earPos.x, y: shoulderPos.y };

      drawLine(ctx, earPos, shoulderPos, KEYPOINT_COLOR);
      drawLine(ctx, triangle3rdCorner, shoulderPos, LINE_COLOR);
      drawLine(ctx, triangle3rdCorner, earPos, LINE_COLOR);
      drawPoint(ctx, triangle3rdCorner, LINE_COLOR);

      placeTextBetweenTwoPoints({
        ctx: ctx,
        text: angleBetweenPoints(earPos, shoulderPos).toString(),
        color: KEYPOINT_COLOR,
        start: earPos,
        end: shoulderPos,
        shiftX: TEXT_MARGIN,
        shiftY: TEXT_LINE_HEIGHT,
      });
    }

    const elbowShoulderAndWristVisible = [
      pose.keypoints[body.elbow],
      pose.keypoints[body.shoulder],
      pose.keypoints[body.wrist],
    ].every(({ score }) => score >= config.minKeypointScore);

    //check elbow angle
    if (config.shoulderWristMonitoring && elbowShoulderAndWristVisible) {
      const shoulderPos = pose.keypoints[body.shoulder].position;
      const elbowPos = pose.keypoints[body.elbow].position;
      const wristPos = pose.keypoints[body.wrist].position;

      drawLine(ctx, shoulderPos, elbowPos, LINE_COLOR);
      drawLine(ctx, elbowPos, wristPos, LINE_COLOR);
      drawLine(ctx, wristPos, shoulderPos, KEYPOINT_COLOR);

      placeTextBetweenTwoPoints({
        ctx: ctx,
        text: angleBetweenPoints(wristPos, shoulderPos).toString(),
        color: KEYPOINT_COLOR,
        start: shoulderPos,
        end: wristPos,
        shiftX: TEXT_MARGIN,
        shiftY: TEXT_LINE_HEIGHT,
      });
    }

    //draw keypoints last to place them on top of the lines
    for (const key of Object.values(body)) {
      const { position, score } = pose.keypoints[key];
      if (score >= config.minKeypointScore) {
        drawPoint(ctx, position, KEYPOINT_COLOR);
      }
    }
  }, [pose]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        zIndex: 1,
      }}
    />
  );
};
export default Canvas;
