import { memo } from "react";
import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatDate, formatTime } from "../../utils/formatDateTime";

export const getCardIcon = (tags = []) => {
  const iconSize = 70;
  switch (tags[0]?.id) {
    case 1:
      return <Image src="/card_images/fan.svg" alt="Classical dance icon" boxSize={iconSize} />;
    case 2:
      return <Image src="/card_images/shoes.svg" alt="Ballet dance icon" boxSize={iconSize} />;
    case 3:
      return <Image src="/card_images/not_iems.svg" alt="Kpop dance icon" boxSize={iconSize} />;
    case 4:
      return <Image src="/card_images/mic.svg" alt="Hip Hop dance icon" boxSize={iconSize} />;
    case 5:
      return <Image src="/card_images/music.svg" alt="Contemporary dance icon" boxSize={iconSize} />;
    case 6:
      return <Image src="/card_images/gymnastics.svg" alt="Tumbling dance icon" boxSize={iconSize} />;
    case 7:
      return <Image src="/card_images/flute.svg" alt="Folklore dance icon" boxSize={iconSize} />;
    default:
      return <Image src="/card_images/dancer.svg" alt="Dance icon" boxSize={iconSize} />;
  }
};

export const BaseCard = memo(
  ({
    title,
    location,
    date,
    startTime,
    endTime,
    attendeeCount = 0,
    tags = [],
    onClick,
    headingSize = "md",
    badgeTop = 3,
    badgeRight = 3,
    badgeFontSize = "10px",
    badgeTextTransform = "capitalize",
    children,
  }) => {
    const formattedDate = date ? formatDate(date) : null;
    const formattedStartTime = startTime ? formatTime(startTime) : null;
    const formattedEndTime = endTime ? formatTime(endTime) : null;

    return (
      <Box
        w="100%"
        bg="gray.50"
        borderRadius="xl"
        borderColor="gray.200"
        borderWidth={1}
        px={6}
        py={8}
        position="relative"
        cursor="pointer"
        onClick={onClick}
        _hover={{ bg: "gray.100", shadow: "md" }}
        transition="all 0.2s"
        shadow="md"
      >
        <Badge
          position="absolute"
          top={badgeTop}
          right={badgeRight}
          variant="outline"
          borderStyle="solid"
          borderColor="purple.200"
          color="purple.700"
          bg="purple.50"
          px={3}
          py={0.5}
          fontSize={badgeFontSize}
          fontWeight="medium"
          borderRadius="full"
          textTransform={badgeTextTransform}
          opacity={0.8}
        >
          {attendeeCount} {attendeeCount === 1 ? "Person" : "People"} {badgeTextTransform === 'lowercase' ? 'enrolled' : 'Enrolled'}
        </Badge>

        <HStack spacing={6} align="center" mt={2}>
          <Box
            w="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {getCardIcon(tags)}
          </Box>

          <VStack flex="1" align="flex-start" spacing={0.5}>
            <Heading
              fontSize={headingSize}
              fontWeight="bold"
              color="gray.800"
              wordBreak="break-word"
            >
              {title}
            </Heading>
            <Text fontSize="sm" color="gray.600" wordBreak="break-word">
              {location}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formattedDate} · {formattedStartTime} – {formattedEndTime}
            </Text>
          </VStack>
        </HStack>
        {children}
      </Box>
    );
  }
);
