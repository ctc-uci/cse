import ClassInfoModal from "../reviewModals/classInfoModal.jsx";
import ReviewModal from "../reviewModals/reviewModal.jsx";
import ReviewSubmittedModal from "../reviewModals/reviewSubmittedModal.jsx";
import ReviewFailureModal from "../reviewModals/reviewSubmittedModal.jsx";

export const Reviews = () => {
  return (
    <>
      <ReviewModal />
      <ReviewSubmittedModal />
      <ReviewFailureModal />
      <ClassInfoModal />
      <ClassInfoModal
        title="Yoga for Beginners"
        description="A beginner-friendly yoga class that focuses on flexibility and relaxation techniques."
        location="Downtown Studio, Room 301"
        capacity={20}
        level="intermediate"
        costume="Comfortable clothes, no shoes"
      />
    </>
  );
};
