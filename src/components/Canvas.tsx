import { Pose } from "@tensorflow-models/posenet";
import { Vector2D } from "@tensorflow-models/posenet/dist/types";
import { useEffect, useRef } from "react";

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

interface Props {
  pose: Pose | undefined;
  width: number;
  height: number;
}

const leftBodySide = [3, 5];
const rightBodySide = [4, 6];

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Vector2D,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(Math.round(x), Math.round(y), 5, 0, 2 * Math.PI);
  ctx.fill();
};
const drawLine = (
  ctx: CanvasRenderingContext2D,
  { x: startX, y: startY }: Vector2D,
  { x: endX, y: endY }: Vector2D,
  color: string
) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const Canvas = ({ pose, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    //draw points
    for (const key of rightBodySide) {
      const point = pose.keypoints[key].position;
      drawPoint(ctx, point, "aqua");
    }

    //draw ear-shoulder line
    const earPos = pose.keypoints[4].position;
    const shoulderPos = pose.keypoints[6].position;
    drawLine(ctx, earPos, shoulderPos, "aqua");

    //third triangle corner
    const corner = { x: earPos.x, y: shoulderPos.y };
    drawPoint(ctx, corner, "red");

    //build triangle
    const a = earPos.y - corner.y;
    const b = corner.x - shoulderPos.x;
    const c = Math.sqrt(a ** 2 + b ** 2);
    const alfa = (Math.asin(a / c) * 180) / Math.PI;
    let angle = Math.round(Math.abs(Math.abs(alfa) - 90));

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
