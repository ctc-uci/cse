import { memo, useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CreateClassForm } from "../forms/createClasses";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { InfoModal } from "./InfoModal";
import { TeacherCancelModal } from "./TeacherCancelModal";
import { TeacherConfirmationModal } from "./TeacherConfirmationModal";
import { TeacherEditModal } from "./TeacherEditModal";
import { TeacherViewModal } from "./TeacherViewModal";
import { ViewModal } from "./ViewModal";
import CreateEvent from "../forms/createEvent";

export const Bookings = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();
  const [loading, setLoading] = useState(true);
  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [draftClasses, setDraftClasses] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [attended, setAttended] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);
  const [isAttendedItem, setIsAttendedItem] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [refresh, setRefresh] = useState(0)

  const isTeacher = role === "teacher";
  useEffect(() => {
    if (currentUser && role !== "student") {
      backend.get(`/events/published`).then((res) => setEvents(res.data));
      backend.get(`/classes/published`).then((res) => setClasses(res.data));
      backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data));
      backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data));
    } else if (currentUser && role === "student") {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((userRes) => {
          const userId = userRes.data[0].id;
          setUserId(userId);

          backend
            .get(`/class-enrollments/student/${userId}`)
            .then((res) => {
              setClasses(res.data);
            })
            .catch((err) => {
              console.log("Error fetching class enrollments:", err);
            });

            backend
              .get(`/class-enrollments/student/${userId}`)
              .then((res) => {
                setClasses(res.data);
              })
              .catch((err) => {
                console.log("Error fetching class enrollments:", err);
              });

            backend
              .get(`/event-enrollments/student/${userId}`)
              .then((res) => {
                setEvents(res.data);
              })
              .catch((err) => {
                console.log("Error fetching event enrollments:", err);
              });
          })
          .catch((err) => {
            console.log("Error fetching user:", err);
          });
      }
    }, [backend, currentUser, isTeacher, refresh]);

  useEffect(() => {
    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);
    setDrafts([...draftClasses, ...draftEvents]);
  }, [classes, events]);

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
    reloadClassesAndDrafts();
  };
  const onOpenModal = (data) => {
    setClassData(data);
    onOpen();
  };

  const triggerRefresh = () => {
    setRefresh(refresh+1);
    console.log("Refresh triggered");
  }

  const updateModal = (item) => {
    const type =
      classes.includes(item) || draftClasses.includes(item) ? "class" : "event";
    if (type === "class") loadCorequisites(item.id);
    setSelectedCard(item);
    setCardType(type);
    const isAttended = attended.some(
      (attendedItem) => attendedItem === item
    );
    setIsAttendedItem(isAttended);
    onOpen();
  };

  const handleCancelEnrollment = async (itemId) => {
    if (!user_id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      let response = null;
      if (cardType === "class") {
        response = await backend.delete(
          `/class-enrollments/${user_id}/${itemId}`
        );
      } else {
        response = await backend.delete(
          `/event-enrollments/${user_id}/${itemId}`
        );
      }

      if (response.status === 200) {
        if (cardType === "class") {
          setClasses((prevClasses) =>
            prevClasses.filter((cls) => cls.id !== itemId)
          );
        } else {
          setEvents((prevEvents) =>
            prevEvents.filter((evt) => evt.id !== itemId)
          );
        }
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
    }
  };

  const loadCorequisites = async (classId) => {
    try {
      const response = await backend.get(`classes/corequisites/${classId}`);

      if (response.status === 200) {
        setCoEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching corequisite enrollment:", error);
    }
  };

  const reloadClassesAndDrafts = async () => {
    try {

      backend.get(`/events/published`).then((res) => setEvents(res.data));
      backend.get(`/classes/published`).then((res) => {setClasses(res.data)});
      backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data));
      backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data));

      const attendedClasses = classes.filter((c) => c.attendance !== null);
      const attendedEvents = events.filter((e) => e.attendance !== null);
      setAttended([...attendedClasses, ...attendedEvents]);
      setDrafts([...draftClasses, ...draftEvents]);
    } catch (error) {
      console.error("Error reloading classes:", error);
    }
  };

  // useEffect(() => {
  //   console.log("selectedCard", selectedCard);
  // }, [selectedCard]);

  const fetchClassData = async () => {
    try {
      const [classesResponse, classDataResponse] = await Promise.all([
        backend.get("/scheduled-classes"),
        backend.get("/classes"),
      ]);

      const classDataDict = new Map();
      classDataResponse.data.forEach((cls) => classDataDict.set(cls.id, cls));

      const formattedData = classesResponse.data
        .map((cls) => {
          const fullData = classDataDict.get(cls.classId);
          return fullData
            ? {
                classId: cls.classId,
                date: stringToDate(cls.date),
                startTime: stringToTime(cls.startTime),
                endTime: stringToTime(cls.endTime),
                title: fullData.title,
                description: fullData.description,
                location: fullData.location,
                capacity: fullData.capacity,
                level: fullData.level,
                costume: fullData.costume,
                isDraft: fullData.isDraft,
              }
            : null;
        })
        .filter(Boolean);

      setClasses(formattedData);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const stringToDate = (date) => {
    return new Date(date);
  };

  const stringToTime = (time) => {
    const [hours, minutes] = time.split(":");
    const d = new Date();
    d.setHours(hours, minutes, 0);

    return d;
  };

  // console.log("classes", classes);
  // console.log("events", events);
  // console.log("attended", classes);
  // console.log("selected card", selectedCard);
  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Tabs
          width="100%"
          variant="line"
          colorScheme="blackAlpha"
          pt={8}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList justifyContent="center">
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              {role !== "student" ? "Drafts" : "Attended"}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {role !== "student" ? (
                  classes.length > 0 ? (
                    classes.map((classItem, index) => (
                      <ClassTeacherCard
                        key={index}
                        setSelectedCard={setSelectedCard}
                        {...classItem}
                        navigate={navigate}
                        onOpen={onOpen}
                      />
                    ))
                  ) : (
                    <Text>No classes available.</Text>
                  )
                ) : classes.length > 0 ? (
                  classes.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      {...classItem}
                      onClick={() => updateModal(classItem)}
                    />
                  ))
                ) : (
                  <Text>No classes booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {events.length > 0 ? (
                  events.map((eventItem) => (
                    <EventCard
                      key={eventItem.id}
                      {...eventItem}
                      onClick={() => updateModal(eventItem)}
                      // setRefresh={reloadClassesAndDrafts}
                      triggerRefresh={triggerRefresh}
                      onCloseModal={onCloseModal}
                    />
                  ))
                ) : (
                  <Text>No events booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {role !== "student" ? (
                  drafts.length > 0 ? (
                    drafts.map((item) =>
                      draftClasses.includes(item) ? (
                        <ClassCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          location={item.location}
                          capacity={item.capacity}
                          level={item.level}
                          date={item.date}
                          startTime={item.startTime}
                          endTime={item.endTime}
                          attendeeCount={item.attendeeCount}
                          onClick={() => updateModal(item)}
                        />
                      ) : (
                        <EventCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          location={item.location}
                          date={item.date}
                          startTime={item.startTime}
                          endTime={item.endTime}
                          callTime={item.callTime}
                          attendeeCount={item.attendeeCount}
                          description={item.description}
                          capacity={item.capacity}
                          level={item.level}
                          onClick={() => updateModal(item)}
                          triggerRefresh={triggerRefresh}
                          onCloseModal={onCloseModal}
                          // setRefresh={reloadClassesAndDrafts}
                        />
                      )
                    )
                  ) : (
                    <Text>No draft events or classes</Text>
                  )
                ) : attended.length > 0 ? (
                  attended.map((item) =>
                    item.class_id ? (
                      <ClassCard
                        key={item.id}
                        {...item}
                        onClick={() => updateModal(item)}
                      />
                    ) : (
                      <EventCard
                        key={item.id}
                        {...item}
                        onClick={() => updateModal(item)}
                        triggerRefresh={triggerRefresh}
                      />
                    )
                  )
                ) : (
                  <Text>No attended classes or events.</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      {role !== "student" ? (
        currentModal === "view" ? (
          <TeacherViewModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
            performances={coEvents}
            setPerformances={setCoEvents}
          />
        ) : currentModal === "confirmation" ? (
          <TeacherConfirmationModal
            isOpen={isOpen}
            onClose={onCloseModal}
          />
        ) : currentModal === "edit" ? (
          <TeacherEditModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
            setClassData={setSelectedCard}
            performances={coEvents}
            setRefresh={reloadClassesAndDrafts}
          />
        ) : currentModal === "create" ? (
          <Modal
            size="full"
            isOpen={isOpen}
            onClose={onCloseModal}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>
                <HStack justify="space-between">
                  <MdArrowBackIosNew onClick={onCloseModal} />
                  <Heading size="lg">{tabIndex === 0 ? "Create a Class" : "Create an Event"}</Heading>{" "}
                  {/* Will add from prop */}
                  <MdMoreHoriz opacity={0}/>
                </HStack>
              </ModalHeader>
              <ModalBody>
                {(tabIndex === 0 ?
                  <CreateClassForm
                    closeModal={onCloseModal}
                    modalData={selectedCard}
                    reloadCallback={reloadClassesAndDrafts}
                  />
                :
                  <CreateEvent onClose={onCloseModal} reloadCallback={reloadClassesAndDrafts}/>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : (
          <TeacherCancelModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
          />
        )
      ) : // STUDENT VIEW HERE
      currentModal === "view" ? (
        <ViewModal
          isOpen={isOpen}
          onClose={onClose}
          setCurrentModal={setCurrentModal}
          card={selectedCard}
          coEvents={coEvents}
          type={cardType}
          isAttended={isAttendedItem}
        />
      ) : currentModal === "confirmation" ? (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onCloseModal}
          card={selectedCard}
        />
      ) : (
        <CancelModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
          card={selectedCard}
          handleEvent={() => handleCancelEnrollment(selectedCard.id)}
          type={cardType}
        />
      )}
      {isTeacher && tabIndex !== 2 && (
        <Button
          onClick={() => {
            setSelectedCard(null);
            setCurrentModal("create");
            onOpen();
          }}
          position="fixed"
          bottom="160px"
          right="50px"
          borderRadius="50%"
          width="60px"
          height="60px"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.700" }}
          fontSize="2xl"
        >
          +
        </Button>
      )}
      <Navbar />
    </Box>
  );
};

const ClassTeacherCard = memo(
  ({
    id,
    title,
    location,
    date,
    description,
    capacity,
    level,
    costume,
    performance,
    rsvpCount,
    isDraft,
    navigate,
    setSelectedCard,
    onOpen,
  }) => {
    return (
      <Card
        w={{ base: "90%", md: "30em" }}
        bg="gray.200"
      >
        <CardHeader pb={0}>
          <Heading
            size="md"
            fontWeight="bold"
          >
            {title ? title : "Placeholder Title"}
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack
            align="stretch"
            spacing={2}
          >
            <HStack>
              <FaClock size={14} />
              <Text fontSize="sm">
                {date ? date : "1/27/2025 @ 1 PM - 3 PM"}
              </Text>
            </HStack>

            <HStack>
              <FaMapMarkerAlt size={14} />
              <Text fontSize="sm">{location ? location : "Irvine"}</Text>
            </HStack>

            <HStack>
              <FaUser size={14} />
              <Text fontSize="sm">
                {rsvpCount ? rsvpCount : 10}{" "}
                {rsvpCount === 1 ? "person" : "people"} RSVP'd
              </Text>
            </HStack>
            <Button
              alignSelf="flex-end"
              variant="solid"
              size="sm"
              bg="gray.500"
              color="black"
              _hover={{ bg: "gray.700" }}
              mt={2}
              onClick={
                isDraft
                  ? () => {
                      const modalData = {
                        id,
                        title,
                        location,
                        date,
                        description,
                        capacity,
                        level,
                        costume,
                        performance,
                        isDraft,
                        rsvpCount
                      };
                      setSelectedCard(modalData);
                      onOpen();
                    }
                  : () => {
                      const modalData = {
                        id,
                        title,
                        location,
                        date,
                        description,
                        capacity,
                        level,
                        costume,
                        performance,
                        isDraft,
                        rsvpCount
                      };
                      setSelectedCard(modalData);
                      onOpen();
                  }
                  // : () => navigate(`/dashboard/classes/${classId}`)
              }
            >
              {isDraft ? "Edit" : "View Details >"}
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }
);


