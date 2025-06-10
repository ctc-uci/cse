import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";

import { MdCheck } from "react-icons/md";

export const ConfirmationModal = ({ isOpen, onClose, title }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader py={3}></ModalHeader>
        <VStack>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="#d9d9d9"
          >
            <Icon
              as={MdCheck}
              boxSize={20}
              color="black"
            />
          </Box>
        </VStack>
        <ModalBody
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
        >
          You've successfully cancelled {title ? title : "N/A"}.
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            bg="#d9d9d9"
            width="100%"
            mr={3}
            onClick={onClose}
          >
            Back to Discovery Page
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
