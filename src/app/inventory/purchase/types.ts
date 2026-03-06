import { Id } from "../../../../convex/_generated/dataModel";

export interface PurchaseItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseFormValues {
  supplierId: string;
  purchaseDate: string;
  notes: string;
  items: PurchaseItem[];
}

export interface PurchaseFormProps {
  onSubmit: (data: PurchaseFormValues) => Promise<void>;
  isLoading: boolean;
}
