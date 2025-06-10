import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { ProgressBar } from "./ProgressBar";
import { UploadComponent } from "./UploadComponent";

export const FormModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  title,
  setTitle,
  description,
  setDescription,
  link,
  setLink,
  s3URL,
  setS3URL,
  tags,
  setTags,
  allTags,
}) => {
  const { backend } = useBackendContext();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Add/remove tags from the tags array
  const handleClassFilterToggle = (tag) => () => {
    const tagId = allTags[tag];
    setTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const isLink = (link) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(link);
  };

  const fetchS3URL = async () => {
    try {
      const URLResponse = await backend.get("/s3/url");
      console.log(URLResponse);
      return URLResponse.data.url;
    } catch (error) {
      console.error("Error fetching S3 URL:", error);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select file to upload");
      return false;
    }

    setUploading(true);
    setMessage("Uploading...");

    try {
      // Get S3 URL from server backend
      const url = await fetchS3URL();

      console.log(setS3URL);

      // Upload file to S3 bucket
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        setMessage("File uploaded successfully!");
        // Removed debug console.log statements
        setS3URL(url);
        return true;
      } else {
        throw new Error("Failed to upload file.");
        return false;
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed, please try again.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={4}>
          <Flex
            align="center"
            position="relative"
            justify="center"
          >
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<AiOutlineArrowLeft />}
              position="absolute"
              left={0}
              onClick={() => setCurrentModal("select-class")}
            />
            <Text fontSize="xl">Fill out information</Text>
          </Flex>
          <ProgressBar currStep={2} />
        </ModalHeader>
        <ModalBody mt={4}>
          <form>
            <FormControl>
              <FormLabel mb={1}>Enter title</FormLabel>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                border="none"
                borderRadius={0}
                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
              />
            </FormControl>
            <br />
            <FormControl mb={1}>
              <FormLabel>Enter a description</FormLabel>
              <Textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
              />
            </FormControl>
            <br />
            <FormControl mb={1}>
              <FormLabel>Enter a link</FormLabel>
              <Input
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link"
                border="none"
                borderRadius={0}
                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
              />
            </FormControl>
            <br />
            <FormControl mb={1}>
              <FormLabel>Select tags</FormLabel>
              <Flex
                gap={3}
                flexWrap="wrap"
                width="100%"
              >
                {Object.keys(allTags).map((tag) => (
                  <Badge
                    key={tag}
                    onClick={handleClassFilterToggle(tag)}
                    rounded="full"
                    border={tags.includes(allTags[tag]) ? "none" : "1px solid"}
                    borderColor="gray.300"
                    color={
                      tags.includes(allTags[tag]) ? "purple.800" : "gray.600"
                    }
                    bg={tags.includes(allTags[tag]) ? "purple.100" : "white"}
                    textTransform="none"
                    cursor="pointer"
                    transition="all 0.2s ease-in-out"
                  >
                    <HStack>
                      <Text
                        p={1}
                        fontWeight={
                          tags.includes(allTags[tag]) ? "bold" : "normal"
                        }
                      >
                        {tag.charAt(0).toUpperCase() +
                          tag.slice(1).toLowerCase()}
                      </Text>
                      {tags.includes(allTags[tag]) && (
                        <IconButton
                          bg="transparent"
                          aria-label="Close"
                          icon={
                            <IoCloseSharp
                              color="purple.800"
                              opacity={0.5}
                            />
                          }
                          variant="unstyled"
                          minW={0}
                          h="auto"
                          p={0}
                          m={0}
                          ml={-2}
                        />
                      )}
                    </HStack>
                  </Badge>
                ))}
              </Flex>
            </FormControl>
            <br />
            <FormControl mb={1}>
              <FormLabel>Select thumbnail</FormLabel>
              <UploadComponent
                file={file}
                setFile={setFile}
                message={message}
              />
            </FormControl>
            <br />
          </form>
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
              isDisabled={uploading}
              onClick={async () => {
                if (title === "" || description === "" || link === "") {
                  setMessage("Please fill out every fields");
                } else if (!isLink(link)) {
                  setMessage("Please enter a valid link");
                } else if (!file) {
                  setMessage("Please select a file");
                } else {
                  const uploaded = await uploadFile();
                  if (!uploaded) {
                    return;
                  }
                  setCurrentModal("card");
                }
              }}
            >
              Next
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
