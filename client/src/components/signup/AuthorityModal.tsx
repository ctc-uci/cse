import React, { useState } from "react";

import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

interface AuthorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAuthority: (authority: "student" | "teacher") => void;
}

const AuthorityModal: React.FC<AuthorityModalProps> = ({
  isOpen,
  onClose,
  onSelectAuthority,
}) => {
  const [selected, setSelected] = useState<"student" | "teacher" | null>(null);

  const cleanup = () => {
    setSelected(null);
    onClose();
  };

  const handleConfirm = () => {
    if (selected) {
      onSelectAuthority(selected);
      cleanup();
    }
  };

  const handleBack = () => {
    cleanup();
  };

  const OptionButton = ({
    authority,
    icon,
    label,
  }: {
    authority: "student" | "teacher";
    icon: string;
    label: string;
  }) => {
    const isActive = selected === authority;
    return (
      <Button
        onClick={() => setSelected(authority)}
        variant="outline"
        borderColor={isActive ? "purple.600" : "gray.200"}
        color={isActive ? "purple.600" : "gray.800"}
        bg={isActive ? "purple.50" : "white"}
        _hover={{ bg: isActive ? "purple.100" : "gray.100" }}
        height="90px"
        width="100%"
        rounded="md"
        justifyContent="flex-start"
        leftIcon={
          <Image
            src={icon}
            boxSize="24px"
          />
        }
      >
        <Text
          fontSize="4xl"
          fontWeight="medium"
        >
          {label}
        </Text>
      </Button>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleBack}
      size="full"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.600" />

      <ModalContent
        m={0}
        p={0}
        borderRadius={0}
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        bg="gray.50"
      >
        {/* HEADER */}
        <ModalHeader
          px={6}
          pt={9}
          pb={4}
          fontSize="4xl"
          fontWeight="bold"
          color={"gray.800"}
        >
          Are you a student or a teacher?
        </ModalHeader>
        <ModalCloseButton
          top={6}
          right={6}
        />

        {/* OPTIONS */}
        <ModalBody
          flex="1"
          px={6}
          pt={0}
          pb={0}
          overflowY="auto"
        >
          <VStack
            spacing={4}
            mt={4}
          >
            <OptionButton
              authority="student"
              icon="/student.png"
              label="Student"
            />
            <OptionButton
              authority="teacher"
              icon="/teacher.png"
              label="Teacher"
            />
          </VStack>
        </ModalBody>

        {/* FOOTER */}
        <ModalFooter
          px={6}
          py={6}
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Stack
            spacing={3}
            width="100%"
          >
            <Button
              onClick={handleConfirm}
              bg={selected ? "purple.600" : "gray.200"}
              color={selected ? "white" : "gray.500"}
              _hover={selected ? { bg: "purple.700" } : undefined}
              isDisabled={!selected}
              height="50px"
              fontSize="lg"
              width="100%"
              rounded="md"
            >
              Confirm
            </Button>

            <Button
              onClick={handleBack}
              variant="outline"
              borderColor="purple.600"
              color="purple.600"
              height="50px"
              fontSize="lg"
              width="100%"
              rounded="md"
            >
              Back
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthorityModal;
