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

import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";

import { formatDate } from "../../utils/formatDateTime";

export const ViewModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  children,
  title,
  card,
  coEvents,
  type,
  role,
  isAttended = false,
}) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  // console.log("viewmodal", card);
  const viewInfo = (
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <MdArrowBackIosNew onClick={onClose} />
            <Heading size="lg">{card?.title ?? "Create a Class/Draft"}</Heading>{" "}
            {/* Will add from prop */}
            <MdMoreHoriz opacity={0}/>
          </HStack>
        </ModalHeader>
        <ModalBody>{viewInfo}</ModalBody>

        {(!isAttended && !card?.attendance) && <ModalFooter justifyContent="center">
          <Button
            size="sm"
            background="#757575"
            color="white"
            mr={3}
            onClick={onCancel}
            px={10}
            py={6}
          >
            Cancel RSVP
          </Button>
        </ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
