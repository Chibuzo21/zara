import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  UserCheck,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Banknote,
} from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";
import { DebtorRepayment } from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DebtorRepaymentCardProps {
  repayments: DebtorRepayment[]; // today's repayments (from parent query)
  today: string;
  staffId: Id<"staff"> | undefined;
  recordedBy: Id<"users">;
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function DebtStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    outstanding: "bg-red-50 text-red-600 border border-red-100",
    partial: "bg-orange-50 text-orange-600 border border-orange-100",
    settled: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  };
  const labels: Record<string, string> = {
    outstanding: "Outstanding",
    partial: "Partial",
    settled: "Settled",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DebtorRepaymentCard({
  repayments,
  today,
  staffId,
  recordedBy,
}: DebtorRepaymentCardProps) {
  const recordRepayment = useMutation(
    api.debtors.debtorMutations.recordRepayment,
  );
  const reverseRepayment = useMutation(
    api.debtors.debtorMutations.reverseRepayment,
  );

  // Fetch all outstanding/partial debts for this salesperson
  const outstandingDebts =
    useQuery(
      api.debtors.debtorQueries.getOutstandingByStaff,
      staffId ? { staffId } : "skip",
    ) ?? [];

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDebt = outstandingDebts.find((d) => d._id === selectedDebtId);

  // How much is being paid as a fraction of the selected debt's balance
  const parsedAmount = parseFloat(amount) || 0;
  const isFullSettlement = selectedDebt && parsedAmount >= selectedDebt.balance;
  const balanceAfter = selectedDebt
    ? Math.max(0, selectedDebt.balance - parsedAmount)
    : 0;

  const totalRepaidToday = repayments.reduce((acc, r) => acc + r.amount, 0);

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!staffId || !selectedDebtId || !parsedAmount) return;
    if (selectedDebt && parsedAmount > selectedDebt.balance) {
      setError(
        `Amount exceeds outstanding balance of ${formatCurrency(selectedDebt.balance)}.`,
      );
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await recordRepayment({
        debtorLedgerId: selectedDebtId as Id<"debtorLedger">,
        staffId,
        recordedBy,
        repaymentDate: today,
        amount: parsedAmount,
        note: note.trim() || undefined,
      });
      setSelectedDebtId("");
      setAmount("");
      setNote("");
      setShowForm(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to record repayment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Reverse (same-day only) ─────────────────────────────────────────────
  const handleReverse = async (repaymentId: Id<"debtorRepayments">) => {
    if (!confirm("Reverse this repayment? The debt balance will be restored."))
      return;
    try {
      await reverseRepayment({ repaymentId });
    } catch (err: any) {
      alert(err.message ?? "Failed to reverse repayment.");
    }
  };

  return (
    <div className='space-y-4'>
      {/* ── Outstanding debts summary ── */}
      {outstandingDebts.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>
            Outstanding Debts
          </p>
          {outstandingDebts.map((debt) => (
            <div
              key={debt._id}
              className='flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-semibold text-gray-800 truncate'>
                    {debt.customerName}
                  </p>
                  <DebtStatusBadge status={debt.status} />
                </div>
                <p className='text-xs text-gray-400 mt-0.5'>
                  Sale date: {debt.saleDate} · Original:{" "}
                  {formatCurrency(debt.originalAmount)}
                  {debt.status === "partial" && (
                    <> · Paid: {formatCurrency(debt.amountPaid)}</>
                  )}
                </p>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='text-sm font-bold text-red-500 tabular-nums'>
                  {formatCurrency(debt.balance)}
                </p>
                <p className='text-[10px] text-gray-400'>remaining</p>
              </div>
            </div>
          ))}

          {/* Total outstanding */}
          <div className='flex items-center justify-between px-4 py-2 rounded-xl bg-red-500'>
            <span className='text-xs font-semibold text-red-100 uppercase tracking-wider'>
              Total Outstanding
            </span>
            <span className='text-sm font-bold text-white tabular-nums'>
              {formatCurrency(
                outstandingDebts.reduce((acc, d) => acc + d.balance, 0),
              )}
            </span>
          </div>
        </div>
      )}

      {outstandingDebts.length === 0 && repayments.length === 0 && (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <CheckCircle2
            size={28}
            className='text-emerald-300 mb-2'
            strokeWidth={1.5}
          />
          <p className='text-sm text-gray-400'>No outstanding debts</p>
          <p className='text-xs text-gray-300 mt-1'>
            All credit sales have been settled.
          </p>
        </div>
      )}

      {/* ── Today's repayments logged ── */}
      {repayments.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>
            Repayments Logged Today
          </p>
          {repayments.map((r) => (
            <div
              key={r._id}
              className='flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100'>
              <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                <UserCheck
                  size={14}
                  className='text-blue-500'
                  strokeWidth={2}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-gray-800 truncate'>
                  {r.debtorName}
                </p>
                <div className='flex items-center gap-2 mt-0.5 flex-wrap'>
                  {r.note && (
                    <p className='text-xs text-gray-400 truncate'>{r.note}</p>
                  )}
                  <span className='text-[10px] font-semibold text-blue-400'>
                    Balance after: {formatCurrency(r.balanceAfter)}
                  </span>
                  {r.balanceAfter === 0 && (
                    <span className='inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100'>
                      <CheckCircle2 size={9} strokeWidth={2.5} />
                      Settled
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2 flex-shrink-0'>
                <p className='text-sm font-bold text-blue-600 tabular-nums'>
                  {formatCurrency(r.amount)}
                </p>
                {/* Reverse button — same day only */}
                <button
                  type='button'
                  onClick={() => handleReverse(r._id as Id<"debtorRepayments">)}
                  className='text-gray-200 hover:text-red-400 transition-colors'
                  title='Reverse this repayment'>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}

          {/* Total repaid today → feeds into cash reconciliation */}
          <div className='flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600'>
            <span className='text-xs font-semibold text-blue-100 tracking-widest uppercase'>
              Total Repaid Today → Added to Cash
            </span>
            <span className='text-base font-bold text-white tabular-nums'>
              {formatCurrency(totalRepaidToday)}
            </span>
          </div>
        </div>
      )}

      {/* ── Log repayment form ── */}
      {showForm ? (
        <div className='p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-4'>
          {/* Debt selector */}
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Select Debt <span className='text-rose-400'>*</span>
            </label>
            {outstandingDebts.length === 0 ? (
              <p className='text-sm text-gray-400 italic'>
                No outstanding debts to record against.
              </p>
            ) : (
              <div className='relative'>
                <select
                  value={selectedDebtId}
                  onChange={(e) => {
                    setSelectedDebtId(e.target.value);
                    setAmount("");
                    setError(null);
                  }}
                  className='w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition appearance-none'>
                  <option value=''>Choose a debtor…</option>
                  {outstandingDebts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.customerName} — {formatCurrency(d.balance)} remaining
                      {d.status === "partial" ? " (partial)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                />
              </div>
            )}
          </div>

          {/* Debt context card — shown once a debt is selected */}
          {selectedDebt && (
            <div className='px-4 py-3 rounded-xl bg-white border border-gray-100 text-xs space-y-1'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Customer</span>
                <span className='font-semibold text-gray-800'>
                  {selectedDebt.customerName}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Original Amount</span>
                <span className='font-semibold text-gray-800'>
                  {formatCurrency(selectedDebt.originalAmount)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Already Paid</span>
                <span className='font-semibold text-emerald-600'>
                  {formatCurrency(selectedDebt.amountPaid)}
                </span>
              </div>
              <div className='border-t border-gray-100 pt-1 flex justify-between'>
                <span className='text-gray-500 font-semibold'>
                  Balance Remaining
                </span>
                <span className='font-bold text-red-500'>
                  {formatCurrency(selectedDebt.balance)}
                </span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Amount Paid (₦) <span className='text-rose-400'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400'>
                ₦
              </span>
              <input
                type='number'
                placeholder='0'
                min='0'
                step='0.01'
                max={selectedDebt?.balance}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className='w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition'
              />
            </div>

            {/* Live preview of what happens after this payment */}
            {selectedDebt && parsedAmount > 0 && (
              <div className='mt-2 px-3 py-2 rounded-lg bg-white border border-gray-100 flex items-center justify-between text-xs'>
                <span className='text-gray-400'>Balance after payment</span>
                <div className='flex items-center gap-2'>
                  <span
                    className={`font-bold tabular-nums ${
                      isFullSettlement ? "text-emerald-600" : "text-orange-500"
                    }`}>
                    {formatCurrency(balanceAfter)}
                  </span>
                  {isFullSettlement && (
                    <span className='inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100'>
                      <CheckCircle2 size={9} strokeWidth={2.5} />
                      Full Settlement
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'>
              Note (Optional)
            </label>
            <input
              type='text'
              placeholder='e.g. Cash received at shop, invoice #12…'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition'
            />
          </div>

          {/* Error */}
          {error && (
            <div className='flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100'>
              <AlertCircle
                size={13}
                className='text-red-500 flex-shrink-0'
                strokeWidth={2}
              />
              <p className='text-xs text-red-600'>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-3 justify-end'>
            <button
              type='button'
              onClick={() => {
                setShowForm(false);
                setSelectedDebtId("");
                setAmount("");
                setNote("");
                setError(null);
              }}
              className='px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={isSubmitting || !selectedDebtId || !parsedAmount}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Saving…
                </>
              ) : (
                <>
                  <Banknote size={14} strokeWidth={2} />
                  Record Repayment
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Show log button only if there are debts to pay against */
        outstandingDebts.length > 0 && (
          <button
            type='button'
            onClick={() => setShowForm(true)}
            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 transition-colors'>
            <Plus size={13} strokeWidth={2.5} />
            Log Repayment
          </button>
        )
      )}
    </div>
  );
}
