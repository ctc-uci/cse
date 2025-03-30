import React from "react";

import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { DetailedClass } from "../../../types/scheduled_class";

function ClassInfoDashboard() {
  const { classId } = useParams();
  const { backend } = useBackendContext();
  const [currentClass, setcurrentClass] = React.useState<
    DetailedClass | undefined
  >();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await backend.get(`/classes/joined/${classId}`);
        classesResponse.data[0].date = new Date(classesResponse.data[0].date);
        setcurrentClass(classesResponse.data[0]);
        // console.log(classesResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, classId]);

  const hardcodedCoreqs = ["Ballet I", "Contemporary I"]; // Hardcoded coreqs for now

  return (
    <Box p={4}>
      <Heading
        as="h2"
        size="xl"
        mb={4}
      >
        Class Information
      </Heading>
      <VStack
        spacing={4}
        align="stretch"
      >
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            value={currentClass?.location || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={currentClass?.description || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Capacity</FormLabel>
          <Input
            value={currentClass?.capacity || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Level</FormLabel>
          <Input
            value={currentClass?.level || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            value={currentClass?.date.toLocaleDateString() || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Start Time</FormLabel>
          <Input
            value={currentClass?.startTime || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Time</FormLabel>
          <Input
            value={currentClass?.endTime || ""}
            isDisabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>Corequisites</FormLabel>
          <Input
            value={hardcodedCoreqs.join(", ")}
            isDisabled
          />
        </FormControl>
      </VStack>
      <AttendanceLogTable />
    </Box>
  );
}
export default ClassInfoDashboard;

const AttendanceLogTable = () => {
  const sampleData = [
    { name: "John Doe", attended: "Yes", date: new Date("2025-01-15") },
    { name: "Jane Smith", attended: "Yes", date: new Date("2025-01-15") },
    { name: "Mike Johnson", attended: "Yes", date: new Date("2025-01-15") },
  ];

  return (
    <Box p={4}>
      <Heading
        as="h2"
        size="xl"
        mb={4}
      >
        Attendance Log
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Attended</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sampleData.map((record, index) => (
            <Tr key={index}>
              <Td>{record.name}</Td>
              <Td>{record.attended}</Td>
              <Td>{record.date.toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
