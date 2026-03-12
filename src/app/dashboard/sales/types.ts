import { Doc } from "../../../../convex/_generated/dataModel";

export type Sale = Doc<"sales"> & {
  product?: { productName: string };
};

export type StaffRecord = Doc<"staff">;
export type CommissionRecord = Doc<"commissionRecords">;

export interface StockReconciliationCardProps {
  todaySales: Sale[];
  staffId: string | undefined;
  today: string;
}

export type StockRow = {
  id: string; // local key only
  productId: string;
  openingQty: number;
  damagedQty: number;
};
export interface PendingCommissionBannerProps {
  amount: number;
}
export interface CashReconciliationCardProps {
  todayCash: number;
  todayTotal: number;
  today: string;
  staffName: string;
  debtorRepaymentTotal: number; // ← ADD THIS
}
// ─── ADD TO YOUR EXISTING types.ts ───────────────────────────────────────────

// 2. Add this field to your existing DerivedStats type:
//
//   debtorRepaymentTotal: number;
//

// 3. Add productId to your existing Sale type if it's not already there:
//    productId: string;
//
// It's referenced in StockReconciliationCard's soldMap to group sales by product.
// ─── ADD / REPLACE IN YOUR EXISTING types.ts ─────────────────────────────────

// 1. DebtorLedger — one record per credit sale, tracks the debt lifecycle
export type DebtorLedger = {
  _id: string;
  saleId: string;
  salesStaffId: string;
  recordedBy: string;
  customerName: string;
  saleDate: string;
  originalAmount: number;
  amountPaid: number;
  balance: number;
  status: "outstanding" | "partial" | "settled";
  settledDate?: string;
  notes?: string;
  // joined fields from queries
  sale?: any;
  staff?: any;
};

// 2. DebtorRepayment — REPLACE your existing DebtorRepayment type with this
//    (adds debtorLedgerId and balanceAfter fields)
export type DebtorRepayment = {
  _id: string;
  debtorLedgerId: string; // links to the specific debt being paid
  staffId: string;
  recordedBy: string;
  repaymentDate: string;
  debtorName: string;
  amount: number;
  note?: string;
  balanceAfter: number; // balance on that debt after this payment
};

// 3. StockEntry — unchanged from before
export type StockEntry = {
  _id: string;
  staffId: string;
  recordedBy: string;
  entryDate: string;
  productId: string;
  productName?: string;
  openingQty: number;
  damagedQty: number;
  notes?: string;
  product?: {
    productName: string;
    basePrice: number;
  };
};

// 4. DerivedStats — add debtorRepaymentTotal if not already there
export type DerivedStats = {
  todayTotal: number;
  todayCash: number;
  todayTransfer: number;
  todayPos: number;
  monthTotal: number;
  todayCommission: number;
  monthCommission: number;
  pendingCommission: number;
  debtorRepaymentTotal: number;
};

// 5. Ensure your existing Sale type includes productId:
//    productId: string;
