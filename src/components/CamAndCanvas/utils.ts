import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";
import { Cam } from "../../utils/interfaces";

export const getCameraPemission = async () => {
  try {
    await window.navigator.mediaDevices.getUserMedia({
      video: true,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getCams = async (): Promise<Cam[]> => {
  try {
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    const cams = devices
      .filter(
        ({ kind, deviceId, label }) =>
          kind === "videoinput" && deviceId && label
      )
      .map(({ deviceId, label }) => ({ label, id: deviceId }));
    return cams;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getStream = async (camId: string): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: CAM_WIDTH,
        height: CAM_HEIGHT,
        deviceId: camId,
      },
    });
    return stream;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getFrameFromVideoEl = (videoEl: HTMLVideoElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(videoEl, 0, 0, videoEl.width, videoEl.height);
  const frame = ctx.getImageData(0, 0, videoEl.width, videoEl.height);
  return frame;
};
