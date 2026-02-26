"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../../lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Settings,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TransactionsPage() {
  const transactions = useQuery(api.inventory.getTransactions) || [];

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");

  if (transactions === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t: any) => {
    const matchesType =
      typeFilter === "all" || t.transactionType === typeFilter;
    const matchesDate = !dateFilter || t.transactionDate === dateFilter;
    return matchesType && matchesDate;
  });

  const typeIcons: Record<string, any> = {
    purchase: <TrendingUp className='text-green-600' size={20} />,
    usage: <TrendingDown className='text-orange-600' size={20} />,
    waste: <AlertTriangle className='text-red-600' size={20} />,
    adjustment: <Settings className='text-blue-600' size={20} />,
  };

  const typeColors: Record<string, string> = {
    purchase: "bg-green-100 text-green-800 border-green-200",
    usage: "bg-orange-100 text-orange-800 border-orange-200",
    waste: "bg-red-100 text-red-800 border-red-200",
    adjustment: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const totalPurchases = filteredTransactions
    .filter((t: any) => t.transactionType === "purchase")
    .reduce((sum: number, t: any) => sum + (t.totalCost || 0), 0);

  const totalUsage = filteredTransactions.filter(
    (t: any) => t.transactionType === "usage",
  ).length;

  const totalWaste = filteredTransactions.filter(
    (t: any) => t.transactionType === "waste",
  ).length;

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/inventory' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Transaction History
            </h1>
            <p className='text-gray-600 mt-1'>
              All stock movements and changes
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Purchases</p>
              <p className='text-2xl font-bold mt-2'>
                {formatCurrency(totalPurchases)}
              </p>
            </div>
            <TrendingUp size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Usage Records</p>
              <p className='text-3xl font-bold mt-2'>{totalUsage}</p>
            </div>
            <TrendingDown size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Waste Records</p>
              <p className='text-3xl font-bold mt-2'>{totalWaste}</p>
            </div>
            <AlertTriangle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Transactions</p>
              <p className='text-3xl font-bold mt-2'>
                {filteredTransactions.length}
              </p>
            </div>
            <Settings size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='card'>
        <div className='flex items-center gap-2 mb-4'>
          <Filter size={20} className='text-bakery-pink' />
          <h2 className='text-lg font-bold text-gray-900'>Filters</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='label'>Transaction Type</label>
            <select
              className='input-field'
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}>
              <option value='all'>All Types</option>
              <option value='purchase'>Purchase</option>
              <option value='usage'>Usage</option>
              <option value='waste'>Waste</option>
              <option value='adjustment'>Adjustment</option>
            </select>
          </div>

          <div>
            <label className='label'>Date</label>
            <input
              type='date'
              className='input-field'
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        {(typeFilter !== "all" || dateFilter) && (
          <button
            onClick={() => {
              setTypeFilter("all");
              setDateFilter("");
            }}
            className='mt-4 text-sm text-bakery-pink hover:underline'>
            Clear Filters
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Date</th>
                <th className='table-header'>Type</th>
                <th className='table-header'>Item</th>
                <th className='table-header'>Quantity</th>
                <th className='table-header'>Unit Cost</th>
                <th className='table-header'>Total Cost</th>
                <th className='table-header'>Supplier</th>
                <th className='table-header'>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='table-cell text-center text-gray-500 py-8'>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction: any) => (
                  <tr key={transaction._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-semibold'>
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className='table-cell'>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${typeColors[transaction.transactionType]}`}>
                        {typeIcons[transaction.transactionType]}
                        <span className='text-xs font-semibold uppercase'>
                          {transaction.transactionType}
                        </span>
                      </div>
                    </td>
                    <td className='table-cell font-semibold'>
                      {transaction.item?.itemName || "Unknown"}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`font-bold ${
                          transaction.transactionType === "purchase" ||
                          transaction.transactionType === "adjustment"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                        {transaction.transactionType === "purchase" ||
                        transaction.transactionType === "adjustment"
                          ? "+"
                          : "-"}
                        {transaction.quantity} {transaction.item?.unit}
                      </span>
                    </td>
                    <td className='table-cell'>
                      {transaction.unitCost
                        ? formatCurrency(transaction.unitCost)
                        : "-"}
                    </td>
                    <td className='table-cell font-semibold text-bakery-pink'>
                      {transaction.totalCost
                        ? formatCurrency(transaction.totalCost)
                        : "-"}
                    </td>
                    <td className='table-cell'>
                      {transaction.supplier?.supplierName || "-"}
                    </td>
                    <td className='table-cell max-w-xs'>
                      <p className='text-sm text-gray-600 truncate'>
                        {transaction.notes || "-"}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
