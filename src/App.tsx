import "@tensorflow/tfjs";
import { Box, Flex } from "@chakra-ui/react";
import Config from "./components/Config";
import GithubLink from "./components/GithubLink";
import PanicButton from "./components/PanicButton";
import HardwareAccelerationNotice from "./components/HardwareAccelerationNotice";
import Controls from "./components/Controls";

import CamAndCanvas from "./components/CamAndCanvas";

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
