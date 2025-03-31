import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { BsChevronLeft } from "react-icons/bs";
import { formatDate } from "../../utils/formatDateTime";
import { QRCode } from "./teacherView/qrcode/QRCode.jsx";
import { ClassRSVP } from "../rsvp/classRsvp.jsx"

export const TeacherViewModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  classData,
  performances,
}) => {

  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const enterEditMode = () => {
    setCurrentModal("edit");
  };

  const { isOpen: isRSVPOpen, onOpen: onRSVPOpen, onClose: onRSVPClose } = useDisclosure();

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <Flex
          align="center"
          w="100%"
          position="relative"
        >
          <IconButton
            onClick={onClose}
            icon={<BsChevronLeft />}
            position="absolute"
            left={5}
            backgroundColor="white"
          />
          <ModalHeader
            flex={1}
            textAlign="center"
          >
            {classData?.title}
          </ModalHeader>
          <Menu>
            <MenuButton
              as={Button}
              position="absolute"
              right={5}
            >
              ...
            </MenuButton>
            <MenuList
              backgroundColor="rgba(0, 0, 0, 0.7)"
              color="white"
              borderRadius="8px"
              padding="4px"
            >
              <MenuItem
                value="edit"
                onClick={enterEditMode}
                background="transparent"
              >
                Edit
              </MenuItem>
              <MenuItem
                value="delete"
                onClick={onCancel}
                background="transparent"
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <ModalBody>
          <Flex
            gap="40"
            justify="center"
          >
            <div>
              <Text
                fontWeight="bold"
                mb="1rem"
              >
                Location
              </Text>
              <Text>{classData?.location}</Text>
            </div>
            <div>
              <Text
                fontWeight="bold"
                mb="1rem"
              >
                Date
              </Text>
              <Text>{formatDate(classData?.date)}</Text>
            </div>
          </Flex>
          <VStack>
            <Box
              bg="gray.200"
              h="100%"
              w="100%"
              mt="4"
              mb="4"
              p="4"
            >
              <Box
                bg="gray"
                h="100%"
                w="100%"
                p="4"
                mt="4"
                color="white"
              >
                <Center>
                  <QRCode
                    id={classData?.id}
                    type="Class"
                    date={classData?.date}
                  >
                  </QRCode>
                </Center>
                <Center>
                  <Button
                    colorScheme="blue"
                    mr={3}
                  >
                    Share
                  </Button>
                </Center>
              </Box>
              <Box width="100%" align="center">
                <Text fontWeight="bold"> {classData?.rsvpCount ? classData?.rsvpCount : 0} RSVPs</Text>
                <Button
                  onClick={onRSVPOpen}
                  variant="unstyled"
                  fontSize="lg"
                  fontWeight="normal"
                  color="purple"
                  textDecoration="underline"
                  _focus={{ boxShadow: "none" }}
                >
                  View attendees &gt;
                </Button>
                <ClassRSVP isOpen={isRSVPOpen} onClose={onRSVPClose} card={{id: classData?.id, name: classData?.title, date: classData?.date}}/>
              </Box>
            </Box>
          </VStack>
          <Box>
            <Text
              fontWeight="bold"
              mb="1rem"
            >
              Time
            </Text>
            <Text>
              {classData?.startTime} -{" "}
              {classData?.endTime}
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="bold"
              mb="1rem"
            >
              Description
            </Text>
            <Text>{classData?.description}</Text>
          </Box>
          <Flex
            gap="40"
            justify="center"
          >
            <div>
              <Text
                fontWeight="bold"
                mb="1rem"
              >
                Capacity
              </Text>
              <Text>{classData?.capacity}</Text>
            </div>
            <div>
              <Text
                fontWeight="bold"
                mb="1rem"
              >
                Level
              </Text>
              <Text>{classData?.level}</Text>
            </div>
          </Flex>
          <Box>
            <Text
              fontWeight="bold"
              mb="0.5rem"
            >
              Performance(s)
            </Text>
            {performances.map((performance) => (
              <Text key={performance.id}>{performance.title}</Text>
            ))}
            <Text></Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
