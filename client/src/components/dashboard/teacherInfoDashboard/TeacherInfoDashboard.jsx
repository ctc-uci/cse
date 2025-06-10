import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
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

import { FaRegBell } from "react-icons/fa";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { LevelCard } from "../../resources/LevelCard";
import { StatusCard } from "../../resources/StatusCard";
import { NotificationPanel } from "../NotificationPanel";
import { RoleSelect } from "../RoleSelect";

export const TeacherInfoDashboard = () => {
  const { teacherId } = useParams();
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const notifRef = useRef();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [classStudents, setClassStudents] = useState(new Map());
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/teachers/" + teacherId);
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
      try {
        const response = await backend.get(
          "/classes/students/teacher/" + teacherId
        );
        setClassStudents(
          response.data.reduce((acc, item) => {
            const {
              classId,
              studentId,
              title,
              classLevel,
              capacity,
              isDraft,
              firstName,
              lastName,
            } = item;
            const key = JSON.stringify({
              id: classId,
              title,
              level: classLevel,
              capacity,
              isDraft,
            }); // class
            const value = { id: studentId, firstName, lastName }; // student + user
            if (!acc.has(key))
              if (studentId) acc.set(key, [value]);
              else acc.set(key, []);
            else acc.get(key).push(value);
            return acc;
          }, new Map())
        );
      } catch (error) {
        console.error(
          "Error fetching classes and students for teacher:",
          error
        );
      }
    };

    fetchData();
  }, [backend]);

  return (
    <VStack gap="30px">
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
            onClick={() => navigate("/dashboard/teachers")}
          >
            <SlArrowLeft />
          </Button>
          {teacher?.firstName} {teacher?.lastName}
        </Heading>
        {/* <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="/bell.png"
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
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          First Name
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {teacher?.firstName}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Last Name
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {teacher?.lastName}
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Email
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {teacher?.email}
        </Box>
        <Box flex={1} />
        <Box flex={1} />
      </HStack>

      <Box
        w="100%"
        pl="60px"
      >
        <Text
          fontWeight={500}
          fontSize={24}
        >
          Associated Classes
        </Text>
      </Box>
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
                Class
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
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
                Location
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {classStudents
              ? [...classStudents].map(([classString, students], index) => {
                  const cls = JSON.parse(classString);
                  return (
                    <Tr
                      key={cls.id}
                      backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                      _hover={{ bg: "gray.300", cursor: "pointer" }}
                      color="gray.700"
                    >
                      <Td fontFamily="Inter">{cls.title}</Td>
                      <Td fontFamily="Inter">{cls.level}</Td>
                      <Td fontFamily="Inter">{/** LOCATION **/}</Td>
                    </Tr>
                  );
                })
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
