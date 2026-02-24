import { useCallback, useEffect } from "react";

import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { authenticateGoogleUser } from "../../utils/auth/providers";
import AuthorityModal from "../signup/AuthorityModal";
import logo from "/logo.png";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { login, handleRedirectResult, updateRole } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const toastLoginError = useCallback(
    (msg: string) => {
      toast({
        title: "An error occurred while signing in",
        description: msg,
        status: "error",
        variant: "subtle",
        position: "top",
      });
    },
    [toast]
  );

  const handleLogin = async (data: SigninFormValues) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      const response = await backend.get("/teachers");
      const teachers = response.data;
      const teacher = teachers.find((teach) => teach.email === data.email);
      updateRole();

      if (teacher) {
        if (teacher.isActivated) {
          navigate("/bookings");
        } else {
          navigate("/teacher-signup/pending");
        }
      } else {
        console.log("In else clause!");
        const qrCodeRedirect = localStorage.getItem("qrcode_redirect");
        console.log(qrCodeRedirect);
        // return qrCodeRedirect ? navigate(qrCodeRedirect) : navigate('/discovery');
        if (qrCodeRedirect) {
          localStorage.removeItem("qrcode_redirect");
          navigate(qrCodeRedirect);
        } else {
          navigate("/bookings");
        }
      }
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;
      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
        case "auth/user-not-found":
          toastLoginError(
            "Email address or password does not match our records!"
          );
          break;
        case "auth/unverified-email":
          toastLoginError("Please verify your email address.");
          break;
        case "auth/user-disabled":
          toastLoginError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          toastLoginError("Too many attempts. Please try again later.");
          break;
        case "auth/user-signed-out":
          toastLoginError("You have been signed out. Please sign in again.");
          break;
        default:
          toastLoginError(firebaseErrorMsg);
      }
    }
  };

  const handleGoogleLogin = async () => {
    await authenticateGoogleUser();
  };

  const handleSelectAuthority = (authority: "student" | "teacher") => {
    onClose();
    if (authority === "student") {
      navigate("/signup");
    } else if (authority === "teacher") {
      navigate("/teacher-signup");
    }
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Box
      bg="white"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <Center w="100%">
        <VStack
          spacing={5}
          w="full"
          maxW="sm"
        >
          <VStack spacing={4}>
            <Image
              src={logo}
              w="134px"
              h="140px"
              objectFit="contain"
              rounded="xl"
            />
            <Heading
              size="lg"
              fontWeight="semibold"
            >
              Welcome!
            </Heading>
          </VStack>

          <Box w="100%">
            <form
              onSubmit={handleSubmit(handleLogin)}
              style={{ width: "100%" }}
            >
              <VStack
                spacing={4}
                align="stretch"
              >
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    size="md"
                    placeholder="Enter email"
                    {...register("email")}
                    name="email"
                    isRequired
                    autoComplete="email"
                    borderRadius="md"
                  />
                  <FormErrorMessage>
                    {errors.email?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    size="md"
                    placeholder="Enter password"
                    {...register("password")}
                    name="password"
                    isRequired
                    autoComplete="current-password"
                    borderRadius="md"
                  />
                  <FormErrorMessage>
                    {errors.password?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>

                <Box
                  w="full"
                  textAlign="right"
                >
                  <ChakraLink
                    as={Link}
                    to="/forgotPassword"
                    color="purple.500"
                    fontSize="sm"
                    fontWeight={500}
                  >
                    Forgot password?
                  </ChakraLink>
                </Box>

                <Button
                  type="submit"
                  size="md"
                  bg="#6B46C1"
                  color="white"
                  w="full"
                  borderRadius="md"
                  _hover={{ bg: "#5A3AB0" }}
                  isDisabled={Object.keys(errors).length > 0}
                >
                  Log In
                </Button>
              </VStack>
            </form>
          </Box>

          <VStack
            spacing={4}
            w="full"
          >
            <HStack
              w="full"
              align="center"
              spacing={4}
            >
              <Box
                flex="1"
                h="1px"
                bg="gray.300"
              />
              <Text
                fontSize="sm"
                color="gray.600"
              >
                OR
              </Text>
              <Box
                flex="1"
                h="1px"
                bg="gray.300"
              />
            </HStack>

            <Button
              type="button"
              size="md"
              w="full"
              bg="gray.100"
              color="gray.700"
              borderRadius="md"
              _hover={{ bg: "gray.200" }}
              onClick={onOpen}
            >
              Sign Up
            </Button>
          </VStack>
        </VStack>
      </Center>

      <AuthorityModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectAuthority={handleSelectAuthority}
      />
    </Box>
  );
};
