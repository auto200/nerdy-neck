import { Pose } from "@tensorflow-models/posenet";
import { useEffect, useRef } from "react";

interface Props {
  pose: Pose | undefined;
  width: number;
  height: number;
}

const leftBodySide = [0, 1, 3, 5];
const rightBodySide = [0, 2, 4, 6];

const Canvas = ({ pose, width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pose || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    //draw points
    for (const key of rightBodySide) {
      const { x, y } = pose.keypoints[key].position;
      ctx.fillStyle = "aqua";
      ctx.beginPath();
      ctx.arc(Math.round(x), Math.round(y), 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    //draw ear-shoulder line
    const { x: earX, y: earY } = pose.keypoints[4].position;
    const { x: shoulderX, y: shoulderY } = pose.keypoints[6].position;
    ctx.beginPath();
    ctx.moveTo(earX, earY);
    ctx.lineTo(shoulderX, shoulderY);
    ctx.strokeStyle = "aqua";
    ctx.lineWidth = 2;
    ctx.stroke();

    //third triangle corner
    const cornerX = earX;
    const cornerY = shoulderY;

    //triangle
    const a = earY - cornerY;
    const b = cornerX - shoulderX;
    const c = Math.sqrt(a ** 2 + b ** 2);
    const alfa = (Math.asin(a / c) * 180) / Math.PI;
    const angle = Math.round(Math.abs(Math.abs(alfa) - 90));

    //display current angle
    const fontSize = 48;
    const margin = fontSize * 0.1;
    const lineHeight = fontSize / 3;
    const textX = earX - (earX - shoulderX) / 2 + margin;
    const textY = earY - (earY - shoulderY) / 2 + lineHeight;
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
