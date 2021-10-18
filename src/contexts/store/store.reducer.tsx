import { PoseNet } from "@tensorflow-models/posenet";
import { IStore } from "./store";

export type StoreReducerActions =
  | {
      action: "SET_CAM_PERMISSION_GRANTED";
      payload: boolean | null;
    }
  | {
      action: "SET_CAMS";
      payload: MediaDeviceInfo[];
    }
  | {
      action: "SET_CURRENT_CAM_ID";
      payload: string;
    }
  | {
      action: "SET_MEDIA_LOADED";
      payload: boolean;
    }
  | {
      action: "SET_RUNNING";
      payload: boolean;
    }
  | {
      action: "SET_POSE_NET";
      payload: PoseNet;
    }
  | {
      action: "SET_APP_READY";
      payload: boolean;
    };

export const storeReducer = (
  state: IStore,
  action: StoreReducerActions
): IStore => {
  switch (action.action) {
    case "SET_CAM_PERMISSION_GRANTED": {
      return { ...state, camPermissionGranted: action.payload };
    }
    case "SET_CAMS": {
      return { ...state, cams: action.payload };
    }
    case "SET_CURRENT_CAM_ID": {
      return { ...state, currentCamId: action.payload };
    }
    case "SET_MEDIA_LOADED": {
      return { ...state, mediaLoaded: action.payload };
    }
    case "SET_RUNNING": {
      return { ...state, running: action.payload };
    }
    case "SET_POSE_NET": {
      return { ...state, poseNet: action.payload };
    }
    case "SET_APP_READY": {
      return { ...state, appReady: action.payload };
    }
    default: {
      throw new Error("Invalid action type");
    }
  }
};
