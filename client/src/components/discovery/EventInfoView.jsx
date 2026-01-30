import { memo, useEffect, useState } from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Image,
  List,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import SuccessSignupModal from "./SuccessSignupModal";

const EventInfoView = ({
  user,
  isOpenProp,
  handleClose,
  title,
  location,
  description,
  level,
  date,
  id,
  capacity,
  // costume,
  isCorequisiteSignUp,
  corequisites,
  // modalIdentity,
  setModalIdentity,
  tags = [],
  handleResolveCoreq = () => {},
}) => {
  const { backend } = useBackendContext();
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [callTime, setCallTime] = useState("");

  const getStartTime = async () => {
    try {
      const data = await backend.get(`/events/${id}`);
      if (data?.data?.[0]) {
        setStartTime(data.data[0].startTime);
        setEndTime(data.data[0].endTime);
        setCallTime(data.data[0].callTime);
      }
    } catch (error) {
      console.error("Error fetching event time:", error);
    }
  };

  const enrollInEvent = async () => {
    try {
      if (!user?.data?.[0]?.id) {
        return;
      }
      // Check if already checked into event
      const currentCheckIn = await backend.get(`/event-enrollments/test`, {
        params: {
          student_id: user.data[0].id,
          event_id: id,
        },
      });
      if (user.data[0] && !currentCheckIn.data.exists) {
        const req = await backend.post(`/event-enrollments/`, {
          student_id: user.data[0].id,
          event_id: id,
          attendance: null,
        });
        if (req.status === 201) {
          setOpenSuccessModal(true);
        }
      } else {
        console.log("Already signed up for this event!");
      }
    } catch (error) {
      console.error("Error enrolling in event:", error);
    }
  };

  const eventSignUp = async () => {
    if (isCorequisiteSignUp) {
      enrollInEvent();
      return;
    }

    if (corequisites.some((coreq) => !coreq.enrolled)) {
      // let coReqWarningModal know that it should programatically display an event info modal version
      setModalIdentity("event");
      handleResolveCoreq();
    } else {
      enrollInEvent();
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  useEffect(() => {
    if (isOpenProp) {
      getStartTime();
    }
  }, [isOpenProp]);

  // Close the view when navigating away from discovery
  useEffect(() => {
    if (isOpenProp && routerLocation.pathname !== "/discovery") {
      handleClose();
    }
  }, [routerLocation.pathname, isOpenProp, handleClose]);

  // Close the view when location state changes (force refresh from navbar)
  useEffect(() => {
    if (isOpenProp && routerLocation.state?.forceRefresh) {
      handleClose();
      // Clear the forceRefresh state to prevent it from affecting future opens
      navigate(routerLocation.pathname, { replace: true, state: {} });
    }
  }, [routerLocation.state, isOpenProp, handleClose, navigate, routerLocation.pathname]);

  if (!isOpenProp) {
    return null;
  }

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="white"
        zIndex={1000}
        overflowY="auto"
        pb={20}
      >
        <Box
          maxW="100%"
          px={6}
          py={4}
        >
          <VStack
            align="start"
            spacing={4}
            mb={4}
          >
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              aria-label="Back"
              variant="ghost"
              fontSize={"2xl"}
              p={4}
              ml={-4}
            />
            <List>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  mr={1}
                  mb={1}
                  mt={1}
                  borderRadius={"full"}
                  bg="white"
                  textColor="gray.600"
                  borderColor={"gray.300"}
                  borderWidth={1}
                >
                  {tag.tag}
                </Tag>
              ))}
            </List>
            <Text
              justifyContent="center"
              wordBreak={"break-word"}
              fontWeight={"bold"}
            >
              {title}
            </Text>
          </VStack>
          <Box>
            <Text>
              {description
                ? `Description: ${description}`
                : "No description available."}
            </Text>{" "}
            <br />
            <Divider orientation="horizontal" /> <br />
            <Text color="#553C9A">
              {formatDate(date)} · {formatTime(startTime)} –{" "}
              {formatTime(endTime)}
            </Text>
            <Text>Call Time: {formatTime(callTime)}</Text>
            <Text>Location: {location}</Text>
            <br /> <Divider orientation="horizontal" /> <br />
            <VStack
              spacing={4}
              align="center"
            >
              <HStack
                spacing={4}
                width={"100%"}
              >
                <Box width="50%">
                  <Text fontWeight="bold">Level</Text>
                  <Text>{level}</Text>
                </Box>
                <Box width="50%">
                  <Text fontWeight="bold">Capacity</Text>
                  <Text>{capacity}</Text>
                </Box>
              </HStack>
              <br />
              <Divider orientation="horizontal" />
              <HStack width="100%">
                <Box>
                  <Text
                    fontWeight="bold"
                    mb="1"
                  >
                    Included Classes
                  </Text>
                  <Text
                    mb={2}
                    fontSize="sm"
                  >
                    All classes that will be participating in this performance.
                  </Text>

                  {corequisites && corequisites.length > 0 ? (
                    <Box>
                      {corequisites.map((prerequisite) => (
                        <Tag
                          borderRadius={"full"}
                          bg="purple.200"
                          textColor={"purple.800"}
                          m={1}
                          key={prerequisite.id}
                        >
                          {prerequisite.title}
                        </Tag>
                      ))}
                    </Box>
                  ) : (
                    <Text
                      mt={1}
                      fontSize={"md"}
                      fontStyle="italic"
                    >
                      No prerequisites for this class
                    </Text>
                  )}
                </Box>
              </HStack>
            </VStack>
            <br />
            <Divider orientation="horizontal" />
            <br />
            <Button
              width="100%"
              py={3}
              bg="purple.600"
              color="white"
              onClick={eventSignUp}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EventInfoView;
