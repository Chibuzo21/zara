import React from "react";
import { formatCurrency } from "../../../../lib/utils";
import { QuickStatsProps } from "./types";

export default function QuickStats({ operations }: QuickStatsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
      <div className='stat-card'>
        <p className='text-white/80 text-sm'>Total Days Logged</p>
        <p className='text-3xl font-bold mt-2'>{operations.length}</p>
      </div>
      <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>Open Days</p>
        <p className='text-3xl font-bold mt-2'>
          {operations?.filter((op: any) => op.status === "open").length}
        </p>
      </div>
      <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>This Week Sales</p>
        <p className='text-3xl font-bold mt-2'>
          {formatCurrency(
            operations
              .slice(0, 7)
              .reduce((sum: number, op: any) => sum + op.totalSales, 0),
          )}
        </p>
      </div>
      <div className='bg-linear-to-br from-bakery-gold to-yellow-500 text-white rounded-lg p-6 shadow-lg'>
        <p className='text-white/80 text-sm'>This Week Profit</p>
        <p className='text-3xl font-bold mt-2'>
          {formatCurrency(
            operations
              .slice(0, 7)
              .reduce(
                (sum: number, op: any) =>
                  sum + (op.totalSales - op.totalExpenses),
                0,
              ),
          )}
        </p>
      </div>
    </div>
  );
}
