import { useFormContext, useWatch } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { UsageFormValues } from "../types";

export default function UsageSummarySection() {
  const { control } = useFormContext<UsageFormValues>();
  const items = useWatch({ control, name: "items" }) ?? [];

  const totalMaterials = items.length;
  const totalUnits = items.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0,
  );

  return (
    <div className='rounded-2xl border border-amber-100 shadow-sm bg-amber-50/40 p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-amber-500 mb-5'>
        Usage Summary
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white rounded-xl border border-amber-100 p-4'>
          <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
            Materials Used
          </p>
          <p className='text-2xl font-bold text-gray-800 tabular-nums mt-1.5'>
            {totalMaterials}
          </p>
        </div>

        <div className='bg-white rounded-xl border border-amber-100 p-4'>
          <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
            Total Units
          </p>
          <p className='text-2xl font-bold text-gray-800 tabular-nums mt-1.5'>
            {totalUnits.toFixed(2)}
          </p>
        </div>
      </div>

      <div className='mt-4 flex items-start gap-3 px-4 py-3 bg-white border border-amber-100 rounded-xl'>
        <AlertTriangle
          size={15}
          className='text-amber-500 flex-shrink-0 mt-0.5'
          strokeWidth={2.5}
        />
        <div>
          <p className='text-xs font-semibold text-gray-700'>
            This action will
          </p>
          <ul className='mt-1.5 space-y-1 text-xs text-gray-400'>
            <li>Reduce stock levels for all selected materials</li>
            <li>Record usage in transaction history</li>
            <li>Cannot be undone — use adjustments to fix mistakes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
