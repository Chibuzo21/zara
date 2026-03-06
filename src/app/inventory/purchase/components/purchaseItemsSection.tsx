import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";
import { PurchaseFormValues } from "../types";

type InventoryItem = Doc<"inventoryItems">;

function ItemRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  const inventoryItems: InventoryItem[] =
    useQuery(api.inventory.inventory.getAll) ?? [];

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<PurchaseFormValues>();

  const [quantity, unitCost] = useWatch({
    control,
    name: [`items.${index}.quantity`, `items.${index}.unitCost`],
  });

  const totalCost = (Number(quantity) || 0) * (Number(unitCost) || 0);

  const handleItemSelect = (itemId: string) => {
    const selected = inventoryItems.find((item) => item._id === itemId);
    if (selected) {
      setValue(`items.${index}.itemName`, selected.itemName);
      setValue(`items.${index}.unitCost`, selected.unitCost);
    }
  };

  const fieldError = errors.items?.[index];

  return (
    <div className='p-4 bg-gray-50/80 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-6 gap-4 items-end'>
      {/* Item Select */}
      <div className='md:col-span-2'>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
          Item <span className='text-rose-400'>*</span>
        </label>
        <select
          {...register(`items.${index}.itemId`, { required: "Required" })}
          onChange={(e) => {
            register(`items.${index}.itemId`).onChange(e);
            handleItemSelect(e.target.value);
          }}
          className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
          <option value=''>Select item…</option>
          {inventoryItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.itemName} ({item.unit})
            </option>
          ))}
        </select>
        {fieldError?.itemId && (
          <p className='mt-1 text-xs text-red-500'>
            {fieldError.itemId.message}
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
          Qty <span className='text-rose-400'>*</span>
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
          className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
        />
        {fieldError?.quantity && (
          <p className='mt-1 text-xs text-red-500'>
            {fieldError.quantity.message}
          </p>
        )}
      </div>

      {/* Unit Cost */}
      <div>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
          Unit Cost <span className='text-rose-400'>*</span>
        </label>
        <div className='relative'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium'>
            ₦
          </span>
          <input
            {...register(`items.${index}.unitCost`, {
              required: "Required",
              min: { value: 0, message: "Must be ≥ 0" },
              valueAsNumber: true,
            })}
            type='number'
            placeholder='0.00'
            step='0.01'
            min='0'
            className='w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>
        {fieldError?.unitCost && (
          <p className='mt-1 text-xs text-red-500'>
            {fieldError.unitCost.message}
          </p>
        )}
      </div>

      {/* Total Cost (read-only) */}
      <div>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
          Total
        </label>
        <div className='px-3 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-semibold text-rose-500 tabular-nums'>
          {formatCurrency(totalCost)}
        </div>
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
  );
}

export default function PurchaseItemsSection() {
  const { control } = useFormContext<PurchaseFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const handleAddItem = () => {
    append({
      itemId: "",
      itemName: "",
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
    });
  };

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
          Items to Purchase
        </h2>
        <button
          type='button'
          onClick={handleAddItem}
          className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors'>
          <Plus size={14} strokeWidth={2.5} />
          Add Item
        </button>
      </div>

      {fields.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 rounded-xl border-2 border-dashed border-gray-100 text-center'>
          <ShoppingCart
            size={32}
            className='text-gray-200 mb-3'
            strokeWidth={1.5}
          />
          <p className='text-sm font-medium text-gray-400'>
            No items added yet
          </p>
          <p className='text-xs text-gray-300 mt-1'>
            Click "Add Item" to build your purchase order
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {fields.map((field, index) => (
            <ItemRow
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
