import { Medal, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";

export default function TopProductsList({
  products,
}: {
  products: {
    productName: string | undefined;
    quantity: number;
    amount: number;
  }[];
}) {
  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-14 text-center'>
        <ShoppingBag
          size={32}
          className='text-gray-200 mb-3'
          strokeWidth={1.5}
        />
        <p className='text-sm font-medium text-gray-400'>
          No sales for this period
        </p>
      </div>
    );
  }

  const max = products[0].amount;

  return (
    <div className='space-y-3'>
      {products.map((product, index) => {
        const pct = max > 0 ? (product.amount / max) * 100 : 0;
        return (
          <div key={index} className='group'>
            <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50/40 transition-colors'>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  index === 0
                    ? "bg-rose-500 text-white"
                    : index === 1
                      ? "bg-rose-200 text-rose-700"
                      : "bg-gray-100 text-gray-500"
                }`}>
                {index === 0 ? <Medal size={13} /> : index + 1}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1.5'>
                  <p className='text-sm font-semibold text-gray-800 truncate'>
                    {product.productName ?? "Unknown Product"}
                  </p>
                  <p className='text-sm font-bold text-rose-500 tabular-nums ml-3 flex-shrink-0'>
                    {formatCurrency(product.amount)}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-rose-400 rounded-full transition-all duration-500'
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className='text-xs text-gray-400 tabular-nums flex-shrink-0'>
                    {product.quantity} units
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
