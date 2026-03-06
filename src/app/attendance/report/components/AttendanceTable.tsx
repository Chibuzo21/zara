import { MapPin, CheckCircle2, Clock, XCircle } from "lucide-react";
import { AttendanceRecord } from "../types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

function computeHours(clockIn?: string, clockOut?: string): string {
  if (!clockIn || !clockOut) return "—";
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);
  const mins = outH * 60 + outM - (inH * 60 + inM);
  if (mins <= 0) return "—";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const STATUS_CONFIG = {
  present: {
    label: "Present",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  late: {
    label: "Late",
    icon: Clock,
    className: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    className: "bg-red-50 text-red-600 border border-red-100",
  },
} as const;

type AttendanceStatus = keyof typeof STATUS_CONFIG;

export default function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-rose-100 bg-rose-50/60'>
              {[
                "Date",
                "Staff Name",
                "Clock In",
                "Clock Out",
                "Hours",
                "Status",
                "Location",
              ].map((h) => (
                <th
                  key={h}
                  className='px-5 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-rose-400 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>📋</span>
                    <span>No attendance records found for this period</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const hours = computeHours(
                  record.clockInTime,
                  record.clockOutTime,
                );
                const status = (record.status ?? "absent") as AttendanceStatus;
                const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.absent;
                const StatusIcon = statusCfg.icon;

                return (
                  <tr
                    key={record._id}
                    className='group transition-colors duration-150 hover:bg-rose-50/40'>
                    {/* Date */}
                    <td className='px-5 py-4'>
                      <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors'>
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Staff */}
                    <td className='px-5 py-4 font-medium text-gray-700'>
                      {record.staff?.fullName ?? (
                        <span className='text-gray-300 italic'>Unknown</span>
                      )}
                    </td>

                    {/* Clock In */}
                    <td className='px-5 py-4 tabular-nums text-gray-500'>
                      {record.clockInTime ?? (
                        <span className='text-gray-200'>—</span>
                      )}
                    </td>

                    {/* Clock Out */}
                    <td className='px-5 py-4 tabular-nums text-gray-500'>
                      {record.clockOutTime ?? (
                        <span className='text-gray-200'>—</span>
                      )}
                    </td>

                    {/* Hours */}
                    <td className='px-5 py-4 font-semibold text-gray-700 tabular-nums'>
                      {hours}
                    </td>

                    {/* Status */}
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusCfg.className}`}>
                        <StatusIcon size={11} strokeWidth={2.5} />
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Location */}
                    <td className='px-5 py-4'>
                      {record.locationVerified ? (
                        <span className='inline-flex items-center gap-1 text-xs font-medium text-emerald-600'>
                          <MapPin size={11} strokeWidth={2} />
                          {record.distanceFromBakery}m
                        </span>
                      ) : (
                        <span className='text-xs text-gray-300 italic'>
                          Not verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
          <span className='text-xs text-gray-300'>Attendance · Report</span>
        </div>
      )}
    </div>
  );
}
