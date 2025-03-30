import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Image,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SuccessSignupModal from "./SuccessSignupModal";

function EventInfoModal({
  isOpenProp,
  handleClose,
  title,
  location,
  description,
  level,
  date,
  id,
  capacity,
  costume,
  isCorequisiteSignUp,
  corequisites,
  handleResolveCoreq = () => {},
}) {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const enrollInEvent = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/event-enrollments/`, {
        student_id: users.data[0].id,
        event_id: id,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const eventSignUp = async () => {
    if (isCorequisiteSignUp) {
      enrollInEvent();
      return;
    }

    if (corequisites.some((coreq) => !coreq.enrolled)) {
      handleResolveCoreq();
    } else {
      enrollInEvent();
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  useEffect(() => {
    if (isOpenProp && !imageSrc) {
      fetch("https://dog.ceo/api/breeds/image/random") // for fun
        .then((res) => res.json())
        .then((data) => setImageSrc(data.message));
    }
  }, [imageSrc, isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={4}
              align="center"
            >
              <HStack width="100%">
                {!isCorequisiteSignUp && (
                  <Box>
                    <Text as="b">Corequisites</Text>
                    {!corequisites || corequisites.length === 0 ? (
                      <Text>No corequisites for this class</Text>
                    ) : (
                      <List>
                        {corequisites.map((coreq, index) => (
                          <ListItem key={index}>
                            <ListIcon
                              as={
                                coreq.enrolled
                                  ? FaCircleCheck
                                  : FaCircleExclamation
                              }
                            />
                            {coreq.title}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                )}
              </HStack>
              <Box
                boxSize="sm"
                height="15rem"
                width={"100%"}
                alignContent={"center"}
                justifyContent={"center"}
                display="flex"
              >
                <Image
                  src={imageSrc}
                  alt="Random Dog"
                  width={"100%%"}
                />
              </Box>

              <HStack
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>{location}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{date}</Text>
                </Box>
              </HStack>

              <Box width="100%">
                <Text fontWeight="bold">Description:</Text>
                <Text>{description}</Text>
              </Box>

              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Capacity:</Text>
                  <Text>{capacity}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Level:</Text>
                  <Text>{level}</Text>
                </Box>
              </HStack>

              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Costume:</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={eventSignUp}
            >
              Sign Up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventInfoModal;
