import { memo, useEffect, useState } from "react";

import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaMicrophoneAlt, FaMusic } from "react-icons/fa";
import {
  GiAbstract001,
  GiBallerinaShoes,
  GiBoombox,
  GiCartwheel,
  GiTambourine,
} from "react-icons/gi";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";

export const ClassTeacherCard = memo(
  ({
    id,
    title,
    location,
    date,
    description,
    capacity,
    level,
    costume,
    performance,
    attendeeCount = 0,
    isDraft,
    recurrencePattern,
    isRecurring,
    startDate,
    endDate,
    startTime,
    endTime,
    navigate,
    setSelectedCard,
    tags,
    onOpen,
  }) => {
    const [openTeacherModal, setOpenTeacherModal] = useState(false);

    // const closeTeacherModal = () => {
    //   setOpenTeacherModal(false);
    // };

    const handleClickModal = () => {
      const modalData = {
        id,
        title,
        location,
        date,
        description,
        capacity,
        level,
        costume,
        performances: performance,
        isDraft,
        recurrencePattern,
        isRecurring,
        startDate,
        endDate,
        attendeeCount,
        startTime,
        endTime,
      };
      setOpenTeacherModal(true);
      setSelectedCard(modalData);
      onOpen(modalData);
    };

    const formattedDate = date ? formatDate(date) : null;
    const formattedStartTime = startTime ? formatTime(startTime) : null;
    const formattedEndTime = endTime ? formatTime(endTime) : null;
    const getIcon = () => {
      const iconSize = 50;
      switch (tags[0]?.id) {
        case 1:
          return <FaMusic size={iconSize} />;
        case 2:
          return <GiBallerinaShoes size={iconSize} />;
        case 3:
          return <FaMicrophoneAlt size={iconSize} />;
        case 4:
          return <GiBoombox size={iconSize} />;
        case 5:
          return <GiAbstract001 size={iconSize} />;
        case 6:
          return <GiCartwheel size={iconSize} />;
        case 7:
          return <GiTambourine size={iconSize} />;
        default:
          return <FaMusic size={iconSize} />;
      }
    };

    return (
      <Box
        w="100%"
        bg="gray.50"
        borderRadius={"lg"}
        // borderRadius="16px"
        borderColor={"gray.300"}
        borderWidth={1}
        px={6}
        py={10}
        position="relative"
        cursor="pointer"
        onClick={handleClickModal}
        _hover={{ bg: "gray.100" }}
      >
        <Badge
          position="absolute"
          top={4}
          right={4}
          variant="outline"
          borderStyle="dashed"
          borderColor="purple.600"
          color="purple.700"
          bg="purple.50"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="medium"
          borderRadius="full"
        >
          {attendeeCount} {attendeeCount === 1 ? "Person" : "People"} RSVP'd
        </Badge>
        <HStack
          spacing={4}
          align="center"
        >
          <Box
            maxW="100%"
            maxH="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {getIcon()}
          </Box>
          <VStack
            w="80%"
            align="flex-start"
            spacing={1}
          >
            <Heading
              size="md"
              fontWeight="semibold"
              color="grey.700"
              wordBreak="break-word"
              marginTop="10px"
            >
              {title}
            </Heading>
            <Text
              fontSize="sm"
              color="grey.700"
              wordBreak="break-word"
            >
              {location}
            </Text>
            <Text
              fontSize="sm"
              color="gray.700"
            >
              {formattedDate} · {formattedStartTime} – {formattedEndTime}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  }
);
