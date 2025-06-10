import { useEffect, useState } from "react";

import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const TeacherNotification = ({ id, firstName, lastName }) => {
  const [handled, setHandled] = useState(false); // if the notificaiton has been dealt with (approved or denied)
  const { backend } = useBackendContext();
  const toast = useToast();

  const handleApprove = async (id) => {
    console.log("Approved teacher with id ", id);
    try {
      await backend.put(`/teachers/${id}`, {
        isActivated: true,
      });
      toast({
        title: "Teacher request approved.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setHandled(true);
    } catch (error) {
      toast({
        title: "Unable to approve teacher.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Error updating teacher's activation status: ", error);
    }
  };

  const handleDecline = async (id) => {
    console.log("Declined teacher with id ", id);
    try {
      await backend.put("/users/hide", {
        uid: id,
      });
      toast({
        title: "Teacher request denied.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setHandled(true);
    } catch (error) {
      toast({
        title: "Unable to deny teacher.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Error updating teacher's activation status: ", error);
    }
  };

  if (handled) {
    return null;
  }

  return (
    <Box
      h="140px"
      w="300px"
      p="2"
      shadow="md"
    >
      <Stack>
        <Flex
          direction="column"
          align="left"
          p="3"
        >
          <Text fontWeight="bold">New Teacher:</Text>
          <Text>
            {firstName} {lastName}
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          justify="center"
        >
          <Button
            width="50%"
            onClick={() => handleDecline(id)}
          >
            Deny
          </Button>
          <Button
            bg="purple.600"
            color="white"
            width="50%"
            _hover={{ bg: "#2a1c5e" }}
            onClick={() => handleApprove(id)}
          >
            Approve
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
