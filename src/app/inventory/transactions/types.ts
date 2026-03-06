import { Doc } from "../../../../convex/_generated/dataModel";

export type Transaction = Doc<"inventoryTransactions"> & {
  item?: { itemName: string; unit: string };
  supplier?: { supplierName: string };
};

export type TransactionType = "purchase" | "usage" | "waste" | "adjustment";
