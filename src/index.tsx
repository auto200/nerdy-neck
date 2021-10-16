// import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ConfigContext from "./contexts/ConfigContext";
import { StoreContextProvider } from "./contexts/store";
import theme from "./utils/theme";

ReactDOM.render(
  <React.StrictMode>
    <StoreContextProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ConfigContext>
          <App />
        </ConfigContext>
      </ChakraProvider>
    </StoreContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
