import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaMicrophoneAlt, FaMusic } from "react-icons/fa";
import {
  GiAbstract001,
  GiBallerinaShoes,
  GiBoombox,
  GiCartwheel,
  GiTambourine,
} from "react-icons/gi";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { ProgressBar } from "./ProgressBar";

export const SelectClassModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  setClsId,
}) => {
  const [classes, setClasses] = useState([]);
  const [originalClasses, setOriginalClasses] = useState([]);
  const { backend } = useBackendContext();
  const [classId, setClassId] = useState("");
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const displayClasses = (query) => {
    return classes.filter((obj) => obj.name.includes(query));
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await backend.get("/classes/published");

        const formattedClasses = response.data.map((cls) => ({
          ...cls,
          rsvp: cls.rsvp ?? 0,
        }));

        // const classEnrollmentResp = await backend.get("/class-enrollments");
        // const classEnrollmentRespData = classEnrollmentResp.data;
        // for (let i = 0; i < classEnrollmentRespData.length; i++) {
        //   const classEnrollment = classEnrollmentRespData[i];
        //   //  console.log(classEnrollment)
        //   for (let j = 0; j < formattedClasses.length; j++) {
        //     if (formattedClasses[j].id === classEnrollment.classId) {
        //       formattedClasses[j].rsvp++;
        //     }
        //   }
        // }

        // setClassesObject(temp)
        // console.log(classesObject)

        setClasses(formattedClasses);
        setOriginalClasses(formattedClasses);
        // console.log(formattedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [backend]);

  const getIcon = (tagId) => {
    const iconSize = 50;
    switch (tagId) {
      case 1:
        return <FaMusic size={iconSize} />;
      case 2:
        return <GiBallerinaShoes size={iconSize} />;
      case 3:
        return <FaMicrophoneAlt size={iconSize} />;
      case 4:
        return <GiBoombox size={iconSize} />;
      case 5:
        return <GiAbstract001 size={iconSize} />;
      case 6:
        return <GiCartwheel size={iconSize} />;
      case 7:
        return <GiTambourine size={iconSize} />;
      default:
        return <FaMusic size={iconSize} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={4}>
          <Flex
            align="center"
            position="relative"
            justify="center"
          >
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<AiOutlineArrowLeft />}
              position="absolute"
              left={0}
              onClick={onClose}
            />
            <Text fontSize="xl">Select a class</Text>
          </Flex>
          <ProgressBar currStep={1} />
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Search for classes"
            onChange={(e) =>
              setClasses(
                originalClasses.filter((obj) =>
                  obj.title.includes(e.target.value)
                )
              )
            }
          />
          <VStack
            spacing={4}
            w="100%"
            mt={4}
            my={5}
            mb={20}
          >
            {classes.length > 0 ? (
              classes.map((cls, index) => (
                <Card
                  key={index}
                  onClick={() => {
                    setSelectedClass(cls);
                  }}
                  border="1px"
                  borderColor="gray.300"
                  bg={selectedClass === cls ? "gray.200" : "gray.50"}
                  transition="all 0.2s ease-in-out"
                  w={{ base: "100%", md: "30em" }}
                >
                  <CardBody px={0}>
                    <Box
                      position="absolute"
                      textAlign="center"
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                      height="20px"
                      top="10px"
                      right="5%"
                      px="16px"
                      py="2px"
                      borderRadius="full"
                      border="0.2px solid"
                      borderColor="purple.600"
                      color="purple.700"
                      backgroundColor="purple.50"
                      fontSize="10px"
                    >
                      <Text>
                        {cls.rsvp ?? 0}{" "}
                        {(cls.rsvp ?? 0) === 1 ? "Person" : "People"} Enrolled
                      </Text>
                    </Box>
                    <HStack>
                      <Box px="20px">{getIcon(cls.tagId)}</Box>
                      <VStack
                        alignItems="flex-start"
                        py="1rem"
                      >
                        <Text
                          fontSize="1.125rem"
                          fontWeight="bold"
                        >
                          {cls.title ? cls.title : "Title Not Available"}
                        </Text>

                        <Text fontSize="0.875rem">
                          {cls.location
                            ? cls.location
                            : "No Location Available"}
                          <br />
                          {cls.date
                            ? `${formatDate(cls.date)} ·
                             ${formatTime(cls.startTime)} - 
                             ${formatTime(cls.endTime)}`
                            : "No date"}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))
            ) : (
              <option disabled>No classes available</option>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          p={4}
          display="flex"
          justifyContent="center"
        >
          <Button
            colorScheme="purple"
            w="50%"
            onClick={() => {
              setClsId(selectedClass.id);
              setCurrentModal("form");
            }}
            isDisabled={!selectedClass}
          >
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
