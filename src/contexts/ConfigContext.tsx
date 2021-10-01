import React, { createContext, useContext, useEffect } from "react";
import { useImmerReducer } from "../utils/hooks/useImmerReducer";

export interface Config {
  bodySide: "left" | "right";
  getPoseIntervalInS: number;
  additional: {
    onErrorRetry: {
      enabled: boolean;
      intervalInS: number;
    };
    sound: {
      enabled: boolean;
    };
    minUpperBodyKeypointScore: number;
    minLowerBodyKeypointScore: number;
  };
  neckMonitoring: {
    enabled: boolean;
    desiredAngle: number;
    tolerance: number;
  };
  elbowMonitoring: {
    enabled: boolean;
    desiredAngle: number;
    tolerance: number;
  };
  banKneesAndAnkles: boolean;
}

export const initialConfig: Config = {
  bodySide: "right",
  getPoseIntervalInS: 45,
  //additional settings
  //maby extract additional settings to other reducer
  //https://stackoverflow.com/questions/59200785/react-usereducer-how-to-combine-multiple-reducers
  additional: {
    onErrorRetry: {
      enabled: false,
      intervalInS: 5,
    },
    minUpperBodyKeypointScore: 0.6,
    minLowerBodyKeypointScore: 0.2,
    sound: {
      enabled: false,
    },
  },

  neckMonitoring: {
    enabled: true,
    desiredAngle: 15,
    tolerance: 5,
  },
  elbowMonitoring: {
    enabled: true,
    desiredAngle: 90,
    tolerance: 10,
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

type Action =
  | { type: "TOGGLE_BODY_SIDE" }
  | { type: "SET_GET_POSE_INTERVAL_IN_S"; payload: number }
  | { type: "TOGGLE_ADDITIONAL_ON_ERROR_RETRY" }
  | { type: "SET_ADDITIONAL_ON_ERROR_RETRY_INTERVAL_IN_S"; payload: number }
  | { type: "SET_ADDITIONAL_MIN_UPPER_BODY_KEYPOINT_SCORE"; payload: number }
  | { type: "SET_ADDITIONAL_MIN_LOWER_BODY_KEYPOINT_SCORE"; payload: number }
  | { type: "TOGGLE_ADDITIONAL_SOUND_ENABLED" }
  | { type: "TOGGLE_NECK_MONITORING" }
  | { type: "SET_NECK_ANGLE"; payload: number }
  | { type: "SET_NECK_TOLERANCE"; payload: number }
  | { type: "TOGGLE_ELBOW_MONITORING" }
  | { type: "SET_ELBOW_ANGLE"; payload: number }
  | { type: "SET_ELBOW_TOLERANCE"; payload: number }
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

    case "TOGGLE_ADDITIONAL_ON_ERROR_RETRY": {
      config.additional.onErrorRetry.enabled =
        !config.additional.onErrorRetry.enabled;
      return;
    }
    case "SET_ADDITIONAL_ON_ERROR_RETRY_INTERVAL_IN_S": {
      config.additional.onErrorRetry.intervalInS = action.payload;
      return;
    }

    case "SET_ADDITIONAL_MIN_UPPER_BODY_KEYPOINT_SCORE": {
      config.additional.minUpperBodyKeypointScore = action.payload;
      return;
    }
    case "SET_ADDITIONAL_MIN_LOWER_BODY_KEYPOINT_SCORE": {
      config.additional.minLowerBodyKeypointScore = action.payload;
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

    case "TOGGLE_ADDITIONAL_SOUND_ENABLED": {
      config.additional.sound.enabled = !config.additional.sound.enabled;
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
