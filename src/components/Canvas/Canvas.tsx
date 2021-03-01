import { Pose } from "@tensorflow-models/posenet";
import { useEffect, useRef } from "react";
import { useConfig } from "../../contexts/Config";
import { angleBetweenPoints, drawLine, drawPoint } from "./utils";

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

const fullBody = {
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
    const body = fullBody[config.bodySide];
    ctx.clearRect(0, 0, width, height);
    console.log(pose);

    //draw points
    for (const key of Object.values(body)) {
      const { position, score } = pose.keypoints[key];
      if (score >= config.minKeypointScore) {
        drawPoint(ctx, position, "aqua");
      }
    }

    //draw ear-shoulder line
    const earPos = pose.keypoints[body.ear].position;
    const shoulderPos = pose.keypoints[body.shoulder].position;
    drawLine(ctx, earPos, shoulderPos, "aqua");

    //triangle third corner
    const corner = { x: earPos.x, y: shoulderPos.y };
    drawPoint(ctx, corner, "red");

    const headShoulderAngle = angleBetweenPoints(earPos, shoulderPos);

    //connect third corner with shoulder and ear
    drawLine(ctx, corner, shoulderPos, "red");
    drawLine(ctx, corner, earPos, "red");

    //display current angle between ear and shoulder
    const fontSize = 48;
    const margin = fontSize * 0.1;
    const lineHeight = fontSize / 3;
    const textX = earPos.x - (earPos.x - shoulderPos.x) / 2 + margin;
    const textY = earPos.y - (earPos.y - shoulderPos.y) / 2 + lineHeight;
    ctx.font = `${fontSize}px serif`;
    ctx.fillStyle = "aqua"; // TODO?: change color based on value
    ctx.fillText(headShoulderAngle.toString(), textX, textY);

    //check elbow angle
    const elbowPos = pose.keypoints[body.elbow].position;
    const wristPos = pose.keypoints[body.wrist].position;
    drawLine(ctx, shoulderPos, elbowPos, "red");
    drawLine(ctx, elbowPos, wristPos, "red");
    drawLine(ctx, wristPos, shoulderPos, "aqua");

    const wristShoulderAngle = angleBetweenPoints(wristPos, shoulderPos);

    const text2X =
      shoulderPos.x - (shoulderPos.x - wristPos.x) / 2 + margin + 5;
    const text2Y =
      shoulderPos.y - (shoulderPos.y - wristPos.y) / 2 + lineHeight - 5;
    ctx.font = `${fontSize}px serif`;
    ctx.fillStyle = "aqua"; // TODO: change color based on value
    ctx.fillText(wristShoulderAngle.toString(), text2X, text2Y);
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
