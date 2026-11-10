export const formatTime = (time: string) => {
  const hours = Number(time.slice(0, 2));
  const period = hours < 12 ? "AM" : "PM";

  return `${hours % 12 || 12}:${time.slice(3, 5)} ${period}`;
};
