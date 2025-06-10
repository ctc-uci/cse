import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";

export const ClassDeleteConfirmationModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  classData,
}) => {
  const { backend } = useBackendContext();
  const toast = useToast();

  const onGoBack = () => {
    setCurrentModal("view");
  };

  const onConfirm = async () => {
    try {
      await backend.delete(
        `/scheduled-classes/${classData.id}/${classData.date}`
      );
      setCurrentModal("confirmation");
    } catch (error) {
      console.error("Error deleting class:", error);
      console.log("Error deleting class:", error);
      toast({
        title: "Error deleting class",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Delete class?</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Text>
            You are deleting {classData.title}. This action can't be undone.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Flex
            justifyContent="center"
            w="100%"
          >
            <Button
              backgroundColor="#D9D9D9"
              mr={3}
              w="100px"
              onClick={onGoBack}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              bg="purple.600"
              mr={3}
              w="100px"
              onClick={onConfirm}
            >
              <Text
                fontWeight="bold"
                color="white"
              >
                Delete
              </Text>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
