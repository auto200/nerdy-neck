import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  getPoseIntervalInS: number;
}

const SecToPoseCheck: React.FC<Props> = ({ getPoseIntervalInS }) => {
  const [secToPoseCheck, setSecToPoseCheck] = useState(getPoseIntervalInS);
  const endTsRef = useRef(0);

  useEffect(() => {
    endTsRef.current = Date.now() + getPoseIntervalInS * 1000;

    const interval = window.setInterval(() => {
      const secToPoseCheck = Math.ceil((endTsRef.current - Date.now()) / 1000);
      setSecToPoseCheck(secToPoseCheck);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [getPoseIntervalInS]);

  return (
    <Box pos="absolute" bottom="5px" right="5px">
      <Heading
        variant="h2"
        color="blackAlpha.500"
        sx={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.7)" }}
      >
        {secToPoseCheck}
      </Heading>
    </Box>
  );
};

export default SecToPoseCheck;
