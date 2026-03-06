import { useFormContext } from "react-hook-form";
import { TrendingDown } from "lucide-react";
import { UsageFormValues } from "../types";

export default function UsageInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UsageFormValues>();

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5 flex items-center gap-2'>
        <TrendingDown size={15} strokeWidth={2.5} />
        Usage Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* Usage Date */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Usage Date <span className='text-rose-400'>*</span>
          </label>
          <input
            {...register("usageDate", { required: "Usage date is required" })}
            type='date'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
          {errors.usageDate && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.usageDate.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Purpose / Notes
          </label>
          <input
            {...register("notes")}
            type='text'
            placeholder='e.g., Bread production batch #123'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>
      </div>
    </div>
  );
}
