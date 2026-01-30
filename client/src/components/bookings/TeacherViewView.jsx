import { memo, useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import { MdMoreHoriz } from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import PublishedReviews from "../reviews/classReview";
import { ClassRSVP } from "../rsvp/classRsvp.jsx";
import { QRCode } from "./teacherView/qrcode/QRCode.jsx";

export const TeacherViewView = memo(
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
    const routerLocation = useLocation();
    const navigate = useNavigate();
    const [instructorName, setInstructorName] = useState("");

    const fetchInstructor = async () => {
      if (!classData?.id || !isOpen) {
        return;
      }
      try {
        const res = await backend.get(
          `/classes-taught/instructor/${classData.id}`
        );
        if (res?.data?.[0]) {
          const { firstName, lastName } = res.data[0];
          setInstructorName(`${firstName} ${lastName}`);
        }
      } catch (err) {
        console.error("Failed to fetch instructor:", err);
        setInstructorName("Unavailable");
      }
    };

    useEffect(() => {
      if (isOpen) {
        fetchInstructor();
      }
    }, [backend, classData?.id, magic, isOpen]);

    // Close the view when navigating away from bookings
    useEffect(() => {
      if (isOpen && routerLocation.pathname !== "/bookings") {
        onClose();
      }
    }, [routerLocation.pathname, isOpen, onClose]);

    // Close the view when location state changes (force refresh from navbar)
    useEffect(() => {
      if (isOpen && routerLocation.state?.forceRefresh) {
        onClose();
        // Clear the forceRefresh state to prevent it from affecting future opens
        navigate(routerLocation.pathname, { replace: true, state: {} });
      }
    }, [routerLocation.state, isOpen, onClose, navigate, routerLocation.pathname]);

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

    if (!isOpen) {
      return null;
    }

    return (
      <>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="gray.50"
          zIndex={1000}
          overflowY="auto"
          pb={20}
        >
          <Box
            maxW="100%"
            px={6}
            py={4}
          >
            <HStack
              justify="space-between"
              mb={4}
            >
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Back"
                variant="ghost"
                fontSize={"2xl"}
                p={4}
                ml={-4}
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
            <Box>
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
            </Box>
          </Box>
        </Box>
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
