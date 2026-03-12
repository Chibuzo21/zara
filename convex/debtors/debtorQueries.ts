import { query } from "../_generated/server";
import { v } from "convex/values";

// ─── Ledger queries ───────────────────────────────────────────────────────────

// All outstanding + partial debts for a staff member.
// Used in DebtorRepaymentCard to show which debts can be paid.
export const getOutstandingByStaff = query({
  args: {
    staffId: v.id("staff"),
  },
  handler: async (ctx, { staffId }) => {
    const ledger = await ctx.db
      .query("debtorLedger")
      .withIndex("by_staff_and_status", (q) =>
        q.eq("salesStaffId", staffId).eq("status", "outstanding"),
      )
      .collect();

    const partial = await ctx.db
      .query("debtorLedger")
      .withIndex("by_staff_and_status", (q) =>
        q.eq("salesStaffId", staffId).eq("status", "partial"),
      )
      .collect();

    // Return all unpaid debts sorted by date ascending (oldest first)
    return [...ledger, ...partial].sort((a, b) =>
      a.saleDate.localeCompare(b.saleDate),
    );
  },
});

// Full ledger for a staff member — all statuses.
// Used for the salesperson's own debt view.
export const getAllByStaff = query({
  args: {
    staffId: v.id("staff"),
  },
  handler: async (ctx, { staffId }) => {
    const entries = await ctx.db
      .query("debtorLedger")
      .withIndex("by_staff", (q) => q.eq("salesStaffId", staffId))
      .collect();

    // Attach the originating sale for context
    return await Promise.all(
      entries.map(async (entry) => {
        const sale = await ctx.db.get(entry.saleId);
        return { ...entry, sale };
      }),
    );
  },
});

// Full ledger — admin view, all staff.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("debtorLedger").collect();
    return await Promise.all(
      entries.map(async (entry) => {
        const sale = await ctx.db.get(entry.saleId);
        const staff = await ctx.db.get(entry.salesStaffId);
        return { ...entry, sale, staff };
      }),
    );
  },
});

// ─── Repayment queries ────────────────────────────────────────────────────────

// Repayments logged by a staff member on a specific date.
// Used in SalesDashboardPage to feed DebtorRepaymentCard and CashReconciliationCard.
export const getRepaymentsByStaffAndDate = query({
  args: {
    staffId: v.id("staff"),
    date: v.string(),
  },
  handler: async (ctx, { staffId, date }) => {
    return await ctx.db
      .query("debtorRepayments")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", staffId).eq("repaymentDate", date),
      )
      .collect();
  },
});

// All repayments against a specific ledger entry.
// Useful for showing payment history on a single debt.
export const getRepaymentsByLedgerEntry = query({
  args: {
    debtorLedgerId: v.id("debtorLedger"),
  },
  handler: async (ctx, { debtorLedgerId }) => {
    return await ctx.db
      .query("debtorRepayments")
      .withIndex("by_ledger", (q) => q.eq("debtorLedgerId", debtorLedgerId))
      .collect();
  },
});
