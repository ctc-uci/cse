export enum Level {
    beginner = "beginner",
    intermediate = "intermediate",
    advanced = "advanced"
}

export type Booking = {
  id: number;
  title: string;
  description: string;
  location: string;
  level: Level;
  date: string;
  start_time: string;
  end_time: string;
  is_draft: boolean;
};

export type Class = Booking & {
  capacity: number;
  classType: string; // "just a normal string"
};

export type Event = Booking & {
  call_time: string;
};

export type Booking = Class | Event;

export function isClass(booking: Booking): booking is Class {
  return (booking as Class).capacity !== undefined;
}

export function isEvent(booking: Booking): booking is Event {
  return (booking as Event).call_time !== undefined;
}
