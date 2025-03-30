import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter, IconButton, VStack, Wrap, WrapItem, Text, Spinner } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { ProgressBar } from "./ProgressBar";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";

export const SelectTagModal = ({ isOpen, onClose, setCurrentModal, tags, setTags, clsId }) => {
  const { backend } = useBackendContext();
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  // Fetch tags for the selected class
  useEffect(() => {
    const fetchTags = async () => {
      if (!clsId) {
        console.error("No class ID provided");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching tags for class:", clsId);
        const response = await backend.get(`/class-tags/tags/${clsId}`);
        console.log("Raw tag data:", response.data);
        
        if (response.data && response.data.length > 0) {
          // Extract tags from the response based on the structure shown
          const processedTags = response.data.map(item => ({
            id: item.tagId,
            name: item.tag
          }));
          
          console.log("Processed tags:", processedTags);
          setAvailableTags(processedTags);
        } else {
          console.log("No tags found for this class");
          setAvailableTags([]);
        }
      } catch (error) {
        console.error('Error fetching tags for class:', error);
        // Fallback if needed
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [backend, clsId]);

  const onGoBack = () => {
    setCurrentModal("form");
  };

  const onConfirm = () => {
    setCurrentModal("upload-photo");
  };

  const toggleTag = (tagId) => {
    if (tags.includes(tagId)) {
      setTags(tags.filter(id => id !== tagId));
    } else {
      setTags([...tags, tagId]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton aria-label="Go back" variant='ghost' onClick={onGoBack}>
            <IoIosArrowBack />
          </IconButton>
          Select Tags
          <ProgressBar currStep={3}/>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <VStack py={6}>
              <Spinner size="lg" />
              <Text>Loading tags...</Text>
            </VStack>
          ) : (
            <>
              {availableTags.length > 0 ? (
                <>
                  <Text mb={3}>Select tags for this resource:</Text>
                  <Wrap spacing={3} py={2}>
                    {availableTags.map((tag) => (
                      <WrapItem key={tag.id}>
                        <Button 
                          colorScheme={tags.includes(tag.id) ? "teal" : "blue"}
                          onClick={() => toggleTag(tag.id)}
                          mb={2}
                        >
                          {tag.name}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                </>
              ) : (
                <Text>No tags available for this class. Please contact your administrator to add tags.</Text>
              )}
              
              {tags.length > 0 && (
                <Text mt={4}>
                  Selected Tags: {tags.length}
                </Text>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <VStack
            spacing={8}
            sx={{ maxWidth: "100%", marginX: "auto" }}
          >
            <Button colorScheme='gray' mr={3} onClick={onConfirm}>
              Next
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};