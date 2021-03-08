import React, { createContext, useContext, useEffect } from "react";
import { useImmerReducer } from "../utils/hooks/useImmerReducer";

export interface Config {
  bodySide: "left" | "right";
  getPoseIntervalInS: string;
  onErrorRetryIntervalInS: string;
  minUpperBodyKeypointScore: number;
  minLowerBodyKeypointScore: number;
  neckMonitoring: {
    enabled: boolean;
    desiredAngle: string;
    tolerance: string;
  };
  elbowMonitoring: {
    enabled: boolean;
    desiredAngle: string;
    tolerance: string;
  };
  banKneesAndAnkles: boolean;
}

export const initialConfig: Config = {
  bodySide: "right",
  getPoseIntervalInS: "1",
  //additional settings / maby move them to separate object
  onErrorRetryIntervalInS: "5",
  minUpperBodyKeypointScore: 0.6,
  minLowerBodyKeypointScore: 0.2,

  neckMonitoring: {
    enabled: true,
    desiredAngle: "15",
    tolerance: "5",
  },
  elbowMonitoring: {
    enabled: true,
    desiredAngle: "90",
    tolerance: "10",
  },
  banKneesAndAnkles: true,
};

const configContext = createContext<{
  config: Config;
  dispatch: React.Dispatch<Action>;
}>({
  config: initialConfig,
  dispatch: () => null,
});

export type Action =
  | { type: "TOGGLE_BODY_SIDE" }
  | { type: "SET_GET_POSE_INTERVAL_IN_S"; payload: string }
  | { type: "SET_ON_ERROR_RETRY_INTERVAL_IN_S"; payload: string }
  | { type: "SET_MIN_UPPER_BODY_KEYPOINT_SCORE"; payload: number }
  | { type: "SET_MIN_LOWER_BODY_KEYPOINT_SCORE"; payload: number }
  | { type: "TOGGLE_NECK_MONITORING" }
  | { type: "SET_NECK_ANGLE"; payload: string }
  | { type: "SET_NECK_TOLERANCE"; payload: string }
  | { type: "TOGGLE_ELBOW_MONITORING" }
  | { type: "SET_ELBOW_ANGLE"; payload: string }
  | { type: "SET_ELBOW_TOLERANCE"; payload: string }
  | { type: "TOGGLE_BAN_KNEES_AND_ANKLES" };

const reducer = (config: Config, action: Action) => {
  switch (action.type) {
    case "TOGGLE_BODY_SIDE": {
      config.bodySide = config.bodySide === "left" ? "right" : "left";
      return;
    }

    case "SET_GET_POSE_INTERVAL_IN_S": {
      config.getPoseIntervalInS = action.payload;
      return;
    }

    case "SET_ON_ERROR_RETRY_INTERVAL_IN_S": {
      config.onErrorRetryIntervalInS = action.payload;
      return;
    }

    case "SET_MIN_UPPER_BODY_KEYPOINT_SCORE": {
      config.minUpperBodyKeypointScore = action.payload;
      return;
    }
    case "SET_MIN_LOWER_BODY_KEYPOINT_SCORE": {
      config.minLowerBodyKeypointScore = action.payload;
      return;
    }

    case "TOGGLE_NECK_MONITORING": {
      config.neckMonitoring.enabled = !config.neckMonitoring.enabled;
      return;
    }
    case "SET_NECK_ANGLE": {
      config.neckMonitoring.desiredAngle = action.payload;
      return;
    }
    case "SET_NECK_TOLERANCE": {
      config.neckMonitoring.tolerance = action.payload;
      return;
    }

    case "TOGGLE_ELBOW_MONITORING": {
      config.elbowMonitoring.enabled = !config.elbowMonitoring.enabled;
      return;
    }
    case "SET_ELBOW_ANGLE": {
      config.elbowMonitoring.desiredAngle = action.payload;
      return;
    }
    case "SET_ELBOW_TOLERANCE": {
      config.elbowMonitoring.tolerance = action.payload;
      return;
    }

    case "TOGGLE_BAN_KNEES_AND_ANKLES": {
      config.banKneesAndAnkles = !config.banKneesAndAnkles;
      return;
    }
    default:
      throw new Error("Invalid action type");
  }
};

const ConfigContextProvider: React.FC = ({ children }) => {
  const [config, dispatch] = useImmerReducer<Config, Action>(
    reducer,
    initialConfig,
    () => {
      const configStr = window.localStorage.getItem("config");
      return configStr ? JSON.parse(configStr) : initialConfig;
    }
  );

  useEffect(() => {
    try {
      const configStr = JSON.stringify(config);
      window.localStorage.setItem("config", configStr);
    } catch (err) {}
  }, [config]);

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
