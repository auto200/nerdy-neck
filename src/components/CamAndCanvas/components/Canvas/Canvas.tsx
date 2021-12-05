import { Pose } from "@tensorflow-models/pose-detection";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectSideModeSettings } from "store";
import { POSE_ERROR } from "utils/enums";
import { drawPoint, getBodySideKeypoints, keypointToPosition } from "./utils";
import { ERROR_COLOR, KEYPOINT_COLOR } from "./utils/constants";
import {
  handleElbowMonitoring,
  handleNeckMonitoring,
} from "./utils/sideModeHandlers";

interface CanvasProps {
  pose: Pose | null;
  width: number;
  height: number;
  setPoseErrors: React.Dispatch<React.SetStateAction<POSE_ERROR[]>>;
}

const Canvas = ({ pose, width, height, setPoseErrors }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sideModeSettings = useSelector(selectSideModeSettings);

  useEffect(() => {
    if (!pose || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const errors: POSE_ERROR[] = [];

    const {
      earAndShoulderKeypoints,
      elbowShoulderAndWristKeypoints,
      kneesAndAnklesKeypoints,
    } = getBodySideKeypoints(pose, sideModeSettings.bodySide);

    const earAndShoulderVisible = earAndShoulderKeypoints.every(
      ({ score }) =>
        score && score >= sideModeSettings.additional.minUpperBodyKeypointScore
    );
    const elbowShoulderAndWristVisible = elbowShoulderAndWristKeypoints.every(
      ({ score }) =>
        score && score >= sideModeSettings.additional.minUpperBodyKeypointScore
    );
    const kneeOrAnkleVisible = kneesAndAnklesKeypoints.some(
      ({ score }) =>
        score && score >= sideModeSettings.additional.minLowerBodyKeypointScore
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
            keypoint.score! >=
            sideModeSettings.additional.minLowerBodyKeypointScore
          ) {
            drawPoint(ctx, keypointToPosition(keypoint), ERROR_COLOR);
          }
        });
      }
    }

    setPoseErrors(errors);
  }, [pose, sideModeSettings, height, width, setPoseErrors]);

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
