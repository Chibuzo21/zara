"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Id } from "../../../../convex/_generated/dataModel";

import { TrendingDown } from "lucide-react";
import Link from "next/link";

import StaffCommission from "./components/staffCommission";
import ProductionStats from "./components/productionStats";
import ProductionActions from "./components/productionActions";
import LowStock from "./components/LowStock";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";

type InventoryItem = Doc<"inventoryItems">;

export default function ProductionDashboardPage() {
  const { isAllowed, isLoading } = useRoleGuard(["owner", "production"]);
  const user = useQuery(api.users.viewer);
  const inventoryItems: InventoryItem[] =
    useQuery(api.inventory.inventory.getAll) ?? [];
  const lowStockItems: InventoryItem[] =
    useQuery(api.inventory.inventory.getLowStock) ?? [];

  const lowStockCount = lowStockItems.length;
  const outOfStockCount = inventoryItems.filter(
    (item) => item.currentStock === 0,
  ).length;

  if (isLoading || !isAllowed) return null;
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Production Dashboard
          </h1>
          <p className='text-gray-500 mt-1'>
            Welcome back, {user?.fullName ?? "—"}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <ProductionStats
        outOfStockCount={outOfStockCount}
        lowStockCount={lowStockCount}
        inventoryItems={inventoryItems}
      />

      {/* Quick Actions */}
      <ProductionActions />

      {/* Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className='rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 flex items-start gap-4'>
          <div className='mt-0.5 shrink-0 p-2 rounded-xl bg-amber-100 text-amber-600'>
            <TrendingDown size={18} strokeWidth={2.5} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-amber-900 text-sm'>Stock Alert</p>
            <p className='text-amber-700 text-sm mt-0.5'>
              {lowStockCount} item{lowStockCount !== 1 ? "s" : ""} running low.
              {outOfStockCount > 0 && (
                <> {outOfStockCount} out of stock entirely.</>
              )}{" "}
              Notify the owner to reorder soon.
            </p>
          </div>
          <Link
            href='/inventory'
            className='shrink-0 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors whitespace-nowrap mt-0.5'>
            View inventory →
          </Link>
        </div>
      )}

      {/* Low Stock Table */}
      <LowStock lowStockItems={lowStockItems} />

      {/* Commission Info */}
      {user?._id && <StaffCommission userId={user._id as Id<"users">} />}
    </div>
  );
}
