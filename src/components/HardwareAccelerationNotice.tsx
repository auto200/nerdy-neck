import { Code, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectAppState } from "store";

const HardwareAccelerationNotice: React.FC = () => {
  const { appReady } = useSelector(selectAppState);

  if (!appReady) {
    return null;
  }

  return (
    <Text ml="5px" color="chartreuse">
      Please make sure to have{" "}
      <Code colorScheme="messenger">Hardware Acceleration</Code> turned on in
      your browser settings
    </Text>
  );
};

export default HardwareAccelerationNotice;
