import { memo, useState } from "react";
import { BaseCard } from "../shared/BaseCard";

export const ClassTeacherCard = memo(
  ({
    id,
    title,
    location,
    date,
    description,
    capacity,
    level,
    costume,
    performance,
    attendeeCount = 0,
    isDraft,
    recurrencePattern,
    isRecurring,
    startDate,
    endDate,
    startTime,
    endTime,
    navigate,
    setSelectedCard,
    tags,
    onOpen,
  }) => {
    const handleClickModal = () => {
      const modalData = {
        id,
        title,
        location,
        date,
        description,
        capacity,
        level,
        costume,
        performances: performance,
        isDraft,
        recurrencePattern,
        isRecurring,
        startDate,
        endDate,
        attendeeCount,
        startTime,
        endTime,
      };
      setSelectedCard(modalData);
      onOpen(modalData);
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
      />
    );
  }
);
