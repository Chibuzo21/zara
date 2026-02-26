"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { formatCurrency } from "../../../../lib/utils";
import { Package, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";
import StaffCommission from "./components/staffCommission";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ProductionDashboardPage() {
  const user = useQuery(api.users.viewer);
  const inventoryItems = useQuery(api.inventory.inventory.getAll) || [];
  const lowStockItems = useQuery(api.inventory.inventory.getLowStock) || [];

  const lowStockCount = lowStockItems.length;
  const outOfStockCount = inventoryItems.filter(
    (item: any) => item.currentStock === 0,
  ).length;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Production Dashboard
          </h1>
          <p className='text-gray-600 mt-1'>Welcome back, {user?.fullName}!</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Inventory Items</p>
              <p className='text-3xl font-bold mt-2'>{inventoryItems.length}</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Low Stock Items</p>
              <p className='text-3xl font-bold mt-2'>{lowStockCount}</p>
            </div>
            <AlertTriangle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Out of Stock</p>
              <p className='text-3xl font-bold mt-2'>{outOfStockCount}</p>
            </div>
            <TrendingDown size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Link
            href='/inventory/usage'
            className='p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg border-2 border-orange-200 transition-all'>
            <TrendingDown size={32} className='text-orange-600 mb-3' />
            <p className='font-semibold text-gray-900'>Record Usage</p>
            <p className='text-sm text-gray-600 mt-1'>
              Log materials used in production
            </p>
          </Link>

          <Link
            href='/inventory'
            className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border-2 border-blue-200 transition-all'>
            <Package size={32} className='text-blue-600 mb-3' />
            <p className='font-semibold text-gray-900'>View Inventory</p>
            <p className='text-sm text-gray-600 mt-1'>Check stock levels</p>
          </Link>

          <Link
            href='/commission'
            className='p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border-2 border-purple-200 transition-all'>
            <DollarSign size={32} className='text-purple-600 mb-3' />
            <p className='font-semibold text-gray-900'>My Commission</p>
            <p className='text-sm text-gray-600 mt-1'>View your earnings</p>
          </Link>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className='card bg-orange-50 border-2 border-orange-200'>
          <div className='flex items-start gap-4'>
            <AlertTriangle
              size={24}
              className='text-orange-600 flex-shrink-0 mt-1'
            />
            <div>
              <h3 className='font-bold text-orange-900 text-lg'>
                ⚠️ Stock Alert
              </h3>
              <p className='text-orange-800 mt-1'>
                {lowStockCount} item{lowStockCount !== 1 ? "s" : ""} running low
                on stock. Notify the owner to reorder soon.
              </p>
              <Link
                href='/inventory'
                className='text-orange-600 hover:underline text-sm font-semibold mt-2 inline-block'>
                View low stock items →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Low Stock Items
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='table-header'>Item</th>
                <th className='table-header'>Category</th>
                <th className='table-header'>Current Stock</th>
                <th className='table-header'>Reorder Level</th>
                <th className='table-header'>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='table-cell text-center text-gray-500 py-8'>
                    All items have sufficient stock! 🎉
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item: any) => (
                  <tr key={item._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-semibold'>
                      {item.itemName}
                    </td>
                    <td className='table-cell capitalize'>{item.category}</td>
                    <td className='table-cell'>
                      <span
                        className={`font-bold ${
                          item.currentStock === 0
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className='table-cell'>
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.currentStock === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                        {item.currentStock === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Info */}
      <StaffCommission userId={user?._id as Id<"users">} />
    </div>
  );
}
