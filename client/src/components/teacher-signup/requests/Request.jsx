import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

import centerStageLogo from "/logo.png";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pending = location.pathname.includes("pending");

  const message = pending
    ? "Pending account verification. Once approved, check your email to log in."
    : "Request sent!\nOnce approved, check your email to log in.";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <VStack textAlign="center">
        <Image
          src={centerStageLogo}
          boxSize="100px"
          // borderRadius="full"
          objectFit="contain"
          alt="Center Stage Logo"
          mb={4}
        />

        <Text
          fontSize="lg"
          w={"60%"}
          whiteSpace="pre-line"
        >
          {message}
        </Text>

        <Button
          bg="purple.600"
          color="white"
          w="155px"
          h="45px"
          mt={3}
          onClick={() => navigate("/login")}
        >
          OK
        </Button>
      </VStack>
    </Box>
  );
};

export default Request;
