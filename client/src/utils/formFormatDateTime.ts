export const formFormatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// doesn't have to be used as can just feed start/end/call time directly from prop, but just there in case this changes in the future
// export const formFormatTime = (timeString: string) => {
//   return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// };
