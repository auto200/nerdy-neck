import { IStore } from "./store";

//for some reason if i put this variable in './store' it throws "cannot access
//'initialStoreState' before initialization" from 'store.context.tsx'
export const initialStoreState: IStore = {
  camPermissionGranted: null,
  cams: [],
  currentCamId: "",
  mediaLoaded: false,
  running: false,
  poseNet: null,
  appReady: false,
};
