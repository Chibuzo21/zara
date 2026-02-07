"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Plus, DollarSign, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CommissionPage() {
  const records = useQuery(api.commission?.getAll) || [];
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (records === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredRecords =
    statusFilter === "all"
      ? records
      : records.filter((r: any) => r.status === statusFilter);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
  };

  const roleColors: Record<string, string> = {
    production: "bg-blue-100 text-blue-800",
    packaging: "bg-green-100 text-green-800",
    sales: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Commission Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Track and manage staff commission payments
          </p>
        </div>
        <Link href='/commission/new' className='btn-primary'>
          <Plus size={20} className='inline mr-2' />
          Calculate Commission
        </Link>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='stat-card'>
          <p className='text-white/80 text-sm'>Total Pending</p>
          <p className='text-3xl font-bold mt-2'>
            {formatCurrency(
              records
                .filter((r: any) => r.status === "pending")
                .reduce((sum: number, r: any) => sum + r.netCommission, 0),
            )}
          </p>
        </div>

        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Approved</p>
          <p className='text-3xl font-bold mt-2'>
            {formatCurrency(
              records
                .filter((r: any) => r.status === "approved")
                .reduce((sum: number, r: any) => sum + r.netCommission, 0),
            )}
          </p>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Paid This Month</p>
          <p className='text-3xl font-bold mt-2'>
            {formatCurrency(
              records
                .filter((r: any) => r.status === "paid")
                .reduce((sum: number, r: any) => sum + r.netCommission, 0),
            )}
          </p>
        </div>

        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Total Deductions</p>
          <p className='text-3xl font-bold mt-2'>
            {formatCurrency(
              records.reduce(
                (sum: number, r: any) => sum + r.deductions + r.penalties,
                0,
              ),
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className='card'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <label className='label'>Filter by Status</label>
            <select
              className='input-field'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='paid'>Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Commission Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Staff</th>
                <th className='table-header'>Role</th>
                <th className='table-header'>Period</th>
                <th className='table-header'>Gross Commission</th>
                <th className='table-header'>Deductions</th>
                <th className='table-header'>Penalties</th>
                <th className='table-header'>Net Commission</th>
                <th className='table-header'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='table-cell text-center text-gray-500 py-8'>
                    No commission records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record: any) => (
                  <tr key={record._id} className='hover:bg-gray-50'>
                    <td className='table-cell'>
                      <div>
                        <p className='font-semibold'>Staff Name</p>
                        <p className='text-sm text-gray-600'>EMP-XXX</p>
                      </div>
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
                        ROLE
                      </span>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm'>
                        <div>{formatDate(record.periodStart)}</div>
                        <div className='text-gray-600'>
                          to {formatDate(record.periodEnd)}
                        </div>
                      </div>
                    </td>
                    <td className='table-cell font-semibold text-green-600'>
                      {formatCurrency(record.grossCommission)}
                    </td>
                    <td className='table-cell font-semibold text-orange-600'>
                      {formatCurrency(record.deductions)}
                    </td>
                    <td className='table-cell font-semibold text-red-600'>
                      {formatCurrency(record.penalties)}
                    </td>
                    <td className='table-cell font-bold text-bakery-pink text-lg'>
                      {formatCurrency(record.netCommission)}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[record.status]}`}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Rates Reference */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Commission Rates
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 bg-blue-50 rounded-lg border-2 border-blue-200'>
            <p className='font-semibold text-blue-900'>Production Staff</p>
            <p className='text-2xl font-bold text-blue-600 mt-2'>2.0%</p>
            <p className='text-sm text-blue-700 mt-1'>Base rate</p>
            <p className='text-sm text-blue-700'>
              Tier rate: 3.0% (above ₦100k)
            </p>
          </div>
          <div className='p-4 bg-green-50 rounded-lg border-2 border-green-200'>
            <p className='font-semibold text-green-900'>Packaging Staff</p>
            <p className='text-2xl font-bold text-green-600 mt-2'>1.5%</p>
            <p className='text-sm text-green-700 mt-1'>Base rate</p>
            <p className='text-sm text-green-700'>
              Tier rate: 2.5% (above ₦80k)
            </p>
          </div>
          <div className='p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200'>
            <p className='font-semibold text-yellow-900'>Sales Staff</p>
            <p className='text-2xl font-bold text-yellow-600 mt-2'>5.0%</p>
            <p className='text-sm text-yellow-700 mt-1'>Base rate</p>
            <p className='text-sm text-yellow-700'>
              Tier rate: 7.0% (above ₦150k)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
