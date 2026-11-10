import type { THoursEntry, TWeekday } from "@/types";

import { WEEKDAY_NAMES } from "../../constants/hours.ts";
import { getWeekSchedule } from "./getWeekSchedule.ts";

type THoursRun = {
  first: TWeekday;
  last: TWeekday;
  label: string;
  isClosed: boolean;
};

export const getHoursSummary = (hours: THoursEntry[]) => {
  const runs = getWeekSchedule(hours).reduce<THoursRun[]>((groups, { day, label, isClosed }) => {
    const run = groups.at(-1);

    if (run?.label === label) {
      run.last = day;
    } else {
      groups.push({ first: day, last: day, label, isClosed });
    }

    return groups;
  }, []);

  return runs
    .filter(({ isClosed }) => !isClosed)
    .map(({ first, last, label }) => (first === last ? `${WEEKDAY_NAMES[first]}, ${label}` : `${WEEKDAY_NAMES[first]} to ${WEEKDAY_NAMES[last]}, ${label}`))
    .join("; ");
};
