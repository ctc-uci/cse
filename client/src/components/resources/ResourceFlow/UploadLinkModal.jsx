import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, Button, IconButton, VStack } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";

export const UploadLinkModal = ({ isOpen, onClose, setCurrentModal, link, setLink }) => {

    const isValidURL = string => {
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      return (res !== null)
    };
  
    const onGoBack = () => {
      setCurrentModal("select-media")
    }
  
    const onConfirm = () => {
      if (link.length == 0 || !isValidURL(link)) {
        alert("Please type a valid link")
      } else {
        setCurrentModal("select-tag")
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <IconButton aria-label="Search database" variant='ghost' onClick={onGoBack}>
              <IoIosArrowBack />
            </IconButton>
            Upload Link
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Input value={link}
              onChange={(e) => setLink(e.target.value)}/>
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