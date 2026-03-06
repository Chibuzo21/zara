import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TodayStatus, AttendanceState } from "../types";

interface AttendanceStatusCardProps {
  todayStatus: TodayStatus | null | undefined;
  state: AttendanceState;
}

export default function AttendanceStatusCard({
  todayStatus,
  state,
}: AttendanceStatusCardProps) {
  const { isClockedIn, isClockedOut } = state;

  const config = isClockedOut
    ? {
        icon: CheckCircle2,
        iconColor: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        label: "Day Complete",
      }
    : isClockedIn
      ? {
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          label: "Currently Clocked In",
        }
      : {
          icon: Clock,
          iconColor: "text-amber-500",
          bg: "bg-amber-50",
          border: "border-amber-100",
          label: "Not Clocked In",
        };

  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-5 flex items-center gap-4 ${config.bg} ${config.border}`}>
      <div className='flex-shrink-0'>
        <Icon size={36} className={config.iconColor} strokeWidth={1.5} />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-base font-bold text-gray-800'>{config.label}</p>

        {todayStatus?.clockInTime && (
          <p className='text-sm text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap'>
            <span>Clocked in at {todayStatus.clockInTime}</span>
            {todayStatus.clockOutTime && (
              <>
                <span className='text-gray-300'>·</span>
                <span>Clocked out at {todayStatus.clockOutTime}</span>
              </>
            )}
            {todayStatus.status === "late" && (
              <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-600 border border-orange-200'>
                <AlertCircle size={10} strokeWidth={2.5} />
                Late
              </span>
            )}
          </p>
        )}

        {todayStatus?.locationVerified !== undefined && (
          <p className='text-xs mt-1'>
            {todayStatus.locationVerified ? (
              <span className='text-emerald-600'>
                ✓ Location verified ({todayStatus.distanceFromBakery}m from
                bakery)
              </span>
            ) : (
              <span className='text-red-500'>✗ Location not verified</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
