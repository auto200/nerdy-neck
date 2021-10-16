import { Box, Flex } from "@chakra-ui/react";
import "@tensorflow/tfjs";
import CamAndCanvas from "./components/CamAndCanvas";
import Config from "./components/Config";
import Controls from "./components/Controls";
import GithubLink from "./components/GithubLink";
import HardwareAccelerationNotice from "./components/HardwareAccelerationNotice";
import PanicButton from "./components/PanicButton";

const App: React.FC = () => {
  return (
    <>
      <Flex flexWrap="wrap">
        <GithubLink />
        <Box>
          <CamAndCanvas />
          <Controls />
          <HardwareAccelerationNotice />
        </Box>
        {/* config ui */}
        <Config />
      </Flex>
      <PanicButton />
    </>
  );
};

export default App;
