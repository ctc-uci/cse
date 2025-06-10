import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Table,
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

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { NotificationPanel } from "../NotificationPanel";

export const StudentInfoDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifRef } = useRef();
  const { backend } = useBackendContext();

  const navigate = useNavigate();
  const { id } = useParams(); // must have the same name as url parameter
  const [classes, setClasses] = useState([]);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for specific student
        const response = await backend.get(`/students/${id}`);
        setStudent(response.data);

        // Fetch classes for enrolled student
        const classesResponse = await backend.get(`/students/joined/${id}`);
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [backend, id]);

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
            onClick={() => navigate("/dashboard/students")}
          >
            <SlArrowLeft />
          </Button>
          {student?.firstName} {student?.lastName}
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
          {student?.firstName}
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
          {student?.lastName}
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
          {student?.email}
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
            {classes.map((cls, index) => (
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
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
