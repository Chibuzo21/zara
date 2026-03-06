import { useFormContext, useWatch } from "react-hook-form";
import { formatCurrency } from "../../../../../lib/utils";
import { PurchaseFormValues } from "../types";

export default function PurchaseSummarySection() {
  const { control } = useFormContext<PurchaseFormValues>();
  const items = useWatch({ control, name: "items" }) ?? [];

  const totalItems = items.length;
  const totalUnits = items.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0,
  );
  const totalAmount = items.reduce(
    (sum, item) =>
      sum + (Number(item?.quantity) || 0) * (Number(item?.unitCost) || 0),
    0,
  );

  const stats = [
    { label: "Total Items", value: totalItems, color: "text-gray-800" },
    {
      label: "Total Units",
      value: totalUnits.toFixed(2),
      color: "text-gray-800",
    },
    {
      label: "Total Amount",
      value: formatCurrency(totalAmount),
      color: "text-rose-500",
      large: true,
    },
  ];

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-rose-50/40 p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5'>
        Purchase Summary
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {stats.map(({ label, value, color, large }) => (
          <div
            key={label}
            className='bg-white rounded-xl border border-rose-100 p-4'>
            <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
              {label}
            </p>
            <p
              className={`${large ? "text-2xl" : "text-2xl"} font-bold tabular-nums mt-1.5 ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className='mt-4 flex items-start gap-3 px-4 py-3 bg-white border border-rose-100 rounded-xl'>
        <span className='text-base mt-0.5'>💡</span>
        <div>
          <p className='text-xs font-semibold text-gray-700'>
            What happens next
          </p>
          <ul className='mt-1.5 space-y-1 text-xs text-gray-400'>
            <li>Stock levels will be increased automatically</li>
            <li>Purchase will be recorded in transaction history</li>
            <li>Each item's current stock will update</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
