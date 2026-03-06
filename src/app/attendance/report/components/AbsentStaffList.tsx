import { AlertTriangle, UserX } from "lucide-react";
import { StaffMember } from "../types";

interface AbsentStaffListProps {
  absentStaff: StaffMember[];
  today: string;
  onMarkAbsent: (staffId: string, date: string) => Promise<void>;
}

export default function AbsentStaffList({
  absentStaff,
  today,
  onMarkAbsent,
}: AbsentStaffListProps) {
  if (absentStaff.length === 0) return null;

  return (
    <div className='rounded-2xl border border-red-100 shadow-sm bg-red-50/40 p-5'>
      <div className='flex items-center gap-2 mb-4'>
        <AlertTriangle size={14} className='text-red-400' strokeWidth={2.5} />
        <h3 className='text-sm font-semibold tracking-widest uppercase text-red-400'>
          Staff Not Clocked In Today
        </h3>
        <span className='ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-500'>
          {absentStaff.length}
        </span>
      </div>

      <div className='space-y-2'>
        {absentStaff.map((s) => (
          <div
            key={s._id}
            className='flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-red-100'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0'>
                <UserX size={14} className='text-red-400' strokeWidth={2} />
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-800'>
                  {s.fullName}
                </p>
                <p className='text-xs text-gray-400 capitalize'>{s.role}</p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => onMarkAbsent(s._id, today)}
              className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors'>
              Mark Absent
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
