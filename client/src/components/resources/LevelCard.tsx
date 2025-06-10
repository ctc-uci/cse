import { Badge } from "@chakra-ui/react";

import { Level } from "../types/booking";

export const LevelCard = (level: Level) => (
  <Badge
    colorScheme={
      level == Level.beginner
        ? "green"
        : level == Level.intermediate
          ? "yellow"
          : "red"
    }
  >
    {level}
  </Badge>
);
