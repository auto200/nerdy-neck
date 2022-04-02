import { Box, Flex } from "@chakra-ui/react";
import { Cam } from "components/Cam";
import Controls from "components/Controls";
import GithubLink from "components/GithubLink";
import PanicButton from "components/PanicButton";
import Settings from "components/Settings";

const App: React.FC = () => {
  return (
    <>
      <Flex flexWrap="wrap">
        <GithubLink />
        <Box>
          <Cam />
          <Controls />
        </Box>
        <Settings />
      </Flex>
      <PanicButton />
    </>
  );
};

export default App;
