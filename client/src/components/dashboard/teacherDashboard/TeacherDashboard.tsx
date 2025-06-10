import { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
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

import { debounce, set } from "lodash";
import { FaRegBell } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { StatusCard } from "../../resources/StatusCard";
import { NotificationPanel } from "../NotificationPanel";
import { RoleSelect } from "../RoleSelect";

export const TeacherDashboard = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const navigate = useNavigate();

  const [pageNum, setPageNum] = useState<number>(0);
  const [teachers, setTeachers] = useState([]);
  const [numTeachers, setNumTeachers] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reverse, setReverse] = useState<boolean>(false);
  const notifRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        updateTeachers("", 0, false);
      } catch (error) {
        console.error("Error fetching teachers and classes:", error);
      }
    };

    fetchData();
  }, [backend]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateTeachers(searchTerm, 0, false);
    setReverse(false);
    setPageNum(0);
  };

  const updateTeachers = async (
    term: string,
    page: number,
    reverse: boolean
  ) => {
    try {
      const response = await backend.get("/teachers/classes/", {
        params: { search: term.trim(), page: page, reverse: reverse },
      });
      setTeachers(response.data);

      const countResponse = await backend.get("/teachers/classes/count/", {
        params: { search: term.trim() },
      });
      setNumTeachers(countResponse.data[0].count);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value); // Only runs after not typing for 500ms
  };

  const incPage = () => {
    if (pageNum * 10 + 10 < numTeachers) {
      updateTeachers(searchTerm, pageNum + 1, reverse);
      setPageNum(pageNum + 1);
    }
  };
  const decPage = () => {
    if (pageNum > 0) {
      updateTeachers(searchTerm, pageNum - 1, reverse);
      setPageNum(pageNum - 1);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.length >= 2 || term.length === 0) {
        updateTeachers(term, 0, false);
        setReverse(false);
        setPageNum(0);
      }
    }, 500),
    []
  );

  const handleReverse = () => {
    updateTeachers(searchTerm, 0, !reverse);
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
          Teachers
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
              {pageNum * 10 + 10 < teachers.length
                ? pageNum * 10 + 10
                : teachers.length}
              {" of "}
              {numTeachers}
            </Text>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={decPage}
              // disabled={pageNum === 0}
            >
              <SlArrowLeft />
            </Button>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={incPage}
              // disabled={pageNum * 10 + 10 >= numTeachers}
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
                Teacher
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
                Status
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
            {teachers
              ? teachers.map((teacher, index) => {
                  return (
                    <Tr
                      key={teacher.id}
                      onClick={() =>
                        navigate(`/dashboard/teachers/${teacher.id}`)
                      }
                      backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                      _hover={{ bg: "gray.300", cursor: "pointer" }}
                      color="gray.700"
                    >
                      <Td>
                        {teacher.firstName} {teacher.lastName}
                      </Td>
                      <Td>{teacher.email}</Td>
                      <Td>
                        <StatusCard status={teacher.isActivated} />
                      </Td>
                      <Td>{teacher.classCount}</Td>
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
                  );
                })
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
