import Link from "next/link";
import React from "react";

export default function TransactionHistory() {
  return (
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
  );
}
