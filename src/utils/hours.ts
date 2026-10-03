import type { TDaySchedule, THoursEntry, TOpenStatus, TWeekday } from "../types";

const WEEKDAYS: readonly TWeekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const WEEKDAY_NAMES: Record<TWeekday, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const manilaClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

const getManilaClock = (date: Date) => {
  const parts = manilaClock.formatToParts(date);
  const readPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  const weekday = readPart("weekday");
  const day = WEEKDAYS.find((candidate) => candidate === weekday);

  if (day == null) {
    throw new Error(`Unexpected Manila weekday: ${weekday}`);
  }

  return { day, minutes: Number(readPart("hour")) * 60 + Number(readPart("minute")) };
};

export const formatTime = (time: string) => {
  const hours = Number(time.slice(0, 2));
  const period = hours < 12 ? "AM" : "PM";

  return `${hours % 12 || 12}:${time.slice(3, 5)} ${period}`;
};

export const formatTimeRange = (opens: string, closes: string) => `${formatTime(opens)} to ${formatTime(closes)}`;

export const getManilaWeekday = (date: Date) => getManilaClock(date).day;

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

export const getWeekSchedule = (hours: THoursEntry[]): TDaySchedule[] =>
  WEEKDAYS.map((day) => {
    const ranges = hours
      .filter((entry) => entry.days.includes(day))
      .sort((first, second) => first.opens.localeCompare(second.opens))
      .map((entry) => formatTimeRange(entry.opens, entry.closes));

    return { day, label: ranges.length > 0 ? ranges.join(", ") : "Closed" };
  });
