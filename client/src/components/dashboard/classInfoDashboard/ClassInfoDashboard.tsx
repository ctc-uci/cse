import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Table,
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

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { DetailedClass } from "../../../types/scheduled_class";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { NotificationPanel } from "../NotificationPanel";

type AttendanceRecord = {
  firstName: string;
  lastName: string;
  email: string;
  attendance: Date;
};

export default function ClassInfoDashboard() {
  const navigate = useNavigate();
  const { classId, classDate } = useParams();
  const { backend } = useBackendContext();
  const [currentClass, setCurrentClass] = useState<DetailedClass | undefined>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [performances, setPerformances] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch class info
        const classesResponse = await backend.get(
          `/classes/scheduled/${classId}/${classDate}`
        );
        classesResponse.data[0].date = new Date(classDate || "");
        setCurrentClass(classesResponse.data[0]);

        // Fetch class attendances
        const attendanceResponse = await backend.get(
          `class-enrollments/class/${classId}/${classDate}`
        );
        setAttendance(attendanceResponse.data);
        // console.log(attendanceResponse.data);

        // Fetch performances from coreqs
        const performancesResponse = await backend.get(
          `classes/corequisites/${classId}`
        );
        setPerformances(
          performancesResponse.data.map(
            (performance: { title: string }) => performance.title
          )
        );
        console.log(performancesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, classId]);

  // const hardcodedCoreqs = ["Ballet I", "Contemporary I"]; // Hardcoded coreqs for now

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
            onClick={() => navigate("/dashboard/classes")}
          >
            <SlArrowLeft />
          </Button>
          {currentClass?.title}
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
          Title
        </Box>
        <Box
          flex={3}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.title}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Location
        </Box>
        <Box
          flex={3}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.location}
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
          Date
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.date.toLocaleDateString()}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Performances
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {performances.join(", ")}
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
          Start
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass ? formatTime(currentClass.startTime) : ""}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          End
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass ? formatTime(currentClass.endTime) : ""}
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
          Level
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.level}
        </Box>
        <Box
          flex={2}
          fontWeight={700}
          pr="60px"
          fontSize={18}
        >
          Description
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
          Capacity
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.capacity}
        </Box>
        <Box
          flex={2}
          pr="60px"
          fontSize={18}
        >
          {currentClass?.description}
        </Box>
      </HStack>

      <Box
        w="100%"
        mt="80px"
        pl="40px"
      >
        <Text
          fontWeight={500}
          fontSize={24}
          pl="20px"
        >
          Check-in Log
        </Text>

        <Box p={4}>
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
                  Name
                </Th>
                <Th
                  fontFamily="Inter"
                  fontWeight={700}
                  color="#4A5568"
                  letterSpacing="5%"
                  fontSize={18}
                  textTransform="none"
                >
                  Attended
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
                <Th
                  fontFamily="Inter"
                  fontWeight={700}
                  color="#4A5568"
                  letterSpacing="5%"
                  fontSize={18}
                  textTransform="none"
                >
                  Email
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendance.map((stud, index) => (
                <Tr
                  key={index}
                  backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                  _hover={{ bg: "gray.300", cursor: "pointer" }}
                  color="gray.700"
                >
                  <Td>
                    {stud.firstName} {stud.lastName}
                  </Td>
                  <Td>{stud.attendance !== null ? "Yes" : "No"}</Td>
                  <Td>{currentClass?.date.toLocaleDateString()}</Td>
                  <Td>{stud.email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
