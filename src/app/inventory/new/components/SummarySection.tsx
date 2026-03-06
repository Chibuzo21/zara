import { useFormContext, useWatch } from "react-hook-form";
import { InventoryFormValues } from "../types";

interface SummaryRow {
  label: string;
  key: keyof InventoryFormValues;
  format?: (val: string | number) => string;
  accent?: boolean;
}

export default function SummarySection() {
  const { control } = useFormContext<InventoryFormValues>();

  const [itemName, category, currentStock, reorderLevel, unitCost, unit] =
    useWatch({
      control,
      name: [
        "itemName",
        "category",
        "currentStock",
        "reorderLevel",
        "unitCost",
        "unit",
      ],
    });

  const stock = Number(currentStock) || 0;
  const cost = Number(unitCost) || 0;
  const totalValue = stock * cost;

  const rows = [
    { label: "Item Name", value: itemName || "—" },
    {
      label: "Category",
      value: category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "—",
    },
    { label: "Current Stock", value: `${stock} ${unit || ""}`.trim() || "0" },
    {
      label: "Reorder Level",
      value: `${Number(reorderLevel) || 0} ${unit || ""}`.trim(),
    },
    { label: "Unit Cost", value: `₦${cost.toFixed(2)}` },
    { label: "Total Value", value: `₦${totalValue.toFixed(2)}`, accent: true },
  ];

  return (
    <div className='rounded-2xl border border-gray-100 shadow-sm bg-white p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-gray-400 mb-5'>
        Summary
      </h2>

      <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
        {rows.map(({ label, value, accent }) => (
          <div key={label}>
            <p className='text-xs text-gray-400 uppercase tracking-wider font-medium'>
              {label}
            </p>
            <p
              className={`text-sm font-semibold mt-0.5 ${accent ? "text-rose-500" : "text-gray-800"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
