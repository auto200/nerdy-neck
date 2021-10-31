import { Cam } from "./interfaces";

export const promptCameraPemission = async () => {
  return await window.navigator.mediaDevices.getUserMedia({
    video: true,
  });
};

export const getCams = async (): Promise<Cam[]> => {
  const devices = await window.navigator.mediaDevices.enumerateDevices();
  const cams = devices
    .filter(
      ({ kind, deviceId, label }) => kind === "videoinput" && deviceId && label
    )
    .map(({ deviceId, label }) => ({ label, id: deviceId }));
  return cams;
};
