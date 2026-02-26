"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { Plus, DollarSign, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function CommissionPage() {
  const records = useQuery(api.commission.getAll) || [];
  const approveCommission = useMutation(api.commissionMutations.approve);
  const markAsPaid = useMutation(api.commissionMutations.markAsPaid);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (id: Id<"commissionRecords">) => {
    if (!confirm("Approve this commission record?")) return;
    setLoading(id);
    try {
      // TODO: Replace with actual current user ID
      await approveCommission({ id });
      alert("Commission approved!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to approve");
    } finally {
      setLoading(null);
    }
  };

  const handleMarkPaid = async (id: Id<"commissionRecords">) => {
    if (!confirm("Mark this commission as paid?")) return;
    setLoading(id);
    try {
      await markAsPaid({ id });
      alert("Marked as paid!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark as paid");
    } finally {
      setLoading(null);
    }
  };

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

  const pending = records.filter((r: any) => r.status === "pending");
  const approved = records.filter((r: any) => r.status === "approved");
  const paid = records.filter((r: any) => r.status === "paid");

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Commission Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Approve and track staff commission payments
          </p>
        </div>
        <Link href='/commission/new' className='btn-primary'>
          <Plus size={20} className='inline mr-2' />
          Calculate Commission
        </Link>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-linear-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Pending Approval</p>
          <p className='text-2xl font-bold mt-2'>
            {formatCurrency(
              pending.reduce((sum: number, r: any) => sum + r.netCommission, 0),
            )}
          </p>
          <p className='text-sm mt-1 text-white/80'>{pending.length} records</p>
        </div>

        <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Approved</p>
          <p className='text-2xl font-bold mt-2'>
            {formatCurrency(
              approved.reduce(
                (sum: number, r: any) => sum + r.netCommission,
                0,
              ),
            )}
          </p>
          <p className='text-sm mt-1 text-white/80'>
            {approved.length} records
          </p>
        </div>

        <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Paid</p>
          <p className='text-2xl font-bold mt-2'>
            {formatCurrency(
              paid.reduce((sum: number, r: any) => sum + r.netCommission, 0),
            )}
          </p>
          <p className='text-sm mt-1 text-white/80'>{paid.length} records</p>
        </div>

        <div className='bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Total Deductions</p>
          <p className='text-2xl font-bold mt-2'>
            {formatCurrency(
              records.reduce(
                (sum: number, r: any) => sum + r.deductions + r.penalties,
                0,
              ),
            )}
          </p>
        </div>
      </div>

      {/* Workflow */}
      <div className='card bg-blue-50 border-2 border-blue-200'>
        <h3 className='font-bold text-blue-900 mb-3'>📊 Commission Workflow</h3>
        <div className='flex items-center gap-3 text-sm flex-wrap'>
          <span className='px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold border-2 border-yellow-300'>
            1. Pending
          </span>
          <span className='text-blue-600 font-bold'>→ [Approve/Reject] →</span>
          <span className='px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold border-2 border-blue-300'>
            2. Approved
          </span>
          <span className='text-blue-600 font-bold'>→ [Mark as Paid] →</span>
          <span className='px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold border-2 border-green-300'>
            3. Paid ✓
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className='card'>
        <label className='label'>Filter by Status</label>
        <select
          className='input-field max-w-xs'
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}>
          <option value='all'>All Status ({records.length})</option>
          <option value='pending'>Pending ({pending.length})</option>
          <option value='approved'>Approved ({approved.length})</option>
          <option value='paid'>Paid ({paid.length})</option>
        </select>
      </div>

      {/* Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Staff</th>
                <th className='table-header'>Period</th>
                <th className='table-header'>Gross</th>
                <th className='table-header'>Deductions</th>
                <th className='table-header'>Net</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500 py-8'>
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record: any) => (
                  <tr key={record._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-semibold'>Staff Name</td>
                    <td className='table-cell text-sm'>
                      <div>{formatDate(record.periodStart)}</div>
                      <div className='text-gray-600'>
                        to {formatDate(record.periodEnd)}
                      </div>
                    </td>
                    <td className='table-cell font-semibold text-green-600'>
                      {formatCurrency(record.grossCommission)}
                    </td>
                    <td className='table-cell text-sm'>
                      <div className='text-orange-600'>
                        -{formatCurrency(record.deductions)}
                      </div>
                      {record.penalties > 0 && (
                        <div className='text-red-600'>
                          -{formatCurrency(record.penalties)}
                        </div>
                      )}
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
                    <td className='table-cell'>
                      {record.status === "pending" && (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleApprove(record._id)}
                            disabled={loading === record._id}
                            className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center gap-1'>
                            <CheckCircle size={12} />
                            Approve
                          </button>
                          <button className='px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded flex items-center gap-1'>
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      )}
                      {record.status === "approved" && (
                        <button
                          onClick={() => handleMarkPaid(record._id)}
                          disabled={loading === record._id}
                          className='px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded flex items-center gap-1'>
                          <DollarSign size={12} />
                          Mark Paid
                        </button>
                      )}
                      {record.status === "paid" && (
                        <span className='text-xs text-green-600 font-semibold'>
                          ✓ Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rates */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Commission Rates
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 bg-blue-50 rounded-lg border-2 border-blue-200'>
            <p className='font-semibold text-blue-900'>Production</p>
            <p className='text-2xl font-bold text-blue-600 mt-2'>2.0% → 3.0%</p>
            <p className='text-sm text-blue-700'>Tier at ₦100k</p>
          </div>
          <div className='p-4 bg-green-50 rounded-lg border-2 border-green-200'>
            <p className='font-semibold text-green-900'>Packaging</p>
            <p className='text-2xl font-bold text-green-600 mt-2'>
              1.5% → 2.5%
            </p>
            <p className='text-sm text-green-700'>Tier at ₦80k</p>
          </div>
          <div className='p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200'>
            <p className='font-semibold text-yellow-900'>Sales</p>
            <p className='text-2xl font-bold text-yellow-600 mt-2'>
              5.0% → 7.0%
            </p>
            <p className='text-sm text-yellow-700'>Tier at ₦150k</p>
          </div>
        </div>
      </div>
    </div>
  );
}
