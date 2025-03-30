import { Icon, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Flex, Text, VStack } from "@chakra-ui/react";

import { BsCheck } from "react-icons/bs";

export const TeacherConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <VStack>
          <Flex paddingTop={10} justifyContent="center" w="100%" position="relative">
            <Icon as={BsCheck} boxSize="75vw" backgroundColor="#D9D9D9" borderRadius="full" color="#323232"></Icon>
          </Flex>
          <Text fontSize="28px" fontWeight="bold">Class Deleted</Text>
        <ModalFooter>
          <Button backgroundColor="#D9D9D9" padding={7} onClick={onClose}>
            Back to Booked Classes Page
          </Button>
        </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};