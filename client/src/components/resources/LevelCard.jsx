import { Badge } from "@chakra-ui/react";

export const LevelCard = ({ level }) => (
  <Badge
    colorScheme={
      level === "beginner"
        ? "green"
        : level === "intermediate"
          ? "yellow"
          : "red"
    }
  >
    {level}
  </Badge>
);
