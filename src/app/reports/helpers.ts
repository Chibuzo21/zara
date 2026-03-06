import { formatDate, getMonthRange, getWeekRange } from "../../../lib/utils";
import { DateRange, ReportPeriod } from "./types";

export function getDateRange(
  period: ReportPeriod,
  custom: DateRange,
): DateRange {
  const today = new Date().toISOString().split("T")[0];
  switch (period) {
    case "today":
      return { start: today, end: today };
    case "week": {
      const r = getWeekRange();
      return {
        start: r.start.toISOString().split("T")[0],
        end: r.end.toISOString().split("T")[0],
      };
    }
    case "month": {
      const r = getMonthRange();
      return {
        start: r.start.toISOString().split("T")[0],
        end: r.end.toISOString().split("T")[0],
      };
    }
    case "custom":
      return custom;
  }
}

export function periodLabel(period: ReportPeriod, range: DateRange): string {
  if (period === "today") return "Today";
  if (period === "week") return "This Week";
  if (period === "month") return "This Month";
  if (!range.start || !range.end) return "Custom Range";
  return `${formatDate(range.start)} – ${formatDate(range.end)}`;
}
