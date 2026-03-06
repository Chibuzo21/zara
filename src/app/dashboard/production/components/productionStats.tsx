import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import React from "react";
import { iProductionStats } from "../types";

export default function ProductionStats({
  inventoryItems,
  lowStockCount,
  outOfStockCount,
}: iProductionStats) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
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
  );
}
