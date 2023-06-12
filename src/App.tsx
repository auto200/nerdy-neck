import { Box, Flex } from "@chakra-ui/react";
import { Cam } from "@components/Cam";
import Controls from "@components/Controls";
import GithubLink from "@components/GithubLink";
import { InitialLoader } from "@components/InitialLoader";
import PanicButton from "@components/PanicButton";
import Settings from "@components/Settings";
import { usePoseDetector } from "@utils/hooks/usePoseDetector";

const App: React.FC = () => {
  const poseDetector = usePoseDetector();

  if (poseDetector.state !== "ready") {
    return <InitialLoader state={poseDetector.state} />;
  }

  return (
    <>
      <Flex flexWrap="wrap">
        <GithubLink />
        <Box>
          <Cam getPose={poseDetector.getPose} />
          <Controls />
        </Box>
        <Settings />
      </Flex>
      <PanicButton />
    </>
  );
};

export default App;
