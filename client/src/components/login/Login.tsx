import { useCallback, useEffect } from "react";

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
  Stack,
  Text,
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
import logo from "/logo.png";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

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

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Box mt={"15.10vh"}>
      <Center w="100%">
        <VStack>
          <Image
            src={logo}
            w="24.378vw"
            h="11.670vh"
            fit="contain"
          ></Image>
          {/* <Text fontSize="20px" sx={{fontWeight: "500" }}>Account created! Continue to log in.</Text> */}
        </VStack>
      </Center>

      <Center
        mt={6}
        w="100%"
      >
        <VStack
          spacing={8}
          sx={{ width: 324, marginX: "auto" }}
        >
          <form
            onSubmit={handleSubmit(handleLogin)}
            style={{ width: "100%" }}
          >
            <Stack spacing={2}>
              <Box>
                <FormControl
                  isInvalid={!!errors.email}
                  w={"100%"}
                >
                  <Center>
                    <FormControl>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        // placeholder="Email"
                        type="email"
                        size={"lg"}
                        {...register("email")}
                        name="email"
                        isRequired
                        autoComplete="email"
                        borderRadius="4px"
                        h="3.661vh"
                      />
                    </FormControl>
                  </Center>
                  <FormErrorMessage>
                    {errors.email?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Center>
                    <Input
                      // placeholder="Password"
                      type="password"
                      size={"lg"}
                      {...register("password")}
                      name="password"
                      isRequired
                      autoComplete="current-password"
                      h="3.661vh"
                    />
                  </Center>
                  <FormErrorMessage>
                    {errors.password?.message?.toString()}
                  </FormErrorMessage>
                  <ChakraLink
                    as={Link}
                    to="/signup"
                  ></ChakraLink>
                </FormControl>
              </Box>
              <Box mb={5}>
                <Text
                  color="#6B46C1"
                  fontSize="16px"
                  fontWeight={500}
                >
                  <Link to="/forgotPassword">Forgot Password?</Link>
                </Text>
              </Box>
              <Center>
                <Button
                  type="submit"
                  size={"lg"}
                  bg="#6B46C1"
                  color="white"
                  sx={{ width: "100%" }}
                  borderRadius="4px"
                  isDisabled={Object.keys(errors).length > 0}
                >
                  <Text>Log In</Text>
                </Button>
              </Center>
            </Stack>
          </form>

          {/* <Button
            leftIcon={<FaGoogle />}
            variant={"solid"}
            size={"lg"}
            onClick={handleGoogleLogin}
            sx={{ width: "100%" }}
          >
            Login with Google
          </Button> */}
        </VStack>
      </Center>
    </Box>
  );
};
