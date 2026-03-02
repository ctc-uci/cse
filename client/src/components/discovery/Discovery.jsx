import { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Center,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";

const CLASSES_PAGE_SIZE = 12;

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { SearchBar } from "../searchbar/SearchBar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";

export const Discovery = () => {
  // Active Tab Logic
  const [tabIndex, setTabIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [lastToggledTag, setLastToggledTag] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesOffset, setClassesOffset] = useState(0);
  const [hasMoreClasses, setHasMoreClasses] = useState(true);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesMode, setClassesMode] = useState("browse"); // 'browse' | 'search' | 'tag'
  const [events, setEvents] = useState([]);
  const loadMoreRef = useRef(null);
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});
  const [initialTagFilter, setInitialTagFilter] = useState({});
  const [classTagsMap, setClassTagsMap] = useState({});
  const [eventTagsMap, setEventTagsMap] = useState({});
  const [user, setUser] = useState(null);

  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  // API endpoint configuration
  const getApiEndpoints = useCallback(
    () => ({
      events: {
        published: role === "student" ? "/events/published" : "/events",
        search:
          role === "student" ? "/events/search/published" : "/events/search",
      },
      classes: {
        published:
          role === "student" ? "/classes/published" : "/classes/scheduled",
        search:
          role === "student" ? "/classes/search/published" : "/classes/search",
      },
    }),
    [role]
  );

  // Fetch functions
  const fetchAllEvents = useCallback(async () => {
    try {
      const endpoints = getApiEndpoints();
      const res = await backend.get(endpoints.events.published);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  }, [backend, getApiEndpoints]);

  const fetchClassesPage = useCallback(
    async (offset = 0, append = false) => {
      try {
        setClassesLoading(true);
        const endpoints = getApiEndpoints();
        const res = await backend.get(endpoints.classes.published, {
          params: { limit: CLASSES_PAGE_SIZE, offset },
        });
        const newClasses = res.data;

        if (append) {
          setClasses((prev) => [...prev, ...newClasses]);
        } else {
          setClasses(newClasses);
        }
        setHasMoreClasses(newClasses.length === CLASSES_PAGE_SIZE);
        setClassesOffset(offset + newClasses.length);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setHasMoreClasses(false);
      } finally {
        setClassesLoading(false);
      }
    },
    [backend, getApiEndpoints]
  );

  const fetchAllClasses = useCallback(async () => {
    setClassesMode("browse");
    await fetchClassesPage(0, false);
  }, [fetchClassesPage]);

  const loadMoreClasses = useCallback(async () => {
    if (classesLoading || !hasMoreClasses || classesMode !== "browse") return;
    await fetchClassesPage(classesOffset, true);
  }, [fetchClassesPage, classesLoading, hasMoreClasses, classesMode, classesOffset]);

  const fetchEventsByTag = useCallback(
    async (tagId) => {
      try {
        const res = await backend.get(`/event-tags/events/${tagId}`);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events for specified tag:", error);
      }
    },
    [backend]
  );

  const fetchClassesByTag = useCallback(
    async (tagId) => {
      try {
        setClassesMode("tag");
        setClassesLoading(true);
        const res = await backend.get(`/class-tags/classes/${tagId}`);
        setClasses(res.data);
        setHasMoreClasses(false); // Tag filter returns all, no pagination
      } catch (error) {
        console.error("Error fetching classes for specified tag:", error);
      } finally {
        setClassesLoading(false);
      }
    },
    [backend]
  );

  // Search functions with proper empty query handling
  const searchEvents = useCallback(
    async (query) => {
      try {
        if (!query || query.trim() === "") {
          await fetchAllEvents();
          return;
        }

        const endpoints = getApiEndpoints();
        const res = await backend.get(
          `${endpoints.events.search}/${query.trim()}`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Error searching events:", error);
      }
    },
    [backend, fetchAllEvents, getApiEndpoints]
  );

  const searchClasses = useCallback(
    async (query) => {
      try {
        if (!query || query.trim() === "") {
          await fetchAllClasses();
          return;
        }

        setClassesMode("search");
        setClassesLoading(true);
        const endpoints = getApiEndpoints();
        const res = await backend.get(
          `${endpoints.classes.search}/${query.trim()}`
        );
        setClasses(res.data);
        setHasMoreClasses(false); // Search returns all matches, no pagination
      } catch (error) {
        console.error("Error searching classes:", error);
      } finally {
        setClassesLoading(false);
      }
    },
    [backend, fetchAllClasses, getApiEndpoints]
  );

  // Tag filter handlers
  const handleFilterToggle = useCallback(
    (id) => () => {
      setTagFilter((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      setLastToggledTag(id);
    },
    []
  );

  const handleClassFilterToggle = useCallback(
    (id) => () => {
      setTagFilter((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      setLastToggledTag(id);
    },
    []
  );

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await backend.get(`/users/${currentUser.uid}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser?.uid) {
      fetchUserData();
    }
  }, [backend, currentUser]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch first page of classes (lazy load rest on scroll)
        const classResponse = await backend.get(
          role !== "student" ? "/classes/scheduled" : "/classes/published",
          { params: { limit: CLASSES_PAGE_SIZE, offset: 0 } }
        );
        const classData = classResponse.data;
        setClasses(classData);
        setClassesOffset(classData.length);
        setHasMoreClasses(classData.length === CLASSES_PAGE_SIZE);
        setClassesMode("browse");

        const classTagsResponse = await backend.get(
          "/class-tags/all-class-tags"
        );
        const classTags = {};
        classTagsResponse.data.forEach((tag) => {
          classTags[tag.classId] = tag.tagArray;
        });
        setClassTagsMap(classTags);

        // Fetch events with tags
        const eventResponse = await backend.get(
          role !== "student" ? "/events" : "/events/published"
        );
        setEvents(eventResponse.data);

        const eventTagsResponse = await backend.get(
          "/event-tags/all-event-tags"
        );
        const eventTags = {};
        eventTagsResponse.data.forEach((tag) => {
          eventTags[tag.eventId] = tag.tagArray;
        });
        setEventTagsMap(eventTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, role]);

  // Fetch tags
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
        setInitialTagFilter(initialTagFilter);
        setTags(initialTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [backend]);

  // Tag filtering effect
  useEffect(() => {
    if (lastToggledTag === null) {
      return;
    }

    const active = tagFilter[lastToggledTag];

    if (tabIndex === 1) {
      if (active) {
        fetchEventsByTag(lastToggledTag);
      } else {
        fetchAllEvents();
      }
    } else {
      if (active) {
        fetchClassesByTag(lastToggledTag);
      } else {
        fetchAllClasses();
      }
    }
  }, [
    tagFilter,
    lastToggledTag,
    fetchAllEvents,
    fetchAllClasses,
    fetchEventsByTag,
    fetchClassesByTag,
    tabIndex,
  ]);

  // Infinite scroll for classes
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || classesMode !== "browse" || !hasMoreClasses || classesLoading)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreClasses();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [classesMode, hasMoreClasses, classesLoading, loadMoreClasses]);

  return (
    <Box>
      <Flex
        direction={"column"}
        mb={20}
      >
        <Tabs
          colorScheme="purple"
          index={tabIndex}
          onChange={(index) => {
            setTagFilter(initialTagFilter); // Reset tag filter when switching tabs
            setTabIndex(index);
          }}
        >
          <Center>
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
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <VStack
                spacing={4}
                align="stretch"
              >
                <SearchBar
                  onSearch={searchClasses}
                  tags={tags}
                  tagFilter={tagFilter}
                  onTag={handleClassFilterToggle}
                />
                <Flex
                  gap={3}
                  wrap="wrap"
                  justify="center"
                >
                  {classes.map((classItem, index) => {
                    const isFilterActive =
                      Object.values(tagFilter).some(Boolean);
                    const classTags = classTagsMap[classItem.id] || [];
                    if (
                      !isFilterActive ||
                      classTags.some((tag) => tagFilter[tag.id])
                    ) {
                      return (
                        <ClassCard
                          id={classItem.id}
                          key={`${classItem.id}-${classItem.date ?? index}`}
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
                          tags={classTagsMap[classItem.id] || []}
                        />
                      );
                    }
                    return null;
                  })}
                </Flex>
                {classesMode === "browse" && hasMoreClasses && (
                  <Box
                    ref={loadMoreRef}
                    py={8}
                    display="flex"
                    justifyContent="center"
                    w="100%"
                  >
                    {classesLoading && <Spinner color="purple.500" size="lg" />}
                  </Box>
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack
                spacing={4}
                align="stretch"
              >
                <SearchBar
                  onSearch={searchEvents}
                  tags={tags}
                  tagFilter={tagFilter}
                  onTag={handleFilterToggle}
                />
                <Flex
                  gap={5}
                  wrap="wrap"
                  justify="center"
                >
                  {events.map((eventItem, index) => {
                    const isFilterActive =
                      Object.values(tagFilter).some(Boolean);
                    const eventTags = eventTagsMap[eventItem.id] || [];
                    if (
                      !isFilterActive ||
                      eventTags.some((tag) => tagFilter[tag.id])
                    ) {
                      return (
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
                          capacity={eventItem.capacity}
                          costume={eventItem.costume}
                          attendeeCount={eventItem.attendeeCount}
                          id={eventItem.id}
                          setRefresh={setRefresh} // Pass the setRefresh function to EventCard
                          user={user} // Pass the user data to EventCard
                          tags={eventTagsMap[eventItem.id] || []} // Pass the tags for the event
                        />
                      );
                    }
                    return null;
                  })}
                </Flex>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Navbar />
    </Box>
  );
};
