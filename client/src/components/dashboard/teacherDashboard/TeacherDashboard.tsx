import { useEffect, useRef, useState } from "react";

import {
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  HStack,
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

import { Link } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { StatusCard } from "../../resources/StatusCard";
import { NavigationSidebar } from "../NavigationSidebar";
import { NotificationPanel } from "../NotificationPanel";
import { RoleSelect } from "../RoleSelect";

export const TeacherDashboard = () => {
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [teacherClasses, setTeacherClasses] = useState(new Map());
  const notifRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/teachers/classes/");
        // console.log(response.data);
        setTeacherClasses(
          response.data.reduce((acc, item) => {
            const {
              teacherId,
              classId,
              firstName,
              lastName,
              email,
              isActivated,
              title,
            } = item;
            const key = JSON.stringify({
              id: teacherId,
              firstName,
              lastName,
              email,
              isActivated,
            }); // teacher + user
            // console.log(key);
            const value = { id: classId, title }; // class
            if (!acc.has(key))
              if (classId) acc.set(key, [value]);
              else acc.set(key, []);
            else acc.get(key).push(value);
            return acc;
          }, new Map())
        );
      } catch (error) {
        console.error("Error fetching teachers and classes:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <HStack alignItems={"flex-start"}>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto", marginTop: "30px" }}
      >
        <Flex direction="row" w={"100%"} justify={"space-between"}>
          <Heading alignSelf={"flex-start"}>Teachers</Heading>
          <Image
            alignSelf={"flex-end"}
            cursor="pointer"
            onClick={onOpen}
            ref={notifRef}
            src="../bell.png"
          />
        </Flex>
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />

        <VStack>
          <Text>
            Signed in as {currentUser?.email} (
            {role === "admin" ? "Admin" : "Teacher"})
          </Text>

          {role === "admin" ? (
            <ChakraLink
              as={Link}
              to={"/admin"}
            >
              Go to Admin Page
            </ChakraLink>
          ) : null}
          <Button onClick={logout}>Sign out</Button>
        </VStack>

        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Classes</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teacherClasses
                ? [...teacherClasses].map(([teacherString, classes], i) => {
                    const teacher = JSON.parse(teacherString);
                    return (
                      <Tr
                        key={i}
                        onClick={() => {
                          window.location.href =
                            "/dashboard/teachers/" + teacher.id;
                        }}
                      >
                        <Td>
                          {teacher.firstName} {teacher.lastName}
                        </Td>
                        <Td>{teacher.email}</Td>
                        <Td>
                          <VStack>
                            {classes.map((cls, j) => (
                              <Text key={j}>{cls.title}</Text>
                            ))}
                          </VStack>
                        </Td>
                        <Td>
                          <StatusCard status={teacher.isActivated} />
                        </Td>
                      </Tr>
                    );
                  })
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </HStack>
  );
};
