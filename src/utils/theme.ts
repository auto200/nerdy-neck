import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const theme = extendTheme({
  //@ts-ignore
  config,
});
export default theme;
