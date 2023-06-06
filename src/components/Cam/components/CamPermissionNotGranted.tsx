import { Box, Center, Heading, Image } from "@chakra-ui/react";
import { ReactComponent as CamErrorImg } from "assets/cam-error.svg";
import grantPermissionImg from "assets/grant-permission.png";
import { CAM_HEIGHT, CAM_WIDTH } from "utils/constants";

export const CamPermissionNotGranted: React.FC = () => {
  return (
    <Box pos="relative" width={CAM_WIDTH} height={CAM_HEIGHT}>
      <Image as={CamErrorImg} width="full" height="full" opacity="0.5" />
      <Center pos="absolute" top="0" left="0" h="full" textAlign="center">
        <Heading
          variant="h3"
          fontSize="2xl"
          color="yellow.400"
          maxW="600px"
          mx="2"
        >
          You need to grant permission to use your cam. Do it now and refresh
          the website 🙂 If this problem keeps occuring, make sure that no other
          applications are using your camera at the same time
        </Heading>
      </Center>
      <Box mt="2">
        <img src={grantPermissionImg} alt="How to grant permission" />
      </Box>
    </Box>
  );
};
