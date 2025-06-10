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

const ReviewFailureModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Review Failure Modal</Button>

      <Modal isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Failure!</ModalHeader>
            <ModalBody>
              <p>
                An error occured while trying to submit that review... Please
                try again.
              </p>
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

export default ReviewFailureModal;
