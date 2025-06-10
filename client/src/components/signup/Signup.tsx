import { useEffect } from "react";

import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "Please include your first name."),
    lastName: z.string().min(1, "Please include your last name."),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { studentSignup, handleRedirectResult, updateRole, login } =
    useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleSignup = async (data: SignupFormValues) => {
    try {
      const user = await studentSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        level: "beginner",
      });

      if (user) {
        login({
          email: data.email,
          password: data.password,
        });
        updateRole();
        navigate("/discovery");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "An error occurred",
          description: err.message,
          status: "error",
          variant: "subtle",
          position: "top",
        });
      }
    }
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  const handleBack = () => {
    navigate("/landing");
  };

  return (
    <Box mt={"5vh"}>
      <VStack
        spacing={4}
        sx={{ width: 350, marginX: "auto" }}
        mt={5}
      >
        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
        >
          Enter your details
        </Text>
        <form
          onSubmit={handleSubmit(handleSignup)}
          style={{ width: "100%" }}
        >
          <VStack
            spacing={4}
            alignItems="stretch"
          >
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                size={"md"}
                {...register("firstName")}
                isRequired
                autoComplete="given-name"
              />
              <FormErrorMessage>
                {errors.firstName?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                size={"md"}
                {...register("lastName")}
                isRequired
                autoComplete="family-name"
              />
              <FormErrorMessage>
                {errors.lastName?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                size={"md"}
                {...register("email")}
                isRequired
                autoComplete="email"
              />
              <FormErrorMessage>
                {errors.email?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                size={"md"}
                {...register("password")}
                isRequired
                autoComplete="new-password"
              />
              <FormErrorMessage>
                {errors.password?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password Again</FormLabel>
              <Input
                type="password"
                size={"md"}
                {...register("confirmPassword")}
                isRequired
                autoComplete="new-password"
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              size={"lg"}
              bg="#6A1B9A"
              color="white"
              _hover={{ bg: "#4A148C" }}
              isDisabled={Object.keys(errors).length > 0}
              mt={4}
              w="100%"
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              size={"lg"}
              onClick={handleBack}
              w="100%"
              mt={2}
            >
              Back
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};
