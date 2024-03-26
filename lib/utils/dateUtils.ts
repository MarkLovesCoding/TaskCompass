export const formatTimeStamp = (timestamp: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    minute: "2-digit",
    hour: "2-digit",
    hour12: true,
  };

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};
