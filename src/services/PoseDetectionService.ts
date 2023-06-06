import {
  MoveNetModelConfig,
  Pose,
  PoseDetectorInput,
  SupportedModels,
  PoseDetector as TfPoseDetector,
  createDetector,
  movenet,
} from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";

export class PoseDetectionService {
  private detector: TfPoseDetector | null = null;

  public async load() {
    //TODO: make it possible to pass config object
    if (this.detector) return;

    const config: MoveNetModelConfig = {
      modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
    };

    await tf.setBackend("webgl");
    this.detector = await createDetector(SupportedModels.MoveNet, config);

    //warm up
    //https://github.com/tensorflow/tfjs-models/blob/9b5d3b663638752b692080145cfb123fa324ff11/pose-detection/demos/upload_video/src/index.js#L181
    const warmUpTensor = tf.fill([500, 600, 3], 0, "float32");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.detector.estimatePoses(warmUpTensor as any);
    warmUpTensor.dispose();
  }

  //TODO: pass `flipHorizontal`
  public async getPose(mediaInput: PoseDetectorInput): Promise<Pose | null> {
    if (!this.detector) {
      throw new Error("You need to load model first.");
    }

    try {
      const pose = await this.detector.estimatePoses(mediaInput, {});
      return pose[0] ?? null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
