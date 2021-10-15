import { Text, Code } from "@chakra-ui/react";

const HardwareAccelerationNotice: React.FC = () => {
  return (
    <Text ml="5px" color="chartreuse">
      Please make sure to have{" "}
      <Code colorScheme="messenger">Hardware Acceleration</Code> turned on in
      your browser settings
    </Text>
  );
};

export default HardwareAccelerationNotice;
