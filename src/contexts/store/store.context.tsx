import { createContext } from "react";
import { initialStoreState } from "./initialStoreState";
import { IStore } from "./store";
import { StoreHandlers } from "./store.handlers";

const throwNotImplementedError = () => {
  throw new Error("Function not implemented");
};

export const StoreContext = createContext<{
  store: IStore;
  storeHandlers: StoreHandlers;
}>({
  store: initialStoreState,
  storeHandlers: {
    setCamPermissionGranted: throwNotImplementedError,
    setCams: throwNotImplementedError,
    setCurrentCamId: throwNotImplementedError,
    setMediaLoaded: throwNotImplementedError,
    setRunning: throwNotImplementedError,
    setPoseNet: throwNotImplementedError,
    setAppReady: throwNotImplementedError,
  },
});
