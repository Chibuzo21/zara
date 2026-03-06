import { Clock } from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";

interface PendingCommissionBannerProps {
  amount: number;
}

export default function PendingCommissionBanner({
  amount,
}: PendingCommissionBannerProps) {
  if (amount <= 0) return null;

  return (
    <div className='rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 flex items-center gap-4'>
      <div className='flex-shrink-0 p-2.5 rounded-xl bg-amber-100 text-amber-600'>
        <Clock size={18} strokeWidth={2.5} />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-gray-800'>
          Pending Commission
        </p>
        <p className='text-xs text-gray-400 mt-0.5'>
          Awaiting approval from management
        </p>
      </div>
      <p className='text-xl font-bold text-amber-600 tabular-nums flex-shrink-0'>
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
