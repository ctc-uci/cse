import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { BsCheck } from "react-icons/bs";

export const TeacherConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <VStack>
          <Flex
            paddingTop={10}
            justifyContent="center"
            w="100%"
            position="relative"
          >
            <Icon
              as={BsCheck}
              boxSize="75vw"
              backgroundColor="#134A74"
              borderRadius="full"
              color="white"
            ></Icon>
          </Flex>
          <Text
            fontSize="28px"
            fontWeight="bold"
          >
            Class Deleted
          </Text>
          <ModalFooter>
            <Button
              backgroundColor="#D9D9D9"
              padding={7}
              onClick={onClose}
            >
              View Booked Events{" "}
            </Button>
          </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
