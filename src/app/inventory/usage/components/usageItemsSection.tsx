import {
  useFormContext,
  useFieldArray,
  useWatch,
  Controller,
} from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Plus, Trash2, TrendingDown } from "lucide-react";
import { UsageFormValues, UsageReason } from "../types";

type InventoryItem = Doc<"inventoryItems">;

const REASONS: { value: UsageReason; label: string }[] = [
  { value: "production", label: "🍞 Production" },
  { value: "damaged", label: "💔 Damaged" },
  { value: "missing", label: "❓ Missing" },
  { value: "waste", label: "🗑️ Waste" },
  { value: "expired", label: "⏰ Expired" },
  { value: "spillage", label: "💧 Spillage" },
];

function UsageItemRow({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const inventoryItems: InventoryItem[] =
    useQuery(api.inventory.inventory.getAll) ?? [];

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<UsageFormValues>();

  const [itemId, currentStock, unit, quantity, reason] = useWatch({
    control,
    name: [
      `items.${index}.itemId`,
      `items.${index}.currentStock`,
      `items.${index}.unit`,
      `items.${index}.quantity`,
      `items.${index}.reason`,
    ],
  });

  const qty = Number(quantity) || 0;
  const stock = Number(currentStock) || 0;
  const remaining = stock - qty;
  const exceedsStock = qty > stock;

  const handleItemSelect = (id: string) => {
    const selected = inventoryItems.find((item) => item._id === id);
    if (selected) {
      setValue(`items.${index}.itemName`, selected.itemName);
      setValue(`items.${index}.currentStock`, selected.currentStock);
      setValue(`items.${index}.unit`, selected.unit);
    }
  };

  const fieldError = errors.items?.[index];

  return (
    <div className='p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-3'>
      <div className='grid grid-cols-1 md:grid-cols-6 gap-4 items-end'>
        {/* Material Select */}
        <div className='md:col-span-2'>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
            Material <span className='text-rose-400'>*</span>
          </label>
          <select
            {...register(`items.${index}.itemId`, { required: "Required" })}
            onChange={(e) => {
              register(`items.${index}.itemId`).onChange(e);
              handleItemSelect(e.target.value);
            }}
            className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            <option value=''>Select material…</option>
            {inventoryItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.itemName} (Available: {item.currentStock} {item.unit})
              </option>
            ))}
          </select>
          {fieldError?.itemId && (
            <p className='mt-1 text-xs text-red-500'>
              {fieldError.itemId.message}
            </p>
          )}
        </div>

        {/* Available (read-only) */}
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
            Available
          </label>
          <div className='px-3 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-gray-500 tabular-nums'>
            {stock > 0 ? (
              `${stock} ${unit}`
            ) : (
              <span className='text-gray-300'>—</span>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
            Qty Used <span className='text-rose-400'>*</span>
          </label>
          <input
            {...register(`items.${index}.quantity`, {
              required: "Required",
              min: { value: 0.01, message: "Must be > 0" },
              valueAsNumber: true,
            })}
            type='number'
            placeholder='0'
            step='0.01'
            min='0'
            className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition ${
              exceedsStock
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-200 focus:ring-rose-200 focus:border-rose-300"
            }`}
          />
          {exceedsStock && (
            <p className='mt-1 text-xs text-red-500'>Exceeds available stock</p>
          )}
          {fieldError?.quantity && !exceedsStock && (
            <p className='mt-1 text-xs text-red-500'>
              {fieldError.quantity.message}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
            Reason <span className='text-rose-400'>*</span>
          </label>
          <select
            {...register(`items.${index}.reason`, { required: "Required" })}
            className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {fieldError?.reason && (
            <p className='mt-1 text-xs text-red-500'>
              {fieldError.reason.message}
            </p>
          )}
        </div>

        {/* Remove */}
        <div>
          <button
            type='button'
            onClick={onRemove}
            className='w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 border border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors'>
            <Trash2 size={14} strokeWidth={2} />
            Remove
          </button>
        </div>
      </div>

      {/* Stock preview */}
      {itemId && (
        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 text-xs text-gray-500'>
          <span className='tabular-nums'>
            {stock} {unit}
          </span>
          <span className='text-gray-300'>−</span>
          <span className='tabular-nums'>{qty}</span>
          <span className='text-gray-300'>=</span>
          <span
            className={`font-semibold tabular-nums ${
              remaining < 0
                ? "text-red-500"
                : remaining === 0
                  ? "text-amber-500"
                  : "text-emerald-600"
            }`}>
            {remaining} {unit}
          </span>
          <span className='text-gray-300 mx-1'>·</span>
          <span className='text-gray-400 capitalize'>
            {REASONS.find((r) => r.value === reason)?.label ?? ""}
          </span>
        </div>
      )}
    </div>
  );
}

export default function UsageItemsSection() {
  const { control } = useFormContext<UsageFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const handleAddItem = () => {
    append({
      itemId: "",
      itemName: "",
      currentStock: 0,
      unit: "",
      quantity: 0,
      reason: "production",
    });
  };

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
          Materials Used
        </h2>
        <button
          type='button'
          onClick={handleAddItem}
          className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors'>
          <Plus size={14} strokeWidth={2.5} />
          Add Material
        </button>
      </div>

      {fields.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 rounded-xl border-2 border-dashed border-gray-100 text-center'>
          <TrendingDown
            size={32}
            className='text-gray-200 mb-3'
            strokeWidth={1.5}
          />
          <p className='text-sm font-medium text-gray-400'>
            No materials added yet
          </p>
          <p className='text-xs text-gray-300 mt-1'>
            Click "Add Material" to record stock usage
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {fields.map((field, index) => (
            <UsageItemRow
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
