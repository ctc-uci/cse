import { memo, useEffect, useState } from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  List,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import PublishedReviews from "../reviews/classReview";

export const ViewView = ({
  isOpen,
  onClose,
  setCurrentModal,
  // children,
  // title,
  card,
  coEvents,
  // type,
  // role,
  isAttended = false,
  tags = [],
}) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const { backend } = useBackendContext();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const [corequisites, setCorequisites] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch coreq class data needed
      backend
        .get(`corequisites/class/${card?.id}`)
        .then((response) => {
          if (response?.data) {
            setCorequisites(response.data);
          } else {
            setCorequisites([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching corequisites:", error);
          setCorequisites([]);
        });
    }
  }, [isOpen, card, backend]);

  const viewInfo = (
    <>
      <Text>
        {card?.description
          ? `Description: ${card.description}`
          : "No description available."}
      </Text>{" "}
      <br />
      <Divider orientation="horizontal" /> <br />
      <Text color="#553C9A">
        {formatDate(card?.date)} · {formatTime(card?.startTime)} –{" "}
        {formatTime(card?.endTime)}
      </Text>
      <Text>Call Time: {formatTime(card?.callTime)}</Text>
      <Text>Location: {card?.location}</Text>
      <br /> <Divider orientation="horizontal" /> <br />
      <VStack
        spacing={4}
        align="center"
      >
        <HStack
          spacing={4}
          width={"100%"}
        >
          <Box width="50%">
            <Text fontWeight="bold">Level</Text>
            <Text>{card?.level}</Text>
          </Box>
          <Box width="50%">
            <Text fontWeight="bold">Capacity</Text>
            <Text>{card?.capacity}</Text>
          </Box>
        </HStack>
        <br />
        <Divider orientation="horizontal" />
        {/* <HStack width="100%"> */}
        <Box>
          <Text
            fontWeight="bold"
            mb="1"
          >
            Recommended Prerequisite(s)
          </Text>
          <Text mb={2}>
            We recommend taking these classes before enrolling in this series.
          </Text>

          {corequisites && corequisites.length > 0 ? (
            <Box>
              {corequisites.map((prerequisite) => (
                <Tag
                  borderRadius={"full"}
                  bg="purple.200"
                  textColor={"purple.800"}
                  m={1}
                  key={prerequisite.id}
                >
                  {prerequisite.title}
                </Tag>
              ))}
            </Box>
          ) : (
            <Text
              mt={1}
              fontSize={"md"}
              fontStyle="italic"
            >
              No prerequisites for this class
            </Text>
          )}
        </Box>
        <Box>
          <Text
            fontWeight="bold"
            mb="1"
          >
            Performance(s)
          </Text>
          <Text mb={3}>
            At the end of the class period, students will perform in a final
            performance.
          </Text>
          {coEvents && coEvents.length > 0 ? (
            coEvents.map((performance) => (
              <Tag
                borderRadius={"full"}
                bg="purple.200"
                textColor={"purple.800"}
                key={performance.id}
              >
                {performance.title}
              </Tag>
            ))
          ) : (
            <Text
              fontSize={"md"}
              fontStyle="italic"
            >
              No performances for this class
            </Text>
          )}
        </Box>
        <Divider orientation="horizontal" />
      </VStack>
    </>
  );

  // Close the view when navigating away from bookings
  useEffect(() => {
    if (isOpen && routerLocation.pathname !== "/bookings") {
      onClose();
    }
  }, [routerLocation.pathname, isOpen, onClose]);

  // Close the view when location state changes (force refresh from navbar)
  useEffect(() => {
    if (isOpen && routerLocation.state?.forceRefresh) {
      onClose();
      // Clear the forceRefresh state to prevent it from affecting future opens
      navigate(routerLocation.pathname, { replace: true, state: {} });
    }
  }, [routerLocation.state, isOpen, onClose, navigate, routerLocation.pathname]);

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white"
      zIndex={1000}
      overflowY="auto"
      pb={20}
    >
      <Box
        maxW="100%"
        px={6}
        py={4}
      >
        <VStack
          align="start"
          spacing={4}
          mb={4}
        >
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Back"
            variant="ghost"
            fontSize={"2xl"}
            p={4}
            ml={-4}
          />
          <List>
            {tags.map((tag) => (
              <Tag
                key={tag.id || tag.tag}
                mr={1}
                mb={1}
                mt={1}
                borderRadius={"full"}
                bg="white"
                textColor="gray.600"
                borderColor={"gray.300"}
                borderWidth={1}
              >
                {tag.tag[0].toUpperCase() + tag.tag.slice(1)}
              </Tag>
            ))}
          </List>
          <Text
            justifyContent="center"
            wordBreak={"break-word"}
            fontWeight={"bold"}
          >
            {card?.title ?? "Create a Class/Draft"}
          </Text>
        </VStack>
        <Box>
          {viewInfo}
          {!isAttended && !card?.attendance && (
            <Box
              mt={6}
              textAlign="center"
            >
              <Button
                width="60%"
                size="sm"
                background="purple.600"
                color="white"
                onClick={onCancel}
                px={10}
                py={6}
              >
                Cancel RSVP
              </Button>
            </Box>
          )}
          <PublishedReviews
            classId={card?.id}
            isAttended={isAttended}
          />
        </Box>
      </Box>
    </Box>
  );
};
