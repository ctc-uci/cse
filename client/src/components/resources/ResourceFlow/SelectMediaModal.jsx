import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter } from "@chakra-ui/react"

export const SelectMediaModal = ({ isOpen, onClose, setCurrentModal }) => {
    const onPhoto = () => {
      setCurrentModal("upload-photo");
    };
  
    const onLink = () => {
      setCurrentModal("upload-link");
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select Media
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button onClick={onPhoto}>
              Photo
            </Button>
            <Button onClick={onLink}>
              Link
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
}