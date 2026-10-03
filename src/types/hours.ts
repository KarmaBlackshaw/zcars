import type { TWeekday } from "./site";

export type TOpenStatus = { day: TWeekday } & ({ isOpen: true; closesAt: string } | { isOpen: false; opensNext?: { day: TWeekday; time: string } });

export type TDaySchedule = { day: TWeekday; label: string };
