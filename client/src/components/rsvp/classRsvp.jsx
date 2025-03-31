import { 
  Box, Text, HStack, Heading, Flex, Avatar,
  Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, 
  Table, TableContainer, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react"

import { MdArrowBackIosNew } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const ClassRSVP = ({ isOpen, onClose, card }) => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [students, setStudents] = useState([]);
  const [teacherId, setTeacherId] = useState();

  useEffect(() => {
    const fetchTeacherId = async () => {
      try {
        const response = await backend.get(`/users/${currentUser.uid}`);
        const userId = response.data[0].id;
        setTeacherId(userId);
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };
  
    fetchTeacherId();
  }, [backend, currentUser.uid]);
  
  useEffect(() => {
    if (teacherId) {
      const fetchClasses = async () => {
        try {
          // const response = await backend.get(`/class-enrollments/teacher/${teacherId}/${card.id}`);
          const date = new Date(decodeURIComponent(card?.date)).toISOString().split("T")[0];
          const response = await backend.get(`/class-enrollments/class/${card?.id}/${date}`);
          console.log(response)
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      };
  
      fetchClasses();
    }
  }, [backend, teacherId, card, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <HStack justifyContent="center" position="relative">
            <Box position="absolute" left={0}><MdArrowBackIosNew onClick={onClose}/></Box>
            <Heading size="lg" textAlign="center">RSVP's for {card.name}</Heading>
          </HStack>
        </ModalHeader>
        <ModalBody px={0}>
          <TableContainer> {/* TODO: Rethink about using charkaUI table, idk if i want to use it */}
            <Table variant="unstyled">
              <Thead>
                <Tr borderBottom="1px solid #757575">
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold">Student</Th>
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold" textAlign="right">Checked In</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students && students.length > 0 ? students.map((user, index) => (
                  <Tr borderBottom="1px solid #757575" key={index}>
                    <Td px={0}>
                      <Flex align="center">
                        <Avatar mx={4} size="md" bg="gray.300"/>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">{user.firstName} {user.lastName}</Text>
                          <Text fontSize="xs">{user.email}</Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td p={0} textAlign="center">
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {user.attendance ? <FaCheckCircle color="green"/> : <FaTimesCircle color="red"/>}
                      </Box>
                    </Td>
                  </Tr>
                ))
                  : 
                  <Tr><Td>No students have RSVP'd</Td></Tr>
                }
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};