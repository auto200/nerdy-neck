import React, { createContext, useContext } from "react";
import { useImmerReducer } from "../utils/hooks/useImmerReducer";

export interface Config {
  getPoseFrequency: number;
  bodySide: "left" | "right";
  earShoulderMonitoring: {
    enabled: boolean;
    angle: number;
    tolerance: number;
  };
  shoulderWristMonitoring: {
    enabled: boolean;
    angle: number;
    tolerance: number;
  };
  banKneeAndAnkle: boolean;
}

export const initialConfig: Config = {
  getPoseFrequency: 1000,
  bodySide: "right",
  earShoulderMonitoring: {
    enabled: true,
    angle: 15,
    tolerance: 5,
  },
  shoulderWristMonitoring: {
    enabled: true,
    angle: 45,
    tolerance: 10,
  },
  banKneeAndAnkle: false,
};

const configContext = createContext<{
  config: Config;
  dispatch: React.Dispatch<Action>;
}>({
  config: initialConfig,
  dispatch: () => null,
});

export type Action =
  | { type: "SET_GET_POSE_FREQUENCY"; payload: number }
  | { type: "TOGGLE_BODY_SIDE" }
  | { type: "TOGGLE_EAR_SHOULDER_MONITORING" }
  | { type: "TOGGLE_SHOULDER_WRIST_MONITORING" }
  | { type: "TOGGLE_BAN_KNEE_AND_ANKLE" };

const reducer = (config: Config, action: Action) => {
  switch (action.type) {
    case "TOGGLE_BODY_SIDE": {
      config.bodySide = config.bodySide === "left" ? "right" : "left";
      return;
    }
    case "SET_GET_POSE_FREQUENCY": {
      config.getPoseFrequency = action.payload;
      return;
    }
    case "TOGGLE_EAR_SHOULDER_MONITORING": {
      config.earShoulderMonitoring.enabled = !config.earShoulderMonitoring
        .enabled;
      return;
    }
    case "TOGGLE_SHOULDER_WRIST_MONITORING": {
      config.shoulderWristMonitoring.enabled = !config.shoulderWristMonitoring
        .enabled;
      return;
    }
    case "TOGGLE_BAN_KNEE_AND_ANKLE": {
      config.banKneeAndAnkle = !config.banKneeAndAnkle;
      return;
    }
    default:
      throw new Error("Invalid action type");
  }
};

const ConfigContextProvider: React.FC = ({ children }) => {
  const [config, dispatch] = useImmerReducer<Config, Action>(
    reducer,
    initialConfig
  );

  const values = {
    config,
    dispatch,
  };

  return (
    <configContext.Provider value={values}>{children}</configContext.Provider>
  );
};

export default ConfigContextProvider;

export const useConfig = () => useContext(configContext);
