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
import PublishedReviews from "../reviews/classReview";
import SuccessSignupModal from "./SuccessSignupModal";

const ClassInfoView = ({
  // userid,
  isOpenProp,
  title,
  location,
  // description,
  // level,
  date,
  // startTime,
  // endTime,
  id,
  // capacity,
  // costume,
  isCorequisiteSignUp,
  corequisites,
  handleClose,
  // modalIdentity,
  setModalIdentity,
  // filteredCorequisites,
  handleResolveCoreq = () => {},
  tags = [],
}) => {
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("");
  const [coClasses, setCoClasses] = useState([]);

  const getTeacherName = async () => {
    try {
      const teacherName = await backend.get(`/classes-taught/instructor/${id}`);
      if (teacherName?.data?.[0]) {
        setTeacherName(
          teacherName.data[0].firstName + " " + teacherName.data[0].lastName
        );
      }
    } catch (error) {
      console.error("Error fetching teacher name:", error);
    }
  };

  const getStartTime = async () => {
    try {
      const data = await backend.get(`/scheduled-classes/${id}`);
      if (data?.data?.[0]) {
        setStartTime(data.data[0].startTime);
        setEndTime(data.data[0].endTime);
      }
    } catch (error) {
      console.error("Error fetching start time:", error);
    }
  };

  const enrollInClass = async () => {
    try {
      const users = await backend.get(`/users/${currentUser.uid}`);
      if (users?.data?.[0]) {
        const req = await backend.post(`/class-enrollments`, {
          studentId: users.data[0].id,
          classId: id,
          attendance: null,
        });
        if (req.status === 201) {
          setOpenSuccessModal(true);
        }
      }
    } catch (error) {
      console.error("Error enrolling in class:", error);
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const classSignUp = async () => {
    if (isCorequisiteSignUp) {
      enrollInClass();
      return;
    }
    // if there exisits a coreq and not enrolled in a coreq,
    if (corequisites.some((coreq) => !coreq.enrolled)) {
      // let coReqWarningModal know that it should programatically display an event info modal version
      setModalIdentity("class");
      handleResolveCoreq();
    } else {
      enrollInClass();
    }
  };

  const initClass = async () => {
    try {
      const classData = await backend.get(`/classes/${id}`);
      if (classData?.data?.[0]) {
        setDescription(classData.data[0].description);
        setCapacity(classData.data[0].capacity);
        setLevel(classData.data[0].level);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const getCoClasses = async () => {
    try {
      const response = await backend.get(`/corequisites/class/${id}`);
      if (response?.data) {
        setCoClasses(response.data);
      }
    } catch (error) {
      console.error("Error fetching co-classes:", error);
    }
  };

  useEffect(() => {
    if (isOpenProp) {
      getTeacherName();
      getStartTime();
      initClass();
      getCoClasses();
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
            <Text>Taught by {teacherName ? teacherName : "Unknown"}</Text>
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
            <Text>Location: {location}</Text>
            <br /> <Divider orientation="horizontal" /> <br />
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
            <br /> <Divider orientation="horizontal" /> <br />
            <VStack
              spacing={4}
              align="center"
              w="100%"
            >
              <Box>
                <Text
                  fontWeight={"bold"}
                  mb="1"
                >
                  Recommended Prerequisite(s)
                </Text>
                <Text
                  fontSize="sm"
                  mb={2}
                >
                  We recommend taking these classes before enrolling in this
                  series.
                </Text>
                {coClasses && coClasses.length > 0 ? (
                  <Box>
                    {coClasses.map((prerequisite) => (
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
              <Box>
                <Text
                  fontWeight="bold"
                  mb="1"
                >
                  Performance(s)
                </Text>
                <Text
                  fontSize={"sm"}
                  mb={2}
                >
                  At the end of the class period, students will perform in a
                  final performance.
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
                    No performances for this class
                  </Text>
                )}
              </Box>
            </VStack>
            <br />
            <Divider orientation="horizontal" />
            <br />
            {role === "student" && (
              <Button
                width="100%"
                py={3}
                bg="purple.600"
                color="white"
                onClick={classSignUp}
              >
                Sign Up
              </Button>
            )}
            <br />
            <PublishedReviews classId={id} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClassInfoView;
