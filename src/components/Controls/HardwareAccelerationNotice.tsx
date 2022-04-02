import { Code, Text } from "@chakra-ui/react";

const HardwareAccelerationNotice: React.FC = () => {
  return (
    <Text ml="5px" maxW="600" px="1" textAlign="center">
      If your having performance issues, please make sure to have{" "}
      <span>
        <Code color="firebrick">Hardware Acceleration</Code>
      </span>
      turned on in your browser settings
    </Text>
  );
};

export default HardwareAccelerationNotice;
