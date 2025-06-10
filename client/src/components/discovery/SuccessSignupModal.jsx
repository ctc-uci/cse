import { useEffect } from "react";

import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { MdCheckCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function SuccessSignupModal({
  isOpen,
  title,
  onClose,
  isCoreq: isCorequisiteSignUp = false,
  corequisites = [],
  withCoreqFlag = false,
}) {
  const navigate = useNavigate();

  if (typeof title === "string") {
    title = [title];
  }

  useEffect(() => {
    if (isOpen) {
      // setTimeout(() => {
      //   onClose();
      //   if (!isCorequisiteSignUp) navigate("/bookings");
      // }, 2000);
    }
  }, [isCorequisiteSignUp, isOpen, navigate, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onClose={() => {}}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          display={"flex"}
          justifyContent={"center"}
        >
          <VStack
            // spacing={150}
            minh={"100vh"}
            justify={"center"}
          >
            <VStack spacing={4}>
              <Box color="purple.600">
                <MdCheckCircle fontSize={"9rem"} />
              </Box>
              <Text textAlign={"center"}>
                You've successfully signed up for...
              </Text>
              <Text textAlign={"center"}>
                {title && title.length > 1 ? (
                  <List>
                    {title.map((t, index) => (
                      <ListItem key={index}>{t}</ListItem>
                    ))}
                  </List>
                ) : (
                  <Text fontWeight="bold">
                    {title ? title[0] : "No title detected"}
                  </Text>
                )}
              </Text>
            </VStack>

            {withCoreqFlag && corequisites.length > 0 && (
              <UnorderedList listStyleType="disc">
                {corequisites.map((coreq) => (
                  <ListItem
                    key={coreq.id}
                    display="flex"
                    alignItems="center"
                    fontSize="lg"
                    listStyleType={""}
                  >
                    <Text>{coreq.title}</Text>
                  </ListItem>
                ))}
              </UnorderedList>
            )}

            {!isCorequisiteSignUp && (
              <Button
                bg="purple.600"
                color="#FFFFFF"
                onClick={onClose}
                width="100%"
              >
                Find Upcoming Events
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SuccessSignupModal;
