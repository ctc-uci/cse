import React, { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { FaStar } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const StudentReview = ({
  rating,
  reviewText,
  class_id,
  student_id,
  displayName,
  onUpdate,
}) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [starRating, setStarRating] = useState(rating ?? 0);
  const [review, setReview] = useState(reviewText ?? "");
  const [stars, setStars] = useState(Array(5).fill(0));

  const [hoverValue, setHoverValue] = useState(undefined);

  const handleMouseOverStar = (value) => {
    console.log(value);
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = (value) => {
    setStarRating(value);
  };
  const colors = {
    orange: "#F2C265",
    grey: "a9a9a9",
  };

  const isError = review === "" || starRating === 0;
  async function postReview() {
    if (isError) return;

    let response;
    if (student_id) {
      response = await backend.put("/reviews", {
        class_id: class_id,
        student_id: student_id,
        rating: starRating,
        review: review,
      });
    } else {
      const users = await backend.get(`/users/${currentUser.uid}`);
      response = await backend.post("/reviews", {
        class_id: class_id,
        student_id: users.data[0].id,
        rating: starRating,
        review: review,
      });
    }

    if (response.status === 200 || response.status === 201) {
      onUpdate();
      setReview("");
      setStarRating(0);
    }
  }

  return (
    <CardBody>
      <FormControl>
        <HStack>
          <Avatar
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
          <Text>{displayName}</Text>
        </HStack>
        <HStack>
          {stars.map((_, index) => (
            <FaStar
              key={index}
              size={24}
              value={starRating}
              onChange={(e) => setStarRating(e.target.value)}
              color={
                (hoverValue || starRating) > index ? colors.orange : colors.grey
              }
              onClick={() => handleClickStar(index + 1)}
              onMouseOver={() => handleMouseOverStar(index + 1)}
              onMouseLeave={() => handleMouseLeaveStar}
            />
          ))}
        </HStack>

        <Textarea
          placeholder="Type Here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button
          onClick={postReview}
          colorScheme={isError ? "gray" : "blue"}
          disabled={isError}
        >
          Post
        </Button>
      </FormControl>
    </CardBody>
  );
};

export default StudentReview;
