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

export const UPPER_BODY = {
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
export const LOWER_BODY = {
  // leftHip: 11,
  // rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16,
};

export const FONT_SIZE = 48;
export const TEXT_MARGIN = FONT_SIZE * 0.2;
export const TEXT_LINE_HEIGHT = FONT_SIZE / 3;
export const KEYPOINT_COLOR = "aqua";
export const ERROR_COLOR = "red";
