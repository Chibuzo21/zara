import { Id } from "../../../../convex/_generated/dataModel";

export type InventoryCategory =
  | "flour"
  | "sugar"
  | "dairy"
  | "eggs"
  | "flavoring"
  | "packaging"
  | "other";

export interface InventoryFormValues {
  itemName: string;
  category: InventoryCategory;
  unit: string;
  reorderLevel: number;
  currentStock: number;
  unitCost: number;
  supplierId: string;
}

export interface NewFormProps {
  onSubmit: (data: InventoryFormValues) => Promise<void>;
  isLoading: boolean;
}
