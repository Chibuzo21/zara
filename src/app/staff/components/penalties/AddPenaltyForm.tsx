"use client";

// components/penalties/AddPenaltyForm.tsx
// Drop this wherever you need it — pass preselectedStaffId from the staff detail page

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";

// ─── Validation ───────────────────────────────────────────────────────────────

const penaltySchema = z.object({
  staffId: z.string().min(1, "Select a staff member"),
  amount: z.coerce.number({ error: "Required" }).min(1, "Must be at least ₦1"),
  reason: z.string().min(3, "Provide a reason"),
  category: z.enum(["lateness", "misconduct", "damage", "absence", "other"]),
  penaltyDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type PenaltyFormValues = z.infer<typeof penaltySchema>;

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "lateness", label: "Lateness", emoji: "⏰" },
  { value: "misconduct", label: "Misconduct", emoji: "⚠️" },
  { value: "damage", label: "Damage", emoji: "💔" },
  { value: "absence", label: "Absence", emoji: "🚫" },
  { value: "other", label: "Other", emoji: "📝" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface AddPenaltyFormProps {
  preselectedStaffId?: Id<"staff">;
  onSuccess?: () => void;
}

export default function AddPenaltyForm({
  preselectedStaffId,
  onSuccess,
}: AddPenaltyFormProps) {
  const addPenalty = useMutation(api.staffs.penalties.add);
  const allStaff = useQuery(api.staffs.staff.getAll) ?? [];
  const activeStaff = allStaff.filter((s) => s.status === "active");

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PenaltyFormValues>({
    resolver: zodResolver(penaltySchema) as Resolver<PenaltyFormValues>,
    defaultValues: {
      staffId: preselectedStaffId ?? "",
      penaltyDate: today,
      category: "other",
    },
  });

  const amount = watch("amount");
  const category = watch("category");

  const onSubmit = async (data: PenaltyFormValues) => {
    try {
      await addPenalty({
        staffId: data.staffId as Id<"staff">,
        amount: data.amount,
        reason: data.reason,
        category: data.category,
        penaltyDate: data.penaltyDate,
        notes: data.notes || undefined,
      });
      reset({
        staffId: preselectedStaffId ?? "",
        penaltyDate: today,
        category: "other",
      });
      onSuccess?.();
    } catch (err: any) {
      setError("root", { message: err?.message ?? "Something went wrong." });
    }
  };

  return (
    <div className='rounded-2xl border border-red-100 bg-white shadow-sm p-5'>
      {/* Title */}
      <div className='flex items-center gap-2 mb-5'>
        <div className='p-2 rounded-xl bg-red-50'>
          <AlertTriangle size={14} className='text-red-400' strokeWidth={2.5} />
        </div>
        <h2 className='text-xs font-semibold tracking-widest uppercase text-red-400'>
          Add Penalty
        </h2>
      </div>

      {errors.root && (
        <div className='mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-500'>
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Staff selector — hidden when preselected */}
        {!preselectedStaffId && (
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Staff Member <span className='text-red-400'>*</span>
            </label>
            <select
              {...register("staffId")}
              className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition'>
              <option value=''>Select staff…</option>
              {activeStaff.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName} — {s.role}
                </option>
              ))}
            </select>
            {errors.staffId && (
              <p className='text-xs text-red-400 mt-1'>
                {errors.staffId.message}
              </p>
            )}
          </div>
        )}

        {/* Amount + Date */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Amount (₦) <span className='text-red-400'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
                ₦
              </span>
              <input
                {...register("amount")}
                type='number'
                min='1'
                step='1'
                placeholder='0'
                className='w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition'
              />
            </div>
            {amount > 0 && (
              <p className='text-[11px] text-red-400 mt-1'>
                ₦{Number(amount).toLocaleString()} deducted from base salary
              </p>
            )}
            {errors.amount && (
              <p className='text-xs text-red-400 mt-1'>
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Date <span className='text-red-400'>*</span>
            </label>
            <input
              {...register("penaltyDate")}
              type='date'
              max={today}
              className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition'
            />
            {errors.penaltyDate && (
              <p className='text-xs text-red-400 mt-1'>
                {errors.penaltyDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
            Category <span className='text-red-400'>*</span>
          </label>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className='cursor-pointer'>
                <input
                  {...register("category")}
                  type='radio'
                  value={cat.value}
                  className='sr-only'
                />
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none
                    ${
                      category === cat.value
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-red-100 hover:bg-red-50/40"
                    }`}>
                  {cat.emoji} {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Reason <span className='text-red-400'>*</span>
          </label>
          <input
            {...register("reason")}
            type='text'
            placeholder='e.g. Arrived 2 hours late without notice'
            className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition'
          />
          {errors.reason && (
            <p className='text-xs text-red-400 mt-1'>{errors.reason.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
            Notes <span className='text-gray-300'>(optional)</span>
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder='Any extra context…'
            className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition resize-none'
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className='animate-spin' /> Adding…
            </>
          ) : (
            <>
              <AlertTriangle size={14} strokeWidth={2.5} /> Add Penalty
            </>
          )}
        </button>
      </form>
    </div>
  );
}
