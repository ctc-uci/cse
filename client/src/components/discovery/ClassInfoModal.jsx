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

import { FaPencilAlt } from "react-icons/fa";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import PublishedReviews from "../reviews/classReview";
import SuccessSignupModal from "./SuccessSignupModal";

function ClassInfoModal({
  isOpenProp,
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
  handleClose,
  handleResolveCoreq = () => {},
}) {
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const enrollInClass = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments`, {
        studentId: users.data[0].id,
        classId: id,
        attendance: null,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const classSignUp = async () => {
    if (isCorequisiteSignUp) {
      enrollInClass();
      return;
    }
    if (corequisites.some((coreq) => !coreq.enrolled)) {
      handleResolveCoreq();
    } else {
      enrollInClass();
    }
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
        onClose={handleClose}
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={4}
              align="center"
            >
              {!isCorequisiteSignUp && (
                <HStack width="100%">
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
                </HStack>
              )}
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
                  height={"100%"}
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
            {role === "student" && <Button onClick={classSignUp}>Sign up</Button>}
          </ModalFooter>
          <PublishedReviews classId={id} />
        </ModalContent>
        <PublishedReviews
          title={title}
          location={location}
          description={description}
          level={level}
          date={date}
          id={id}
        ></PublishedReviews>
      </Modal>
    </>
  );
}

export default ClassInfoModal;
