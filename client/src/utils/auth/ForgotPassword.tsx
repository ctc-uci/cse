import { useState } from "react";

import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Image,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { sendPasswordReset } from "./firebase";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for instructions.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setEmail(""); // Clear email field
      navigate("/forgotPasswordConfirmation");
    } catch (err) {
      let message = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).code === "auth/invalid-email" ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).code === "auth/user-not-found"
        ) {
          message = "Email address not found. Please check and try again.";
        } else {
          message = err.message;
        }
      }
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center h="90vh">
      <VStack
        spacing={6}
        w={{ base: "90%", md: "350px" }}
        p={8} // Added padding
        textAlign="center"
      >
        <Image
          src="/logo.png"
          alt="Center Stage Logo"
          boxSize="150px"
          mb={4}
        />

        <Heading
          as="h1"
          size="lg"
        >
          Forgot Password
        </Heading>
        <Text
          size="md"
          color="gray.600"
        >
          Enter your email to reset your password.
        </Text>
        <form
          onSubmit={handleForgotPassword}
          style={{ width: "100%" }}
        >
          <VStack
            spacing={4}
            align="stretch"
          >
            <FormControl>
              <Input
                type="email"
                isRequired={true}
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="Enter email"
                size="lg"
              />
            </FormControl>
            <Button
              type="submit"
              bg="purple.600"
              color="white"
              _hover={{ bg: "purple.400" }}
              size="lg"
              w="100%"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </VStack>
        </form>
      </VStack>
    </Center>
  );
};
