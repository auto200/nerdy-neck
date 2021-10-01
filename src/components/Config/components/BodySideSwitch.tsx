import {
  Box,
  chakra,
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { useConfig } from "../../../contexts/ConfigContext";

const BodySideSwitch = () => {
  const { config, dispatch: dispatchConfig } = useConfig();

  return (
    <FormControl my={6}>
      <FormLabel htmlFor="body-side-switch" m="0">
        Body side
      </FormLabel>
      <Box>
        <chakra.span color={config.bodySide === "left" ? "blue.200" : ""}>
          Left
        </chakra.span>
        <ChakraSwitch
          id="body-side-switch"
          mx={2}
          isChecked={config.bodySide === "right"}
          onChange={() => dispatchConfig({ type: "TOGGLE_BODY_SIDE" })}
          sx={{
            "& span[data-checked]": {
              background: "rgba(255, 255, 255, 0.24)",
            },
            "& span span": {
              background: "blue.200",
            },
            "& span[data-checked] span": {
              background: "blue.200",
            },
          }}
        />
        <chakra.span color={config.bodySide === "right" ? "blue.200" : ""}>
          Right
        </chakra.span>
      </Box>
    </FormControl>
  );
};

export default BodySideSwitch;
