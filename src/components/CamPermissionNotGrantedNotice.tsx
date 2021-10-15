import { Box, Heading } from "@chakra-ui/react";
import grantPermissionImg from "../assets/grant-permission.png";

const CamPermissionNotGrantedNotice: React.FC = () => {
  return (
    <Box>
      <Heading variant="h1" color="yellow.400" maxW="600px">
        {
          "You need to grant permission to use your cam. Do it now and refresh website :)"
        }
      </Heading>
      <Box>
        {/* TODO: change image, use official website not localhost and select correct setting */}
        <img src={grantPermissionImg} alt="How to grant permission" />
      </Box>
    </Box>
  );
};

export default CamPermissionNotGrantedNotice;
