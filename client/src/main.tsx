import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import App from "./App.tsx";

import "@fontsource-variable/inter";

const fonts = {
  body: `Inter Variable, sans-serif`,
  heading: `Inter Variable, sans-serif`,
};

const theme = extendTheme({
  fonts,
  styles: {
    global: {
      body: {
        bg: "#FAFAFA",
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
