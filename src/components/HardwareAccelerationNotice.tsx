import { Code, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectAppState } from "store";

const HardwareAccelerationNotice: React.FC = () => {
  const { appReady } = useSelector(selectAppState);
  //TODO: check if hardware acceleration is supported/enabled
  if (!appReady) {
    return null;
  }

  return (
    <Text ml="5px" color="chartreuse" maxW="600" px="1" textAlign="center">
      If your having performace issues, please make sure to have{" "}
      <span>
        <Code colorScheme="pink">Hardware Acceleration</Code>
      </span>
      turned on in your browser settings
    </Text>
  );
};

export default HardwareAccelerationNotice;
