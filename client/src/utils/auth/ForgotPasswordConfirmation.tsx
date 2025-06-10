import { Box, Button, Center, Heading, Link, Text } from "@chakra-ui/react";

export const ForgotPasswordConfirmation = () => {
  return (
    <Box>
      <Center h="90vh">
        <Box
          style={{
            margin: "auto",
            textAlign: "center",
            width: "598px",
            minWidth: "300px",
          }}
        >
          <Heading
            as="h1"
            size="lg"
          >
            Instructions Sent
          </Heading>
          <Text
            as="h2"
            size="md"
            mt={2}
          >
            Please check inbox for password reset instructions.
          </Text>
          <Center>
            <Button
              mt={5}
              type="submit"
              backgroundColor={"purple.600"}
              color={"#ffffff"}
              _hover={{ backgroundColor: "purple.400" }}
            >
              <Link
                href="/login"
                style={{ textDecoration: "none" }}
              >
                Return to Login
              </Link>
            </Button>
          </Center>
        </Box>
      </Center>
    </Box>
  );
};

export default ForgotPasswordConfirmation;
