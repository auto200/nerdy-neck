import { Vector2D } from "@tensorflow-models/posenet/dist/types";

export const angleBetweenPoints = (
  a: Vector2D,
  b: Vector2D,
  round: boolean = true
) => {
  const dy = Math.abs(a.y - b.y);
  const dx = Math.abs(a.x - b.x);
  const deg = Math.abs(90 - Math.atan2(dy, dx) * (180 / Math.PI));
  if (round) {
    return Math.round(deg);
  }
  return deg;
};

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: Vector2D,
  color: string,
  roundPoints: boolean = true
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (roundPoints) {
    ctx.arc(Math.round(point.x), Math.round(point.y), 5, 0, 2 * Math.PI);
  } else {
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
  }
  ctx.fill();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: Vector2D,
  end: Vector2D,
  color: string,
  lineWidth: number = 2
) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};
