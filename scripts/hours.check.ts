import assert from "node:assert/strict";
import { formatTime } from "../src/utils/hours/formatTime.ts";
import { getHoursSummary } from "../src/utils/hours/getHoursSummary.ts";
import { getOpenStatus } from "../src/utils/hours/getOpenStatus.ts";
import { getWeekSchedule } from "../src/utils/hours/getWeekSchedule.ts";

const weekdays = [{ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], opens: "08:00", closes: "18:00" }];
const overnight = [{ days: ["Fri"], opens: "20:00", closes: "02:00" }];
const saturdayOff = [{ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"], opens: "08:00", closes: "18:00" }];

assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-05T10:00:00+08:00")), { day: "Mon", isOpen: true, closesAt: "6:00 PM" });
assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-05T22:00:00+08:00")), { day: "Mon", isOpen: false, opensNext: { day: "Tue", time: "8:00 AM" } });
assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-10T19:00:00+08:00")), { day: "Sat", isOpen: false, opensNext: { day: "Mon", time: "8:00 AM" } });
assert.deepEqual(getOpenStatus(overnight, new Date("2026-10-10T01:00:00+08:00")), { day: "Sat", isOpen: true, closesAt: "2:00 AM" });
assert.equal(getOpenStatus(overnight, new Date("2026-10-10T03:00:00+08:00")).isOpen, false);
assert.deepEqual(getOpenStatus([], new Date("2026-10-05T10:00:00+08:00")), { day: "Mon", isOpen: false });

assert.deepEqual(
  getWeekSchedule(weekdays).find((entry) => entry.day === "Sun"),
  { day: "Sun", label: "Closed", isClosed: true }
);

assert.equal(getHoursSummary(saturdayOff), "Monday to Friday, 8:00 AM to 6:00 PM; Sunday, 8:00 AM to 6:00 PM");
assert.equal(formatTime("00:00"), "12:00 AM");

console.info("hours self-check passed");
