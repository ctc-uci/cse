import { Text, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Flex } from "@chakra-ui/react";

export const TeacherCancelModal = ({ isOpen, onClose, setCurrentModal, classData }) => {
  const onGoBack = () => {
    setCurrentModal("view");
  };
  const onConfirm = () => {
    setCurrentModal("confirmation");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">A
          re you sure you want to delete this class?</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Text>You are deleting {classData.title}.</Text>
          <Text>This action can't be undone.</Text>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="100%">
            <Button backgroundColor="#D9D9D9" mr={3} onClick={onGoBack}>
            <Text>Close</Text>
            </Button>
            <Button backgroundColor="#D9D9D9" mr={3} onClick={onConfirm}>
              <Text fontWeight="bold">Delete</Text>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
};