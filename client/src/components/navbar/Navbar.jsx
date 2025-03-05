import { Link } from "react-router-dom";
import { Flex, Box } from '@chakra-ui/react';

import bookingsImg from "./bookings_img.png";
import profileImg from "./profile_img.png";
import discoveryImg from "./discovery_img.png";
import resourcesImg from "./resources_img.png";

export const Navbar = () => {
  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="#DBDBDB"
      p={3}
      padding={5}
      height="80px"
    >
      <Flex justify="space-around" align="center" gap="14">
          <Link to="/profile">
            <img src={profileImg}></img>
          </Link>
          <Link to="/resources">
              <img src={resourcesImg}></img>
          </Link>
          <Link to="/discovery">
              <img src={discoveryImg}></img>
          </Link>
          <Link to="/bookings">
              <img src={bookingsImg}></img>
          </Link>
      </Flex>
    </Box>
  );
}