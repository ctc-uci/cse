import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Input, ModalFooter, IconButton, VStack } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";

export const TitleModal = ({ isOpen, onClose, setCurrentModal, title, setTitle }) => {
    const onGoBack = () => {
      setCurrentModal("select-tag")
    }
  
    const onConfirm = () => {
      setCurrentModal("card")
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <IconButton aria-label="Search database" variant='ghost' onClick={onGoBack}>
              <IoIosArrowBack />
            </IconButton>
            Title
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={title}
            onChange={(e) => {
                if (e.target.value.length == 0) {
                alert("Title cannot be empty")
                } else {
                setTitle(e.target.value)
                }
            }}/>
          </ModalBody>
          <ModalFooter>
          <VStack
              spacing={8}
              sx={{ maxWidth: "100%", marginX: "auto" }}
            >
              <Button colorScheme='gray' mr={3} onClick={onConfirm}>
                Next
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}