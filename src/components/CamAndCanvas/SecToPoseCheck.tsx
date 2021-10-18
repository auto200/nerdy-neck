import { Box, Heading } from "@chakra-ui/react";

interface Props {
  sec: number;
}

const SecToPoseCheck: React.FC<Props> = ({ sec }) => {
  return (
    <Box pos="absolute" bottom="5px" right="5px">
      <Heading
        variant="h2"
        color="blackAlpha.500"
        sx={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.7)" }}
      >
        {sec}
      </Heading>
    </Box>
  );
};

export default SecToPoseCheck;
