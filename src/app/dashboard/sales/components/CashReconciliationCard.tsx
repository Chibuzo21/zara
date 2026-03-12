import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Edit2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { formatCurrency } from "../../../../../lib/utils";
import { Resolver } from "react-hook-form";

// ─── Schema ───────────────────────────────────────────────────────────────────

const cashSchema = z.object({
  openingCash: z.coerce.number({ error: "Required" }).min(0, "Must be ≥ 0"),
  closingCash: z.coerce.number({ error: "Required" }).min(0, "Must be ≥ 0"),
  notes: z.string().optional(),
});

type CashFormValues = z.infer<typeof cashSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CashReconciliationCardProps {
  todayCash: number;
  todayTotal: number;
  today: string;
  staffName: string;
  debtorRepaymentTotal: number;
  onSubmitSuccess?: () => void; // called after successful submit so parent can mark step done
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CashReconciliationCard({
  todayCash,
  todayTotal,
  today,
  staffName,
  debtorRepaymentTotal,
  onSubmitSuccess,
}: CashReconciliationCardProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const createOperation = useMutation(
    api.operations.operationsMutations.create,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CashFormValues>({
    resolver: zodResolver(cashSchema) as Resolver<CashFormValues>,
  });

  const [openingCash, closingCash] = watch(["openingCash", "closingCash"]);

  const expected = (openingCash ?? 0) + todayCash + debtorRepaymentTotal;
  const variance = (closingCash ?? 0) - expected;
  const hasPreview = openingCash > 0 || closingCash > 0;

  const onSubmit = async (data: CashFormValues) => {
    const cashVariance =
      data.closingCash - (data.openingCash + todayCash + debtorRepaymentTotal);
    try {
      await createOperation({
        operationDate: today,
        openingCash: data.openingCash,
        closingCash: data.closingCash,
        totalSales: todayTotal,
        totalExpenses: 0,
        cashVariance,
        notes: data.notes || `Submitted by ${staffName}`,
        status: "closed",
      });
      setSubmitted(true);
      setShowForm(false);
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting cash report:", error);
      alert("Failed to submit cash report. Please try again.");
    }
  };

  // ─── Submitted state ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className='flex items-center gap-3 px-4 py-3 bg-white border border-emerald-100 rounded-xl'>
        <CheckCircle2
          size={18}
          className='text-emerald-500 flex-shrink-0'
          strokeWidth={2}
        />
        <div>
          <p className='text-sm font-semibold text-gray-800'>
            Cash report submitted for today
          </p>
          <p className='text-xs text-gray-400 mt-0.5'>
            Your cash reconciliation has been recorded.
          </p>
        </div>
      </div>
    );
  }

  // ─── Default (empty) state ────────────────────────────────────────────────
  if (!showForm) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center gap-3'>
        <p className='text-sm text-gray-400'>No cash report submitted yet.</p>
        <button
          type='button'
          onClick={() => setShowForm(true)}
          className='inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-600 border border-amber-200 bg-white hover:bg-amber-50 transition-colors'>
          <Edit2 size={13} strokeWidth={2} />
          Enter Cash
        </button>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Opening Cash */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Opening Cash (₦) <span className='text-rose-400'>*</span>
          </label>
          <div className='relative'>
            <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400'>
              ₦
            </span>
            <input
              {...register("openingCash", { valueAsNumber: true })}
              type='number'
              placeholder='10000'
              step='0.01'
              min='0'
              className='w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition'
            />
          </div>
          <p className='text-xs text-gray-400 mt-1'>Cash you started with</p>
          {errors.openingCash && (
            <p className='text-xs text-red-500 mt-1'>
              {errors.openingCash.message}
            </p>
          )}
        </div>

        {/* Closing Cash */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Closing Cash (₦) <span className='text-rose-400'>*</span>
          </label>
          <div className='relative'>
            <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400'>
              ₦
            </span>
            <input
              {...register("closingCash", { valueAsNumber: true })}
              type='number'
              placeholder='25000'
              step='0.01'
              min='0'
              className='w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition'
            />
          </div>
          <p className='text-xs text-gray-400 mt-1'>Cash you have now</p>
          {errors.closingCash && (
            <p className='text-xs text-red-500 mt-1'>
              {errors.closingCash.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className='md:col-span-2'>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Any notes about today's cash…"
            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition resize-none'
          />
        </div>
      </div>

      {/* Live breakdown */}
      {hasPreview && (
        <div className='p-4 bg-white border border-amber-100 rounded-xl space-y-2 text-xs'>
          {[
            {
              label: "Opening Cash",
              value: formatCurrency(openingCash ?? 0),
              color: "text-gray-700",
              divider: false,
            },
            {
              label: "Cash Sales",
              value: formatCurrency(todayCash),
              color: "text-gray-700",
              divider: false,
            },
            {
              label: "Debt Repayments",
              value: formatCurrency(debtorRepaymentTotal),
              color: "text-blue-600",
              divider: false,
            },
            {
              label: "Expected Total",
              value: formatCurrency(expected),
              color: "text-gray-900",
              divider: true,
            },
            {
              label: "Closing Cash (Actual)",
              value: formatCurrency(closingCash ?? 0),
              color: "text-gray-900",
              divider: false,
            },
            {
              label: "Variance",
              value: formatCurrency(variance),
              color: variance >= 0 ? "text-emerald-600" : "text-red-500",
              divider: true,
            },
          ].map(({ label, value, color, divider }) => (
            <div key={label}>
              {divider && <div className='border-t border-amber-100 my-1.5' />}
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 uppercase tracking-wider font-semibold'>
                  {label}
                </span>
                <span className={`font-bold tabular-nums text-sm ${color}`}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className='flex gap-3 justify-end'>
        <button
          type='button'
          onClick={() => setShowForm(false)}
          className='px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-colors'>
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
          {isSubmitting ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Submitting…
            </>
          ) : (
            "Submit Cash Report"
          )}
        </button>
      </div>
    </form>
  );
}
