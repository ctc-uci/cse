import { memo, useEffect, useMemo, useState } from "react";

import {
  Button,
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
import SaveClass from "./modals/saveClass";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const CreateClassForm = memo(
  ({ closeModal, modalData, reloadCallback }) => {
    const { backend } = useBackendContext();
    // console.log(modalData);
    const [events, setEvents] = useState([]);

    const [title, setTitle] = useState(modalData?.title ?? "");
    const [location, setLocation] = useState(modalData?.location ?? "");
    const [date, setDate] = useState(modalData?.date ?? "");
    const [startTime, setStartTime] = useState(modalData?.startTime ?? "");
    const [endTime, setEndTime] = useState(modalData?.endTime ?? "");
    const [description, setDescription] = useState(
      modalData?.description ?? ""
    );
    const [capacity, setCapacity] = useState(modalData?.capacity ?? 0);
    const [level, setLevel] = useState(modalData?.level ?? "beginner");
    const [classType, setClassType] = useState(
      modalData?.classType ?? "classical"
    );
    const [performance, setPerformance] = useState(
      modalData?.performance ?? -1
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isConfirmationOpen,
      onOpen: onConfirmationOpen,
      onClose: onConfirmationClose,
    } = useDisclosure();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const postClass = async () => {
      const body = {
        location: location ?? "",
        date: date ?? new Date(),
        startTime: startTime ?? "",
        endTime: endTime ?? "",
        description: description ?? "",
        level: level ?? "",
        capacity: capacity === "" ? 0 : capacity,
        classType: classType ?? "",
        performance: performance ?? "",
        isDraft,
        title: title ?? "",
      };

      let classId;
      if (modalData) {
        await backend
          .put("/classes/" + modalData.classId, body)
          .catch((error) => console.log(error));
        classId = modalData.classId;
      } else {
        const response = await backend
          .post("/classes", body)
          .catch((error) => console.log(error));
          console.log("response", response)
        classId = response?.data[0]?.id;
      }

      if (classId && date && startTime && endTime) {
        const scheduledClassBody = {
          class_id: classId,
          date,
          start_time: startTime,
          end_time: endTime,
        };
        // Add scheduled class as well
        await backend
          .post("/scheduled-classes", scheduledClassBody)
          .then((response) => console.log("Scheduled class added:", response))
          .catch((error) =>
            console.log("Error adding scheduled class:", error)
          );
      }

      setIsSubmitted(true);
      onConfirmationClose();
      onClose();
      reloadCallback();
    };

    useMemo(() => {
      if (backend) {
        backend.get("/events").then((response) => {
          setEvents(response.data);
        });
      }
    }, [backend]);
    // useEffect(() => {
    //   if (modalData) {
    //     // console.log(modalData, modalData.isDraft);
    //   }
    // }, [modalData]);

    const isEditingDraft = modalData && modalData.isDraft;
    return (
      <Container>
        <Text
          fontSize="2xl"
          textAlign="center"
          mb={4}
        >
          {!isSubmitted
            ? modalData
              ? // if it is not submitted, and coming from a draft, then it is an edit, else it is a new class, else it is a published class
                "Edit Class"
              : "New Class"
            : `${title} ${isDraft ? "Draft" : "Published"}`}
        </Text>
        {!isSubmitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirmationOpen();
            }}
          >
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
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
              <FormLabel>Performance</FormLabel>
              <Select
                required
                value={performance}
                onChange={(e) => setPerformance(e.target.value)}
              >
                <option key={null} value={null}>No Performance Required</option>
                {events
                  ? events.map((evt, ind) => (
                      <option
                        key={ind}
                        value={evt.id}
                      >
                        {evt.title}
                      </option>
                    ))
                  : null}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Class Type</FormLabel>
              <Select
                required
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
              >
                <option value="classical">Classical</option>
                <option value="ballet">Ballet</option>
              </Select>
            </FormControl>

            <Stack
              direction="row"
              justifyContent="center"
              mt={4}
            >
              {/* wasnt a draft then show the button to save as draft */}
              {((!isSubmitted && !modalData ) || modalData?.isDraft) && (
                <Button
                  onClick={() => {
                    onOpen();
                    setIsDraft(true);
                  }}
                >
                  Save as Draft
                </Button>
              )}
              <Button
                colorScheme="blue"
                type="submit"
              >
                {/* publish either way */}
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
              {isDraft ? "Draft" : "Class"}{" "}
              {modalData ? "Updated" : "Submitted"}!
            </Heading>{" "}
            <br />
            <Button
              colorScheme="blue"
              onClick={closeModal}
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
        <SaveClass
          isOpen={isConfirmationOpen}
          onClose={onConfirmationClose}
          postClass={postClass}
        />
      </Container>
    );
  }
);

export default CreateClassForm;
