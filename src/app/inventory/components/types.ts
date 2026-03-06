import { Doc } from "../../../../convex/_generated/dataModel";

export type InventoryItem = Doc<"inventoryItems">;

export type SummaryCardsProps = {
  items: InventoryItem[];
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
  setStockFilter: (val: string) => void;
};

export type InventoryFiltersProps = {
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  stockFilter: string;
  setStockFilter: (val: string) => void;
};

export type InventoryTableProps = {
  filteredItems: InventoryItem[];
};

export type ReorderAlertsProps = {
  lowStockCount: number;
  outOfStockCount: number;
};

// InventoryHeader and TransactionHistory take no props
