import { Keypoint, Pose } from "@tensorflow-models/posenet";
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
  pose?: Pose;
  width: number;
  height: number;
  setPoseErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

const Canvas = ({ pose, width, height, setPoseErrors }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { config } = useConfig();
  const ctx = canvasRef?.current?.getContext("2d");

  useEffect(() => {
    if (!pose || !canvasRef.current || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    const upperBodySide = UPPER_BODY[config.bodySide];
    const errors: string[] = [];

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

    const EAR_AND_SHOULDER_VISIBLE = earAndShoulderKeypoints.every(
      ({ score }) => score >= config.additional.minUpperBodyKeypointScore
    );
    const ELBOW_SHOULDER_AND_WRIST_VISIBLE =
      elbowShoulderAndWristKeypoints.every(
        ({ score }) => score >= config.additional.minUpperBodyKeypointScore
      );
    const KNEE_OR_ANKLE_VISIBLE = kneesAndAnklesKeypoints.some(
      (keypoint) =>
        keypoint.score >= config.additional.minLowerBodyKeypointScore
    );

    //check for errors and draw lines between keypoints
    {
      if (config.neckMonitoring.enabled && EAR_AND_SHOULDER_VISIBLE) {
        const earPos = earAndShoulderKeypoints[0].position;
        const shoulderPos = earAndShoulderKeypoints[1].position;
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

      if (config.elbowMonitoring.enabled && ELBOW_SHOULDER_AND_WRIST_VISIBLE) {
        const elbowPos = elbowShoulderAndWristKeypoints[0].position;
        const shoulderPos = elbowShoulderAndWristKeypoints[1].position;
        const wristPos = elbowShoulderAndWristKeypoints[2].position;
        let lineColor = KEYPOINT_COLOR;

        const elbowAngle =
          angleBetweenPoints(shoulderPos, elbowPos) +
          angleBetweenPoints(elbowPos, wristPos); // dunno why this mathematically works but looks ok, so yea ¯\_(ツ)_/¯
        const { tolerance, desiredAngle } = config.elbowMonitoring;
        if (
          !numberInTolerance(
            elbowAngle,
            Number(desiredAngle),
            Number(tolerance)
          )
        ) {
          lineColor = ERROR_COLOR;
          errors.push(POSE_ERRORS.SHOULER_WRIST);
        }

        drawLine(ctx, elbowPos, wristPos, lineColor);
        drawLine(ctx, shoulderPos, elbowPos, lineColor);

        ctx.font = `${FONT_SIZE} serif`;
        ctx.fillStyle = KEYPOINT_COLOR;
        ctx.fillText(elbowAngle.toString(), elbowPos.x + 10, elbowPos.y - 10);
      }

      if (config.banKneesAndAnkles && KNEE_OR_ANKLE_VISIBLE) {
        errors.push(POSE_ERRORS.KNEE_OR_ANKLE);
      }
    }

    //draw keypoints last to place them on top of the lines
    {
      if (config.neckMonitoring.enabled && EAR_AND_SHOULDER_VISIBLE) {
        earAndShoulderKeypoints.forEach(({ position }) =>
          drawPoint(ctx, position, KEYPOINT_COLOR)
        );
      }

      if (config.elbowMonitoring.enabled && ELBOW_SHOULDER_AND_WRIST_VISIBLE) {
        elbowShoulderAndWristKeypoints.forEach(({ position }) => {
          drawPoint(ctx, position, KEYPOINT_COLOR);
        });
      }

      if (config.banKneesAndAnkles && KNEE_OR_ANKLE_VISIBLE) {
        kneesAndAnklesKeypoints.forEach(({ position, score }) => {
          if (score >= config.additional.minLowerBodyKeypointScore) {
            drawPoint(ctx, position, ERROR_COLOR);
          }
        });
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
