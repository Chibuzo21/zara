import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import React from "react";
import { formatCurrency } from "../../../../lib/utils";
import { SummaryCardsProps } from "./types";

export default function SummaryCards({
  items,
  lowStockCount,
  setStockFilter,
  totalValue,
  outOfStockCount,
}: SummaryCardsProps) {
  return (
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

      <div className='bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
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

      <div className='bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-white/80 text-sm'>Out of Stock</p>
            <p className='text-3xl font-bold mt-2'>{outOfStockCount}</p>
          </div>
          <AlertTriangle size={40} className='text-white/50' />
        </div>
      </div>

      <div className='bg-linear-to-br from-bakery-gold to-yellow-500 text-white rounded-lg p-6 shadow-lg'>
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
  );
}
