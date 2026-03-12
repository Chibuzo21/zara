import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Record a repayment against a specific debtorLedger entry.
// - Reduces the ledger balance
// - Updates ledger status to "partial" or "settled"
// - Inserts a debtorRepayments row (counts toward today's cash reconciliation)
export const recordRepayment = mutation({
  args: {
    debtorLedgerId: v.id("debtorLedger"),
    staffId: v.id("staff"),
    recordedBy: v.id("users"),
    repaymentDate: v.string(),
    amount: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the current ledger entry
    const ledger = await ctx.db.get(args.debtorLedgerId);
    if (!ledger) throw new Error("Debt record not found.");
    if (ledger.status === "settled")
      throw new Error("This debt is already fully settled.");

    // 2. Guard against overpayment
    if (args.amount > ledger.balance) {
      throw new Error(
        `Repayment (₦${args.amount}) exceeds outstanding balance (₦${ledger.balance}).`,
      );
    }

    // 3. Compute new balance and status
    const newAmountPaid = ledger.amountPaid + args.amount;
    const newBalance = ledger.balance - args.amount;
    const isFullySettled = newBalance <= 0;

    const newStatus = isFullySettled
      ? "settled"
      : newAmountPaid > 0
        ? "partial"
        : "outstanding";

    // 4. Update the ledger entry
    await ctx.db.patch(args.debtorLedgerId, {
      amountPaid: newAmountPaid,
      balance: newBalance,
      status: newStatus,
      settledDate: isFullySettled ? args.repaymentDate : undefined,
    });

    // 5. Insert the repayment record (this is what feeds into cash reconciliation)
    await ctx.db.insert("debtorRepayments", {
      debtorLedgerId: args.debtorLedgerId,
      staffId: args.staffId,
      recordedBy: args.recordedBy,
      repaymentDate: args.repaymentDate,
      debtorName: ledger.customerName,
      amount: args.amount,
      note: args.note,
      balanceAfter: newBalance,
    });

    return { newStatus, newBalance, isFullySettled };
  },
});

// Delete a repayment and reverse its effect on the ledger.
// Only allowed on the same day it was recorded (guard enforced on frontend).
export const reverseRepayment = mutation({
  args: {
    repaymentId: v.id("debtorRepayments"),
  },
  handler: async (ctx, { repaymentId }) => {
    const repayment = await ctx.db.get(repaymentId);
    if (!repayment) throw new Error("Repayment not found.");

    const ledger = await ctx.db.get(repayment.debtorLedgerId);
    if (!ledger) throw new Error("Debt record not found.");

    // Reverse the ledger changes
    const restoredAmountPaid = ledger.amountPaid - repayment.amount;
    const restoredBalance = ledger.balance + repayment.amount;
    const restoredStatus =
      restoredAmountPaid <= 0
        ? "outstanding"
        : restoredBalance > 0
          ? "partial"
          : "settled";

    await ctx.db.patch(repayment.debtorLedgerId, {
      amountPaid: restoredAmountPaid,
      balance: restoredBalance,
      status: restoredStatus,
      settledDate:
        restoredStatus !== "settled" ? undefined : ledger.settledDate,
    });

    // Delete the repayment record
    await ctx.db.delete(repaymentId);
  },
});
