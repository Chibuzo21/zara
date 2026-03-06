import { Filter, X } from "lucide-react";

export default function TransactionFilters({
  typeFilter,
  dateFilter,
  onTypeChange,
  onDateChange,
  onClear,
}: {
  typeFilter: string;
  dateFilter: string;
  onTypeChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onClear: () => void;
}) {
  const isFiltered = typeFilter !== "all" || Boolean(dateFilter);

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 flex items-center gap-2'>
          <Filter size={14} strokeWidth={2.5} />
          Filters
        </h2>
        {isFiltered && (
          <button
            type='button'
            onClick={onClear}
            className='inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-rose-500 transition-colors'>
            <X size={12} strokeWidth={2.5} />
            Clear
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Transaction Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            <option value='all'>All Types</option>
            <option value='purchase'>Purchase</option>
            <option value='usage'>Usage</option>
            <option value='waste'>Waste</option>
            <option value='adjustment'>Adjustment</option>
          </select>
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Date
          </label>
          <input
            type='date'
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>
      </div>
    </div>
  );
}
