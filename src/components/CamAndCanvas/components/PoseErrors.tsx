import { Box } from "@chakra-ui/react";
import badPostureSound from "assets/on-error-sound.mp3";
import { useEffect, useRef } from "react";
import { useSettings } from "utils/hooks/useSettings";

interface Props {
  errors: string[];
}

const PoseErrors: React.FC<Props> = ({ errors }) => {
  const {
    settings: {
      additional: { sound },
    },
  } = useSettings();

  const audioRef = useRef(new Audio(badPostureSound));

  useEffect(() => {
    if (errors.length === 0) return;

    if (!sound.enabled && !audioRef.current.paused) {
      audioRef.current.pause();
      return;
    }

    if (sound.enabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [errors, sound.enabled]);

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
