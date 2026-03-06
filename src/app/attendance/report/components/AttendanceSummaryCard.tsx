import { Users, UserCheck, Clock, UserX } from "lucide-react";
import { AttendanceSummary } from "../types";

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export default function AttendanceSummaryCards({
  summary,
}: AttendanceSummaryCardsProps) {
  const cards = [
    {
      label: "Total Staff",
      value: summary.totalActive,
      icon: Users,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Present Today",
      value: summary.presentToday,
      icon: UserCheck,
      accent: "bg-emerald-500 text-white border-emerald-500",
    },
    {
      label: "Late Today",
      value: summary.lateToday,
      icon: Clock,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Absent Today",
      value: summary.absentToday,
      icon: UserX,
      accent:
        summary.absentToday > 0
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-gray-800 border-gray-100",
    },
  ] as const;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className={`rounded-2xl border p-5 shadow-sm flex flex-col gap-3 ${accent}`}>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-widest opacity-60'>
              {label}
            </span>
            <Icon size={16} className='opacity-30' strokeWidth={2} />
          </div>
          <p className='text-2xl font-bold tabular-nums leading-none'>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
