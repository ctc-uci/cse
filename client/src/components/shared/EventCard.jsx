import { memo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import TeacherEventViewView from "../bookings/teacherView/TeacherEventViewView";
import SignUpController from "../discovery/SignUpController";
import { BaseCard } from "./BaseCard";

export const EventCard = memo(
  ({
    id,
    title,
    location,
    description,
    level,
    date,
    startTime,
    endTime,
    callTime,
    costume,
    capacity,
    attendeeCount = 0,
    onClick,
    triggerRefresh,
    user = null,
    tags = [],
    magic,
  }) => {
    const { pathname } = useLocation();
    const [openRootModal, setOpenRootModal] = useState(false);
    const [openTeacherModal, setOpenTeacherModal] = useState(false);
    const [currentModal, setCurrentModal] = useState("view");
    const { role } = useAuthContext();

    const closeTeacherModal = () => {
      setOpenTeacherModal(false);
    };

    const handleClickModal = () => {
      if (pathname === "/bookings" && role !== "student") {
        if (currentModal === "view") {
          setOpenTeacherModal(true);
        }
      } else if (pathname === "/bookings") {
        if (onClick) onClick();
      } else {
        setOpenRootModal(true);
      }
    };

    return (
      <BaseCard
        title={title}
        location={location}
        date={date}
        startTime={startTime}
        endTime={endTime}
        attendeeCount={attendeeCount}
        tags={tags}
        onClick={handleClickModal}
      >
        <SignUpController
          event_id={id}
          title={title}
          description={description}
          location={location}
          level={level}
          costume={costume}
          date={date}
          startTime={startTime}
          endTime={endTime}
          capacity={capacity}
          setOpenRootModal={setOpenRootModal}
          openRootModal={openRootModal}
          user={user}
          tags={tags}
        />
        {role && role !== "student" && (
          <TeacherEventViewView
            isOpenProp={openTeacherModal}
            handleClose={closeTeacherModal}
            id={id}
            location={location}
            title={title}
            description={description}
            level={level}
            date={date}
            startTime={startTime}
            endTime={endTime}
            callTime={callTime}
            costume={costume}
            capacity={capacity}
            triggerRefresh={triggerRefresh}
            tags={tags}
            magic={magic}
          />
        )}
      </BaseCard>
    );
  }
);
