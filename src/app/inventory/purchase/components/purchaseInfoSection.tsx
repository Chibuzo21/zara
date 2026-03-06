import { useFormContext } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { ShoppingCart } from "lucide-react";
import { PurchaseFormValues } from "../types";

type Supplier = Doc<"suppliers">;

export default function PurchaseInfoSection() {
  const suppliers: Supplier[] = useQuery(api.suppliers?.getAll) ?? [];

  const {
    register,
    formState: { errors },
  } = useFormContext<PurchaseFormValues>();

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-6'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-5 flex items-center gap-2'>
        <ShoppingCart size={15} strokeWidth={2.5} />
        Purchase Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
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
        </div>

        {/* Purchase Date */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Purchase Date <span className='text-rose-400'>*</span>
          </label>
          <input
            {...register("purchaseDate", {
              required: "Purchase date is required",
            })}
            type='date'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
          {errors.purchaseDate && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.purchaseDate.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Notes
          </label>
          <input
            {...register("notes")}
            type='text'
            placeholder='Invoice #, delivery notes, etc.'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition'
          />
        </div>
      </div>
    </div>
  );
}
