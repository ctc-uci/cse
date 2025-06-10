import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const xl = defineStyle({
  px: "6",
  py: "2",
  fontSize: "xl",
});

const sm = defineStyle({
  fontSize: "sm",
  py: "6",
});

const sizes = {
  xl: definePartsStyle({ header: sm, dialog: xl }),
};

export const modalTheme = defineMultiStyleConfig({
  sizes,
});
