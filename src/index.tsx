// import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "store";
import App from "./App";
import { StoreContextProvider } from "./contexts/store";
import theme from "./utils/theme";

ReactDOM.render(
  <React.StrictMode>
    <StoreContextProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Provider store={store}>
          <App />
        </Provider>
      </ChakraProvider>
    </StoreContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
