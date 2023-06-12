import { Pose } from "@tensorflow-models/pose-detection";
import { useEffect, useRef } from "react";
import { AppMode } from "@store/enums";
import { POSE_ERROR } from "@utils/enums";
import { useSettings } from "@hooks/useSettings";
import {
  drawPoint,
  getBodySideKeypoints,
  handleElbowMonitoring,
  handleNeckMonitoring,
  handleShoulderLevelMonitoring,
  keypointToPosition,
} from "./utils";
import { ERROR_COLOR, KEYPOINT_COLOR, UPPER_BODY } from "./utils/constants";

interface CanvasProps {
  pose: Pose | null;
  width: number;
  height: number;
  setPoseErrors: React.Dispatch<React.SetStateAction<POSE_ERROR[]>>;
}

const Canvas: React.FC<CanvasProps> = ({
  pose,
  width,
  height,
  setPoseErrors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { appMode, sideModeSettings, frontModeSettings } = useSettings();

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (!pose) {
      return;
    }

    const errors: POSE_ERROR[] = [];

    if (appMode === AppMode.SIDE) {
      const {
        earAndShoulderKeypoints,
        elbowShoulderAndWristKeypoints,
        kneesAndAnklesKeypoints,
      } = getBodySideKeypoints(pose, sideModeSettings.bodySide);

      const earAndShoulderVisible = earAndShoulderKeypoints.every(
        ({ score }) =>
          score &&
          score >= sideModeSettings.additional.minUpperBodyKeypointScore
      );
      const elbowShoulderAndWristVisible = elbowShoulderAndWristKeypoints.every(
        ({ score }) =>
          score &&
          score >= sideModeSettings.additional.minUpperBodyKeypointScore
      );
      const kneeOrAnkleVisible = kneesAndAnklesKeypoints.some(
        ({ score }) =>
          score &&
          score >= sideModeSettings.additional.minLowerBodyKeypointScore
      );

      /* eslint-disable no-lone-blocks */
      //check for errors and draw lines between keypoints
      {
        if (sideModeSettings.neckMonitoring.enabled && earAndShoulderVisible) {
          const { tolerance, desiredAngle } = sideModeSettings.neckMonitoring;

          const error = handleNeckMonitoring({
            ctx,
            earAndShoulderKeypoints,
            tolerance,
            desiredAngle,
          });

          if (error) {
            errors.push(error);
          }
        }

        if (
          sideModeSettings.elbowMonitoring.enabled &&
          elbowShoulderAndWristVisible
        ) {
          const { tolerance, desiredAngle } = sideModeSettings.elbowMonitoring;
          const error = handleElbowMonitoring({
            ctx,
            elbowShoulderAndWristKeypoints,
            tolerance,
            desiredAngle,
          });

          if (error) {
            errors.push(error);
          }
        }

        if (sideModeSettings.banKneesAndAnkles && kneeOrAnkleVisible) {
          errors.push(POSE_ERROR.KNEE_OR_ANKLE);
        }
      }

      //draw keypoints last to place them on top of the lines
      {
        if (sideModeSettings.neckMonitoring.enabled && earAndShoulderVisible) {
          earAndShoulderKeypoints.forEach((keypoint) =>
            drawPoint(ctx, keypointToPosition(keypoint), KEYPOINT_COLOR)
          );
        }

        if (
          sideModeSettings.elbowMonitoring.enabled &&
          elbowShoulderAndWristVisible
        ) {
          elbowShoulderAndWristKeypoints.forEach((keypoint) => {
            drawPoint(ctx, keypointToPosition(keypoint), KEYPOINT_COLOR);
          });
        }

        if (sideModeSettings.banKneesAndAnkles && kneeOrAnkleVisible) {
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
    }

    if (appMode === AppMode.FRONT) {
      const leftShoulder = pose.keypoints[UPPER_BODY.left.shoulder];
      const rightShoulder = pose.keypoints[UPPER_BODY.right.shoulder];
      const leftShoulderVisible =
        leftShoulder.score &&
        leftShoulder.score >=
          frontModeSettings.additional.minUpperBodyKeypointScore;
      const rightShoulderVisible =
        rightShoulder.score &&
        rightShoulder.score >=
          frontModeSettings.additional.minUpperBodyKeypointScore;

      if (leftShoulderVisible && rightShoulderVisible) {
        const { tolerance, desiredAngle } =
          frontModeSettings.shouldersLevelMonitoring;

        const error = handleShoulderLevelMonitoring({
          ctx,
          shoulderKeypoints: [leftShoulder, rightShoulder],
          tolerance,
          desiredAngle,
        });

        drawPoint(ctx, keypointToPosition(leftShoulder), KEYPOINT_COLOR);
        drawPoint(ctx, keypointToPosition(rightShoulder), KEYPOINT_COLOR);

        if (error) {
          errors.push(error);
        }
      }
    }

    setPoseErrors(errors);
  }, [
    pose,
    sideModeSettings,
    height,
    width,
    setPoseErrors,
    appMode,
    frontModeSettings,
  ]);

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
