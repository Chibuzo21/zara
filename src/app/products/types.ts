import { Doc, Id } from "../../../convex/_generated/dataModel";

export type Product = Doc<"products">;

export type ProductFormValues = {
  productName: string;
  category: string;
  basePrice: number;
  productionCost?: number;
  status: "active" | "inactive";
};

export type SummaryCardProps = {
  products: Product[];
  categories: string[];
  activeCount: number;
  avgPrice: number;
};

export type FiltersProps = {
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categories: string[];
};

export type ProductsTableProps = {
  filteredProducts: Product[];
  handleEdit: (product: Product) => void;
  handleDelete: (id: Id<"products">) => void;
};
