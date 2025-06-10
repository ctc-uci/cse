export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

// Default date constant (Unix epoch)
export const DEFAULT_DATE = "1970-01-01";

// Function to get a default date value
export const getDefaultDate = (dateString?: string) => {
  if (!dateString) return DEFAULT_DATE;
  return dateString;
};

export const isDefaultDate = (date: string) => {
  if (!date) return true;
  return date.split("T")[0] === "1970-01-01";
};

export const formatTime = (timeString: string) => {
  if (!timeString) return "";
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const calculateRecurringDates = (
  startDate: Date,
  endDate: Date,
  pattern: string
) => {
  if (pattern === "none" || !startDate || !endDate) {
    return [startDate];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);

    switch (pattern) {
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "biweekly":
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case "monthly": {
        const month = currentDate.getMonth();
        currentDate.setMonth(month + 1);
        if (currentDate.getDate() !== start.getDate()) {
          currentDate.setDate(0);
        }
        break;
      }
      default:
        currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return dates;
};
