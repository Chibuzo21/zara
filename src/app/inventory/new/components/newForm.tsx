import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Save } from "lucide-react";

import { InventoryFormValues, NewFormProps } from "../types";
import ItemDetailsSection from "./itemDetailsSection";
import StockInfoSection from "./stockInfoSection";
import StockPreviewSection from "./stockPreviewSection";
import SummarySection from "./SummarySection";

export default function NewForm({ onSubmit, isLoading }: NewFormProps) {
  const methods = useForm<InventoryFormValues>({
    defaultValues: {
      itemName: "",
      category: "flour",
      unit: "",
      reorderLevel: 0,
      currentStock: 0,
      unitCost: 0,
      supplierId: "",
    },
  });

  const handleSubmit: SubmitHandler<InventoryFormValues> = (data) => {
    return onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-5'>
        <ItemDetailsSection />
        <StockInfoSection />
        <StockPreviewSection />
        <SummarySection />

        {/* Actions */}
        <div className='rounded-2xl border border-gray-100 shadow-sm bg-white px-6 py-4 flex items-center justify-end gap-3'>
          <Link
            href='/inventory'
            className='px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors'>
            Cancel
          </Link>
          <button
            type='submit'
            disabled={isLoading}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'>
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} />
                Add to Inventory
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
