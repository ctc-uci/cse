import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";


export const CreateEvent = ({ event = null, eventId = null, onClose, reloadCallback }) => {
  const [formData, setFormData] = useState({
    location: "",
    title: "",
    description: "",
    level: "",
    date: "",
    startTime: "",
    endTime: "",
    callTime: "",
    costume: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backend } = useBackendContext();

  useEffect(() => {
    if (event) {
      // console.log(event.startTime, event.endTime);
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
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.callTime) newErrors.callTime = "Call time is required";
    if (!formData.costume)
      newErrors.costume = "Costume information is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // console.log(formData);

    setIsSubmitting(true);
    try {
      // Convert form data to match API expectations
      const eventData = {
        ...formData,
        start_time: formData.startTime,
        end_time: formData.endTime,
        call_time: formData.callTime,
      };

      // Using axios instead of fetch
      let response;
      if (eventId) {
        // Edit event (PUT request)
        response = await backend.put(`/events/${eventId}/`, eventData);
      } else {
        // Create new event (POST request)
        response = await backend.post("/events/", eventData);
      }

      if (response.status === 201 || response.status === 200) {
        // Reset form or handle success
        setFormData({
          location: "",
          title: "",
          description: "",
          level: "",
          date: "",
          startTime: "",
          endTime: "",
          callTime: "",
          costume: "",
        });
        if (onClose) onClose();
      } else {
        console.error("Failed to create/save event:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create/save event:", error);
    } finally {
      setIsSubmitting(false);
      if (reloadCallback) reloadCallback();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <VStack
      spacing={4}
      align="stretch"
    >
      <Text>New Event</Text>
      <Box>
        <Text>Title</Text>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={errors.title}
        />
        {errors.title && <Text color="red.500">{errors.title}</Text>}
      </Box>

      <Box>
        <Text>Location</Text>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          isInvalid={errors.location}
        />
        {errors.location && <Text color="red.500">{errors.location}</Text>}
      </Box>

      <Box>
        <Text>Level</Text>
        <Select
          name="level"
          value={formData.level}
          onChange={handleChange}
          isInvalid={errors.level}
        >
          <option value="">Select Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
        {errors.level && <Text color="red.500">{errors.level}</Text>}
      </Box>

      <Box>
        <Text>Date</Text>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          isInvalid={errors.date}
        />
        {errors.date && <Text color="red.500">{errors.date}</Text>}
      </Box>

      <Box>
        <Text>Start Time</Text>
        <Input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          isInvalid={errors.startTime}
        />
        {errors.startTime && <Text color="red.500">{errors.startTime}</Text>}
      </Box>

      <Box>
        <Text>End Time</Text>
        <Input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          isInvalid={errors.endTime}
        />
        {errors.endTime && <Text color="red.500">{errors.endTime}</Text>}
      </Box>

      <Box>
        <Text>Call Time</Text>
        <Input
          type="time"
          name="callTime"
          value={formData.callTime}
          onChange={handleChange}
          isInvalid={errors.callTime}
        />
        {errors.callTime && <Text color="red.500">{errors.callTime}</Text>}
      </Box>

      <Box>
        <Text>Description</Text>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={errors.description}
        />
        {errors.description && (
          <Text color="red.500">{errors.description}</Text>
        )}
      </Box>

      <Box>
        <Text>Costume</Text>
        <Textarea
          name="costume"
          value={formData.costume}
          onChange={handleChange}
          isInvalid={errors.costume}
        />
        {errors.costume && <Text color="red.500">{errors.costume}</Text>}
      </Box>

      <Button
        onClick={handleSubmit}
        colorScheme="blue"
        isLoading={isSubmitting}
      >
        {eventId  ? "Save Changes" : "Create Event"}
      </Button>
    </VStack>
  );
};

export default CreateEvent;
