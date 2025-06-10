import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IoIosArrowBack } from "react-icons/io";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { ProgressBar } from "./ProgressBar";

export const CardModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  title,
  description,
  tags,
  link,
  s3URL,
  ajax,
  allTags,
}) => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [user_name, setUserName] = useState(currentUser?.displayName || "");
  const today = new Date();
  const posted_date = today.toLocaleDateString();

  const onGoBack = () => {
    setCurrentModal("form");
  };

  useEffect(() => {
    backend.get(`/users/${currentUser?.uid}`).then((response) => {
      setUserName(
        response?.data[0]?.firstName && response?.data[0]?.lastName
          ? `${response?.data[0]?.firstName} ${response?.data[0]?.lastName}`
          : currentUser?.displayName || "current user"
      );
    });
  }, [currentUser, backend]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton
            aria-label="Search database"
            variant="ghost"
            onClick={onGoBack}
          >
            <IoIosArrowBack />
          </IconButton>
          Is everything correct?
          <ProgressBar currStep={5} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card
            maxW="sm"
            bg="gray.50"
            border="0.5px solid"
            borderColor="gray.300"
          >
            <CardBody
              p={2}
              m={2}
            >
              <Heading
                fontSize="18px"
                color="gray.700"
                fontWeight={500}
              >
                {title}
              </Heading>
              <p>{description}</p>
              <p>Posted by {user_name}</p>
              <Link
                href={link}
                isExternal
              >
                <Image
                  src={s3URL}
                  alt={`image thumbnail`}
                />
              </Link>
            </CardBody>
            <CardFooter>
              <VStack
                align="flex-start"
                spacing={2}
              >
                {/* Posted date, uses current date cus easy */}
                <Text>Posted {posted_date}</Text>
                <Flex
                  gap={2}
                  flexWrap="wrap"
                >
                  {tags.map((tag, _) => (
                    <Badge
                      key={tag}
                      px={2}
                      py={1}
                      borderRadius="full"
                      border="none"
                      color="purple.50"
                      bg="purple.300"
                      textTransform="none"
                      fontSize="10px"
                    >
                      {Object.keys(allTags)
                        .find((key) => allTags[key] === tag)
                        ?.charAt(0)
                        .toUpperCase() +
                        Object.keys(allTags)
                          .find((key) => allTags[key] === tag)
                          ?.slice(1)}
                    </Badge>
                  ))}
                </Flex>
              </VStack>
            </CardFooter>
          </Card>
        </ModalBody>
        <ModalFooter>
          <VStack
            spacing={8}
            sx={{ maxWidth: "100%", marginX: "auto" }}
          >
            <Button
              bg="purple.500"
              color="white"
              px={16}
              onClick={ajax}
            >
              Post
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
