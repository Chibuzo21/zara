export type UsageReason =
  | "production"
  | "damaged"
  | "missing"
  | "waste"
  | "expired"
  | "spillage";

export interface UsageItem {
  itemId: string;
  itemName: string;
  currentStock: number;
  unit: string;
  quantity: number;
  reason: UsageReason;
}

export interface UsageFormValues {
  usageDate: string;
  notes: string;
  items: UsageItem[];
}

export interface UsageFormProps {
  onSubmit: (data: UsageFormValues) => Promise<void>;
  isLoading: boolean;
}
