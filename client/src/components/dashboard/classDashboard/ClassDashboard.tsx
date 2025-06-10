import { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { debounce, set } from "lodash";
import { FaRegBell } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { Class } from "../../../types/class";
import { Event } from "../../../types/event";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { NotificationPanel } from "../NotificationPanel";
import { ClassDeleteConfirmationModal } from "./ClassDeleteConfirmationModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { EventDeleteConfirmationModal } from "./EventDeleteConfirmationModal";

function ClassDashboard() {
  return <Outlet />;
}

export default ClassDashboard;

export function OverallClassDashboard() {
  const [pageNum, setPageNum] = useState<number>(0);
  const [pageNumE, setPageNumE] = useState<number>(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [numClasses, setNumClasses] = useState<number>(0);
  const [numEvents, setNumEvents] = useState<number>(0);
  const [reverse, setReverse] = useState<boolean>(false);
  const [reverseE, setReverseE] = useState<boolean>(false);
  const [currModal, setModal] = useState("none");
  const [selectedClass, setSelectedClass] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const notifRef = useRef();

  const confirmDelete = () => {
    setModal("toConfirm");
    onOpenModal();
  };

  const confirmDeleteEvent = () => {
    setModal("toConfirmEvent"); //TBD not set up yet.
    onOpenModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateClasses("", 0, false);
        updateEvents("", 0, false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [backend]);

  const handleClassSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateClasses(classSearchTerm, 0, false);
    setPageNum(0);
    setReverse(false);
  };
  const handleEventSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateEvents(eventSearchTerm, 0, false);
    setPageNumE(0);
    setReverseE(false);
  };

  const updateClasses = async (
    term: string,
    page: number,
    reverse: boolean
  ) => {
    try {
      const response = await backend.get("/scheduled-classes/teachers/", {
        params: { search: term.trim(), page: page, reverse: reverse },
      });
      setClasses(response.data);

      const countResponse = await backend.get(
        "/scheduled-classes/teachers/count/",
        {
          params: { search: term.trim() },
        }
      );
      setNumClasses(countResponse.data[0].count);
    } catch (error) {
      console.error("Error fetching classes: ", error);
    }
  };
  const updateEvents = async (term: string, page: number, reverse: boolean) => {
    try {
      const response = await backend.get("/events/", {
        params: { search: term.trim(), page: page, reverse: reverse },
      });
      setEvents(response.data);

      const countResponse = await backend.get("/events/count/", {
        params: { search: term.trim() },
      });
      setNumEvents(countResponse.data[0].count);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassSearchTerm(e.target.value);
    debouncedClassSearch(e.target.value); // Only runs after not typing for 500ms
  };
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventSearchTerm(e.target.value);
    debouncedEventSearch(e.target.value); // Only runs after not typing for 500ms
  };

  const debouncedClassSearch = useCallback(
    debounce((term) => {
      if (term.length >= 2 || term.length === 0) {
        updateClasses(term, 0, false);
        setPageNum(0);
        setReverse(false);
      }
    }, 500),
    []
  );
  const debouncedEventSearch = useCallback(
    debounce((term) => {
      if (term.length >= 2 || term.length === 0) {
        updateEvents(term, 0, false);
        setPageNumE(0);
        setReverseE(false);
      }
    }, 500),
    []
  );

  const incPage = () => {
    if (pageNum * 10 + 10 < numClasses) {
      updateClasses(classSearchTerm, pageNum + 1, reverse);
      setPageNum(pageNum + 1);
    }
  };
  const decPage = () => {
    if (pageNum > 0) {
      updateClasses(classSearchTerm, pageNum - 1, reverse);
      setPageNum(pageNum - 1);
    }
  };

  const incPageE = () => {
    if (pageNumE * 10 + 10 < numEvents) {
      updateEvents(eventSearchTerm, pageNumE + 1, reverseE);
      setPageNumE(pageNumE + 1);
    }
  };
  const decPageE = () => {
    if (pageNumE > 0) {
      updateEvents(eventSearchTerm, pageNumE - 1, reverseE);
      setPageNumE(pageNumE - 1);
    }
  };

  const handleReverse = () => {
    updateClasses(classSearchTerm, 0, !reverse);
    setReverse(!reverse);
    setPageNum(0);
  };

  const handleReverseE = () => {
    updateEvents(eventSearchTerm, 0, !reverseE);
    setReverseE(!reverseE);
    setPageNumE(0);
  };

  return (
    <VStack>
      <Flex
        w={"100%"}
        justify={"space-between"}
      >
        <Heading
          as="h1"
          size="lg"
          mb={4}
          alignSelf={"flex-start"}
          alignContent="center"
          fontWeight={700}
          fontSize={36}
        >
          <Button
            backgroundColor="transparent"
            fontSize={25}
            mb={1}
            onClick={() => navigate("/dashboard")}
          >
            <SlArrowLeft />
          </Button>
          Classes and Events
        </Heading>
        {/* <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="../bell.png"
        /> */}
        <IconButton
          icon={<FaRegBell />}
          size="lg"
          mt="-2"
          onClick={onOpen}
          ref={notifRef}
          aria-label="Notifications"
          bg="white"
        />
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />
      </Flex>
      <form
        onSubmit={handleClassSearch}
        style={{ width: "100%" }}
      >
        <HStack
          w="100%"
          pl={20}
        >
          <Input
            flex={4}
            h="36px"
            borderRadius="18px"
            placeholder="Search Classes"
            value={classSearchTerm}
            onChange={handleClassChange}
          ></Input>
          <Box flex={1} />
          <HStack gap={0}>
            <Text>
              {pageNum * 10 + 1}
              {" - "}
              {pageNum * 10 + classes.length}
              {" of "}
              {numClasses}
            </Text>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={decPage}
            >
              <SlArrowLeft />
            </Button>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={incPage}
            >
              <SlArrowRight />
            </Button>
            <Text>|</Text>
            <Button
              backgroundColor={reverse ? "gray.300" : "transparent"}
              p={0}
              onClick={handleReverse}
            >
              <PiArrowsDownUpFill />
            </Button>
          </HStack>
        </HStack>
      </form>
      <TableContainer
        w="100%"
        sx={{
          overflowX: "auto",
        }}
        pl={20}
        mb={10}
      >
        <Table colorScheme="gray">
          <Thead>
            <Tr>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Class
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
                width="15vw"
              >
                Teacher
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
                width="15vw"
              >
                Level
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Date
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {classes
              ? classes.map((cls, index) => (
                  <Tr
                    key={index}
                    onClick={() =>
                      navigate(`/dashboard/classes/${cls.id}/${cls.date}`)
                    }
                    backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                    _hover={{ bg: "gray.300", cursor: "pointer" }}
                    color="gray.700"
                  >
                    <Td
                      maxW="25vw"
                      minW="25vw"
                      width="25vw"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontFamily="Inter"
                    >
                      {cls.title}
                    </Td>
                    <Td fontFamily="Inter">{cls.teachers}</Td>
                    <Td fontFamily="Inter">{cls.level}</Td>
                    <Td fontFamily="Inter">
                      {cls.date ? formatDate(cls.date) : ""}
                    </Td>
                    <Td>
                      <Button
                        backgroundColor="transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // prevents earlier onclick
                          setSelectedClass(cls);
                          confirmDelete();
                        }}
                        m={-8} // overrides bounds of row
                        fontSize="28px"
                      >
                        <FiTrash2 />
                      </Button>
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
      <form
        onSubmit={handleEventSearch}
        style={{ width: "100%" }}
      >
        <HStack
          w="100%"
          pl={20}
        >
          <Input
            flex={4}
            h="36px"
            borderRadius="18px"
            placeholder="Search Events"
            value={eventSearchTerm}
            onChange={handleEventChange}
          ></Input>
          <Box flex={1} />
          <HStack gap={0}>
            <Text>
              {pageNumE * 10 + 1}
              {" - "}
              {pageNumE * 10 + events.length}
              {" of "}
              {numEvents}
            </Text>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={decPageE}
            >
              <SlArrowLeft />
            </Button>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={incPageE}
            >
              <SlArrowRight />
            </Button>
            <Text>|</Text>
            <Button
              backgroundColor={reverseE ? "gray.300" : "transparent"}
              p={0}
              onClick={handleReverseE}
            >
              <PiArrowsDownUpFill />
            </Button>
          </HStack>
        </HStack>
      </form>
      <TableContainer
        w="100%"
        sx={{
          overflowX: "auto",
        }}
        pl={20}
      >
        <Table colorScheme="gray">
          <Thead>
            <Tr>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Event
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
                width="20vw"
              >
                Level
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
                width="20vw"
              >
                Date
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {events
              ? events.map((ev, index) => (
                  <Tr
                    key={index}
                    onClick={() =>
                      navigate(`/dashboard/classes/event/${ev.id}`)
                    }
                    backgroundColor={index % 2 ? "white" : "gray.100"}
                    _hover={{ bg: "gray.300", cursor: "pointer" }}
                    color="gray.700"
                  >
                    <Td
                      maxW="25vw"
                      minW="25vw"
                      width="25vw"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontFamily="Inter"
                    >
                      {ev.title}
                    </Td>
                    <Td fontFamily="Inter">{ev.level}</Td>
                    <Td fontFamily="Inter">
                      {ev.date ? formatDate(ev.date) : ""}
                    </Td>
                    <Td>
                      <Button
                        backgroundColor="transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // prevents earlier onclick
                          setSelectedEvent(ev);
                          confirmDeleteEvent();
                        }}
                        m={-8} // overrides bounds of row
                        fontSize="28px"
                      >
                        <FiTrash2 />
                      </Button>
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "admin" ? "Admin" : "User"})
        </Text>
      </VStack>

      {currModal === "confirmation" ? (
        <ConfirmDeleteModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          itemType="Class"
        />
      ) : currModal === "confirmationEvent" ? (
        <ConfirmDeleteModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          itemType="Event"
        />
      ) : currModal === "toConfirm" ? (
        <ClassDeleteConfirmationModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          setCurrentModal={setModal}
          classData={selectedClass}
        />
      ) : currModal === "toConfirmEvent" ? (
        <EventDeleteConfirmationModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          setCurrentModal={setModal}
          eventData={selectedEvent}
        />
      ) : null}
    </VStack>
  );
}
