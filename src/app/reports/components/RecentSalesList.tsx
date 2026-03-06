import { ArrowUpRight, BarChart2 } from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";

export default function RecentSalesList({
  sales,
}: {
  sales: {
    _id: string;
    totalAmount: number;
    _creationTime: number;
    items?: { productName: string; quantity: number }[];
    staffName?: string;
  }[];
}) {
  if (sales.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-14 text-center'>
        <BarChart2 size={32} className='text-gray-200 mb-3' strokeWidth={1.5} />
        <p className='text-sm font-medium text-gray-400'>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className='divide-y divide-gray-50'>
      {sales.slice(0, 8).map((sale) => (
        <div
          key={sale._id}
          className='flex items-center justify-between py-3 px-1 hover:bg-rose-50/30 rounded-lg transition-colors'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0'>
              <ArrowUpRight
                size={14}
                className='text-rose-400'
                strokeWidth={2.5}
              />
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-800'>
                {sale.items?.[0]?.productName ?? "Sale"}
                {(sale.items?.length ?? 0) > 1 && (
                  <span className='ml-1 text-xs text-gray-400 font-normal'>
                    +{(sale.items?.length ?? 1) - 1} more
                  </span>
                )}
              </p>
              <p className='text-xs text-gray-400'>
                {new Date(sale._creationTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {sale.staffName && ` · ${sale.staffName}`}
              </p>
            </div>
          </div>
          <p className='text-sm font-bold text-gray-800 tabular-nums'>
            {formatCurrency(sale.totalAmount)}
          </p>
        </div>
      ))}
    </div>
  );
}
