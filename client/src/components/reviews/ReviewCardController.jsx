import { useState } from "react";

import { Button, Card } from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";

import ReviewCard from "./reviewCard";
import StudentReview from "./studentReview";

function ReviewCardController(props) {
  const { rating, reviewText, class_id, student_id, onUpdate } = props;

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdition = () => setIsEditing(!isEditing);

  return (
    <Card position="relative">
      <Button
        position={"absolute"}
        top={0}
        right={0}
        width={"fit-content"}
        onClick={toggleEdition}
        zIndex={100}
      >
        <FaPencilAlt />
      </Button>
      {!isEditing ? <ReviewCard {...props} /> : <StudentReview {...props} />}
    </Card>
  );
}

export default ReviewCardController;
