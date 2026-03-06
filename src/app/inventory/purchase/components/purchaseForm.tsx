import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Save } from "lucide-react";

import { PurchaseFormValues, PurchaseFormProps } from "../types";
import PurchaseInfoSection from "./purchaseInfoSection";
import PurchaseItemsSection from "./purchaseItemsSection";
import PurchaseSummarySection from "./purchaseSummarySection";

export default function PurchaseForm({
  onSubmit,
  isLoading,
}: PurchaseFormProps) {
  const methods = useForm<PurchaseFormValues>({
    defaultValues: {
      supplierId: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      notes: "",
      items: [],
    },
  });

  const { watch } = methods;
  const items = watch("items");

  const handleSubmit: SubmitHandler<PurchaseFormValues> = (data) => {
    return onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className='space-y-5'>
        <PurchaseInfoSection />
        <PurchaseItemsSection />
        <PurchaseSummarySection />

        {/* Actions */}
        <div className='rounded-2xl border border-gray-100 shadow-sm bg-white px-6 py-4 flex items-center justify-end gap-3'>
          <Link
            href='/inventory'
            className='px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors'>
            Cancel
          </Link>
          <button
            type='submit'
            disabled={isLoading || items.length === 0}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Recording…
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} />
                Record Purchase
                {items.length > 0 && (
                  <span className='ml-0.5 px-1.5 py-0.5 rounded-md bg-rose-400 text-xs font-bold tabular-nums'>
                    {items.length}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
