import { Pose } from "@tensorflow-models/posenet";
import { PosenetInput } from "@tensorflow-models/posenet/dist/types";

export type GetPose = (mediaInput: PosenetInput) => Promise<Pose | undefined>;
export type LoadPoseNet = () => Promise<boolean>;

export type PoseWorker = { getPose: GetPose; loadPoseNet: LoadPoseNet };
