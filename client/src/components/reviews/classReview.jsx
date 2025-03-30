// import useAuthContext from "../../contexts/hooks/useAuthContext";
// import StudentReview from "./studentReview";
import { useEffect, useState } from "react";

import { Box, Divider, HStack, Stack, Text } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ReviewCard from "./reviewCard";
import ReviewCardController from "./ReviewCardController";
import StudentReview from "./studentReview";

const PublishedReviews = ({ classId }) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  const fetchReviews = async () => {
    const reviews = await backend
      .get(`/reviews/class/${classId}`)
      .then((res) => res.data);
    setReviews(reviews);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await backend.get(`/users/${currentUser.uid}`);
      setUser(user.data[0]);
    };
    fetchUser();
    if (classId) {
      fetchReviews();
    }
  }, []);
  async function onUpdate() {
    await fetchReviews();
  }
  return (
    <Stack
      padding="1rem"
      spacing="2"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
      >
        Reviews
      </Text>

      {!reviews.some((review) => review.studentId === user?.id) && (
        <>
          <StudentReview
            displayName={user?.firstName}
            class_id={classId}
            onUpdate={onUpdate}
          />
          <Divider />
        </>
      )}
      <Stack height={"fit-content"}>
        {reviews.map((review, index) => (
          <ReviewCardController
            key={index}
            displayName={user?.firstName}
            reviewText={review.review}
            rating={review.rating}
            student_id={review.studentId}
            class_id={review.classId}
            onUpdate={onUpdate}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PublishedReviews;
