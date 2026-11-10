import type { THoursEntry, TWeekday } from "@/types";

type THoursRun = {
  first: TWeekday;
  last: TWeekday;
  label: string;
};

export const getHoursSummary = (hours: THoursEntry[]) => {
  const runs = getWeekSchedule(hours).reduce<THoursRun[]>((groups, { day, label }) => {
    const run = groups.at(-1);

    if (run?.label === label) {
      run.last = day;
    } else {
      groups.push({ first: day, last: day, label });
    }

    return groups;
  }, []);

  return runs
    .filter(({ label }) => label !== "Closed")
    .map(({ first, last, label }) => (first === last ? `${WEEKDAY_NAMES[first]}, ${label}` : `${WEEKDAY_NAMES[first]} to ${WEEKDAY_NAMES[last]}, ${label}`))
    .join("; ");
};
