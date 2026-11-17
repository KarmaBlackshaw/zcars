import type { TDaySchedule, THoursEntry } from "@/types";

import { WEEKDAYS } from "../../constants/hours.ts";
import { formatTimeRange } from "./formatTimeRange.ts";

export const getWeekSchedule = (hours: THoursEntry[]): TDaySchedule[] =>
  WEEKDAYS.map((day) => {
    const ranges = hours
      .filter((entry) => entry.days.includes(day))
      .sort((first, second) => first.opens.localeCompare(second.opens))
      .map((entry) => formatTimeRange(entry.opens, entry.closes));
    const isClosed = ranges.length === 0;

    return { day, label: isClosed ? "Closed" : ranges.join(", "), isClosed };
  });
