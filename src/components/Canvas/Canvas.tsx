import { Pose } from "@tensorflow-models/posenet";
import { useEffect, useRef } from "react";
import { degreeBetweenPoints, drawLine, drawPoint } from "./utils";

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

const leftBodySide = [3, 5];
const body = {
  rightEar: 4,
  rightShoulder: 6,
  rightElbow: 8,
  rightWrist: 10,
};

interface Props {
  pose: Pose | undefined;
  width: number;
  height: number;
}

const Canvas = ({ pose, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    //draw points
    for (const key of Object.values(body)) {
      const point = pose.keypoints[key].position;
      drawPoint(ctx, point, "aqua");
    }

    //draw ear-shoulder line
    const earPos = pose.keypoints[body.rightEar].position;
    const shoulderPos = pose.keypoints[body.rightShoulder].position;
    drawLine(ctx, earPos, shoulderPos, "aqua");

    //triangle third corner
    const corner = { x: earPos.x, y: shoulderPos.y };
    drawPoint(ctx, corner, "red");

    let angle = degreeBetweenPoints(earPos, shoulderPos);
    if (corner.x < shoulderPos.x) {
      angle = -angle;
    }

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
    ctx.fillStyle = "aqua"; // TODO: change color based on value
    ctx.fillText(angle.toString(), textX, textY);

    //check elbow angle
    const elbowPos = pose.keypoints[body.rightElbow].position;
    const wristPos = pose.keypoints[body.rightWrist].position;
    drawLine(ctx, shoulderPos, elbowPos, "red");
    drawLine(ctx, elbowPos, wristPos, "red");
    drawLine(ctx, wristPos, shoulderPos, "aqua");
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
