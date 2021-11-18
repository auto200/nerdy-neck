import {
  createDetector,
  movenet,
  MoveNetModelConfig,
  Pose,
  PoseDetector as TfPoseDetector,
  PoseDetectorInput,
  SupportedModels,
} from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export class PoseDetector {
  private detector: TfPoseDetector | null = null;

  public async load() {
    const config: MoveNetModelConfig = {
      modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
    };

    const loadStartTime = performance.now();
    console.log("creating detector");
    this.detector = await createDetector(SupportedModels.MoveNet, config);
    console.log("detector created, time:", performance.now() - loadStartTime);

    //warm up
    //https://github.com/tensorflow/tfjs-models/blob/9b5d3b663638752b692080145cfb123fa324ff11/pose-detection/demos/upload_video/src/index.js#L181
    const warmUpTensor = tf.fill([500, 600, 3], 0, "float32");
    await this.detector.estimatePoses(warmUpTensor as any);
    warmUpTensor.dispose();
  }

  public async getPose(mediaInput: PoseDetectorInput): Promise<Pose | null> {
    if (!this.detector) {
      throw new Error("You need to load model first.");
    }

    try {
      const startTime = performance.now();
      const pose = await this.detector.estimatePoses(mediaInput);
      console.log("pose estimation time:", performance.now() - startTime);
      console.log(pose);
      return pose[0] ?? null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
