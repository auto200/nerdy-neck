import { Box } from "@chakra-ui/react";

interface Props {
  errors: string[];
}

const PoseErrors: React.FC<Props> = ({ errors }) => {
  return (
    <Box pos="absolute" top="0" left="2">
      {errors.map((err, i) => (
        <Box
          key={i}
          color="red.500"
          fontSize="3xl"
          fontWeight="bold"
          sx={{ WebkitTextStroke: "1px rgba(0, 0, 0, 0.7)" }}
        >
          {err}
        </Box>
      ))}
    </Box>
  );
};

export default PoseErrors;
