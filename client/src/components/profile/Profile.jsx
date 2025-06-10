import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { L } from "../logout/Logout";
import { Navbar } from "../navbar/Navbar";

export const Profile = () => {
  const { currentUser, role } = useAuthContext();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser?.uid) {
        try {
          const response = await backend.get(`/users/${currentUser.uid}`);
          if (response.data) {
            const user = response.data[0];
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [backend, currentUser.uid]);

  // const hardcodedProfilePic =
  //   "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  // const hardcodedName =
  //   // currentUser?.first_name && currentUser?.last_name
  //   ? `${currentUser.first_name} ${currentUser.last_name}`
  //   : "Homie Tony";

  return (
    <Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="100vh"
        padding={4}
      >
        <Icon
          as={FaUserCircle}
          w={100}
          h={100}
          color="gray.500"
          mb={6}
        />
        <Heading
          fontSize="20px"
          fontWeight="600"
        >
          {firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName
              ? `${firstName}`
              : lastName
                ? `${lastName}`
                : "User"}
        </Heading>
        <Text>{currentUser?.email || "Not available"}</Text>
        <Text>Role: {role || "Not available"}</Text>

        <VStack
          spacing={4}
          mt={10}
          // w={"80"}
        >
          <Button
            onClick={() =>
              console.log("Redirect to GoFundMe to be implemented")
            }
            as="a"
            href="https://ctc-uci.com/"
            target="_blank"
            borderRadius="5px"
            color="white"
            bg="purple.600"
            height="6.407vh"
            // width calculated from figma hi-fi
            w="82.33vw"
          >
            <Text fontSize="16px">Donations</Text>
          </Button>
          <Button
            onClick={() => navigate("/settings")}
            colorScheme="gray"
            borderRadius="5px"
            color="white"
            bg="purple.600"
            height="6.407vh"
            // width calculated from figma hi-fi
            w="82.33vw"
          >
            Settings
          </Button>
          <L />
        </VStack>
      </Flex>
      <Navbar></Navbar>
    </Box>
  );
};
