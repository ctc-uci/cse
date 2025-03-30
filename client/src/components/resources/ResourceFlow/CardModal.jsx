import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Card, CardBody, Image, Heading, Divider, CardFooter, ModalFooter, Tag, IconButton, VStack } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { ProgressBar } from "./ProgressBar";


export const CardModal = ({ isOpen, onClose, setCurrentModal, title, description, tags, link, s3URL, ajax }) => {
    const onGoBack = () => {
      setCurrentModal("upload-photo")
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <IconButton aria-label="Search database" variant='ghost' onClick={onGoBack}>
              <IoIosArrowBack />
            </IconButton>
            Is everything correct?
            <ProgressBar currStep={5}/>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card maxW='sm'>
              <CardBody>
                <Image
                  src={s3URL}
                  alt=''
                  borderRadius='lg'
                />
                <Heading>{title}</Heading>
                <p>{description}</p>
                <p>Link: {link}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                {tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </CardFooter>
            </Card>
          </ModalBody>
          <ModalFooter>
            <VStack
              spacing={8}
              sx={{ maxWidth: "100%", marginX: "auto" }}
            >
              <Button colorScheme='gray' mr={3} onClick={ajax}>
                Post
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }