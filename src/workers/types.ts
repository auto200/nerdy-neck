import { Pose, PoseDetectorInput } from "@tensorflow-models/pose-detection";

export type GetPose = (
  mediaInput: PoseDetectorInput
) => Promise<Pose | undefined>;

export type LoadDetector = () => Promise<boolean>;

export type PoseWorker = { getPose: GetPose; loadDetector: LoadDetector };
