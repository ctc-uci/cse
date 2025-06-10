import React, { useState } from "react";

import {
  Button,
  Divider,
  Flex,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { Login } from "../login/Login";
import AuthorityModal from "./AuthorityModal";

export const Landing = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelectAuthority = (authority: "student" | "teacher") => {
    onClose();
    if (authority === "student") {
      navigate("/signup");
    } else if (authority === "teacher") {
      navigate("/teacher-signup");
    }
  };
  const handleSignupClick = onOpen;
  return (
    <>
      <VStack
        justifyContent="center"
        alignItems="center"
        height={"100vh"}
      >
        <Login />
        <Flex
          alignItems="center"
          w={"48.2587vw"}
          my={4}
        >
          <Divider borderColor="gray.300" />
          <Text
            mx={2}
            color="gray.500"
            whiteSpace="nowrap"
          >
            OR
          </Text>
          <Divider borderColor="gray.300" />
        </Flex>
        <Button
          type="button"
          size={"lg"}
          bg="#E2E8F0"
          w={"48.2587vw"}
          color="white"
          mt={4}
          onClick={handleSignupClick}
          textColor={"#71717A"}
        >
          Signup
        </Button>
      </VStack>

      <AuthorityModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectAuthority={handleSelectAuthority}
      />
    </>
  );
};
