export const formatDate = (date: Date) => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("en-us", formatOptions).format(date);
};
