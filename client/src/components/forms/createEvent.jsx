import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const CreateEvent = ({
  event = null,
  eventId = null,
  onClose,
  triggerRefresh,
}) => {
  const [formData, setFormData] = useState({
    location: "",
    title: "",
    description: "",
    level: "",
    tag: "Select Tag",
    date: "",
    startTime: "",
    endTime: "",
    callTime: "",
    costume: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // initial state should be changed
  const [tags, setTags] = useState({});
  // const [currentTag, setCurrentTag] = useState("Select Tag");
  const { backend } = useBackendContext();
  const toast = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        location: event.location || "",
        title: event.title || "",
        description: event.description || "",
        level: event.level || "",
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        callTime: event.callTime || "",
        costume: event.costume || "",
        capacity: event.capacity || event.capacity === 0 ? event.capacity : "",
        tag: event.tag || "Select Tag",
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (
      !formData.location &&
      !formData.title &&
      !formData.level &&
      !formData.date &&
      !formData.startTime &&
      !formData.endTime &&
      !formData.callTime
    ) {
      toast({
        title: "Class Not Published",
        description: "Fill out missing fields.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDraft = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.title) newErrors.title = "Title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // add in call to events router here!
  const handleSubmit = async (isDraft) => {
    if (!isDraft && !validateForm()) {
      console.log("what the heck", errors);
      return;
    }
    if (isDraft && !validateDraft()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert form data to match API expectations
      const eventData = {
        ...formData,
        level: formData.level === "" ? "beginner" : formData.level,
        tag: formData.tag === "Select Tag" ? "" : formData.tag,
        date: formData.date === "" ? new Date() : formData.date,
        start_time:
          formData.startTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.startTime,
        end_time:
          formData.endTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.endTime,
        call_time:
          formData.callTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.callTime,
        capacity:
          formData.capacity === "" &&
          (parseInt(formData.capacity) < 0 ||
            parseInt(formData.capacity) > 2147483647)
            ? 0
            : formData.capacity,
        is_draft: isDraft,
      };

      console.log(eventData);

      // Using axios instead of fetch
      let response;
      // let tagResponse;
      if (eventId) {
        // Edit event (PUT request)
        response = await backend.put(`/events/${eventId}/`, eventData);
        if (eventData.tag !== "") {
          if (event?.tag) {
            // If the event already has a tag, we need to delete it first
            await backend.delete(`/event-tags/${eventId}/${event?.tag}`);
          }
          response = await backend.post("/event-tags/", {
            eventId: eventId,
            tagId: eventData.tag,
          });
        }
      } else {
        // Create new event (POST request)
        if (eventData.tag !== "") {
          const tagId = await backend.get(`/tags/${eventData.tag}`);
          response = await backend.post("/events/", eventData);
          if (event?.tag) {
            // If the event already has a tag, we need to delete it first
            await backend.delete(`/event-tags/${eventId}/${event?.tag}`);
          }
          response = await backend.post("/event-tags/", {
            eventId: response.data[0].id,
            tagId: tagId.data[0].id,
          });
        } else {
          response = await backend.post("/events/", eventData);
        }
      }

      console.log("response", response.status, response?.data[0]);

      if (response?.status === 201 || response?.status === 200) {
        // Reset form or handle success
        setFormData({
          location: "",
          title: "",
          description: "",
          level: "",
          tag: "",
          date: "",
          startTime: "",
          endTime: "",
          callTime: "",
          costume: "",
          capacity: "",
        });
        if (triggerRefresh) triggerRefresh();
        if (onClose) onClose();
      } else {
        console.error("Failed to create/save event:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create/save event, error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get("/tags");
      setTags(tagsResponse.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Container>
      <VStack
        height="100%"
        spacing={4}
        align="stretch"
      >
        {!eventId ? <Text></Text> : ""}
        <Box>
          <Text fontWeight="bold">Event Title</Text>
          <Input
            placeholder="Event Title"
            _placeholder={{ color: "gray.400" }}
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isInvalid={errors.title}
          />
          {errors.title && <Text color="red.500">{errors.title}</Text>}
        </Box>

        <Box>
          <Text fontWeight="bold">Location</Text>
          <Input
            placeholder="Location"
            _placeholder={{ color: "gray.400" }}
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            isInvalid={errors.location}
          />
          {errors.location && <Text color="red.500">{errors.location}</Text>}
        </Box>

        <Box>
          <Text fontWeight="bold">Tags</Text>
          <Select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
          >
            <option
              value="Select Tag"
              disabled="Tag"
            >
              Select Tag
            </option>
            {Object.values(tags).map((option) => {
              return <option value={option.id}>{option.tag}</option>;
            })}
          </Select>
          {/* {errors.level && <Text color="red.500">{errors.level}</Text>} */}
        </Box>

        <Box>
          <Text fontWeight="bold">Date</Text>
          <Input
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            isInvalid={errors.date}
          />
          {errors.date && <Text color="red.500">{errors.date}</Text>}
        </Box>

        <HStack align="flex-start">
          <FormControl>
            <Text fontWeight="bold">Start Time</Text>
            <Input
              border="1px"
              borderColor="gray.200"
              boxShadow="sm"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              isInvalid={errors.startTime}
            />
            {errors.startTime && (
              <Text color="red.500">{errors.startTime}</Text>
            )}
          </FormControl>

          <FormControl>
            <Text fontWeight="bold">End Time</Text>
            <Input
              border="1px"
              borderColor="gray.200"
              boxShadow="sm"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              isInvalid={errors.endTime}
            />
            {errors.endTime && <Text color="red.500">{errors.endTime}</Text>}
          </FormControl>
        </HStack>

        <Box>
          <Text fontWeight="bold">Call Time</Text>
          <Input
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            type="time"
            name="callTime"
            value={formData.callTime}
            onChange={handleChange}
            isInvalid={errors.callTime}
          />
          {errors.callTime && <Text color="red.500">{errors.callTime}</Text>}
        </Box>

        <HStack>
          <Box>
            <Text fontWeight="bold">Capacity</Text>
            <Input
              placeholder="Capacity"
              _placeholder={{ color: "gray.400" }}
              border="1px"
              borderColor="gray.200"
              boxShadow="sm"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <Text fontWeight="bold">Level</Text>
            <Select
              border="1px"
              borderColor="gray.200"
              boxShadow="sm"
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              isInvalid={errors.level}
            >
              <option>Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
            {errors.level && <Text color="red.500">{errors.level}</Text>}
          </Box>
        </HStack>

        <Box>
          <Text fontWeight="bold">Description</Text>
          <Textarea
            placeholder="Description"
            _placeholder={{ color: "gray.400" }}
            border="1px"
            borderColor="gray.200"
            boxShadow="sm"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            isInvalid={errors.description}
          />
          {errors.description && (
            <Text color="red.500">{errors.description}</Text>
          )}
        </Box>
        <Flex
          justifyContent="center"
          w="100%"
          gap={3}
        >
          <Button
            onClick={() => handleSubmit(true)} // true = save draft
            isLoading={isSubmitting}
            flex="1"
            bg="gray.100"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)} // false = publish
            isLoading={isSubmitting}
            bg="purple.600"
            color="white"
            flex="1"
          >
            Publish
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default CreateEvent;
