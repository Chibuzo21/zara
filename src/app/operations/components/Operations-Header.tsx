import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function OperationsHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Daily Operations</h1>
        <p className='text-gray-600 mt-1'>
          Track daily sales, expenses, and cash flow
        </p>
      </div>
      <Link href='/operations/new' className='btn-primary'>
        <Plus size={20} className='inline mr-2' />
        New Entry
      </Link>
    </div>
  );
}
