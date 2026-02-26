"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Plus, Eye, Edit2, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";

export default function OperationsPage() {
  // You'll need to create these queries in convex/operations.ts
  const operations = useQuery(api.operations.operations?.getAll) || [];

  const [dateFilter, setDateFilter] = useState("");

  if (operations === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredOps = dateFilter
    ? operations.filter((op: any) => op.operationDate === dateFilter)
    : operations;

  return (
    <div className='space-y-6'>
      {/* Header */}
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

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='stat-card'>
          <p className='text-white/80 text-sm'>Total Days Logged</p>
          <p className='text-3xl font-bold mt-2'>{operations.length}</p>
        </div>
        <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Open Days</p>
          <p className='text-3xl font-bold mt-2'>
            {operations.filter((op: any) => op.status === "open").length}
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

      {/* Filters */}
      <div className='card'>
        <div className='flex gap-4 items-end'>
          <div className='flex-1'>
            <label className='label'>Filter by Date</label>
            <input
              type='date'
              className='input-field'
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className='btn-outline'>
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Operations Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Date</th>
                <th className='table-header'>Opening Cash</th>
                <th className='table-header'>Closing Cash</th>
                <th className='table-header'>Total Sales</th>
                <th className='table-header'>Total Expenses</th>
                <th className='table-header'>Net Profit</th>
                <th className='table-header'>Variance</th>
                <th className='table-header'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOps.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='table-cell text-center text-gray-500 py-8'>
                    No operations logged yet
                  </td>
                </tr>
              ) : (
                filteredOps.map((op: any) => {
                  const netProfit = op.totalSales - op.totalExpenses;
                  const expectedCash =
                    op.openingCash + op.totalSales - op.totalExpenses;
                  const variance = op.closingCash - expectedCash;

                  return (
                    <tr key={op._id} className='hover:bg-gray-50'>
                      <td className='table-cell font-semibold'>
                        {formatDate(op.operationDate)}
                      </td>
                      <td className='table-cell'>
                        {formatCurrency(op.openingCash)}
                      </td>
                      <td className='table-cell'>
                        {formatCurrency(op.closingCash)}
                      </td>
                      <td className='table-cell font-semibold text-green-600'>
                        {formatCurrency(op.totalSales)}
                      </td>
                      <td className='table-cell font-semibold text-red-600'>
                        {formatCurrency(op.totalExpenses)}
                      </td>
                      <td
                        className={`table-cell font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(netProfit)}
                      </td>
                      <td
                        className={`table-cell font-semibold ${Math.abs(variance) < 100 ? "text-gray-600" : variance > 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(variance)}
                      </td>
                      <td className='table-cell'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            op.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                          {op.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
