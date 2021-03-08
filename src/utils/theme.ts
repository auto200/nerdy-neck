import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  //@ts-ignore
  config,
  styles: {
    global: {
      "#root": {
        minHeight: "100vh",
      },
    },
  },
});
export default theme;
