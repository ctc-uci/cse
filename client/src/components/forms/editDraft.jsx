import { useState } from "react";

import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const ClassEditingForm = ({ id }) => {
  const { backend } = useBackendContext();
  const postClass = async (e) => {
    e.preventDefault();
    console.log({
      location: location ? location : "in draft",
      date: date ? date : new Date(),
      description: description ? description : "in draft",
      level: level ? level : "in draft",
      capacity: capacity ? capacity : 0,
      costume: performances ? performances : "in draft",
      isDraft,
      title: title ? title : "in draft",
    });
    await backend
      .post("/classes", {
        location: location ? location : "in draft",
        date: date ? date : new Date(),
        description: description ? description : "in draft",
        level: level ? level : "in draft",
        capacity: capacity ? capacity : 0,
        costume: performances ? performances : "in draft",
        isDraft,
        title: title ? title : "in draft",
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    setIsSubmitted(true);
    onClose();
  };

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("beginner");
  const [performances, setPerformances] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  return (
    <Container>
      <Text
        fontSize="2xl"
        textAlign="center"
        mb={4}
      >
        {!isSubmitted
          ? "New Class"
          : `${title} ${isDraft ? "Draft" : "Published"}`}
      </Text>
      {!isSubmitted ? (
        <form onSubmit={postClass}>
          <FormControl>
            <FormLabel>Class Title</FormLabel>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Level</FormLabel>
            <Select
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Performances</FormLabel>
            <Input
              type="text"
              required
              value={performances}
              onChange={(e) => setPerformances(e.target.value)}
            />
          </FormControl>

          <Stack
            direction="row"
            justifyContent="center"
            mt={4}
          >
            <Button
              onClick={() => {
                onOpen();
                setIsDraft(true);
              }}
            >
              Save as Draft
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
            >
              Publish
            </Button>
          </Stack>
        </form>
      ) : (
        <VStack>
          <IoIosCheckmarkCircle size={100} />
          <Heading
            as="h3"
            size="xl"
          >
            Class Submitted!
          </Heading>{" "}
          <br />
          <Button
            colorScheme="blue"
            onClick={onClose}
          >
            Return to Classes Page
          </Button>
        </VStack>
      )}

      <SaveClassAsDraftModal
        isOpen={isOpen}
        onClose={onClose}
        postClass={postClass}
      />
    </Container>
  );
};

export default ClassEditingForm;
