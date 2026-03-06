import { SlidersHorizontal } from "lucide-react";
import { StaffMember, ReportFilters } from "../types";

interface AttendanceFiltersProps {
  filters: ReportFilters;
  staff: StaffMember[];
  onChange: (filters: ReportFilters) => void;
}

export default function AttendanceFilters({
  filters,
  staff,
  onChange,
}: AttendanceFiltersProps) {
  const update = (key: keyof ReportFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-4 flex items-center gap-2'>
        <SlidersHorizontal size={14} strokeWidth={2.5} />
        Filters
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Start Date
          </label>
          <input
            type='date'
            value={filters.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            End Date
          </label>
          <input
            type='date'
            value={filters.endDate}
            min={filters.startDate}
            onChange={(e) => update("endDate", e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Staff Member
          </label>
          <select
            value={filters.selectedStaff}
            onChange={(e) => update("selectedStaff", e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            <option value=''>All Staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
