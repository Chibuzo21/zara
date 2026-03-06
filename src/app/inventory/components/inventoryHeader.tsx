import { Package, Plus, TrendingDown } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function InventoryHeader() {
  return (
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
  );
}
