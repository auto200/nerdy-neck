import { PoseNet } from "@tensorflow-models/posenet";

export type StoreHandlers = {
  setCamPermissionGranted: (value: boolean | null) => void;
  setCams: (cams: MediaDeviceInfo[]) => void;
  setCurrentCamId: (id: string) => void;
  setMediaLoaded: (value: boolean) => void;
  setRunning: (value: boolean) => void;
  setPoseNet: (poseNet: PoseNet) => void;
  setAppReady: (value: boolean) => void;
};
