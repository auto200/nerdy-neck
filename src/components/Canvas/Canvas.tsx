import { Pose } from "@tensorflow-models/posenet";
import { useEffect, useRef } from "react";
import { useConfig } from "../../contexts/Config";
import { POSE_ERRORS } from "../../utils/constants";
import {
  angleBetweenPoints,
  drawLine,
  drawPoint,
  numberInTolerance,
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

const UPPER_BODY = {
  left: {
    // eye: 1,
    ear: 3,
    shoulder: 5,
    elbow: 7,
    wrist: 9,
  },
  right: {
    // eye: 2,
    ear: 4,
    shoulder: 6,
    elbow: 8,
    wrist: 10,
  },
};
const LOWER_BODY = {
  // leftHip: 11,
  // rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16,
};

const FONT_SIZE = 48;
const TEXT_MARGIN = FONT_SIZE * 0.2;
const TEXT_LINE_HEIGHT = FONT_SIZE / 3;
const KEYPOINT_COLOR = "aqua";
const ERROR_COLOR = "red";

interface Props {
  pose: Pose | undefined;
  width: number;
  height: number;
  setPoseErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

const Canvas = ({ pose, width, height, setPoseErrors }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useConfig();

  useEffect(() => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const errors: string[] = [];

    const body = UPPER_BODY[config.bodySide];
    ctx.clearRect(0, 0, width, height);

    const earAndShoulderVisible = [
      pose.keypoints[body.ear],
      pose.keypoints[body.shoulder],
    ].every(({ score }) => score >= config.minKeypointScore);

    //check ear-shoulder angle
    if (config.neckMonitoring.enabled && earAndShoulderVisible) {
      const earPos = pose.keypoints[body.ear].position;
      const shoulderPos = pose.keypoints[body.shoulder].position;
      // const triangle3rdCorner = { x: earPos.x, y: shoulderPos.y };
      let lineColor = KEYPOINT_COLOR;

      const neckAngle = angleBetweenPoints(earPos, shoulderPos);
      const { tolerance, desiredAngle } = config.neckMonitoring;
      if (
        !numberInTolerance(neckAngle, Number(desiredAngle), Number(tolerance))
      ) {
        errors.push(POSE_ERRORS.EAR_SHOULDER);
        lineColor = ERROR_COLOR;
      }

      drawLine(ctx, earPos, shoulderPos, lineColor);
      // drawLine(ctx, triangle3rdCorner, shoulderPos, LINE_COLOR);
      // drawLine(ctx, triangle3rdCorner, earPos, LINE_COLOR);
      // drawPoint(ctx, triangle3rdCorner, LINE_COLOR);

      placeTextBetweenTwoPoints({
        ctx: ctx,
        text: neckAngle.toString(),
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
    if (config.elbowMonitoring.enabled && elbowShoulderAndWristVisible) {
      const shoulderPos = pose.keypoints[body.shoulder].position;
      const elbowPos = pose.keypoints[body.elbow].position;
      const wristPos = pose.keypoints[body.wrist].position;
      let lineColor = KEYPOINT_COLOR;

      const elbowAngle =
        angleBetweenPoints(shoulderPos, elbowPos) +
        angleBetweenPoints(elbowPos, wristPos);
      const { tolerance, desiredAngle } = config.elbowMonitoring;
      if (
        !numberInTolerance(elbowAngle, Number(desiredAngle), Number(tolerance))
      ) {
        lineColor = ERROR_COLOR;
        errors.push(POSE_ERRORS.SHOULER_WRIST);
      }

      drawLine(ctx, elbowPos, wristPos, lineColor);
      drawLine(ctx, shoulderPos, elbowPos, lineColor);
      // drawLine(ctx, wristPos, shoulderPos, LINE_COLOR);

      ctx.font = `${FONT_SIZE} serif`;
      ctx.fillStyle = KEYPOINT_COLOR;
      ctx.fillText(elbowAngle.toString(), elbowPos.x + 10, elbowPos.y - 10);
    }

    const kneeOrAnkleVisible = Object.values(LOWER_BODY).some(
      (part) => pose.keypoints[part].score >= 0.2
    );

    if (config.banKneeAndAnkle && kneeOrAnkleVisible) {
      errors.push(POSE_ERRORS.KNEE_OR_ANKLE);
    }

    //draw keypoints last to place them on top of the lines
    for (const key of Object.values(body)) {
      const { position, score } = pose.keypoints[key];
      if (score >= config.minKeypointScore) {
        drawPoint(ctx, position, KEYPOINT_COLOR);
      }
    }

    setPoseErrors(errors);
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
