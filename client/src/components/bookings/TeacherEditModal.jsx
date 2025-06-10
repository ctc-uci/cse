import { useEffect, useMemo, useRef, useState } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { BsChevronLeft } from "react-icons/bs";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  calculateRecurringDates,
  isDefaultDate,
} from "../../utils/formatDateTime";

const stringToDate = (dateString) => {
  // Split string and convert to numbers
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const stringToTime = (timeString) => {
  const d = new Date();
  // Split time and AM/PM
  const [time, modifier] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  // Convert to 24-hour time
  let hoursIn24 = parseInt(hours, 10);
  if (modifier === "PM" && hoursIn24 !== 12) {
    hoursIn24 += 12;
  } else if (modifier === "AM" && hoursIn24 === 12) {
    hoursIn24 = 0;
  }

  d.setHours(hoursIn24, parseInt(minutes, 10), 0);

  return d;
};

const formatDate = (date) => {
  if (!(date instanceof Date)) date = new Date(date); // Ensure it's a Date object
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

export const TeacherEditModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  classData,
  setClassData,
  performances,
  setRefresh,
  coreqId,
  tags = [],
  magic,
  setMagic,
}) => {
  const { backend } = useBackendContext();
  const [isPublishing, setIsPublishing] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState(
    classData?.recurrencePattern ?? "none"
  );
  const [teachers, setTeachers] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(
    classData?.instructor ?? ""
  );
  const formRef = useRef(null);
  const [tagTypes, setTagTypes] = useState([]);
  const toast = useToast();

  console.log("type", tags[0]?.id);
  const [classType, setClassType] = useState(tags[0]?.id ?? "-1");

  useEffect(() => {
    if (backend && classData?.id) {
      Promise.all([
        backend.get("/tags"),
        backend.get("/teachers/activated"),
        backend.get(`/classes-taught/instructor/${classData.id}`),
      ])
        .then(
          ([tagResponse, activatedTeachersResponse, instructorResponse]) => {
            setTagTypes(tagResponse.data);
            setTeachers(activatedTeachersResponse.data);
            const teacher = instructorResponse.data;
            if (teacher && Array.isArray(teacher) && teacher[0]) {
              setSelectedInstructor(teacher[0]?.id);
            } else {
              setSelectedInstructor("");
            }
          }
        )
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
  }, [backend, classData?.id]);

  const onBack = () => {
    setCurrentModal("view");
  };

  const onSave = async (draft) => {
    try {
      // PUT request to save class data
      const updatedData = {
        title: classTitle,
        description,
        location,
        capacity,
        level,
        costume: null,
        start_date: startDate,
        end_date: endDate,
        recurrence_pattern: recurrencePattern,
        is_recurring: recurrencePattern !== "none",
        isDraft: draft,
      };
      // console.log(classData);
      await backend.put(`/classes/${classData.id}`, updatedData);
      // console.log("Updating class", classData.id, updatedData);
      await backend.delete(`/corequisites/class/${classData.id}`);
      if (selectedInstructor && parseInt(selectedInstructor) !== -1) {
        await backend.put(`/classes-taught`, {
          classId: classData.id,
          teacherId: selectedInstructor,
        });
      } else {
        await backend.delete(`/classes-taught/${classData.id}`);
      }
      // console.log("Updating instructor", classData.id, selectedInstructor);
      if (performanceId && parseInt(performanceId) !== -1) {
        await backend.put(
          `/corequisites/${classData.id}/${performanceId}`,
          updatedData
        );
        // console.log(
        //   "Updating corequisites",
        //   classData.id,
        //   performanceId,
        //   updatedData
        // );
      }

      if (recurrencePattern !== "none") {
        await backend.delete(`/scheduled-classes/${classData.id}`);
        const classDates = calculateRecurringDates(
          stringToDate(startDate),
          stringToDate(endDate),
          recurrencePattern
        );
        // console.log("classdates", classDates);
        for (const classDate of classDates) {
          if (classDate && startTime && endTime) {
            const scheduledClassBody = {
              class_id: classData.id,
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
      } else {
        if (startDate)
          await backend.put(`/scheduled-classes/`, {
            class_id: classData.id,
            date: startDate,
            start_time: startTime,
            end_time: endTime,
          });
      }
      // Update classData
      setClassData((prev) => ({
        ...prev,
        date: startDate,
        startTime,
        endTime,
        title: classTitle,
        description,
        location,
        capacity,
        level,
        isDraft: draft,
      }));

      if (classData?.id && classType !== "-1") {
        tags.map(async (tag) => {
          await backend
            .delete(`/class-tags/${classData.id}/${tag.id}`)
            .catch((err) => {
              console.error(err);
            });
        });
        await backend
          .post("/class-tags", {
            classId: classData.id,
            tagId: classType,
          })
          .then((response) => console.log(response))
          .catch((err) => {
            console.error(err);
          });
      }

      setCurrentModal("view");
      setRefresh();
    } catch (error) {
      console.error("Error updating class data:", error);
    }
  };
  const onSaveAsDraft = async () => {
    await onSave(true);
  };
  const onPublish = async () => {
    setIsPublishing(true);
    toast({
      title: "Changes saved successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
      colorScheme: "purple",
    });
    // defer validation for isPublishing to update
    setTimeout(() => {
      if (formRef.current && !formRef.current.checkValidity()) {
        formRef.current.reportValidity(); // stops user from submitting if date is empty
        return;
      }

      onSave(false); // publishes, swithes is_draft to false
    }, 0);

    setCurrentModal("view");
  };

  // input values
  const [classTitle, setClassTitle] = useState(classData?.title);
  const [location, setLocation] = useState(classData?.location);
  const [startDate, setStartDate] = useState(
    (isDefaultDate(classData?.startDate) && !classData?.date) ||
      (isDefaultDate(classData?.date) && !classData?.startDate)
      ? ""
      : classData?.startDate
        ? formatDate(classData.startDate)
        : formatDate(classData.date)
  );
  const [endDate, setEndDate] = useState(
    isDefaultDate(classData?.endDate)
      ? ""
      : classData?.endDate
        ? formatDate(classData.endDate)
        : ""
  );
  const [startTime, setStartTime] = useState(classData?.startTime);
  const [endTime, setEndTime] = useState(classData?.endTime);
  const [description, setDescription] = useState(classData?.description);
  const [capacity, setCapacity] = useState(classData?.capacity);
  const [level, setLevel] = useState(classData?.level);
  const [performanceId, setPerformanceId] = useState(coreqId);

  const handleLocationSelect = (e) => {
    setLocation(e.target.value);
  };

  const handleLevelSelect = (e) => {
    setLevel(e.target.value);
  };

  const handlePerformanceSelect = (e) => {
    setPerformanceId(e.target.value);
  };

  const onTitleChange = (e) => setClassTitle(e.target.value);
  const onDescriptionChange = (e) => setDescription(e.target.value);
  const onCapacityChange = (e) => setCapacity(e.target.value);
  const onDateChange = (e) => setStartDate(e.target.value);
  const onEndDateChage = (e) => setEndDate(e.target.value);
  const onStartTimeChange = (e) => setStartTime(e.target.value);
  const onEndTimeChange = (e) => setEndTime(e.target.value);

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <Flex
          align="center"
          w="100%"
          position="relative"
        >
          <IconButton
            onClick={onBack}
            icon={<BsChevronLeft />}
            position="absolute"
            left={5}
            backgroundColor="white"
          />
          <ModalHeader
            flex={1}
            textAlign="center"
          >
            {classData.title}
          </ModalHeader>
        </Flex>
        <ModalBody>
          <form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
          >
            {" "}
            {/* necessary for required tag on date! */}
            <FormControl mb={4}>
              <FormLabel>Class Title</FormLabel>
              <Input
                value={classTitle}
                onChange={onTitleChange}
                placeholder="Enter class title..."
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={handleLocationSelect}
                placeholder="Enter location..."
              />
            </FormControl>
            <FormControl
              mb={4}
              isRequired={isPublishing}
            >
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={onDateChange}
                maxWidth="200px"
                placeholder="Enter date..."
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                required={recurrencePattern !== "none"}
                value={endDate}
                onChange={onEndDateChage}
                min={startDate}
                isDisabled={recurrencePattern === "none"}
                maxWidth="200px"
                bg="white"
                color="black"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Recurrence Pattern</FormLabel>
              <Select
                value={recurrencePattern}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option value="none">None</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                maxWidth="200px"
                value={startTime}
                onChange={onStartTimeChange}
                placeholder="Enter start time..."
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                maxWidth="200px"
                value={endTime}
                onChange={onEndTimeChange}
                placeholder="Enter end time..."
              />
            </FormControl>
            {/* editing teachers */}
            <FormControl mb={4}>
              <FormLabel>Instructor</FormLabel>
              <Select
                placeholder="Select an instructor"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                maxWidth="300px"
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
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                height="100px"
                value={description}
                onChange={onDescriptionChange}
                placeholder="Enter description..."
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Capacity</FormLabel>
              <Input
                type="number"
                maxWidth="200px"
                value={capacity}
                onChange={onCapacityChange}
                placeholder="Enter capacity..."
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Level</FormLabel>
              <Select
                maxWidth="200px"
                value={level}
                placeholder="Select level..."
                onChange={handleLevelSelect}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ClassType</FormLabel>
              <Select
                maxWidth="200px"
                value={classType}
                placeholder="Select class type..."
                onChange={(e) => setClassType(e.target.value)}
              >
                {tagTypes.map((tagType) => (
                  <option
                    key={tagType.id}
                    value={tagType.id}
                  >
                    {tagType.tag}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Performances</FormLabel>
              <Select
                maxWidth="200px"
                value={performanceId}
                placeholder="Select a performance..."
                onChange={handlePerformanceSelect}
              >
                {performances.map((performance) => (
                  <option
                    key={performance.id}
                    value={performance.id}
                  >
                    {performance.title}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Flex
            justifyContent="center"
            w="100%"
            gap={3}
          >
            <Button
              flex="1"
              onClick={onBack}
            >
              Discard Edits
            </Button>
            <Button
              bg="purple.600"
              color="white"
              flex="1"
              onClick={onPublish}
            >
              Publish
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
