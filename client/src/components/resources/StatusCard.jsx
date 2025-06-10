import { Badge } from "@chakra-ui/react";

export const StatusCard = ({ status }) => (
  <Badge
    backgroundColor={status ? "teal.500" : "red.500"}
    color="white"
    width="100px"
    textAlign="center"
  >
    {status ? "verified" : "not verified"}
  </Badge>
);
