import { useEffect, useState } from "react";

import { Box, Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const EventCheckInHandler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const handleCheckIn = async () => {
      try {
        if (!currentUser?.uid) {
          const id = params.id;

          // removed baseURL, was preventing the redirect to login from happening
          localStorage.setItem("qrcode_redirect", `/check-in/event/${id}`);
          // throw new Error("No user ID found");
          navigate("/login");
        }

        const studentResponse = await backend.get(
          `/students/firebase/${currentUser.uid}`
        );
        const studentId = studentResponse.data.id;

        await backend.post("/event-enrollments", {
          student_id: studentId,
          event_id: id,
          // this statement has no effect since attendance defaults to false in backend route (event_enrollments.ts)
          attendance: true,
        });

        const eventResponse = await backend.get(`/events/${id}`);
        setTitle(eventResponse.data[0].title);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleCheckIn();
  }, [id, backend, currentUser]);

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
