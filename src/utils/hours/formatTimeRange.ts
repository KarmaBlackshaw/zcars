import { formatTime } from "./formatTime.ts";

export const formatTimeRange = (opens: string, closes: string) => `${formatTime(opens)} to ${formatTime(closes)}`;
