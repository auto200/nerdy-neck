import { CAM_HEIGHT, CAM_WIDTH } from "@utils/constants";
import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";

export interface Cam {
  label: string;
  id: string;
}

export type UseCamControllerReturnType =
  | { isPermissionGranted: null }
  | {
      isPermissionGranted: false;
    }
  | {
      isPermissionGranted: true;
      cams: Cam[];
      stream: MediaStream | null;
    };

export const useCamController = (): UseCamControllerReturnType => {
  const {
    settings: { selectedCamId },
    appMode,
  } = useSettings();

  const [isPermissionGranted, setIsPermissionGranted] = useState<
    null | boolean
  >(null);
  const [cams, setCams] = useState<Cam[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    (async () => {
      if (!(await getCameraPermission())) {
        setIsPermissionGranted(false);
        return;
      }

      setIsPermissionGranted(true);

      const cams = await getCams();

      if (cams.length === 0) {
        //TODO: handle case when there are no cams
        console.log("no camera devices detected");
        return;
      }

      setCams(cams);
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!selectedCamId) {
      setStream(null);
      return;
    }

    getStream(selectedCamId)
      .then((stream) => setStream(stream))
      .catch((err) => console.log(err));
  }, [selectedCamId, appMode]);

  return { isPermissionGranted, cams, stream };
};

async function getCameraPermission(): Promise<boolean> {
  try {
    await window.navigator.mediaDevices.getUserMedia({
      video: true,
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCams(): Promise<Cam[]> {
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
}

async function getStream(camId: string): Promise<MediaStream | null> {
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
}
