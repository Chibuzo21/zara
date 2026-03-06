import { Doc } from "../../../../convex/_generated/dataModel";

export type Sale = Doc<"sales"> & {
  product?: { productName: string };
};

export type StaffRecord = Doc<"staff">;
export type CommissionRecord = Doc<"commissionRecords">;

export interface DerivedStats {
  todayTotal: number;
  todayCash: number;
  todayTransfer: number;
  todayPos: number;
  monthTotal: number;
  todayCommission: number;
  monthCommission: number;
  pendingCommission: number;
}
