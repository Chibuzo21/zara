"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import InventoryHeader from "./components/inventoryHeader";
import SummaryCards from "./components/SummaryCards";
import InventoryFilters from "./components/inventoryFilters";
import InventoryTable from "./components/InventoryTable";
import ReorderAlerts from "./components/ReorderAlerts";
import TransactionHistory from "./components/TransactionHistory";
import { useRoleGuard } from "../../../hooks/useRoleGuard";

export default function InventoryPage() {
  const items = useQuery(api.inventory.inventory.getAll);
  const { isAllowed, isLoading } = useRoleGuard([
    "owner",
    "admin",
    "production",
  ]);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  if (isLoading || !isAllowed) return null;

  if (items === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock =
        item.currentStock <= item.reorderLevel && item.currentStock > 0;
    } else if (stockFilter === "out") {
      matchesStock = item.currentStock === 0;
    }

    return matchesCategory && matchesStock;
  });

  const lowStockCount = items.filter(
    (item) => item.currentStock <= item.reorderLevel && item.currentStock > 0,
  ).length;
  const outOfStockCount = items.filter(
    (item) => item.currentStock === 0,
  ).length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost,
    0,
  );

  return (
    <div className='space-y-6'>
      {/* Header */}

      <InventoryHeader />

      {/* Summary Cards */}

      <SummaryCards
        outOfStockCount={outOfStockCount}
        totalValue={totalValue}
        setStockFilter={setStockFilter}
        lowStockCount={lowStockCount}
        items={items}
      />

      {/* Filters */}

      <InventoryFilters
        setCategoryFilter={setCategoryFilter}
        setStockFilter={setStockFilter}
        stockFilter={stockFilter}
        categoryFilter={categoryFilter}
      />

      {/* Inventory Table */}

      <InventoryTable filteredItems={filteredItems} />

      {/* Reorder Alerts */}

      <ReorderAlerts
        outOfStockCount={outOfStockCount}
        lowStockCount={lowStockCount}
      />
      {/* Transaction History Link */}

      <TransactionHistory />
    </div>
  );
}
