import type { THoursEntry, TOpenStatus } from "@/types";

import { WEEKDAYS } from "../../constants/hours.ts";
import { formatTime } from "./formatTime.ts";
import { getManilaClock } from "./getManilaClock.ts";

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

export const getOpenStatus = (hours: THoursEntry[], date: Date): TOpenStatus => {
  const { day, minutes } = getManilaClock(date);
  const dayIndex = WEEKDAYS.indexOf(day);
  const yesterday = WEEKDAYS[(dayIndex + 6) % 7];

  const openEntry = hours.find((entry) => {
    const opens = toMinutes(entry.opens);
    const closes = toMinutes(entry.closes);
    const isOvernight = closes <= opens;
    const isOpenFromToday = entry.days.includes(day) && minutes >= opens && (isOvernight || minutes < closes);
    const isOpenFromYesterday = isOvernight && entry.days.includes(yesterday) && minutes < closes;

    return isOpenFromToday || isOpenFromYesterday;
  });

  if (openEntry != null) {
    return { day, isOpen: true, closesAt: formatTime(openEntry.closes) };
  }

  for (let offset = 0; offset <= 7; offset++) {
    const nextDay = WEEKDAYS[(dayIndex + offset) % 7];

    const opensTimes = hours
      .filter((entry) => entry.days.includes(nextDay) && (offset > 0 || toMinutes(entry.opens) > minutes))
      .map((entry) => entry.opens)
      .sort();

    if (opensTimes.length > 0) {
      return { day, isOpen: false, opensNext: { day: nextDay, time: formatTime(opensTimes[0]) } };
    }
  }

  return { day, isOpen: false };
};
