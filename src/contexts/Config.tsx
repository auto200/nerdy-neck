import React, { createContext, useContext } from "react";
import { useImmerReducer } from "../utils/hooks/useImmerReducer";

export interface Config {
  getPoseInterval: string;
  bodySide: "left" | "right";
  earShoulderMonitoring: {
    enabled: boolean;
    desiredAngle: string;
    tolerance: string;
  };
  shoulderWristMonitoring: {
    enabled: boolean;
    desiredAngle: string;
    tolerance: string;
  };
  banKneeAndAnkle: boolean;
  minKeypointScore: number;
}

export const initialConfig: Config = {
  getPoseInterval: "1000",
  bodySide: "right",
  earShoulderMonitoring: {
    enabled: true,
    desiredAngle: "15",
    tolerance: "5",
  },
  shoulderWristMonitoring: {
    enabled: true,
    desiredAngle: "45",
    tolerance: "10",
  },
  banKneeAndAnkle: false,
  minKeypointScore: 0.6,
};

const configContext = createContext<{
  config: Config;
  dispatch: React.Dispatch<Action>;
}>({
  config: initialConfig,
  dispatch: () => null,
});

export type Action =
  | { type: "SET_GET_POSE_INTERVAL"; payload: string }
  | { type: "TOGGLE_BODY_SIDE" }
  | { type: "TOGGLE_EAR_SHOULDER_MONITORING" }
  | { type: "SET_EAR_SHOULDER_ANGLE"; payload: string }
  | { type: "SET_EAR_SHOULDER_TOLERANCE"; payload: string }
  | { type: "TOGGLE_SHOULDER_WRIST_MONITORING" }
  | { type: "SET_SHOULDER_WRIST_ANGLE"; payload: string }
  | { type: "SET_SHOULDER_WRIST_TOLERANCE"; payload: string }
  | { type: "TOGGLE_BAN_KNEE_AND_ANKLE" };

const reducer = (config: Config, action: Action) => {
  switch (action.type) {
    case "TOGGLE_BODY_SIDE": {
      config.bodySide = config.bodySide === "left" ? "right" : "left";
      return;
    }

    case "SET_GET_POSE_INTERVAL": {
      config.getPoseInterval = action.payload;
      return;
    }

    case "TOGGLE_EAR_SHOULDER_MONITORING": {
      config.earShoulderMonitoring.enabled = !config.earShoulderMonitoring
        .enabled;
      return;
    }
    case "SET_EAR_SHOULDER_ANGLE": {
      config.earShoulderMonitoring.desiredAngle = action.payload;
      return;
    }
    case "SET_EAR_SHOULDER_TOLERANCE": {
      config.earShoulderMonitoring.tolerance = action.payload;
      return;
    }

    case "TOGGLE_SHOULDER_WRIST_MONITORING": {
      config.shoulderWristMonitoring.enabled = !config.shoulderWristMonitoring
        .enabled;
      return;
    }
    case "SET_SHOULDER_WRIST_ANGLE": {
      config.shoulderWristMonitoring.desiredAngle = action.payload;
      return;
    }
    case "SET_SHOULDER_WRIST_TOLERANCE": {
      config.shoulderWristMonitoring.tolerance = action.payload;
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
