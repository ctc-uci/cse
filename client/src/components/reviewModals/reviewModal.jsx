import { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const ReviewModal = () => {
  const { backend } = useBackendContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [data, setData] = useState();
  const [formSubmitted, setFormSubmitted] = useState(0);

  const handleRatingChange = (event) => {
    setRating(event);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleFormSubmission = async (event) => {
    // event.preventDefault();
    try {
      const response = await backend.post("/reviews", {
        class_id: 73,
        student_id: 153,
        rating: rating,
        review: review,
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Open Review Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a review</ModalHeader>
          <form onSubmit={handleFormSubmission}>
            <ModalBody>
              <FormControl
                isRequired
                isInvalid={false}
              >
                <FormLabel>Rating</FormLabel>
                <RadioGroup onChange={handleRatingChange}>
                  <HStack spacing="20px">
                    <Radio value="1">One star</Radio>
                    <Radio value="2">Two stars</Radio>
                    <Radio value="3">Three stars</Radio>
                    <Radio value="4">Four stars</Radio>
                    <Radio value="5">Five stars</Radio>
                  </HStack>
                </RadioGroup>
                <FormHelperText>
                  Rate this class on a scale from 1 to 5 stars
                </FormHelperText>
                <FormErrorMessage>Rating is required</FormErrorMessage>
              </FormControl>

              <FormControl onChange={handleReviewChange}>
                <FormLabel>Review</FormLabel>
                <Textarea placeholder="Leave a review" />
                <FormHelperText>Leave a review</FormHelperText>
                <FormErrorMessage>
                  There is an error with the review.
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit">Submit</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewModal;
