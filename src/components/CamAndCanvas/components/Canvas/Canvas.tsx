import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectSideModeSettings } from "store";
import { POSE_ERRORS } from "utils/enums";
import {
  angleBetweenPoints,
  drawLine,
  drawPoint,
  isNumberInTolerance,
  keypointToPosition,
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
  const sideModeSettings = useSelector(selectSideModeSettings);
  const ctx = canvasRef?.current?.getContext("2d");

  useEffect(() => {
    if (!pose || !canvasRef.current || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    const upperBodySide = UPPER_BODY[sideModeSettings.bodySide];
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
    console.log(
      earAndShoulderKeypoints,
      elbowShoulderAndWristKeypoints,
      kneesAndAnklesKeypoints
    );

    const EAR_AND_SHOULDER_VISIBLE = earAndShoulderKeypoints.every(
      ({ score }) =>
        score && score >= sideModeSettings.additional.minUpperBodyKeypointScore
    );
    const ELBOW_SHOULDER_AND_WRIST_VISIBLE =
      elbowShoulderAndWristKeypoints.every(
        ({ score }) =>
          score &&
          score >= sideModeSettings.additional.minUpperBodyKeypointScore
      );
    const KNEE_OR_ANKLE_VISIBLE = kneesAndAnklesKeypoints.some(
      ({ score }) =>
        score && score >= sideModeSettings.additional.minLowerBodyKeypointScore
    );

    /* eslint-disable no-lone-blocks */
    //check for errors and draw lines between keypoints
    {
      if (sideModeSettings.neckMonitoring.enabled && EAR_AND_SHOULDER_VISIBLE) {
        const earPos = keypointToPosition(earAndShoulderKeypoints[0]);
        const shoulderPos = keypointToPosition(earAndShoulderKeypoints[1]);
        let lineColor = KEYPOINT_COLOR;

        const neckAngle = angleBetweenPoints(earPos, shoulderPos);
        const { tolerance, desiredAngle } = sideModeSettings.neckMonitoring;
        if (!isNumberInTolerance(neckAngle, desiredAngle, tolerance)) {
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

      if (
        sideModeSettings.elbowMonitoring.enabled &&
        ELBOW_SHOULDER_AND_WRIST_VISIBLE
      ) {
        const elbowPos = keypointToPosition(elbowShoulderAndWristKeypoints[0]);
        const shoulderPos = keypointToPosition(
          elbowShoulderAndWristKeypoints[1]
        );
        const wristPos = keypointToPosition(elbowShoulderAndWristKeypoints[2]);
        let lineColor = KEYPOINT_COLOR;

        const elbowAngle =
          angleBetweenPoints(shoulderPos, elbowPos) +
          angleBetweenPoints(elbowPos, wristPos); // dunno why this mathematically works but looks ok, so yea ¯\_(ツ)_/¯
        const { tolerance, desiredAngle } = sideModeSettings.elbowMonitoring;
        if (!isNumberInTolerance(elbowAngle, desiredAngle, tolerance)) {
          lineColor = ERROR_COLOR;
          errors.push(POSE_ERRORS.SHOULER_WRIST);
        }

        drawLine(ctx, elbowPos, wristPos, lineColor);
        drawLine(ctx, shoulderPos, elbowPos, lineColor);

        ctx.font = `${FONT_SIZE} serif`;
        ctx.fillStyle = KEYPOINT_COLOR;
        ctx.fillText(elbowAngle.toString(), elbowPos.x + 10, elbowPos.y - 10);
      }

      if (sideModeSettings.banKneesAndAnkles && KNEE_OR_ANKLE_VISIBLE) {
        errors.push(POSE_ERRORS.KNEE_OR_ANKLE);
      }
    }

    //draw keypoints last to place them on top of the lines
    {
      if (sideModeSettings.neckMonitoring.enabled && EAR_AND_SHOULDER_VISIBLE) {
        earAndShoulderKeypoints.forEach((keypoint) =>
          drawPoint(ctx, keypointToPosition(keypoint), KEYPOINT_COLOR)
        );
      }

      if (
        sideModeSettings.elbowMonitoring.enabled &&
        ELBOW_SHOULDER_AND_WRIST_VISIBLE
      ) {
        elbowShoulderAndWristKeypoints.forEach((keypoint) => {
          drawPoint(ctx, keypointToPosition(keypoint), KEYPOINT_COLOR);
        });
      }

      if (sideModeSettings.banKneesAndAnkles && KNEE_OR_ANKLE_VISIBLE) {
        kneesAndAnklesKeypoints.forEach((keypoint) => {
          if (
            keypoint.score &&
            keypoint.score >=
              sideModeSettings.additional.minLowerBodyKeypointScore
          ) {
            drawPoint(ctx, keypointToPosition(keypoint), ERROR_COLOR);
          }
        });
      }
    }
    setPoseErrors(errors);
  }, [pose, sideModeSettings, ctx, height, width, setPoseErrors]);

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
