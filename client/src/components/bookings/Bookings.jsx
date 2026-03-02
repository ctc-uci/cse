import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
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

// import {
//   FaClock,
//   FaMapMarkerAlt,
//   FaMicrophoneAlt,
//   FaMusic,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";
// import {
//   GiAbstract001,
//   GiBallerinaShoes,
//   GiBoombox,
//   GiCartwheel,
//   GiTambourine,
// } from "react-icons/gi";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
// import { formatDate, formatTime } from "../../utils/formatDateTime";
import { CreateClassForm } from "../forms/createClasses";
import CreateEvent from "../forms/createEvent";
import { Navbar } from "../navbar/Navbar";
// import { InfoModal } from "./InfoModal";
import { SearchBar } from "../searchbar/SearchBar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ClassTeacherCard } from "./ClassTeacherCard";
import { ConfirmationModal } from "./ConfirmationModal";
import { TeacherCancelModal } from "./TeacherCancelModal";
import { TeacherConfirmationModal } from "./TeacherConfirmationModal";
import { TeacherEditModal } from "./TeacherEditModal";
import { TeacherViewView } from "./TeacherViewView";
import { ViewView } from "./ViewView";

export const Bookings = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();
  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [draftClasses, setDraftClasses] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);
  const [isAttendedItem, setIsAttendedItem] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [coreqId, setCoreqId] = useState();
  const [tags, setTags] = useState([]);
  const [tagFilter, setTagFilter] = useState({});
  const [classTagsMap, setClassTagsMap] = useState({});
  const [eventTagsMap, setEventTagsMap] = useState({});

  const [refresh, setRefresh] = useState(-1);
  const [magic, setMagic] = useState(-1);

  const reloadStudentClasses = async () => {
    if (!user_id) return;
    try {
      const [classesRes, classTagsRes] = await Promise.all([
        backend.get(`/class-enrollments/student/${user_id}`),
        backend.get(`/class-tags/enrolled-class-tags/${user_id}`),
      ]);
      setClasses((prev) => {
        const newData = classesRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((c, i) => c.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      const newClassTagsMap = {};
      classTagsRes.data.forEach((item) => {
        newClassTagsMap[item.classId] = item.tagArray;
      });
      setClassTagsMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newClassTagsMap);
        return prevStr === newStr ? prev : newClassTagsMap;
      });
    } catch (error) {
      console.error("Error reloading student classes:", error);
    }
  };

  const reloadStudentEvents = async () => {
    if (!user_id) return;
    try {
      const [eventsRes, eventTagsRes] = await Promise.all([
        backend.get(`/event-enrollments/student/${user_id}`),
        backend.get(`/event-tags/enrolled-event-tags/${user_id}`),
      ]);
      setEvents((prev) => {
        const newData = eventsRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((e, i) => e.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      const newEventTagsMap = {};
      eventTagsRes.data.forEach((item) => {
        newEventTagsMap[item.eventId] = item.tagArray;
      });
      setEventTagsMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newEventTagsMap);
        return prevStr === newStr ? prev : newEventTagsMap;
      });
    } catch (error) {
      console.error("Error reloading student events:", error);
    }
  };

  const reloadTeacherClasses = async () => {
    try {
      const [classesRes, classDraftsRes, classTagsRes] = await Promise.all([
        backend.get(`/classes/published`),
        backend.get(`/classes/drafts`),
        backend.get(`/class-tags/all-class-tags`),
      ]);
      setClasses((prev) => {
        const newData = classesRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((c, i) => c.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      setDraftClasses((prev) => {
        const newData = classDraftsRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((c, i) => c.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      const newClassTagsMap = {};
      classTagsRes.data.forEach((item) => {
        newClassTagsMap[item.classId] = item.tagArray;
      });
      setClassTagsMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newClassTagsMap);
        return prevStr === newStr ? prev : newClassTagsMap;
      });
    } catch (error) {
      console.error("Error reloading teacher classes:", error);
    }
  };

  const reloadTeacherEvents = async () => {
    try {
      const [eventsRes, eventDraftsRes, eventTagsRes] = await Promise.all([
        backend.get(`/events/published`),
        backend.get(`/events/drafts`),
        backend.get(`/event-tags/all-event-tags`),
      ]);
      setEvents((prev) => {
        const newData = eventsRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((e, i) => e.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      setDraftEvents((prev) => {
        const newData = eventDraftsRes.data;
        if (
          prev.length !== newData.length ||
          prev.some((e, i) => e.id !== newData[i]?.id)
        ) {
          return newData;
        }
        return prev;
      });
      const newEventTagsMap = {};
      eventTagsRes.data.forEach((item) => {
        newEventTagsMap[item.eventId] = item.tagArray;
      });
      setEventTagsMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newEventTagsMap);
        return prevStr === newStr ? prev : newEventTagsMap;
      });
    } catch (error) {
      console.error("Error reloading teacher events:", error);
    }
  };

  useEffect(() => {
    if (!role) return;
    if (currentUser && role !== "student") {
      // First get all classes and events
      const fetchData = async () => {
        try {
          // Get all the basic data
          const [
            classesRes,
            eventsRes,
            draftEventsRes,
            draftClassesRes,
            allEventsRes,
          ] = await Promise.all([
            backend.get(`/classes/published`),
            backend.get(`/events/published`),
            backend.get(`/events/drafts`),
            backend.get(`/classes/drafts`),
            backend.get("/events/all"),
          ]);

          const allClasses = classesRes.data;
          const allDraftClasses = draftClassesRes.data;

          const newClassTagsMap = {};
          const classTagsRes = await backend.get("/class-tags/all-class-tags");
          classTagsRes.data.forEach((item) => {
            newClassTagsMap[item.classId] = item.tagArray;
          });
          // console.log("Class Tags Map:", newClassTagsMap);
          const newEventTagsMap = {};
          const eventTagsRes = await backend.get("/event-tags/all-event-tags");
          eventTagsRes.data.forEach((item) => {
            newEventTagsMap[item.eventId] = item.tagArray;
          });
          // console.log("Event Tags Map:", newEventTagsMap);

          // Set all the state - only update if data actually changed
          setClassTagsMap((prev) => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(newClassTagsMap);
            return prevStr === newStr ? prev : newClassTagsMap;
          });
          setEventTagsMap((prev) => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(newEventTagsMap);
            return prevStr === newStr ? prev : newEventTagsMap;
          });
          setClasses((prev) => {
            if (
              prev.length !== allClasses.length ||
              prev.some((c, i) => c.id !== allClasses[i]?.id)
            ) {
              return allClasses;
            }
            return prev;
          });
          setEvents((prev) => {
            if (
              prev.length !== eventsRes.data.length ||
              prev.some((e, i) => e.id !== eventsRes.data[i]?.id)
            ) {
              return eventsRes.data;
            }
            return prev;
          });
          setDraftEvents((prev) => {
            if (
              prev.length !== draftEventsRes.data.length ||
              prev.some((e, i) => e.id !== draftEventsRes.data[i]?.id)
            ) {
              return draftEventsRes.data;
            }
            return prev;
          });
          setDraftClasses((prev) => {
            if (
              prev.length !== allDraftClasses.length ||
              prev.some((c, i) => c.id !== allDraftClasses[i]?.id)
            ) {
              return allDraftClasses;
            }
            return prev;
          });
          setAllEvents((prev) => {
            if (
              prev.length !== allEventsRes.data.length ||
              prev.some((e, i) => e.id !== allEventsRes.data[i]?.id)
            ) {
              return allEventsRes.data;
            }
            return prev;
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else if (currentUser && role === "student") {
      const fetchData = async () => {
        try {
          const userRes = await backend.get(`/users/${currentUser.uid}`);
          const userId = userRes.data[0].id;
          setUserId(userId);
          const [enrolledClassesRes, enrolledEventsRes] = await Promise.all([
            backend.get(`/class-enrollments/student/${userId}`),
            backend.get(`/event-enrollments/student/${userId}`),
          ]);
          const enrolledClasses = enrolledClassesRes.data;
          const enrolledEvents = enrolledEventsRes.data;
          setClasses((prev) => {
            if (
              prev.length !== enrolledClasses.length ||
              prev.some((c, i) => c.id !== enrolledClasses[i]?.id)
            ) {
              return enrolledClasses;
            }
            return prev;
          });
          setEvents((prev) => {
            if (
              prev.length !== enrolledEvents.length ||
              prev.some((e, i) => e.id !== enrolledEvents[i]?.id)
            ) {
              return enrolledEvents;
            }
            return prev;
          });

          const newClassTagsMap = {};
          const newEventTagsMap = {};
          const classTagsRes = await backend.get(
            `/class-tags/enrolled-class-tags/${userId}`
          );
          classTagsRes.data.forEach((item) => {
            newClassTagsMap[item.classId] = item.tagArray;
          });
          // console.log("Student Class Tags Map:", newClassTagsMap);
          const eventTagsRes = await backend.get(
            `/event-tags/enrolled-event-tags/${userId}`
          );
          eventTagsRes.data.forEach((item) => {
            newEventTagsMap[item.eventId] = item.tagArray;
          });
          // console.log("Student Event Tags Map:", newEventTagsMap);
          setClassTagsMap((prev) => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(newClassTagsMap);
            return prevStr === newStr ? prev : newClassTagsMap;
          });
          setEventTagsMap((prev) => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(newEventTagsMap);
            return prevStr === newStr ? prev : newEventTagsMap;
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [backend, currentUser, refresh, role]);

  // Use refs to track previous values and prevent unnecessary recalculations
  const prevClassesRef = useRef();
  const prevEventsRef = useRef();
  const prevAttendedRef = useRef([]);

  // Use useMemo with deep comparison to prevent re-render loops
  const attended = useMemo(() => {
    // Deep comparison: check if arrays have same IDs
    const classesIds = classes.map((c) => c.id).join(",");
    const eventsIds = events.map((e) => e.id).join(",");
    const prevClassesIds = prevClassesRef.current
      ? prevClassesRef.current.map((c) => c.id).join(",")
      : "";
    const prevEventsIds = prevEventsRef.current
      ? prevEventsRef.current.map((e) => e.id).join(",")
      : "";

    if (
      classesIds === prevClassesIds &&
      eventsIds === prevEventsIds &&
      prevAttendedRef.current.length > 0
    ) {
      return prevAttendedRef.current;
    }

    prevClassesRef.current = classes;
    prevEventsRef.current = events;
    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    const result = [...attendedClasses, ...attendedEvents];
    prevAttendedRef.current = result;
    return result;
  }, [classes, events]);

  const drafts = useMemo(() => {
    return [...draftClasses, ...draftEvents];
  }, [draftClasses, draftEvents]);

  // Memoize callbacks and props to prevent unnecessary re-renders
  const handleSetCurrentModal = useCallback((modal) => {
    setCurrentModal(modal);
  }, []);

  // Memoize coEvents to prevent unnecessary re-renders
  const coEventsIdString = useMemo(
    () =>
      coEvents
        .map((e) => e?.id)
        .filter(Boolean)
        .join(","),
    [coEvents]
  );
  const memoizedCoEvents = useMemo(() => {
    return coEvents;
  }, [coEventsIdString]);

  const memoizedViewViewTags = useMemo(() => {
    if (!selectedCard?.id) return [];
    return cardType === "class"
      ? classTagsMap[selectedCard.id] || []
      : eventTagsMap[selectedCard.id] || [];
  }, [cardType, selectedCard?.id, classTagsMap, eventTagsMap]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await backend.get("/tags");
        const initialTagFilter = {};
        const initialTags = {};
        tagsResponse.data.forEach((tag) => {
          initialTagFilter[tag.id] = false;
          initialTags[tag.id] =
            tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
        });

        setTagFilter(initialTagFilter);
        setTags(initialTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [backend]);

  const handleFilterToggle = (id) => () => {
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const fetchCoreqId = async () => {
      if (!selectedCard?.id || !isOpen) return;

      try {
        const res = await backend.get(`/corequisites/${selectedCard.id}`);
        const data = res.data;

        if (data.length > 0) {
          const eventId = data[0].eventId;
          setCoreqId(eventId);
        } else {
          setCoreqId(null);
        }
      } catch (err) {
        console.error("Failed to fetch coreqId:", err);
        setCoreqId(null);
      }
    };

    fetchCoreqId();
  }, [backend, selectedCard, isOpen]);

  const onCloseModal = () => {
    if (tabIndex === 0) {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses()]).then(() => {
          setCurrentModal("view");
          onClose();
        });
      } else {
        Promise.all([reloadStudentClasses()]).then(() => {
          setCurrentModal("view");
          onClose();
        });
      }
    } else if (tabIndex === 1) {
      if (role !== "student") {
        Promise.all([reloadTeacherEvents()]).then(() => {
          setSelectedCard(null);
          setCurrentModal("view");
          onClose();
        });
      } else {
        Promise.all([reloadStudentEvents()]).then(() => {
          setSelectedCard(null);
          setCurrentModal("view");
          onClose();
        });
      }
    } else {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses(), reloadTeacherEvents()]).then(
          () => {
            setSelectedCard(null);
            setCurrentModal("view");
            onClose();
          }
        );
      } else {
        Promise.all([reloadStudentClasses(), reloadStudentEvents()]).then(
          () => {
            setSelectedCard(null);
            setCurrentModal("view");
            onClose();
          }
        );
      }
    }
  };

  const onCloseEditModal = () => {
    if (tabIndex === 0) {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses()]).then(() => {
          setCurrentModal("view");
          setMagic((prev) => -1 * prev);
        });
      } else {
        Promise.all([reloadStudentClasses()]).then(() => {
          setCurrentModal("view");
          setMagic((prev) => -1 * prev);
        });
      }
    } else if (tabIndex === 1) {
      if (role !== "student") {
        Promise.all([reloadTeacherEvents()]).then(() => {
          setCurrentModal("view");
          setMagic((prev) => -1 * prev);
        });
      } else {
        Promise.all([reloadStudentEvents()]).then(() => {
          setCurrentModal("view");
          setMagic((prev) => -1 * prev);
        });
      }
    } else {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses(), reloadTeacherEvents()]).then(
          () => {
            setCurrentModal("view");
            setMagic((prev) => -1 * prev);
          }
        );
      } else {
        Promise.all([reloadStudentClasses(), reloadStudentEvents()]).then(
          () => {
            setCurrentModal("view");
            setMagic((prev) => -1 * prev);
          }
        );
      }
    }
  };

  const triggerRefresh = () => {
    if (tabIndex === 0) {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses()]).then(() => {
          setRefresh((prev) => -1 * prev);
        });
      } else {
        Promise.all([reloadStudentClasses()]).then(() => {
          setRefresh((prev) => -1 * prev);
        });
      }
    } else if (tabIndex === 1) {
      if (role !== "student") {
        Promise.all([reloadTeacherEvents()]).then(() => {
          setRefresh((prev) => -1 * prev);
        });
      } else {
        Promise.all([reloadStudentEvents()]).then(() => {
          setRefresh((prev) => -1 * prev);
        });
      }
    } else {
      if (role !== "student") {
        Promise.all([reloadTeacherClasses(), reloadTeacherEvents()]).then(
          () => {
            setRefresh((prev) => -1 * prev);
          }
        );
      } else {
        Promise.all([reloadStudentClasses(), reloadStudentEvents()]).then(
          () => {
            setRefresh((prev) => -1 * prev);
          }
        );
      }
    }
  };

  // https://dmitripavlutin.com/how-to-compare-objects-in-javascript/#4-deep-equality
  // const deepequality = (object1, object2) => {
  //   if (object1 === null || object2 === null) return object1 === object2;
  //   const keys1 = Object.keys(object1);
  //   const keys2 = Object.keys(object2);

  //   if (keys1.length !== keys2.length) {
  //     return false;
  //   }

  //   for (const key of keys1) {
  //     const val1 = object1[key];
  //     const val2 = object2[key];
  //     const areObjects = typeof val1 === "object" && typeof val2 === "object";
  //     if (
  //       (areObjects && !deepEquality(val1, val2)) ||
  //       (!areObjects && val1 !== val2)
  //     ) {
  //       return false;
  //     }
  //   }

  //   return true;
  // };

  const loadCorequisites = useCallback(
    async (classId) => {
      try {
        const response = await backend.get(`classes/corequisites/${classId}`);

        if (response.status === 200) {
          setCoEvents((prev) => {
            const newData = response.data || [];
            if (
              !prev ||
              prev.length !== newData.length ||
              prev.some((e, i) => e?.id !== newData[i]?.id)
            ) {
              return newData;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error fetching corequisite enrollment:", error);
        setCoEvents([]);
      }
    },
    [backend]
  );

  const updateModal = useCallback(
    (item, type = "class") => {
      if (type === "class") loadCorequisites(item.id);
      setSelectedCard(item);
      setCardType(type);
      const isAttended = attended.some((attendedItem) => attendedItem === item);
      setIsAttendedItem(isAttended);
      onOpen();
    },
    [attended, onOpen, loadCorequisites]
  );

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

  const handleClassSearch = async (query) => {
    try {
      if (!query || query.trim() === "") {
        // For empty search, reload the appropriate data based on role
        if (role === "student") {
          if (user_id) await reloadStudentClasses();
        } else {
          await reloadTeacherClasses();
        }
        return;
      }

      if (currentUser && role === "student") {
        if (!user_id) return;
        // For students, search within their enrolled classes
        const enrolledRes = await backend.get(
          `/class-enrollments/student/${user_id}`
        );
        const allEnrolledClasses = enrolledRes.data;

        // Client-side search filtering
        const filteredClasses = allEnrolledClasses.filter((cls) =>
          cls.title.toLowerCase().includes(query.trim().toLowerCase())
        );

        setClasses(filteredClasses);
      } else {
        // For teachers/admin, use server-side search
        const searchRes = await backend.get(`/classes/search/${query.trim()}`);
        setClasses(searchRes.data);
      }
    } catch (error) {
      console.error("Error searching classes:", error);
    }
  };

  const handleEventSearch = async (query) => {
    try {
      if (!query || query.trim() === "") {
        // For empty search, reload the appropriate data based on role
        if (role === "student") {
          if (user_id) await reloadStudentEvents();
        } else {
          await reloadTeacherEvents();
        }
        return;
      }

      if (currentUser && role === "student") {
        if (!user_id) return;
        // For students, search within their enrolled events
        const enrolledRes = await backend.get(
          `/event-enrollments/student/${user_id}`
        );
        const allEnrolledEvents = enrolledRes.data;

        // Client-side search filtering
        const filteredEvents = allEnrolledEvents.filter((evt) =>
          evt.title.toLowerCase().includes(query.trim().toLowerCase())
        );

        setEvents(filteredEvents);
      } else {
        // For teachers/admin, use server-side search
        const searchRes = await backend.get(`/events/search/${query.trim()}`);
        setEvents(searchRes.data);
      }
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  const reloadClassesAndDrafts = async () => {
    try {
      await Promise.all([
        backend.get(`/events/published`).then((res) => setEvents(res.data)),
        backend.get(`/classes/published`).then((res) => setClasses(res.data)),
        backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data)),
        backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data)),
      ]);

      const attendedClasses = classes.filter((c) => c.attendance !== null);
      const attendedEvents = events.filter((e) => e.attendance !== null);
      setAttended([...attendedClasses, ...attendedEvents]);
      setDrafts([...draftClasses, ...draftEvents]);
      if (selectedCard) loadCorequisites(selectedCard.id);
      // console.log(attended);
    } catch (error) {
      console.error("Error reloading classes:", error);
    }
  };

  return (
    <Box>
      <Flex
        direction={"column"}
        mb={20}
      >
        <Tabs
          colorScheme="purple"
          onChange={(index) => setTabIndex(index)}
        >
          <Center mt={4}>
            <TabList>
              <Tab
                fontWeight={500}
                fontSize={"14px"}
                pb={1}
                _selected={{
                  borderBottom: "2px solid",
                  borderColor: "purple.600",
                  color: "purple.600",
                }}
              >
                Classes
              </Tab>
              <Tab
                fontWeight={500}
                fontSize={"14px"}
                pb={1}
                _selected={{
                  borderBottom: "2px solid",
                  borderColor: "purple.600",
                  color: "purple.600",
                }}
              >
                Events
              </Tab>
              <Tab
                fontWeight={500}
                fontSize={"14px"}
                pb={1}
                _selected={{
                  borderBottom: "2px solid",
                  borderColor: "purple.600",
                  color: "purple.600",
                }}
              >
                {role !== "student" ? "Drafts" : "Attended"}
              </Tab>
            </TabList>
          </Center>

          <TabPanels>
            <TabPanel>
              <SearchBar
                onSearch={handleClassSearch}
                tags={tags}
                tagFilter={tagFilter}
                onTag={handleFilterToggle}
              />
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
                justifyContent="center"
              >
                {role !== "student" && (
                  <Box
                    // w={{ base: "100%", md: "30em" }}
                    w={"100%"}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCard(null);
                      setCurrentModal("create");
                      onOpen();
                    }}
                  >
                    <Card
                      w="100%"
                      border="1px"
                      borderColor="gray.300"
                      bg="gray.50"
                      _hover={{ bg: "gray.60" }}
                    >
                      <CardBody textAlign="center">
                        <Text
                          fontSize="xl"
                          fontWeight="semibold"
                        >
                          Add a Class +
                        </Text>
                      </CardBody>
                    </Card>
                  </Box>
                )}
                {role !== "student" ? (
                  classes.length > 0 ? (
                    classes.map((classItem, index) => {
                      const isFilterActive =
                        Object.values(tagFilter).some(Boolean);
                      const classTags = classTagsMap[classItem.id] || [];

                      if (
                        !isFilterActive ||
                        classTags.some((tag) => tagFilter[tag.id])
                      ) {
                        return (
                          <ClassTeacherCard
                            key={`${classItem.id}-${classItem.date ?? index}`}
                            setSelectedCard={setSelectedCard}
                            {...classItem}
                            performance={coEvents}
                            performances={events}
                            navigate={navigate}
                            onOpen={updateModal}
                            onClick={() => {
                              updateModal(classItem, "class");
                            }}
                            tags={classTags}
                          />
                        );
                      }
                      return null;
                    })
                  ) : (
                    <Text>No classes available.</Text>
                  )
                ) : classes.length > 0 ? (
                  classes.map((classItem, index) => {
                    const classTags = classTagsMap[classItem.id] || [];

                    if (
                      !Object.values(tagFilter).some(Boolean) ||
                      classTags.some((tag) => tagFilter[tag.id])
                    ) {
                      return (
                        <Box
                          key={`${classItem.id}-${classItem.date ?? index}`}
                          display="flex"
                          justifyContent="center"
                          w="100%"
                        >
                          <ClassCard
                            {...classItem}
                            onClick={() => {
                              updateModal(classItem, "class");
                            }}
                            triggerRefresh={triggerRefresh}
                            onCloseModal={onCloseModal}
                            tags={classTags}
                          />
                        </Box>
                      );
                    }
                    return null;
                  })
                ) : (
                  <Text>No classes booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <SearchBar
                onSearch={handleEventSearch}
                tags={tags}
                tagFilter={tagFilter}
                onTag={handleFilterToggle}
              />
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
                justifyContent="center"
              >
                {role !== "student" && (
                  <Box
                    // w={{ base: "90%", md: "30em" }}
                    w={"100%"}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCard(null);
                      setCurrentModal("create");
                      onOpen();
                    }}
                  >
                    <Card
                      w="100%"
                      border="1px"
                      borderColor="gray.300"
                      bg="gray.50"
                      _hover={{ bg: "gray.60" }}
                    >
                      <CardBody textAlign="center">
                        <Text
                          fontSize="xl"
                          fontWeight="semibold"
                        >
                          Add an Event +
                        </Text>
                      </CardBody>
                    </Card>
                  </Box>
                )}{" "}
                {events.length > 0 ? (
                  events.map((eventItem, index) => {
                    const eventTags = eventTagsMap[eventItem.id] || [];

                    if (
                      !Object.values(tagFilter).some(Boolean) ||
                      eventTags.some((tag) => tagFilter[tag.id])
                    ) {
                      return (
                        <EventCard
                          key={`${eventItem.id}-${eventItem.date ?? index}`}
                          {...eventItem}
                          onClick={() => {
                            updateModal(eventItem, "event");
                          }}
                          magic={refresh}
                          triggerRefresh={triggerRefresh}
                          onCloseModal={onCloseModal}
                          tags={eventTags}
                        />
                      );
                    }
                    return null;
                  })
                ) : (
                  <Text>No events booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
                justifyContent={"center"}
              >
                {" "}
                {role !== "student" ? (
                  drafts.length > 0 ? (
                    drafts.map((item) => {
                      const classTags = classTagsMap[item.id] || [];

                      if (!item.callTime) {
                        return (
                          <ClassTeacherCard
                            key={`draft-class-${item.id}`}
                            {...item}
                            onClick={() => updateModal(item, "class")}
                            setSelectedCard={setSelectedCard}
                            performance={coEvents}
                            onOpen={updateModal}
                            tags={classTags}
                          />
                        );
                      } else if (item.callTime) {
                        return (
                          <EventCard
                            key={`draft-event-${item.id}`}
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
                            onClick={() => {
                              updateModal(item, "event");
                            }}
                            magic={refresh}
                            triggerRefresh={triggerRefresh}
                            onCloseModal={onCloseModal}
                            tags={eventTagsMap[item.id] || []}
                          />
                        );
                      }
                      return null;
                    })
                  ) : (
                    <Text>No draft events or classes</Text>
                  )
                ) : attended.length > 0 ? (
                  attended.map((item, index) => {
                    const itemTags =
                      classTagsMap[item.id] || eventTagsMap[item.id] || [];
                    const uniqueKey = item.id
                      ? `${item.callTime ? "event" : "class"}-${item.id}`
                      : `attended-${index}`;
                    return !item.callTime ? (
                      <ClassCard
                        key={uniqueKey}
                        {...item}
                        onClick={() => {
                          updateModal(item, "class");
                        }}
                        tags={itemTags}
                      />
                    ) : (
                      <EventCard
                        key={uniqueKey}
                        {...item}
                        onClick={() => {
                          updateModal(item, "event");
                        }}
                        magic={refresh}
                        triggerRefresh={triggerRefresh}
                        tags={itemTags}
                      />
                    );
                  })
                ) : (
                  <Text>No attended classes or events.</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {role !== "student" ? (
          currentModal === "view" && isOpen ? (
            <>
              <TeacherViewView
                key={`teacher-view-${selectedCard?.id || "none"}`}
                isOpen={isOpen}
                onClose={onCloseModal}
                setCurrentModal={setCurrentModal}
                classData={selectedCard}
                performances={coEvents}
                setPerformances={setCoEvents}
                tags={classTagsMap[selectedCard?.id] || []}
                magic={magic}
              />
            </>
          ) : currentModal === "confirmation" ? (
            <TeacherConfirmationModal
              isOpen={isOpen}
              onClose={onCloseModal}
            />
          ) : currentModal === "edit" ? (
            <TeacherEditModal
              isOpen={isOpen}
              onClose={onCloseEditModal}
              setCurrentModal={setCurrentModal}
              classData={selectedCard}
              setClassData={setSelectedCard}
              performances={allEvents}
              setRefresh={reloadTeacherClasses}
              coreqId={coreqId}
              tags={classTagsMap[selectedCard?.id] || []}
            />
          ) : currentModal === "create" ? (
            <Modal
              size="full"
              isOpen={isOpen}
              onClose={onCloseModal}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <HStack justify="space-between">
                    <MdArrowBackIosNew onClick={onCloseModal} />
                    <Heading size="lg">
                      {tabIndex === 0 ? "New Class" : "New Event"}
                    </Heading>{" "}
                    {/* Will add from prop */}
                    <MdMoreHoriz opacity={0} />
                  </HStack>
                </ModalHeader>
                <ModalBody>
                  {tabIndex === 0 ? (
                    <CreateClassForm
                      closeModal={onCloseModal}
                      modalData={selectedCard}
                      reloadCallback={reloadClassesAndDrafts}
                    />
                  ) : (
                    <CreateEvent
                      isOpen={isOpen}
                      onClose={onCloseModal}
                      // triggerRefresh={reloadClassesAndDrafts}
                    />
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
        currentModal === "view" && isOpen ? (
          <>
            <ViewView
              key={`view-${selectedCard?.id || "none"}`}
              isOpen={isOpen}
              onClose={onClose}
              setCurrentModal={handleSetCurrentModal}
              card={selectedCard}
              coEvents={memoizedCoEvents}
              type={cardType}
              isAttended={isAttendedItem}
              tags={memoizedViewViewTags}
            />
          </>
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
      </Flex>
      <Navbar />
    </Box>
  );
};
