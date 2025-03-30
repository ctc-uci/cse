import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, IconButton, VStack } from "@chakra-ui/react"
import { UploadComponent } from "./UploadComponent"
import { IoIosArrowBack } from "react-icons/io";
import { ProgressBar } from "./ProgressBar";


export const UploadFileModal = ({ isOpen, onClose, setCurrentModal, s3URL, setS3URL }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton aria-label="Search database" variant='ghost' onClick={() => {setCurrentModal("select-tag")}}>
            <IoIosArrowBack />
          </IconButton>
          Upload File
          <ProgressBar currStep={4}/>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UploadComponent setS3URL={setS3URL} />
        </ModalBody>
        <ModalFooter>
            <VStack
              spacing={8}
              sx={{ maxWidth: "100%", marginX: "auto" }}
            >
            <Button colorScheme='gray' mr={3} onClick={() => {
              if (s3URL == "") {
                alert("You must upload a file first!")
              } else {
                setCurrentModal("card")
              }
            }}>
              Next
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
    )
}