import { memo, useState } from "react";

import {
  Badge,
  Box,
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
import { useLocation } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import TeacherEventViewView from "../bookings/teacherView/TeacherEventViewView";
import SignUpController from "../discovery/SignUpController";

export const EventCard = memo(
  ({
    id,
    title,
    location,
    description,
    level,
    date,
    startTime,
    endTime,
    callTime,
    costume,
    capacity,
    attendeeCount = 0,
    onClick,
    triggerRefresh,
    user = null,
    tags = [],
    magic,
  }) => {
    const formattedDate = formatDate(date);
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    const { pathname } = useLocation();
    const [openRootModal, setOpenRootModal] = useState(false);
    const [openTeacherModal, setOpenTeacherModal] = useState(false);

    const [currentModal, setCurrentModal] = useState("view");
    const { role } = useAuthContext();

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

    const closeTeacherModal = () => {
      setOpenTeacherModal(false);
    };

    const handleClickModal = () => {
      if (pathname === "/bookings" && role !== "student") {
        if (currentModal === "view") {
          setOpenTeacherModal(true);
          console.log("Open teacher view modal!");
        }
      } else if (pathname === "/bookings") {
        if (onClick) onClick();
      } else {
        setOpenRootModal(true);
      }
    };

    const dateTimeString = formattedDate
      ? `${formattedDate} @ ${formattedStartTime} - ${formattedEndTime}`
      : "Date/Time not available";

    // console.log("ec tags", id, title, tags);
    return (
      <Box
        w="100%"
        bg="gray.50"
        borderRadius="lg"
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
            wordBreak="break-word"
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
        <SignUpController
          event_id={id}
          title={title}
          description={description}
          location={location}
          level={level}
          costume={costume}
          date={date}
          startTime={startTime}
          endTime={endTime}
          capacity={capacity}
          setOpenRootModal={setOpenRootModal}
          openRootModal={openRootModal}
          user={user}
          tags={tags}
        />
        {role && role !== "student" && (
          <TeacherEventViewView
            isOpenProp={openTeacherModal}
            handleClose={closeTeacherModal}
            id={id}
            location={location}
            title={title}
            description={description}
            level={level}
            date={date}
            startTime={startTime}
            endTime={endTime}
            callTime={callTime}
            costume={costume}
            capacity={capacity}
            triggerRefresh={triggerRefresh}
            tags={tags}
            magic={magic}
          />
        )}
      </Box>
    );
  }
);
