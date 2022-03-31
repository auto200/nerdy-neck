import { Vector2D } from "@tensorflow-models/pose-detection/dist/posenet/types";

export const angleBetweenPoints = (
  a: Vector2D,
  b: Vector2D,
  roundValue: boolean = true
) => {
  const dy = Math.abs(a.y - b.y);
  const dx = Math.abs(a.x - b.x);
  const deg = Math.abs(90 - Math.atan2(dy, dx) * (180 / Math.PI));
  return roundValue ? Math.round(deg) : deg;
};

export const isNumberInTolerance = (
  number: number,
  middlePoint: number,
  tolerance: number
) => {
  return Math.abs(middlePoint - number) <= tolerance ? true : false;
};
