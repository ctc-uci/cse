import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";

export const Settings = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const toast = useToast();

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
          toast({
            title: "Error",
            description: "Could not fetch user details",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      }
    };

    fetchUserDetails();
  }, [currentUser, backend]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName) {
      const names = currentUser.displayName.split(" ", 2);
      setFirstName(names[0] || "");
      setLastName(names[1] || "");
    } else if (currentUser?.firstName && currentUser?.lastName) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
    } else {
      setFirstName("");
      setLastName("");
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser?.uid) {
      toast({
        title: "Error",
        description: "User not identified. Cannot save changes.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "First and Last names cannot be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await backend.put("/users/update", {
        firebaseUid: currentUser.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error.response?.data || "Could not update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const navigate = useNavigate(); // Add this at the top with other hooks

  return (
    <>
      <VStack
        spacing={6}
        pt={8}
        pb="100px"
      >
        <Heading
          fontSize="2xl"
          fontWeight="semibold"
          mb={4}
        >
          Account Details
        </Heading>
        <Icon
          as={FaUserCircle}
          w={100}
          h={100}
          color="gray.500"
          mb={6}
        />

        <VStack
          spacing={4}
          align="stretch"
          w="80%"
          maxW="400px"
        >
          <Box>
            <Text
              mb="1"
              fontSize="sm"
              color="gray.600"
            >
              First Name
            </Text>
            <InputGroup>
              <Input
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputRightElement>
                <Icon
                  as={FaPencilAlt}
                  color="gray.400"
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          <Box>
            <Text
              mb="1"
              fontSize="sm"
              color="gray.600"
            >
              Last Name
            </Text>
            <InputGroup>
              <Input
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
              <InputRightElement>
                <Icon
                  as={FaPencilAlt}
                  color="gray.400"
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          <Box>
            <Text
              mb="1"
              fontSize="sm"
              color="gray.600"
            >
              Email
            </Text>
            <Input
              value={currentUser?.email || "Not available"}
              isReadOnly
              variant="filled"
            />
          </Box>

          <Box>
            <Text
              mb="1"
              fontSize="sm"
              color="gray.600"
            >
              Password
            </Text>
            <Button
              w="full"
              onClick={() => navigate("/forgotPassword")}
              colorScheme="purple"
              variant="outline"
            >
              Change Password
            </Button>
          </Box>

          <Button
            colorScheme="purple"
            size="lg"
            mt={6}
            w="full"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </VStack>
      </VStack>
      <Navbar />
    </>
  );
};
