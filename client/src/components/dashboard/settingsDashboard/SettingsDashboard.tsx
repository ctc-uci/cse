import { React, useRef } from "react";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FaRegBell } from "react-icons/fa";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { NotificationPanel } from "../NotificationPanel";

const SettingsDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  return (
    <VStack gap="30px">
      <Flex
        w={"100%"}
        justify={"space-between"}
      >
        <Heading
          as="h1"
          size="lg"
          mb={4}
          alignSelf={"flex-start"}
          alignContent="center"
          fontWeight={700}
          fontSize={36}
        >
          <Button
            backgroundColor="transparent"
            fontSize={25}
            mb={1}
            onClick={() => navigate("/dashboard")}
          >
            <SlArrowLeft />
          </Button>
          Settings
        </Heading>
        {/* <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="../bell.png"
        /> */}
        <IconButton
          icon={<FaRegBell />}
          size="lg"
          mt="-2"
          onClick={onOpen}
          ref={notifRef}
          aria-label="Notifications"
          bg="white"
        />
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />
      </Flex>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          First Name
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentUser?.displayName?.split(" ")[0] || ""}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Last Name
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentUser?.displayName?.split(" ")[1] || ""}
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Email
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentUser?.email || ""}
        </Box>
        <Box flex={1} />
        <Box flex={1} />
      </HStack>
    </VStack>
  );
};

export default SettingsDashboard;
