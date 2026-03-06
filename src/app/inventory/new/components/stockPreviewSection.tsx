import { useFormContext, useWatch } from "react-hook-form";
import { TrendingDown, XCircle, CheckCircle2 } from "lucide-react";
import { InventoryFormValues } from "../types";

function StatusBadge({ stock, reorder }: { stock: number; reorder: number }) {
  if (!stock && stock !== 0) {
    return <span className='text-sm font-medium text-gray-400'>Not set</span>;
  }
  if (stock === 0) {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100'>
        <XCircle size={11} strokeWidth={2.5} /> Out of Stock
      </span>
    );
  }
  if (stock <= reorder) {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100'>
        <TrendingDown size={11} strokeWidth={2.5} /> Low Stock
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100'>
      <CheckCircle2 size={11} strokeWidth={2.5} /> Good Stock
    </span>
  );
}

export default function StockPreviewSection() {
  const { control } = useFormContext<InventoryFormValues>();

  const [currentStock, unitCost, reorderLevel, unit] = useWatch({
    control,
    name: ["currentStock", "unitCost", "reorderLevel", "unit"],
  });

  const stock = Number(currentStock) || 0;
  const cost = Number(unitCost) || 0;
  const reorder = Number(reorderLevel) || 0;
  const totalValue = stock * cost;
  const isLow = stock > 0 && stock <= reorder;

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-rose-50/40 p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5'>
        Stock Preview
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Total Value */}
        <div className='bg-white rounded-xl border border-rose-100 p-4'>
          <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
            Total Value
          </p>
          <p className='text-2xl font-bold text-rose-500 mt-1.5 tabular-nums'>
            ₦{totalValue.toFixed(2)}
          </p>
          <p className='text-xs text-gray-400 mt-1'>
            {stock} × ₦{cost}
          </p>
        </div>

        {/* Stock Status */}
        <div className='bg-white rounded-xl border border-rose-100 p-4'>
          <p className='text-xs text-gray-400 uppercase tracking-wider font-medium mb-2'>
            Stock Status
          </p>
          <StatusBadge stock={stock} reorder={reorder} />
        </div>

        {/* Stock Level */}
        <div className='bg-white rounded-xl border border-rose-100 p-4'>
          <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
            Stock Level
          </p>
          <p className='text-2xl font-bold text-gray-800 mt-1.5 tabular-nums'>
            {stock}{" "}
            <span className='text-sm font-medium text-gray-400'>{unit}</span>
          </p>
          <p className='text-xs text-gray-400 mt-1'>Reorder at: {reorder}</p>
        </div>
      </div>

      {isLow && (
        <div className='mt-4 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl'>
          <TrendingDown
            size={15}
            className='text-amber-500 flex-shrink-0 mt-0.5'
            strokeWidth={2.5}
          />
          <p className='text-xs text-amber-700'>
            <span className='font-semibold'>Warning:</span> Current stock is at
            or below the reorder level. Consider ordering more stock.
          </p>
        </div>
      )}
    </div>
  );
}
