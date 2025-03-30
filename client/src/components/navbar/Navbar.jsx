import { Link } from "react-router-dom";
import { Flex, Box } from '@chakra-ui/react';

import bookingsImg from "./bookings_img.png";
import profileImg from "./profile_img.png";
import discoveryImg from "./discovery_img.png";
import resourcesImg from "./resources_img.png";
import { useState } from "react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";


export const Navbar = () => {
  const { role } = useAuthContext();


  return (
    <Box
      as="footer"
      position="sticky"
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
            <img style={{ userSelect: "none" }} src={profileImg}></img>
          </Link>
          <Link to="/resources">
              <img style={{ userSelect: "none" }} src={resourcesImg}></img>
          </Link>
          {
            role !== "teacher" && (
              <Link to="/discovery">
                <img style={{ userSelect: "none" }} src={discoveryImg}></img>
              </Link>
            )
          }
          <Link to="/bookings">
              <img style={{ userSelect: "none" }} src={bookingsImg}></img>
          </Link>
      </Flex>
    </Box>
  );
}
