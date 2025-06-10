import { useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
import { EmailTemplate } from "../signup/EmailTemplate";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "Field Cannot Be Empty"),
    lastName: z.string().min(1, "Field Cannot Be Empty"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    repeatPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match.",
    path: ["repeatPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const TeacherSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { teacherSignup, handleRedirectResult, updateDisplayName } =
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
      const user = await teacherSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        experience: "",
        email: data.email,
        password: data.password,
      });

      if (user) {
        updateDisplayName(user, data.firstName + " " + data.lastName);
        const templateEmail = EmailTemplate({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: "teacher",
        });
        backend.post("/nodemailer/send", {
          to: import.meta.env.VITE_ADMIN_EMAIL,
          html: ReactDOMServer.renderToString(templateEmail),
        });
        navigate("/teacher-signup/request");
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

  return (
    <Box mt={"5vh"}>
      <VStack
        spacing={4}
        sx={{ width: 350, marginX: "auto" }}
        mt={5}
      >
        {/* <Image
          src={centerStageLogo}
          mt={5}
        ></Image> */}
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

            <FormControl isInvalid={!!errors.repeatPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                size={"md"}
                {...register("repeatPassword")}
                isRequired
                autoComplete="new-password"
              />
              <FormErrorMessage>
                {errors.repeatPassword?.message?.toString()}
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
              Submit
            </Button>

            <Button
              variant="outline"
              size={"lg"}
              onClick={() => navigate("/landing")}
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
