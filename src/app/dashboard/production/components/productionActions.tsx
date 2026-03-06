import { DollarSign, Package, TrendingDown } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductionActions() {
  return (
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
  );
}
