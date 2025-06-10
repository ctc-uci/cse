import { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
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

import { debounce } from "lodash";
import { FaRegBell } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { NotificationPanel } from "../NotificationPanel";

export const StudentDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifRef } = useRef();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [pageNum, setPageNum] = useState(0);
  const [numStudents, setNumStudents] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [students, setStudents] = useState([]);
  const [classCount, setClassCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateStudents(searchTerm, pageNum, reverse);

        const classCountResponse = await backend.get(
          "/class-enrollments/student-class-count"
        );
        setClassCount(classCountResponse.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [backend]);

  const handleSearch = async (e) => {
    e.preventDefault();

    updateStudents(searchTerm, 0, false);
    setReverse(false);
    setPageNum(0);
  };

  const updateStudents = async (term, page, reverse) => {
    try {
      const response = await backend.get("/students", {
        params: { search: term.trim(), page: page, reverse: reverse },
      });
      setStudents(response.data);

      const studentCountResponse = await backend.get("/students/count", {
        params: { search: term.trim() },
      });
      setNumStudents(studentCountResponse.data[0].count);
      console.log(studentCountResponse.data[0].count);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value); // Only runs after not typing for 500ms
  };

  const incPage = () => {
    if (pageNum * 10 + 10 < numStudents) {
      updateStudents(searchTerm, pageNum + 1, reverse);
      setPageNum(pageNum + 1);
    }
  };
  const decPage = () => {
    if (pageNum > 0) {
      updateStudents(searchTerm, pageNum - 1, reverse);
      setPageNum(pageNum - 1);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.length >= 2 || term.length === 0) {
        setPageNum(0);
        setReverse(false);
        updateStudents(term, 0, false);
      }
    }, 500),
    []
  );

  const handleReverse = () => {
    updateStudents(searchTerm, pageNum, !reverse);
    setReverse(!reverse);
    setPageNum(0);
  };

  return (
    <VStack>
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
            onClick={() => navigate("/dashboard")}
          >
            <SlArrowLeft />
          </Button>
          Students
        </Heading>
        {/* <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="../bell.png"
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
      <form
        onSubmit={handleSearch}
        style={{ width: "100%" }}
      >
        <HStack
          w="100%"
          pl={20}
        >
          <Input
            flex={4}
            h="36px"
            borderRadius="18px"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          ></Input>
          <Box flex={1} />
          <HStack gap={0}>
            <Text>
              {pageNum * 10 + 1}
              {" - "}
              {pageNum * 10 + students.length}
              {" of "}
              {numStudents}
            </Text>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={decPage}
            >
              <SlArrowLeft />
            </Button>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={incPage}
            >
              <SlArrowRight />
            </Button>
            <Text>|</Text>
            <Button
              backgroundColor={reverse ? "gray.300" : "transparent"}
              p={0}
              onClick={handleReverse}
            >
              <PiArrowsDownUpFill />
            </Button>
          </HStack>
        </HStack>
      </form>
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
                Student
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
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Classes
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {students
              ? students
                  // .slice(pageNum * 10, pageNum * 10 + 10)
                  .map((stud, index) => (
                    <Tr
                      key={stud.id}
                      onClick={() => navigate(`/dashboard/students/${stud.id}`)}
                      backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                      _hover={{ bg: "gray.300", cursor: "pointer" }}
                      color="gray.700"
                    >
                      <Td>
                        {stud.firstName} {stud.lastName}
                      </Td>
                      <Td>{stud.email}</Td>
                      <Td>
                        {classCount.find((elem) => elem.id === stud.id)
                          ?.count ?? 0}
                      </Td>
                      <Td>
                        <Button
                          backgroundColor="transparent"
                          onClick={(e) => {
                            e.stopPropagation(); // prevents earlier onclick
                          }}
                          m={-8} // overrides bounds of row
                          fontSize="28px"
                        >
                          <FiTrash2 />
                        </Button>
                      </Td>
                    </Tr>
                  ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
