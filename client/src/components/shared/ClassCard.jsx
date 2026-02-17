import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SignUpController from "../discovery/SignUpController";
import { BaseCard } from "./BaseCard";

export const ClassCard = memo(
  ({
    title,
    location,
    date,
    startTime,
    endTime,
    attendeeCount = 0,
    id,
    user = null,
    onClick = null,
    tags = [],
  }) => {
    const { backend } = useBackendContext();
    const [classDate, setClassDate] = useState(null);
    const [openRootModal, setOpenRootModal] = useState(false);
    const { pathname } = useLocation();

    const handleClick = () => {
      if (pathname === "/bookings") {
        if (onClick) onClick();
      } else {
        setOpenRootModal(true);
      }
    };

    useEffect(() => {
      const fetchClassDate = async () => {
        if (!classDate && id) {
          const response = await backend.get(`/scheduled-classes/${id}`);
          if (response?.data[0]?.date) {
            const newDate = new Date(response.data[0].date).toLocaleDateString(
              "en-US"
            );
            setClassDate(newDate);
          }
        }
      };
      fetchClassDate();
    }, [backend, classDate, id]);

    return (
      <BaseCard
        title={title}
        location={location}
        date={date}
        startTime={startTime}
        endTime={endTime}
        attendeeCount={attendeeCount}
        tags={tags}
        onClick={handleClick}
      >
        <SignUpController
          class_id={id}
          title={title}
          location={location}
          date={classDate || date}
          startTime={startTime}
          endTime={endTime}
          setOpenRootModal={setOpenRootModal}
          openRootModal={openRootModal}
          user={user}
          tags={tags}
        />
      </BaseCard>
    );
  }
);
