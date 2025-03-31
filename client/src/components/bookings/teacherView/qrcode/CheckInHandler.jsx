import { useEffect, useState } from "react";

import { Box, Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../../contexts/hooks/useBackendContext";

export const CheckInHandler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log("studentId", currentUser);

  // Print all localStorage data
  // console.log(
  //   "LocalStorage contents:",
  //   Object.entries(localStorage).reduce((obj, [key, value]) => {
  //     try {
  //       obj[key] = JSON.parse(value);
  //     } catch {
  //       obj[key] = value;
  //     }
  //     return obj;
  //   }, {})
  // );

  useEffect(() => {
    const handleCheckIn = async () => {
      try {
        if (!currentUser?.uid) {
          throw new Error("No user ID found");
        }

        // Get student ID using Firebase UID
        const studentResponse = await backend.get(
          `/students/firebase/${currentUser.uid}`
        );
        const studentId = studentResponse.data.id;

        // Format current date as YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        // Update class enrollment using student ID instead of Firebase UID
        await backend.put(`/class-enrollments/${studentId}`, {
          class_id: id,
          attendance: today,
        });

        // Get class details
        const classResponse = await backend.get(`/classes/${id}`);
        setTitle(classResponse.data[0].title);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleCheckIn();
  }, [id, backend, navigate, currentUser]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  console.log("title", title);

  return (
    <Box
      h="100vh"
      bg="black"
    >
      <VStack
        spacing={4}
        align="center"
        justify="center"
        h="full"
        p={4}
      >
        <Box
          bg="white"
          p={8}
          borderRadius="full"
          boxSize="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="4xl">✓</Text>
        </Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
        >
          You've checked in for
        </Text>
        <Text fontSize="xl">{title}</Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate("/bookings")}
          mt={4}
        >
          View My Bookings
        </Button>
      </VStack>
    </Box>
  );
};
