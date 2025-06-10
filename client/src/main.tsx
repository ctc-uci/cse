import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import App from "./App.tsx";

import "@fontsource-variable/inter";

const colors = {
  purple: {
    100: "#6B46C1",
  },
};

const fonts = {
  body: `'inter', sans-serif`,
  heading: `'inter', sans-serif`,
};

const theme = extendTheme({ colors, fonts });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
