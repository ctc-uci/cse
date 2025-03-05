import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import axios from "axios";
// import QRCodeReact from "react-qr-code";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import CreateClassForm from "../forms/createClasses";

export const Playground = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem("userId", currentUser.id);
    }
  }, [currentUser]);

  // Generate the check-in URLs
  const classId = "30";
  const eventId = "5";
  const classCheckInUrl = `${window.location.origin}/check-in/class/${classId}`;
  const eventCheckInUrl = `${window.location.origin}/check-in/event/${eventId}`;
  console.log("classCheckInUrl", classCheckInUrl);
  console.log("eventCheckInUrl", eventCheckInUrl);

  const sendAjax = (e) => {
    axios
      .post("http://localhost:3001/classes/", {
        location: location,
        date: date,
        description: description,
        level: level,
        capacity: capacity,
        costume: performances, // Need to confirm the equivalence between the two fields here
        isDraft: false,
        title: title,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setIsSubmitted(true);
  };

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [performances, setPerformances] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  return (
    <Box>
      <CreateClassForm />

      {/* QR Code Section */}
      <Box
        justifyContent="center"
        gap={8}
        p={4}
      >
        {/* Class QR Code */}
        <VStack
          spacing={4}
          align="center"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
          >
            Class Check-in QR Code
          </Text>
          <Box
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <QRCodeReact
              value={classCheckInUrl}
              size={256}
              level="H"
            />
          </Box>
          <Text
            fontSize="sm"
            color="gray.600"
          >
            Scan to check in for class
          </Text>
        </VStack>

        {/* Event QR Code */}
        <VStack
          spacing={4}
          align="center"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
          >
            Event Check-in QR Code
          </Text>
          <Box
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <QRCodeReact
              value={eventCheckInUrl}
              size={256}
              level="H"
            />
          </Box>
          <Text
            fontSize="sm"
            color="gray.600"
          >
            Scan to check in for event
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
