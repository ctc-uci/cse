import { memo, useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import { BsChevronLeft } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import PublishedReviews from "../reviews/classReview";
import { ClassRSVP } from "../rsvp/classRsvp.jsx";
import { QRCode } from "./teacherView/qrcode/QRCode.jsx";

export const TeacherViewModal = memo(
  ({
    isOpen,
    onClose,
    setCurrentModal,
    classData,
    performances,
    tags,
    magic,
  }) => {
    const { backend } = useBackendContext();
    const [instructorName, setInstructorName] = useState("");

    const fetchInstructor = async () => {
      if (!classData?.id || !isOpen) {
        return;
      }
      try {
        const res = await backend.get(
          `/classes-taught/instructor/${classData.id}`
        );
        if (res.data) {
          const { firstName, lastName } = res.data[0];
          setInstructorName(`${firstName} ${lastName}`);
        }
      } catch (err) {
        console.error("Failed to fetch instructor:", err);
        setInstructorName("Unavailable");
      }
    };

    useEffect(() => {
      if (!isOpen) {
        return;
      }
      fetchInstructor();
    }, [backend, classData?.id, magic]);

    const onCancel = () => {
      setCurrentModal("cancel");
    };

    const enterEditMode = () => {
      setCurrentModal("edit");
    };

    const {
      isOpen: isRSVPOpen,
      onOpen: onRSVPOpen,
      onClose: onRSVPClose,
    } = useDisclosure();

    return (
      <>
        <Modal
          size="full"
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <HStack justify="space-between">
                  <AiOutlineArrowLeft
                    cursor="pointer"
                    onClick={onClose}
                  />
                  <Menu bg="gray.50">
                    <MenuButton
                      bg="gray.50"
                      as={IconButton}
                      icon={<MdMoreHoriz />}
                    />
                    <MenuList
                      backgroundColor="gray.100"
                      p={0}
                      minW="auto"
                      w="110px"
                      h="80px"
                    >
                      <MenuItem
                        value="edit"
                        onClick={enterEditMode}
                        background="transparent"
                      >
                        <BiSolidEdit style={{ marginRight: "6px" }} />
                        Edit
                      </MenuItem>
                      <MenuItem
                        value="delete"
                        onClick={onCancel}
                        background="transparent"
                      >
                        <BiTrash style={{ marginRight: "6px" }} />
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </ModalHeader>
              <ModalBody bg="gray.50">
                <VStack>
                  <Box
                    bg="white"
                    h="100%"
                    w="100%"
                    mb="4"
                    p="4"
                    boxShadow="md"
                    borderRadius="lg"
                  >
                    <Center>
                      <QRCode
                        id={classData?.id}
                        type="Class"
                      ></QRCode>
                    </Center>
                    <Box
                      width="100%"
                      align="center"
                    >
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                      >
                        {" "}
                        {classData?.attendeeCount
                          ? classData?.attendeeCount
                          : 0}{" "}
                        People Enrolled
                      </Text>
                      <Button
                        onClick={onRSVPOpen}
                        variant="unstyled"
                        fontSize="lg"
                        fontWeight="normal"
                        color="black"
                        textDecoration="underline"
                        _focus={{ boxShadow: "none" }}
                      >
                        <u>View Attendees</u>
                      </Button>
                    </Box>
                  </Box>
                </VStack>

                <VStack
                  spacing={4}
                  align="center"
                >
                  <Flex
                    pt={4}
                    width="100%"
                    justifyContent="flex-start"
                  >
                    <Box
                      border="1px"
                      borderColor="gray.300"
                      borderRadius="full"
                      px={4}
                    >
                      <Text fontSize="sm">
                        {tags[0]?.tag ? tags[0].tag : "No tags"}
                      </Text>
                    </Box>
                  </Flex>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    width="100%"
                  >
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      wordBreak={"break-word"}
                    >
                      {classData?.title}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    width="100%"
                  >
                    <Text fontSize="md">Taught by {instructorName}</Text>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    width="100%"
                  >
                    <Text fontSize="md">{classData?.description}</Text>
                  </Box>
                  <Divider
                    borderColor="gray.400"
                    borderWidth="1px"
                    my={4}
                  />

                  <Box width="100%">
                    <Text
                      color="purple.700"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      {formatDate(classData?.date)} ·{" "}
                      {classData?.startTime
                        ? formatTime(classData?.startTime)
                        : "TBD"}{" "}
                      -{" "}
                      {classData?.endTime
                        ? formatTime(classData?.endTime)
                        : "TBD"}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    width="100%"
                  >
                    <Text fontSize="md">{classData?.location}</Text>
                  </Box>
                  <Divider
                    borderColor="gray.400"
                    borderWidth="1px"
                    my={4}
                  />
                  <HStack
                    width="100%"
                    justify="space-between"
                    align="start"
                    mt={4}
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        mb="0.5rem"
                        fontSize="lg"
                      >
                        Level
                      </Text>
                      <Text fontSize="md">
                        {classData?.level.charAt(0).toUpperCase() +
                          classData?.level.slice(1)}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        mr="20"
                        fontWeight="bold"
                        mb="0.5rem"
                        fontSize="lg"
                      >
                        Capacity
                      </Text>
                      <Text fontSize="md">{classData?.capacity}</Text>
                    </Box>
                  </HStack>
                  <Divider
                    borderColor="gray.400"
                    borderWidth="1px"
                    my={4}
                  />
                  <Box>
                    <Text
                      mr="20"
                      fontWeight="bold"
                      mb="0.5rem"
                    >
                      Recommended Prerequisite(s)
                    </Text>
                    <Text>
                      We recommend taking these classes before enrolling in this
                      series.
                    </Text>

                    {classData?.prerequisites &&
                    classData?.prerequisites.length > 0 ? (
                      <Text fontSize="md">
                        {classData?.prerequisites.map((prerequisite) => (
                          <Tag
                            borderRadius={"full"}
                            bg="purple.200"
                            textColor={"purple.800"}
                            key={prerequisite.id}
                          >
                            {prerequisite.title}
                          </Tag>
                        ))}
                      </Text>
                    ) : (
                      <Text>No prerequisites for this class</Text>
                    )}
                  </Box>
                  <Box>
                    <Text
                      mr="20"
                      fontWeight="bold"
                      mb="0.5rem"
                    >
                      Performance(s)
                    </Text>
                    <Text mb={3}>
                      At the end of the class period, students will perform in a
                      final performance.
                    </Text>
                    {performances.map((performance) => (
                      <Tag
                        borderRadius={"full"}
                        bg="purple.200"
                        textColor={"purple.800"}
                        key={performance.id}
                      >
                        {performance.title}
                      </Tag>
                    ))}
                  </Box>
                  <Divider
                    borderColor="gray.400"
                    borderWidth="1px"
                    my={4}
                  />
                  <PublishedReviews classId={classData?.id} />
                </VStack>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
        <ClassRSVP
          isOpen={isRSVPOpen}
          onClose={onRSVPClose}
          card={{
            id: classData?.id,
            name: classData?.title,
            date: classData?.date,
          }}
        />
      </>
    );
  }
);
