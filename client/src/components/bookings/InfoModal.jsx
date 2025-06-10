import {
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { formatDate } from "../../utils/formatDateTime";

export const InfoModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  children,
  title,
  card,
  coEvents,
  type,
}) => {
  return (
    <>
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={4}
      >
        <GridItem>
          <Text fontWeight="bold">Location</Text> {/* Will add from prop */}
          <Text>{card ? card.location : "N/A"}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Date</Text> {/* Will add from prop */}
          <Text>{card ? formatDate(card.date) : "N/A"}</Text>
        </GridItem>

        <GridItem colSpan={2}>
          <Text fontWeight="bold">Description</Text> {/* Will add from prop */}
          <Text>{card ? card.description : "N/A"}</Text>
        </GridItem>

        {type === "class" ? (
          <GridItem>
            <Text fontWeight="bold">Capacity</Text>
            <Text>{card ? card.capacity : "N/A"}</Text>
          </GridItem>
        ) : (
          <GridItem>
            <Text fontWeight="bold">Start Time</Text>
            <Text>{card ? card.startTime : "N/A"}</Text>
          </GridItem>
        )}

        {type === "class" ? (
          <GridItem>
            <Text fontWeight="bold">Level</Text>
            <Text>{card ? card.level : "N/A"}</Text>
          </GridItem>
        ) : (
          <GridItem>
            <Text fontWeight="bold">End Time</Text>
            <Text>{card ? card.endTime : "N/A"}</Text>
          </GridItem>
        )}

        {type === "class" ? (
          <GridItem colSpan={2}>
            {/* Make an endpoint for this :sob: */}
            <Text fontWeight="bold">Performances</Text>
            {coEvents.length > 0 ? (
              coEvents.map((event, index) => (
                <Text key={index}>{event.title}</Text>
              ))
            ) : (
              <Text>No corequisite events found.</Text>
            )}
          </GridItem>
        ) : (
          <GridItem colSpan={2}>
            <Text fontWeight="bold">Level</Text>
            <Text>{card ? card.level : "N/A"}</Text>
          </GridItem>
        )}
      </Grid>
    </>
  );
};
