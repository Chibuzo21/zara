import React from "react";

import { useFormContext } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Package } from "lucide-react";
import { InventoryFormValues, InventoryCategory } from "../types";

const CATEGORIES: { value: InventoryCategory; label: string }[] = [
  { value: "flour", label: "Flour" },
  { value: "sugar", label: "Sugar" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "flavoring", label: "Flavoring" },
  { value: "packaging", label: "Packaging" },
  { value: "other", label: "Other" },
];

type Supplier = Doc<"suppliers">;

export default function ItemDetailsSection() {
  const suppliers: Supplier[] = useQuery(api.suppliers?.getAll) ?? [];

  const {
    register,
    formState: { errors },
  } = useFormContext<InventoryFormValues>();

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5 flex items-center gap-2'>
        <Package size={15} strokeWidth={2.5} />
        Item Details
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* Item Name */}
        <div className='md:col-span-2'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Item Name <span className='text-rose-400'>*</span>
          </label>
          <input
            {...register("itemName", { required: "Item name is required" })}
            type='text'
            placeholder='e.g., All Purpose Flour'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
          {errors.itemName && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.itemName.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Category <span className='text-rose-400'>*</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Unit of Measurement <span className='text-rose-400'>*</span>
          </label>
          <input
            {...register("unit", { required: "Unit is required" })}
            type='text'
            placeholder='e.g., kg, liters, pieces'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
          <p className='text-xs text-gray-400 mt-1.5'>
            kg, liters, pieces, bags, etc.
          </p>
          {errors.unit && (
            <p className='mt-1 text-xs text-red-500'>{errors.unit.message}</p>
          )}
        </div>

        {/* Supplier */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Supplier
          </label>
          <select
            {...register("supplierId")}
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition bg-white'>
            <option value=''>No Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
          <p className='text-xs text-gray-400 mt-1.5'>Optional</p>
        </div>
      </div>
    </div>
  );
}
