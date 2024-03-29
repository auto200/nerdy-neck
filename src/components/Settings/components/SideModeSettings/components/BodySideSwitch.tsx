import {
  Box,
  chakra,
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBodySide,
  toggleBodySide,
} from "@store/slices/sideModeSettingsSlice";

export const BodySideSwitch = () => {
  const bodySide = useSelector(selectBodySide);
  const dispatch = useDispatch();

  return (
    <FormControl my={6}>
      <FormLabel m="0">Body side</FormLabel>
      <Box>
        <chakra.span color={bodySide === "left" ? "blue.200" : ""}>
          Left
        </chakra.span>
        <ChakraSwitch
          mx={2}
          isChecked={bodySide === "right"}
          onChange={() => dispatch(toggleBodySide())}
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
        <chakra.span color={bodySide === "right" ? "blue.200" : ""}>
          Right
        </chakra.span>
      </Box>
    </FormControl>
  );
};
