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

// import { FaMicrophoneAlt, FaMusic } from "react-icons/fa";
// import {
//   GiAbstract001,
//   GiBallerinaShoes,
//   GiBoombox,
//   GiCartwheel,
//   GiTambourine,
// } from "react-icons/gi";

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
          return <Image src="/card_images/fan.svg" alt="Classical dance icon" boxSize={iconSize}/>;
        case 2:
          return <Image src="/card_images/shoes.svg" alt="Ballet dance icon" boxSize={iconSize}/>;
        case 3:
          return <Image src="/card_images/not_iems.svg" alt="Kpop dance icon" boxSize={iconSize}/>;
        case 4:
          return <Image src="/card_images/mic.svg" alt="Hip Hop dance icon" boxSize={iconSize}/>;
        case 5:
          return <Image src="/card_images/music.svg" alt="Contemporary dance icon" boxSize={iconSize}/>;
        case 6:
          return <Image src="/card_images/gymnastics.svg" alt="Tumbling dance icon" boxSize={iconSize}/>;
        case 7:
          return <Image src="/card_images/flute.svg" alt="Folklore dance icon" boxSize={iconSize}/>;
        default:
          return <Image src="/card_images/dancer.svg" alt="Dance icon" boxSize={iconSize}/>;
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
