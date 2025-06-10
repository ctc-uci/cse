import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export const CancelModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  card,
  handleEvent,
  type,
}) => {
  const onGoBack = () => {
    setCurrentModal("view");
  };
  const onConfirm = () => {
    setCurrentModal("confirmation");
    handleEvent(); // sql query is dependent on card type (class or event)
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          textAlign="center"
          pb={0}
        >
          {" "}
          Delete RSVP?
        </ModalHeader>
        <ModalBody
          textAlign="center"
          py={4}
        >
          You're cancelling{" "}
          <Text
            fontWeight="bold"
            display="inline"
          >
            {card ? card.title : "N/A"}
          </Text>
          . This action can't be undone.
        </ModalBody>

        <ModalFooter
          justifyContent="center"
          pt={4}
        >
          <Flex w="100%">
            <Button
              flex="1"
              bg="#E8E7EF"
              onClick={onGoBack}
              borderRadius="lg"
              borderBottomLeftRadius={6}
              mr={3}
              px={6}
            >
              {" "}
              Go Back
            </Button>
            <Button
              flex="1"
              bg="purple.600"
              color="white"
              fontWeight="bold"
              onClick={onConfirm}
              borderRadius="lg"
              borderBottomRightRadius={6}
              mr={3}
              px={6}
            >
              {" "}
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
