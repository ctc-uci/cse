import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FaRegBell } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { Attendance } from "../../types/attendance";
import { Class } from "../../types/legacy/class";
import { NotificationPanel } from "./NotificationPanel";
import cseLogo from "/dashboard/cseLogo.png";
import classesIcon from "/dashboard/sidebarImgs/classes.svg";
import dashboardIcon from "/dashboard/sidebarImgs/dashboard.svg";
import redirectIcon from "/dashboard/sidebarImgs/redirect.svg";
import settingsIcon from "/dashboard/sidebarImgs/settings.svg";
import studentsIcon from "/dashboard/sidebarImgs/students.svg";
import teachersIcon from "/dashboard/sidebarImgs/teachers.svg";

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const StatCard = ({ iconColor, label, value }: StatCardProps) => {
  return (
    <Flex
      p={4}
      borderRadius="md"
      shadow="md"
      direction="row"
      align="center"
      w={["100%", "30%"]}
      mb={[4, 0]}
    >
      <Flex direction="column">
        <Text
          fontSize="xl"
          color="black"
        >
          {label}
        </Text>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="black"
        >
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

export const Dashboard = () => {
  return (
    <Flex>
      <Sidebar />
      <Box
        ml="250px"
        p={5}
        w="100%"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export const DashboardHome = () => {
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [students, setStudents] = useState(0);
  const [classes, setClasses] = useState<Class[] | undefined>();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

  useEffect(() => {
    const getAttendanceRate = async () => {
      const response = await backend.get(`/class-enrollments/attendance`);

      setAttendanceRate(Number(response.data[0].attendanceRate));
      console.log(response.data[0].attendanceRate);
    };

    getAttendanceRate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await backend.get("/students/count");
        setStudents(Number(studentResponse.data[0].count));

        const classesResponse = await backend.get("/classes");
        setClasses(classesResponse.data);

        const attendanceResponse = await backend.get(
          "/class-enrollments/statistics"
        );
        const data = attendanceResponse.data;
        const graphInfo: Attendance[] = monthLabels.map((label) => {
          const found = data.find(
            (elem) => Number(elem.month) === monthLabels.indexOf(label) + 1
          );
          return found
            ? {
                month: monthLabels[Number(found.month) - 1],
                count: Number(found.count),
              }
            : { month: label, count: 0 };
        });
        console.log(graphInfo);
        setAttendance(graphInfo);
      } catch (error) {
        alert(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend]);
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  return (
    <Box w="100%">
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto", padding: 4 }}
      >
        <Flex
          w={"100%"}
          justify={"space-between"}
        >
          <Heading alignSelf="flex-start">Dashboard</Heading>
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

        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          direction={["column", "row"]}
          gap={4}
        >
          <StatCard
            icon="email"
            iconColor="blue.500"
            label="Students"
            value={students}
          />
          <StatCard
            icon="email"
            iconColor="green.500"
            label="Attendance Rate"
            value={`${Math.round(attendanceRate * 100)}%`} //to be changed
          />
          <StatCard
            icon="email"
            iconColor="purple.500"
            label="Classes Held"
            value={classes?.length || 0}
          />
        </Flex>

        <Flex
          direction="column"
          width="100%"
        >
          <Box
            alignItems="left"
            justifyContent="left"
            paddingLeft="35px"
            paddingTop="30px"
          >
            <Text
              fontSize="xl"
              color="black"
              fontWeight="bold"
              marginBottom="20px"
            >
              Attendance Over Time
            </Text>
          </Box>
          <Box
            w="100%"
            borderRadius="md"
            display="flex"
            position={"relative"}
            alignItems="center"
            justifyContent="center"
            paddingRight="20px"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={attendance}>
                <Line
                  type="linear"
                  dataKey="count"
                  stroke="purple.600"
                  dot={false}
                  strokeWidth={3}
                />
                <XAxis dataKey="month" />
                <YAxis />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Flex>

        <VStack>
          <Text>
            Signed in as {currentUser?.email} (
            {role === "admin" ? "Admin" : "User"})
          </Text>
          <Button onClick={logout}>sign out</Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      h="100vh"
      bg="#FEF7FF"
      w="250px"
      p={5}
      fontWeight={500}
      fontSize="16px"
    >
      <Flex
        flexDirection="column"
        gap={4}
        height="100%"
        marginTop="40px"
      >
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/dashboard")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={dashboardIcon} />
          <Text fontWeight={500}>Dashboard</Text>
        </Flex>
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/dashboard/classes")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={classesIcon} />
          <Text fontWeight={500}>Classes / Events</Text>
        </Flex>
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/dashboard/teachers")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={teachersIcon} />
          <Text fontWeight={500}>Teachers</Text>
        </Flex>
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/dashboard/students")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={studentsIcon} />
          <Text fontWeight={500}>Students</Text>
        </Flex>
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/bookings")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={redirectIcon} />
          <Text fontWeight={500}>Redirect to Teacher-End</Text>
        </Flex>
        <Flex
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "#F3D0F7" }}
          color="black"
          onClick={() => navigate("/dashboard/settings")}
          textAlign="left"
          align="center"
          gap={2}
        >
          <Image src={settingsIcon} />
          <Text fontWeight={500}>Settings</Text>
        </Flex>
        <Box
          flex={1}
          alignContent="center"
          textAlign="center"
        >
          <Image src={cseLogo} />
        </Box>
      </Flex>
    </Box>
  );
};
