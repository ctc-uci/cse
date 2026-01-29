import { useEffect, useState } from "react";

import { Button, Card } from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ReviewCard from "./reviewCard";
import StudentReview from "./studentReview";

function ReviewCardController(props) {
  const { rating, reviewText, class_id, student_id, onUpdate } = props;

  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [isEditing, setIsEditing] = useState(false);
  const [student, setStudent] = useState(null);
  const toggleEdition = () => setIsEditing(!isEditing);
  const update = async () => {
    await onUpdate();
    toggleEdition();
  };
  useEffect(() => {
    const fetchStudent = async () => {
      const user = await backend.get(`/students/${student_id}`);
      setStudent(user.data);
    };

    fetchStudent();
  }, [backend, student_id]);
  return (
    <Card
      position="relative"
      width="100%"
    >
      {currentUser.uid === student?.firebaseUid && (
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
      )}

      {!isEditing ? (
        <ReviewCard {...props} />
      ) : (
        <StudentReview
          {...props}
          onUpdate={update}
          editMode={isEditing}
        />
      )}
    </Card>
  );
}

export default ReviewCardController;
