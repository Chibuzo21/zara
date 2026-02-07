// Types for Convex query results
import type { Id } from "../convex/_generated/dataModel";

export type TopProduct = {
  productName: string;
  quantity: number;
  amount: number;
};

export type DashboardStats = {
  todaySales: number;
  monthSales: number;
  activeStaff: number;
  lowStock: number;
  pendingImprest: number;
  todayProfit: number;
};

export type SaleWithDetails = {
  _id: Id<"sales">;
  _creationTime: number;
  saleDate: string;
  productId: Id<"products">;
  quantitySold: number;
  unitPrice: number;
  totalAmount: number;
  salesStaffId?: Id<"staff">;
  paymentMethod: "cash" | "transfer" | "pos" | "credit";
  customerName?: string;
  notes?: string;
  product?: {
    _id: Id<"products">;
    productName: string;
    category: string;
    basePrice: number;
    productionCost?: number;
    status: string;
  } | null;
  staff?: {
    _id: Id<"staff">;
    fullName: string;
    role: string;
  } | null;
};

export type InventoryItemWithSupplier = {
  _id: Id<"inventoryItems">;
  itemName: string;
  category: string;
  unit: string;
  reorderLevel: number;
  currentStock: number;
  unitCost: number;
  supplierId?: Id<"suppliers">;
  status: string;
  supplier?: {
    _id: Id<"suppliers">;
    supplierName: string;
  } | null;
};
