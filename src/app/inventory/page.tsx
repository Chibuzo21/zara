"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, getStockStatus } from "../../../lib/utils";
import { Plus, AlertTriangle, Package, TrendingDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const items = useQuery(api.inventory.getAll);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

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
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Inventory Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Track stock levels, suppliers, and costs
          </p>
        </div>
        <div className='flex gap-3'>
          <Link href='/inventory/purchase' className='btn-secondary'>
            <Package size={20} className='inline mr-2' />
            Purchase Order
          </Link>
          <Link
            href='/inventory/usage'
            className='bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'>
            <TrendingDown size={20} className='inline mr-2' />
            Record Usage
          </Link>
          <Link href='/inventory/adjust' className='btn-outline'>
            Adjust Stock
          </Link>
          <Link href='/inventory/new' className='btn-primary'>
            <Plus size={20} className='inline mr-2' />
            Add Item
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='stat-card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Items</p>
              <p className='text-3xl font-bold mt-2'>{items.length}</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Low Stock</p>
              <p className='text-3xl font-bold mt-2'>{lowStockCount}</p>
            </div>
            <TrendingDown size={40} className='text-white/50' />
          </div>
          {lowStockCount > 0 && (
            <button
              onClick={() => setStockFilter("low")}
              className='mt-3 text-sm hover:underline flex items-center'>
              <AlertTriangle size={14} className='mr-1' />
              <span>View items</span>
            </button>
          )}
        </div>

        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Out of Stock</p>
              <p className='text-3xl font-bold mt-2'>{outOfStockCount}</p>
            </div>
            <AlertTriangle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-bakery-gold to-yellow-500 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Value</p>
              <p className='text-2xl font-bold mt-2'>
                {formatCurrency(totalValue)}
              </p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='card'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='label'>Category</label>
            <select
              className='input-field'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value='all'>All Categories</option>
              <option value='flour'>Flour</option>
              <option value='sugar'>Sugar</option>
              <option value='dairy'>Dairy</option>
              <option value='eggs'>Eggs</option>
              <option value='flavoring'>Flavoring</option>
              <option value='packaging'>Packaging</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='label'>Stock Status</label>
            <select
              className='input-field'
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}>
              <option value='all'>All Items</option>
              <option value='low'>Low Stock</option>
              <option value='out'>Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Item Name</th>
                <th className='table-header'>Category</th>
                <th className='table-header'>Current Stock</th>
                <th className='table-header'>Reorder Level</th>
                <th className='table-header'>Unit</th>
                <th className='table-header'>Unit Cost</th>
                <th className='table-header'>Total Value</th>
                <th className='table-header'>Supplier</th>
                <th className='table-header'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className='table-cell text-center text-gray-500 py-8'>
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const stockStatus = getStockStatus(
                    item.currentStock,
                    item.reorderLevel,
                  );
                  const totalValue = item.currentStock * item.unitCost;

                  return (
                    <tr key={item._id} className='hover:bg-gray-50'>
                      <td className='table-cell font-semibold'>
                        {item.itemName}
                      </td>
                      <td className='table-cell'>
                        <span className='px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800'>
                          {item.category.toUpperCase()}
                        </span>
                      </td>
                      <td
                        className={`table-cell font-bold text-lg ${stockStatus.color}`}>
                        {item.currentStock}
                      </td>
                      <td className='table-cell text-gray-600'>
                        {item.reorderLevel}
                      </td>
                      <td className='table-cell'>{item.unit}</td>
                      <td className='table-cell font-semibold'>
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td className='table-cell font-bold text-bakery-pink'>
                        {formatCurrency(totalValue)}
                      </td>
                      <td className='table-cell'>
                        {item.supplier?.supplierName || "N/A"}
                      </td>
                      <td className='table-cell'>
                        {item.currentStock === 0 && (
                          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 w-fit'>
                            <AlertTriangle size={12} />
                            OUT OF STOCK
                          </span>
                        )}
                        {item.currentStock > 0 &&
                          item.currentStock <= item.reorderLevel && (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit'>
                              <AlertTriangle size={12} />
                              LOW STOCK
                            </span>
                          )}
                        {item.currentStock > item.reorderLevel && (
                          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 w-fit'>
                            GOOD
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className='card bg-orange-50 border-2 border-orange-200'>
          <div className='flex items-start gap-4'>
            <AlertTriangle
              size={24}
              className='text-orange-600 flex-shrink-0 mt-1'
            />
            <div className='flex-1'>
              <h3 className='font-bold text-orange-900 text-lg'>
                Reorder Alert
              </h3>
              <p className='text-orange-800 mt-1'>
                You have {lowStockCount} item{lowStockCount !== 1 ? "s" : ""}{" "}
                running low
                {outOfStockCount > 0 &&
                  ` and ${outOfStockCount} item${outOfStockCount !== 1 ? "s" : ""} out of stock`}
                . Please reorder soon to avoid production delays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Link */}
      <div className='card bg-blue-50 border-2 border-blue-200'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-bold text-blue-900 text-lg'>
              Transaction History
            </h3>
            <p className='text-blue-700 text-sm mt-1'>
              View all stock movements, purchases, and usage
            </p>
          </div>
          <Link href='/inventory/transactions' className='btn-primary'>
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
