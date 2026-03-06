import React from "react";
import { formatCurrency } from "../../../../lib/utils";
import { SummaryCardProps } from "../types";
export default function SummaryCard({
  products,
  activeCount,
  avgPrice,
  categories,
}: SummaryCardProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
      <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>Total Products</p>
        <p className='text-3xl font-bold mt-2'>{products.length}</p>
      </div>

      <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>Active Products</p>
        <p className='text-3xl font-bold mt-2'>{activeCount}</p>
      </div>

      <div className='bg-gradient-to-br from-bakery-pink to-bakery-gold text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>Average Price</p>
        <p className='text-3xl font-bold mt-2'>{formatCurrency(avgPrice)}</p>
      </div>

      <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>Categories</p>
        <p className='text-3xl font-bold mt-2'>{categories.length}</p>
      </div>
    </div>
  );
}
