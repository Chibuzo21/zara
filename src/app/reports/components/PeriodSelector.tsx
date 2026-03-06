import { CalendarDays } from "lucide-react";
import { ReportPeriod } from "../types";

export function PeriodSelector({
  period,
  onChange,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: {
  period: ReportPeriod;
  onChange: (p: ReportPeriod) => void;
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}) {
  const PERIODS: { key: ReportPeriod; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "custom", label: "Custom" },
  ];
  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
      <div className='flex flex-wrap items-center gap-2'>
        <CalendarDays size={14} className='text-rose-300' strokeWidth={2} />
        <span className='text-xs font-semibold uppercase tracking-widest text-rose-400 mr-2'>
          Period
        </span>
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            type='button'
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              period === key
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {period === "custom" && (
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
              Start Date
            </label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => onStartChange(e.target.value)}
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
              End Date
            </label>
            <input
              type='date'
              value={endDate}
              min={startDate}
              onChange={(e) => onEndChange(e.target.value)}
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
            />
          </div>
        </div>
      )}
    </div>
  );
}
