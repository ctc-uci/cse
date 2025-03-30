import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter, Textarea, FormControl, FormLabel, Input, VStack, IconButton  } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { ProgressBar } from "./ProgressBar";


export const FormModal = ({ isOpen, onClose, setCurrentModal, title, setTitle,  description, setDescription, link, setLink }) => {
    const isLink = link => {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(link);
    }


  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> 
            <IconButton aria-label="Search database" variant='ghost' onClick={() => {setCurrentModal("select-class")}}>
              <IoIosArrowBack />
            </IconButton> Fill out this form
            <ProgressBar currStep={2}/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
                <FormControl>
                    <FormLabel>Resource Title</FormLabel>
                    <Input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Media Link</FormLabel>
                    <Input
                        required
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </FormControl>
                <br />
            </form>
          </ModalBody>
          <ModalFooter>

            <VStack
              spacing={8}
              sx={{ maxWidth: "100%", marginX: "auto" }}
            >
              <Button colorScheme='gray' onClick={() => {
                  if (title == "" || description == "" || link == "") {
                      alert("Please fill out every fields")
                  } else if (!isLink(link)) {
                      alert("Please enter a valid link")
                  } else {
                      setCurrentModal("select-tag")
                  }
              }}>Next
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}