"use client";

// components/penalties/MonthlyPaySummary.tsx
// Shows base salary, penalties for the selected month, and net pay.
// Commission is displayed separately (read-only) and does NOT affect net pay.

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";

interface MonthlyPaySummaryProps {
  staffId: Id<"staff">;
  baseSalary: number;
  /** Pass latest commission amount if available — displayed for reference only */
  commissionAmount?: number;
}

export default function MonthlyPaySummary({
  staffId,
  baseSalary,
  commissionAmount,
}: MonthlyPaySummaryProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const { monthStart, monthEnd, label } = useMemo(() => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      monthStart: start.toISOString().split("T")[0],
      monthEnd: end.toISOString().split("T")[0],
      label: start.toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [year, month]);

  const penalties =
    useQuery(api.staffs.penalties.getByStaffAndMonth, {
      staffId,
      monthStart,
      monthEnd,
    }) ?? [];

  const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);
  const netPay = Math.max(0, baseSalary - totalPenalties);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className='rounded-2xl border border-rose-100 bg-white shadow-sm p-5'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-xs font-semibold tracking-widest uppercase text-rose-400'>
          Monthly Pay
        </h2>
        <div className='flex items-center gap-1.5'>
          <button
            onClick={prevMonth}
            className='p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors'>
            <ChevronLeft size={13} strokeWidth={2.5} />
          </button>
          <span className='text-xs font-semibold text-gray-600 min-w-[100px] text-center tabular-nums'>
            {label}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className='p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'>
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Pay rows */}
      <div className='space-y-2.5'>
        {/* Base Salary */}
        <div className='flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-100'>
          <div className='flex items-center gap-2.5'>
            <div className='p-1.5 rounded-lg bg-emerald-100'>
              <Wallet size={12} className='text-emerald-600' strokeWidth={2} />
            </div>
            <span className='text-sm text-gray-600 font-medium'>
              Base Salary
            </span>
          </div>
          <span className='font-bold text-emerald-600 tabular-nums text-sm'>
            ₦{baseSalary.toLocaleString()}
          </span>
        </div>

        {/* Penalties */}
        <div className='flex items-center justify-between px-4 py-3 rounded-xl bg-red-50/50 border border-red-100'>
          <div className='flex items-center gap-2.5'>
            <div className='p-1.5 rounded-lg bg-red-100'>
              <AlertTriangle
                size={12}
                className='text-red-500'
                strokeWidth={2}
              />
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='text-sm text-gray-600 font-medium'>
                Penalties
              </span>
              {penalties.length > 0 && (
                <span className='text-[11px] text-red-400 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full'>
                  {penalties.length}
                </span>
              )}
            </div>
          </div>
          <span
            className={`font-bold tabular-nums text-sm ${totalPenalties > 0 ? "text-red-500" : "text-gray-300"}`}>
            {totalPenalties > 0 ? `−₦${totalPenalties.toLocaleString()}` : "—"}
          </span>
        </div>

        {/* Divider */}
        <div className='border-t border-dashed border-gray-100' />

        {/* Net Pay */}
        <div className='flex items-center justify-between px-4 py-3.5 rounded-xl bg-rose-50 border border-rose-200'>
          <div className='flex items-center gap-2.5'>
            <div className='p-1.5 rounded-lg bg-rose-100'>
              <BadgeCheck size={12} className='text-rose-500' strokeWidth={2} />
            </div>
            <span className='text-sm font-bold text-gray-800'>Net Pay</span>
          </div>
          <span className='text-base font-bold text-rose-500 tabular-nums'>
            ₦{netPay.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Commission — separate, reference only */}
      {commissionAmount !== undefined && commissionAmount > 0 && (
        <div className='mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50/50 border border-amber-100'>
          <span className='text-xs text-amber-600 font-medium'>
            Commission (separate)
          </span>
          <span className='text-xs font-bold text-amber-600 tabular-nums'>
            ₦{commissionAmount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Penalty breakdown */}
      {penalties.length > 0 && (
        <div className='mt-4'>
          <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2'>
            Penalty Breakdown
          </p>
          <div className='space-y-1.5'>
            {penalties.map((p) => (
              <div
                key={p._id}
                className='flex items-start justify-between text-xs text-gray-500 gap-2'>
                <span className='truncate'>{p.reason}</span>
                <span className='text-red-400 tabular-nums font-semibold flex-shrink-0'>
                  −₦{p.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className='text-[11px] text-gray-300 mt-4 text-center leading-relaxed'>
        Commission is tracked separately · does not affect net pay
      </p>
    </div>
  );
}
