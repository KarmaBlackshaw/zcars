import { WEEKDAYS } from "../../constants/hours.ts";

const manilaClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const getManilaClock = (date: Date) => {
  const parts = manilaClock.formatToParts(date);
  const readPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  const weekday = readPart("weekday");
  const day = WEEKDAYS.find((candidate) => candidate === weekday);

  if (day == null) {
    throw new Error(`Unexpected Manila weekday: ${weekday}`);
  }

  return { day, minutes: Number(readPart("hour")) * 60 + Number(readPart("minute")) };
};
