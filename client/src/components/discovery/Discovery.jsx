import { useEffect, useState } from "react";

import { Box, Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

export const Discovery = () => {
  // Active Tab Logic
  const [activeTab, setActiveTab] = useState("both"); // Default to showing both
  const [searchInput, setSearchInput] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { currentUser } = useAuthContext();


  const toggleClasses = () => {
    setActiveTab("classes");
  };

  const toggleEvents = () => {
    setActiveTab("events");
  };

  // Fetching Class and Event Data
  const { backend } = useBackendContext();

  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  // this will be an array of users
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = () => {backend.get(`/users/${currentUser.uid}`).then(res => setUser(res))};
    fetchUserData();
  }, [backend, currentUser])

  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch and Store Classes Information
      try {
        const response = await backend.get("/classes/scheduled");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }

      // Fetch and Store Events Information
      try {
        const response = await backend.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [backend]);

  const searchEvents = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(`/events/search/${searchInput}`);
        // console.log("Search results:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    } else {
      try {
        const response = await backend.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  };

  const searchClasses = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(`/classes/search/${searchInput}`);
        // console.log("Search results:", response.data);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    } else {
      try {
        const response = await backend.get("/classes/scheduled");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      activeTab === "classes" ? await searchClasses() : await searchEvents();
    }
  };

// console.log(classes)
  return (
    <Box>
      <VStack
        mx="10%"
        my={5}
        mb={20} //added for mobile view of event/class cards; otherwise navbar covers it
      >
        <Heading>Discovery</Heading>
        <Input
          placeholder="Search bar"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        ></Input>
        <Flex gap="5">
          <Button onClick={toggleClasses}>Classes</Button>
          <Button onClick={toggleEvents}>Events</Button>
        </Flex>

        <Box my="14px">
          <Flex
            display={activeTab === "events" ? "none" : "flex"}
            align="center"
            justify="center"
            gap={5}
            wrap="wrap"
          >
            {classes.map((classItem, index) => (
              <ClassCard
                id={classItem.id}
                key={index}
                title={classItem.title}
                description={classItem.description}
                location={classItem.location}
                capacity={classItem.capacity}
                level={classItem.level}
                costume={classItem.costume}
                date={classItem.date}
                startTime={classItem.startTime}
                endTime={classItem.endTime}
                attendeeCount={classItem.attendeeCount}
                user={user}
              />
            ))}
          </Flex>

          <Flex
            display={activeTab === "classes" ? "none" : "flex"}
            align="center"
            justify="center"
            gap={5}
            mt={5}
            wrap="wrap"
          >
            {events.map((eventItem, index) => (
              <EventCard
                key={index}
                title={eventItem.title}
                location={eventItem.location}
                description={eventItem.description}
                level={eventItem.level}
                date={eventItem.date}
                startTime={eventItem.startTime}
                endTime={eventItem.endTime}
                callTime={eventItem.callTime}
                classId={eventItem.classId}
                costume={eventItem.costume}
                id={eventItem.id}
                setRefresh={setRefresh}
                user={user}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
      <Navbar></Navbar>
    </Box>
  );
};
