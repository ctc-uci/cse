import { memo, useEffect, useMemo, useState } from "react";

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  calculateRecurringDates,
  getDefaultDate,
} from "../../utils/formatDateTime";
import SaveClass from "./modals/saveClass";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const CreateClassForm = memo(
  ({ closeModal, modalData, reloadCallback }) => {
    const { backend } = useBackendContext();
    const [events, setEvents] = useState([]);
    const [tags, setTags] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(
      modalData?.teachers?.[0] ?? ""
    );

    const [title, setTitle] = useState(modalData?.title ?? "");
    const [location, setLocation] = useState(modalData?.location ?? "");
    const [date, setDate] = useState(
      modalData?.start_date ?? modalData?.date ?? ""
    );
    const [endDate, setEndDate] = useState(
      modalData?.end_date ?? modalData?.date ?? ""
    );
    const [recurrencePattern, setRecurrencePattern] = useState(
      modalData?.recurrence_pattern ?? ""
    );
    const [startTime, setStartTime] = useState(modalData?.startTime ?? "");
    const [endTime, setEndTime] = useState(modalData?.endTime ?? "");
    const [description, setDescription] = useState(
      modalData?.description ?? ""
    );
    const [capacity, setCapacity] = useState(modalData?.capacity ?? 0);
    const [level, setLevel] = useState(modalData?.level ?? "");
    const [classType, setClassType] = useState(modalData?.classType ?? "");
    const [performance, setPerformance] = useState(
      modalData?.performance ?? -1
    );

    const displayToast = () => {
      console.log({
        selectedInstructor,
        title,
        location,
        date,
        endDate,
        startTime,
        endTime,
        description,
        capacity,
      });
      if (
        selectedInstructor == "" &&
        title == "" &&
        location == "" &&
        date == "" &&
        endDate == "" &&
        startTime == "" &&
        endTime == "" &&
        description == "" &&
        capacity == 0
      ) {
        return true;
      }
      return false;
    };
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isConfirmationOpen,
      onOpen: onConfirmationOpen,
      onClose: onConfirmationClose,
    } = useDisclosure();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

    const validationSchema = {
      title: !title,
      capacity: capacity && (capacity < 0 || capacity > 2147483647),
    };
    const validateForm = () => {
      if (validationSchema.title) {
        window.location.href = "#title";
        return false;
      }
      if (validationSchema.capacity) {
        window.location.href = "#capacity";
        return false;
      }
      return true;
    };
    const postClass = async () => {
      if (date === "") {
        setDate(getDefaultDate());
      }
      if (endDate === "") {
        setEndDate(getDefaultDate());
      }
      console.log(date, endDate);
      const classDates = calculateRecurringDates(
        date,
        endDate,
        recurrencePattern
      );

      const baseClassBody = {
        location: location ?? "",
        description: description ?? "",
        level: level ?? "",
        capacity:
          capacity === "" ? 0 : Math.min(parseInt(capacity), 2147483647),
        classType: classType ?? "",
        performance: performance ?? "",
        isDraft,
        title: title ?? "",
        is_recurring: recurrencePattern !== "none",
        recurrence_pattern: recurrencePattern,
        start_date: date,
        end_date: recurrencePattern !== "none" ? endDate : date,
        instructor: selectedInstructor,
      };

      if (modalData) {
        // Update class information
        await backend
          .put("/classes/" + modalData.classId, {
            ...baseClassBody,
            is_recurring: recurrencePattern !== "none",
          })
          .catch((error) => console.log(error));

        if (parseInt(performance) !== -1) {
          await backend.put(
            `/corequisites/${modalData.classId}` + `/${performance}`
          );
        }

        // Add teacher to classes-taught on form post
        const res = await backend.post(
          `/classes-taught/`,
          { classId: modalData.classId, teacherId: selectedInstructor },
          {}
        );
        // .then((response) =>
        //   console.log(`Added teacher to classes-taught ${response}`))
        // .catch((error) => console.log(error));
        console.log("Added teacher to classes-taught:", res);
        // For recurring classes, delete all existing scheduled classes and create new ones
        if (
          recurrencePattern !== "none" ||
          modalData.recurrence_pattern !== "none"
        ) {
          try {
            // First, delete all existing scheduled classes
            await backend
              .delete(`/scheduled-classes/${modalData.classId}`)
              .then((response) =>
                console.log("Deleted old scheduled classes:", response)
              )
              .catch((error) =>
                console.log("Error deleting scheduled classes:", error)
              );

            // Then create new scheduled classes for each date in the pattern
            for (const classDate of classDates) {
              if (classDate && startTime && endTime) {
                const scheduledClassBody = {
                  class_id: modalData.classId,
                  date: classDate,
                  start_time: startTime,
                  end_time: endTime,
                };
                await backend
                  .post("/scheduled-classes", scheduledClassBody)
                  .then((response) =>
                    console.log("Created scheduled class:", response)
                  )
                  .catch((error) =>
                    console.log("Error creating scheduled class:", error)
                  );
              }
            }
          } catch (error) {
            console.error("Error updating recurring classes:", error);
          }
        } else {
          // For non-recurring classes, just update the single scheduled class
          if (date && startTime && endTime) {
            const scheduledClassBody = {
              class_id: modalData.classId,
              date,
              start_time: startTime,
              end_time: endTime,
            };
            await backend
              .post("/scheduled-classes", scheduledClassBody)
              .then((response) =>
                console.log("Scheduled class updated:", response)
              )
              .catch((error) =>
                console.log("Error updating scheduled class:", error)
              );
          }
        }

        if (classType !== "") {
          await backend
            .post("/class-tags", {
              classId: modalData.classId,
              tagId: classType,
            })
            .then((response) => console.log(response))
            .catch((err) => {
              console.error(err);
            });
        }
      } else {
        const createdClassIds = [];
        const classBody = {
          ...baseClassBody,
          date: date,
        };
        const response = await backend.post("/classes", classBody);
        console.log("Class created:", response);
        const classId = response?.data[0]?.id;
        const res = await backend.post(
          `/classes-taught/`,
          { classId: classId, teacherId: selectedInstructor },
          {}
        );
        console.log("Added teacher to classes-taught:", res);

        // Add prerequisite if performance is selected
        if (parseInt(performance) !== -1) {
          await backend.put(`/corequisites/${classId}` + `/${performance}`);
        }

        for (const classDate of classDates) {
          try {
            // const response = await backend.post("/classes", classBody);
            // console.log("Class created:", response);
            // const classId = response?.data[0]?.id;

            if (classId) {
              createdClassIds.push(classId);

              if (classDate && startTime && endTime) {
                const scheduledClassBody = {
                  class_id: classId,
                  date: classDate,
                  start_time: startTime,
                  end_time: endTime,
                };
                await backend.post("/scheduled-classes", scheduledClassBody);
              }

              if (classType !== "") {
                await backend.post("/class-tags", {
                  classId: classId,
                  tagId: classType,
                });
              }
            }
          } catch (error) {
            console.error("Error creating class:", error);
          }
        }

        console.log(`Created ${createdClassIds.length} classes for the series`);
      }

      setIsSubmitted(true);
      onConfirmationClose();
      onClose();
      reloadCallback();
    };

    useMemo(() => {
      if (backend) {
        backend.get("/events/all").then((response) => {
          setEvents(response.data);
        });
        backend.get("/tags").then((response) => {
          setTags(response.data);
        });
        backend.get("/teachers/activated").then((response) => {
          setTeachers(response.data);
        });
      }
    }, [backend]);

    useEffect(() => {
      if (recurrencePattern !== "none" && endDate && date) {
        if (new Date(endDate) < new Date(date)) {
          setEndDate(date);
        }
      }
    }, [date, endDate, recurrencePattern]);

    // Ensure end date is set to start date when selecting "none" recurrence pattern
    useEffect(() => {
      if (recurrencePattern === "none") {
        setEndDate(date);
      }
    }, [recurrencePattern, date]);

    return (
      <Container>
        {!isSubmitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (displayToast()) {
                toast({
                  title: "Class Not Published",
                  description: "Fill out missing fields.",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                  position: "top",
                });
              } else {
                onConfirmationOpen();
              }
            }}
          >
            <FormControl isInvalid={isDraft && validationSchema.title}>
              <FormLabel
                id="title"
                fontWeight="bold"
              >
                Class Title
              </FormLabel>
              <Input
                placeholder="Class Title"
                _placeholder={{ color: "gray.400" }}
                border="1px"
                borderColor="gray.200"
                boxShadow="sm"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                bg="white"
                color="black"
              />
              {isDraft && validationSchema.title && (
                <FormHelperText color="red.500">
                  Class title is required
                </FormHelperText>
              )}
            </FormControl>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Location</FormLabel>
              <Input
                placeholder="Location"
                _placeholder={{ color: "gray.400" }}
                border="1px"
                borderColor="gray.200"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                bg="white"
                color="black"
                boxShadow="sm"
              />
            </FormControl>

            <HStack
              mt={3}
              align="flex-start"
            >
              <FormControl width={"50%"}>
                <FormLabel fontWeight="bold">Start Date</FormLabel>
                <Input
                  border="1px"
                  borderColor="gray.200"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  bg="white"
                  color={date === "" ? "gray.400" : "black"}
                  boxShadow="sm"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      backgroundColor: "gray.100",
                      padding: "2px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    },
                  }}
                />
              </FormControl>

              <FormControl width={"50%"}>
                <FormLabel fontWeight="bold">End Date</FormLabel>
                <Input
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      backgroundColor: "gray.100",
                      padding: "2px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    },
                  }}
                  border="1px"
                  borderColor="gray.400"
                  type="date"
                  required={recurrencePattern !== "none"}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={date}
                  isDisabled={recurrencePattern === "none"}
                  opacity={recurrencePattern === "none" ? 0.4 : 1}
                  bg="white"
                  color={endDate === "" ? "gray.400" : "black"}
                  boxShadow="sm"
                />
              </FormControl>
            </HStack>

            <HStack
              mt={3}
              align="flex-start"
            >
              <FormControl>
                <FormLabel fontWeight="bold">Start Time</FormLabel>
                <Input
                  border="1px"
                  borderColor="gray.200"
                  boxShadow="sm"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  bg="white"
                  color={startTime === "" ? "gray.400" : "black"}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">End Time</FormLabel>
                <Input
                  border="1px"
                  borderColor="gray.200"
                  boxShadow="sm"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  bg="white"
                  color={endTime === "" ? "gray.400" : "black"}
                />
              </FormControl>
            </HStack>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Recurrence</FormLabel>
              <Select
                border="1px"
                borderColor="gray.200"
                boxShadow="sm"
                value={recurrencePattern}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                bg="white"
                color={recurrencePattern === "" ? "gray.400" : "black"}
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  Recurrence
                </option>
                <option value="none">None</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormControl>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Instructor</FormLabel>
              <Select
                border="1px"
                borderColor="gray.200"
                boxShadow="sm"
                type="text"
                required
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                bg="white"
                color={selectedInstructor === "" ? "gray.400" : "black"}
                sx={{
                  "& option": {
                    color: "black",
                    backgroundColor: "white",
                  },
                  "& option[disabled]": {
                    color: "gray.400",
                  },
                }}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  Select Instructor
                </option>
                {teachers.map((teacher) => (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                placeholder="Description"
                _placeholder={{ color: "gray.400" }}
                border="1px"
                borderColor="gray.200"
                boxShadow="sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>
            <HStack mt={3}>
              <FormControl isInvalid={isDraft && validationSchema.capacity}>
                <FormLabel
                  id="capacity"
                  fontWeight={"bold"}
                >
                  Capacity
                </FormLabel>
                <NumberInput
                  min={0}
                  max={2147483647}
                  clampValueOnBlur
                >
                  <NumberInputField
                    required
                    placeholder="10"
                    _placeholder={{ color: "gray.400" }}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    bg="white"
                    color="black"
                  />
                </NumberInput>
                {isDraft && validationSchema.capacity && (
                  <FormHelperText color="red.500">Ain't no way</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Level</FormLabel>
                <Select
                  border="1px"
                  borderColor="gray.200"
                  boxShadow="sm"
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  bg="white"
                  color={level === "" ? "gray.400" : "black"}
                  sx={{
                    "& option": {
                      bg: "white",
                      color: "black",
                    },
                    "& option[disabled]": {
                      color: "gray.400",
                    },
                  }}
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Level
                  </option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Class Type</FormLabel>
              <Select
                required
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                bg="white"
                color={classType === "" ? "gray.400" : "black"}
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option
                  value=""
                  disabled
                  hidden
                >
                  Class Type
                </option>
                {tags
                  ? tags.map((tag, ind) => (
                      <option
                        key={ind}
                        value={tag.id}
                      >
                        {tag.tag}
                      </option>
                    ))
                  : null}
              </Select>
            </FormControl>

            <FormControl mt={3}>
              <FormLabel fontWeight="bold">Performances</FormLabel>
              <Select
                border="1px"
                borderColor="gray.200"
                boxShadow="sm"
                required
                value={performance}
                onChange={(e) => setPerformance(e.target.value)}
                bg="white"
                color={parseInt(performance) === -1 ? "gray.400" : "black"}
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option
                  value={-1}
                  disabled
                  hidden
                >
                  Select Performance
                </option>
                <option
                  key={1738}
                  value={-1}
                >
                  No Performance Required
                </option>
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

            <Stack
              direction="row"
              justifyContent="space-between"
              mt={7}
              mb={5}
              width="100%"
            >
              {((!isSubmitted && !modalData) || modalData?.isDraft) && (
                <Button
                  paddingRight="10%"
                  paddingLeft="10%"
                  width="48%"
                  onClick={() => {
                    setIsDraft(true);
                    if (validateForm()) {
                      onOpen();
                    }
                  }}
                  bg="gray.100"
                  color="black"
                  _hover={{ bg: "#C8A9C8" }}
                >
                  Save Draft
                </Button>
              )}
              <Button
                paddingRight="10%"
                paddingLeft="10%"
                width="48%"
                type="submit"
                bg="purple.600"
                color="white"
                _hover={{ bg: "#5D2E8C" }}
                onClick={() => {
                  setIsDraft(false);
                  displayToast();
                }}
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
          postClass={() => {
            postClass().then(reloadCallback);
          }}
        />
        <SaveClass
          isOpen={isConfirmationOpen}
          onClose={onConfirmationClose}
          postClass={() => {
            postClass().then(reloadCallback);
          }}
        />
      </Container>
    );
  }
);

export default CreateClassForm;
