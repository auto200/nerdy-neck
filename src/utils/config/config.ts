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

export const defaultConfig: Config = {
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
