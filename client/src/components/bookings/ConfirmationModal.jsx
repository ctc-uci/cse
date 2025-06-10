import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { MdCheckCircle } from "react-icons/md";

export const ConfirmationModal = ({ isOpen, onClose, card }) => {
  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onClose={() => {}}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          display={"flex"}
          justifyContent={"center"}
        >
          <VStack
            spacing={10}
            minH={"100vh"}
            justify={"center"}
            marginBottom={"10vh"}
          >
            <VStack marginTop="5rem">
              <Box color="purple.600">
                <MdCheckCircle fontSize={"9rem"} />
              </Box>
              <Text
                textAlign={"center"}
                fontWeight="bold"
                fontSize="xl"
                mt="2rem"
              >
                Sorry to See You Go!
              </Text>
              <Text textAlign={"center"}>
                Your RSVP has been removed for {card ? card.title : "N/A"}
              </Text>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            bg="purple.600"
            color="white"
            width="60%"
            mr={3}
            onClick={onClose}
          >
            Find Upcoming Events
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
