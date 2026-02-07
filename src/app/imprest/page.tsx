"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ImprestPage() {
  const requests = useQuery(api.imprest?.getAll) || [];
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (requests === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r: any) => r.status === statusFilter);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    disbursed: "bg-purple-100 text-purple-800",
    retired: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const pendingAmount = requests
    .filter((r: any) => r.status === "pending")
    .reduce((sum: number, r: any) => sum + r.amountRequested, 0);

  const approvedAmount = requests
    .filter((r: any) => r.status === "approved")
    .reduce((sum: number, r: any) => sum + r.amountRequested, 0);

  const disbursedAmount = requests
    .filter((r: any) => r.status === "disbursed")
    .reduce((sum: number, r: any) => sum + r.amountRequested, 0);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Imprest Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage staff imprest requests and retirements
          </p>
        </div>
        <Link href='/imprest/new' className='btn-primary'>
          <Plus size={20} className='inline mr-2' />
          New Request
        </Link>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-linear-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Pending Requests</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(pendingAmount)}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {requests.filter((r: any) => r.status === "pending").length}{" "}
                requests
              </p>
            </div>
            <Clock size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Approved</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(approvedAmount)}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {requests.filter((r: any) => r.status === "approved").length}{" "}
                requests
              </p>
            </div>
            <CheckCircle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='stat-card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Disbursed</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(disbursedAmount)}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {requests.filter((r: any) => r.status === "disbursed").length}{" "}
                requests
              </p>
            </div>
            <CheckCircle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Retired</p>
              <p className='text-3xl font-bold mt-2'>
                {requests.filter((r: any) => r.status === "retired").length}
              </p>
            </div>
            <CheckCircle size={40} className='text-white/50' />
          </div>
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
              <option value='disbursed'>Disbursed</option>
              <option value='retired'>Retired</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Request #</th>
                <th className='table-header'>Staff</th>
                <th className='table-header'>Amount</th>
                <th className='table-header'>Purpose</th>
                <th className='table-header'>Request Date</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Approved Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500 py-8'>
                    No imprest requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request: any) => (
                  <tr key={request._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-mono font-semibold'>
                      {request.requestNumber}
                    </td>
                    <td className='table-cell'>
                      <div>
                        <p className='font-semibold'>Staff Name</p>
                        <p className='text-sm text-gray-600'>EMP-XXX</p>
                      </div>
                    </td>
                    <td className='table-cell font-bold text-bakery-pink text-lg'>
                      {formatCurrency(request.amountRequested)}
                    </td>
                    <td className='table-cell max-w-xs'>
                      <p className='truncate'>{request.purpose}</p>
                    </td>
                    <td className='table-cell'>
                      {formatDate(request.requestDate)}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className='table-cell'>
                      {request.approvedDate
                        ? formatDate(request.approvedDate)
                        : "-"}
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
