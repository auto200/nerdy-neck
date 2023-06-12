import { Box, Flex } from "@chakra-ui/react";
import { Cam } from "@components/Cam";
import { CamPermissionNotGranted } from "@components/Cam/components";
import Controls from "@components/Controls";
import GithubLink from "@components/GithubLink";
import { InitialLoader } from "@components/InitialLoader";
import PanicButton from "@components/PanicButton";
import Settings from "@components/Settings";
import { useCamController } from "@hooks/useCamController";
import { usePoseDetector } from "@hooks/usePoseDetector";

const App: React.FC = () => {
  const poseDetector = usePoseDetector();
  const camController = useCamController();

  if (poseDetector.state !== "ready") {
    return <InitialLoader state={poseDetector.state} />;
  }

  return (
    <>
      <Flex flexWrap="wrap">
        <GithubLink />

        <Box>
          {camController.isPermissionGranted === false && (
            <CamPermissionNotGranted />
          )}

          {camController.isPermissionGranted && (
            <Cam getPose={poseDetector.getPose} stream={camController.stream} />
          )}

          {<Controls camController={camController} />}
        </Box>

        <Settings />
      </Flex>

      <PanicButton />
    </>
  );
};

export default App;
