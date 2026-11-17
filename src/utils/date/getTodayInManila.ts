const manilaDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" });

export const getTodayInManila = (date = new Date()) => manilaDate.format(date);
