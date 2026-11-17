const shortDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", timeZone: "UTC" });
const shortDateWithYear = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const formatShortDate = (date: string) => {
  const isCurrentYear = date.startsWith(getTodayInManila().slice(0, 4));

  return (isCurrentYear ? shortDate : shortDateWithYear).format(new Date(date));
};

export const formatPromoValidity = (startsOn?: string, endsOn?: string) => {
  if (startsOn != null && startsOn > getTodayInManila()) {
    return `Starts ${formatShortDate(startsOn)}`;
  }

  return endsOn != null ? `Until ${formatShortDate(endsOn)}` : "";
};
