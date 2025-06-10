import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SuccessSignupModal from "./SuccessSignupModal";

function CoReqWarningModal({
  title,
  user,
  class_id = null,
  event_id = null,
  isOpenProp,
  lstCorequisites,
  modalIdentity,
  setModalIdentity,
  filteredCorequisites,
  setFilteredCorequisites,
  eventId,
  handleClose = () => {},
  killModal = () => {},
}) {
  const { backend } = useBackendContext();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [withCoreqFlag, setWithCoreqFlag] = useState(false);

  const enrollInClass = async (id) => {
    if (user.data[0]) {
      await backend.post(`/class-enrollments`, {
        studentId: user.data[0].id,
        classId: id,
        attendance: null,
      });
    }
  };

  const enrollInEvent = async (id) => {
    const currentCheckIn = await backend.get(`/event-enrollments/test`, {
      params: {
        student_id: user.data[0].id,
        event_id: id,
      },
    });
    if (user.data[0] && !currentCheckIn.data.exists) {
      console.log("Enrolling in event:", id);
      const req = await backend.post(`/event-enrollments/`, {
        student_id: user.data[0].id,
        event_id: id,
        attendance: null,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    } else {
      console.log("Already signed up for this event!");
    }
  };

  const signupWithCoreq = async () => {
    try {
      setWithCoreqFlag(true);
      if (class_id === null) {
        await enrollInEvent(event_id);
        for (const coreq of lstCorequisites) {
          if (coreq.enrolled === false) {
            await enrollInClass(coreq.id);
          }
        }
      } else {
        await enrollInClass(class_id);
        for (const coreq of lstCorequisites) {
          if (coreq.enrolled === false) {
            console.log("Enrolling in corequisite class:", coreq.id);
            await enrollInEvent(coreq.id);
          }
        }
        // lstCorequisites.forEach((coreq) => {
        //   if (coreq.enrolled === false) {
        //     console.log("Enrolling in corequisite class:", coreq.id);
        //     await enrollInEvent(coreq.id);
        //   }
        // });
      }
      setOpenSuccessModal(true);
      killModal();
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const signupWithoutCoreq = async () => {
    // setOpenCoreq(true);
    setWithCoreqFlag(false);
    if (class_id === null) {
      await enrollInEvent(event_id);
    } else {
      await enrollInClass(class_id);
    }
    setOpenSuccessModal(true);
    killModal();
  };

  const cancelSignUp = () => {
    handleClose();
    killModal();
  };

  if (!lstCorequisites || lstCorequisites.length === 0) {
    return null;
  }
  return (
    <Box>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        title={title}
        corequisites={lstCorequisites}
        withCoreqFlag={withCoreqFlag}
      />
      <Modal
        isOpen={isOpenProp}
        onClose={cancelSignUp}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalBody
            display={"flex"}
            justifyContent={"center"}
          >
            <VStack spacing={10}>
              <VStack
                marginY="2rem"
                spacing={4}
                alignItems={"start"}
                fontSize="medium"
              >
                <Text
                  fontWeight="bold"
                  fontSize="large"
                >
                  Performance Participation Required
                </Text>
                <Text>
                  To enroll in {title}, it is recommended that you participate
                  in the end-of-session performance
                  {lstCorequisites.map((coreq, i) => (
                    <Text
                      fontWeight="bold"
                      variant={"span"}
                    >
                      {coreq.title}
                      {i < lstCorequisites.length - 1 ? ", " : ""}
                    </Text>
                  ))}
                </Text>
                <Text>Do you agree to take part in the performance?</Text>
              </VStack>
              <VStack width="full">
                <Button
                  width="inherit"
                  colorScheme="purple"
                  fontSize="medium"
                  bgColor="purple.600"
                  onClick={signupWithCoreq}
                >
                  Yes, Enroll & Join Performance
                </Button>
                <Button
                  width="inherit"
                  colorScheme="gray"
                  bgColor="gray.300"
                  onClick={signupWithoutCoreq}
                >
                  No, Enroll in Class Only
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CoReqWarningModal;
