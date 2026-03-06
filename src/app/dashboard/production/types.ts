import { Doc } from "../../../../convex/_generated/dataModel";

export interface iProductionStats {
  inventoryItems: Doc<"inventoryItems">[];
  lowStockCount: number;
  outOfStockCount: number;
}
export interface iLowStock {
  lowStockItems: Doc<"inventoryItems">[];
}
