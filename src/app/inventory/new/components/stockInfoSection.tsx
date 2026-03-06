import { useFormContext } from "react-hook-form";
import { InventoryFormValues } from "../types";

interface StockField {
  name: keyof Pick<
    InventoryFormValues,
    "currentStock" | "reorderLevel" | "unitCost"
  >;
  label: string;
  placeholder: string;
  hint: string;
  prefix?: string;
}

const STOCK_FIELDS: StockField[] = [
  {
    name: "currentStock",
    label: "Current Stock",
    placeholder: "0",
    hint: "Current quantity in stock",
  },
  {
    name: "reorderLevel",
    label: "Reorder Level",
    placeholder: "0",
    hint: "Alert when stock reaches this level",
  },
  {
    name: "unitCost",
    label: "Unit Cost",
    placeholder: "0.00",
    hint: "Cost per unit",
    prefix: "₦",
  },
];

export default function StockInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InventoryFormValues>();

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5'>
        Stock Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {STOCK_FIELDS.map(({ name, label, placeholder, hint, prefix }) => (
          <div key={name}>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              {label} <span className='text-rose-400'>*</span>
            </label>
            <div className='relative'>
              {prefix && (
                <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium'>
                  {prefix}
                </span>
              )}
              <input
                {...register(name, {
                  required: `${label} is required`,
                  min: { value: 0, message: "Must be 0 or greater" },
                  valueAsNumber: true,
                })}
                type='number'
                placeholder={placeholder}
                step='0.01'
                className={`w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition ${
                  prefix ? "pl-8 pr-4" : "px-4"
                }`}
              />
            </div>
            <p className='text-xs text-gray-400 mt-1.5'>{hint}</p>
            {errors[name] && (
              <p className='mt-1 text-xs text-red-500'>
                {errors[name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
