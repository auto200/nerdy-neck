import { Vector2D } from "@tensorflow-models/pose-detection/dist/posenet/types";

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: Vector2D,
  color: string,
  roundCoordinates: boolean = true
) => {
  const x = roundCoordinates ? Math.round(point.x) : point.x;
  const y = roundCoordinates ? Math.round(point.y) : point.y;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: Vector2D,
  end: Vector2D,
  color: string,
  lineWidth: number = 2,
  roundCoordinates: boolean = true
) => {
  const startX = roundCoordinates ? Math.round(start.x) : start.x;
  const startY = roundCoordinates ? Math.round(start.y) : start.y;
  const endX = roundCoordinates ? Math.round(end.x) : end.x;
  const endY = roundCoordinates ? Math.round(end.y) : end.y;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

export const placeTextBetweenTwoPoints = ({
  ctx,
  text,
  color,
  start,
  end,
  shiftX = 0,
  shiftY = 0,
  font = "48px serif",
  roundCoordinates = true,
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  color: string;
  start: Vector2D;
  end: Vector2D;
  shiftX?: number;
  shiftY?: number;
  font?: string;
  roundCoordinates?: boolean;
}) => {
  let x = start.x - (start.x - end.x) / 2 + shiftX;
  let y = start.y - (start.y - end.y) / 2 + shiftY;
  x = roundCoordinates ? Math.round(x) : x;
  y = roundCoordinates ? Math.round(y) : y;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
