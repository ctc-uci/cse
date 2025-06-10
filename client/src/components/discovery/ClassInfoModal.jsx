import { memo, useEffect, useState } from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaPencilAlt, FaTimesCircle } from "react-icons/fa";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import PublishedReviews from "../reviews/classReview";
import SuccessSignupModal from "./SuccessSignupModal";

const ClassInfoModal = ({
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

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("");
  const [coClasses, setCoClasses] = useState([]);

  const getTeacherName = async () => {
    const teacherName = await backend.get(`/classes-taught/instructor/${id}`);
    setTeacherName(
      teacherName.data[0].firstName + " " + teacherName.data[0].lastName
    );
  };

  const getStartTime = async () => {
    const data = await backend.get(`/scheduled-classes/${id}`);
    setStartTime(data.data[0].startTime);
    setEndTime(data.data[0].endTime);
  };

  const enrollInClass = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments`, {
        studentId: users.data[0].id,
        classId: id,
        attendance: null,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
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
    const classData = await backend.get(`/classes/${id}`);
    setDescription(classData.data[0].description);
    setCapacity(classData.data[0].capacity);
    setLevel(classData.data[0].level);
  };

  const getCoClasses = async () => {
    const response = await backend.get(`/corequisites/class/${id}`);
    setCoClasses(response.data);
  };

  useEffect(() => {
    if (isOpenProp) {
      getTeacherName();
      getStartTime();
      initClass();
      getCoClasses();
    }
  }, [isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        size={"full"}
        isOpen={isOpenProp}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent paddingRight="5vw">
          <ModalHeader>
            <VStack align="start">
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={handleClose}
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
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
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
                  >
                    <em>No prerequisites for this class</em>
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
                  >
                    <em>No performances for this class</em>
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
          <Flex
            justifyContent="center"
            width="100%"
          >
            <ModalFooter>
              {role === "student" && (
                <Button
                  width="100%"
                  p={7}
                  bg="purple.600"
                  color="white"
                  onClick={classSignUp}
                >
                  Sign up
                </Button>
              )}
            </ModalFooter>
          </Flex>
          <PublishedReviews classId={id} />
        </ModalContent>
        {/* <PublishedReviews
          title={title}
          location={location}
          description={description}
          level={level}
          date={date}
          id={id}
        ></PublishedReviews> */}
      </Modal>
    </>
  );
};

export default ClassInfoModal;
