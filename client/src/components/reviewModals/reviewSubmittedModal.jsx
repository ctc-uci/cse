import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

const ReviewSubmittedModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Review Submitted Modal</Button>

      <Modal isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Success!</ModalHeader>
            <ModalBody>
              <p>Thank you for taking the time to give us a review!</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default ReviewSubmittedModal;
