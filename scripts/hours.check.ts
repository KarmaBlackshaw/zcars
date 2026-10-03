import assert from "node:assert/strict";
import { formatTime, getOpenStatus, getWeekSchedule } from "../src/utils/hours.ts";

const weekdays = [{ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], opens: "08:00", closes: "18:00" }];
const overnight = [{ days: ["Fri"], opens: "20:00", closes: "02:00" }];

assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-05T10:00:00+08:00")), { day: "Mon", isOpen: true, closesAt: "6:00 PM" });
assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-05T22:00:00+08:00")), { day: "Mon", isOpen: false, opensNext: { day: "Tue", time: "8:00 AM" } });
assert.deepEqual(getOpenStatus(weekdays, new Date("2026-10-10T19:00:00+08:00")), { day: "Sat", isOpen: false, opensNext: { day: "Mon", time: "8:00 AM" } });
assert.deepEqual(getOpenStatus(overnight, new Date("2026-10-10T01:00:00+08:00")), { day: "Sat", isOpen: true, closesAt: "2:00 AM" });
assert.equal(getOpenStatus(overnight, new Date("2026-10-10T03:00:00+08:00")).isOpen, false);
assert.deepEqual(getOpenStatus([], new Date("2026-10-05T10:00:00+08:00")), { day: "Mon", isOpen: false });
assert.equal(getWeekSchedule(weekdays).find((entry) => entry.day === "Sun")?.label, "Closed");
assert.equal(formatTime("00:00"), "12:00 AM");

console.info("hours self-check passed");
