"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../lib/utils";
import {
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function ImprestPage() {
  const requests = useQuery(api.imprest.imprest.getAll) || [];
  const approveImprest = useMutation(api.imprest.imprestMutations.approve);
  const rejectImprest = useMutation(api.imprest.imprestMutations.reject);
  const disburseImprest = useMutation(api.imprest.imprestMutations.disburse);
  const retireImprest = useMutation(api.imprest.imprestMutations.retire);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (id: Id<"imprestRequests">) => {
    if (!confirm("Approve this imprest request?")) return;
    setLoading(id);
    try {
      await approveImprest({ id, approvedBy: id as any }); // TODO: Use actual current user
      alert("Imprest approved!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to approve");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: Id<"imprestRequests">) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    setLoading(id);
    try {
      await rejectImprest({ id, notes: reason });
      alert("Imprest rejected");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to reject");
    } finally {
      setLoading(null);
    }
  };

  const handleDisburse = async (id: Id<"imprestRequests">) => {
    if (!confirm("Mark this imprest as disbursed (money given)?")) return;
    setLoading(id);
    try {
      await disburseImprest({ id });
      alert("Marked as disbursed!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to disburse");
    } finally {
      setLoading(null);
    }
  };

  const handleRetire = async (id: Id<"imprestRequests">) => {
    if (!confirm("Retire this imprest (receipts submitted)?")) return;
    setLoading(id);
    try {
      await retireImprest({ id });
      alert("Imprest retired!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to retire");
    } finally {
      setLoading(null);
    }
  };

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

  const pending = requests.filter((r: any) => r.status === "pending");
  const approved = requests.filter((r: any) => r.status === "approved");
  const disbursed = requests.filter((r: any) => r.status === "disbursed");
  const retired = requests.filter((r: any) => r.status === "retired");

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
              <p className='text-white/80 text-sm'>Pending</p>
              <p className='text-2xl font-bold mt-2'>
                {formatCurrency(
                  pending.reduce(
                    (sum: number, r: any) => sum + r.amountRequested,
                    0,
                  ),
                )}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {pending.length} requests
              </p>
            </div>
            <Clock size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Approved</p>
              <p className='text-2xl font-bold mt-2'>
                {formatCurrency(
                  approved.reduce(
                    (sum: number, r: any) => sum + r.amountRequested,
                    0,
                  ),
                )}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {approved.length} requests
              </p>
            </div>
            <CheckCircle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Disbursed</p>
              <p className='text-2xl font-bold mt-2'>
                {formatCurrency(
                  disbursed.reduce(
                    (sum: number, r: any) => sum + r.amountRequested,
                    0,
                  ),
                )}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {disbursed.length} requests
              </p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Retired</p>
              <p className='text-2xl font-bold mt-2'>{retired.length}</p>
            </div>
            <FileCheck size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className='card bg-blue-50 border-2 border-blue-200'>
        <h3 className='font-bold text-blue-900 mb-3'>📊 Imprest Workflow</h3>
        <div className='flex items-center gap-2 text-xs flex-wrap'>
          <span className='px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold border-2 border-yellow-300'>
            1. Pending
          </span>
          <span className='text-blue-600 font-bold'>→ [Approve/Reject] →</span>
          <span className='px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold border-2 border-blue-300'>
            2. Approved
          </span>
          <span className='text-blue-600 font-bold'>→ [Disburse] →</span>
          <span className='px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold border-2 border-purple-300'>
            3. Disbursed
          </span>
          <span className='text-blue-600 font-bold'>→ [Retire] →</span>
          <span className='px-3 py-2 bg-green-100 text-green-800 rounded-lg font-semibold border-2 border-green-300'>
            4. Retired ✓
          </span>
        </div>
        <p className='text-xs text-blue-700 mt-3'>
          <strong>Approved:</strong> Owner okays request |{" "}
          <strong>Disbursed:</strong> Money given to staff |{" "}
          <strong>Retired:</strong> Receipts submitted
        </p>
      </div>

      {/* Filters */}
      <div className='card'>
        <label className='label'>Filter by Status</label>
        <select
          className='input-field max-w-xs'
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}>
          <option value='all'>All Status ({requests.length})</option>
          <option value='pending'>Pending ({pending.length})</option>
          <option value='approved'>Approved ({approved.length})</option>
          <option value='disbursed'>Disbursed ({disbursed.length})</option>
          <option value='retired'>Retired ({retired.length})</option>
          <option value='rejected'>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Request #</th>
                <th className='table-header'>Staff</th>
                <th className='table-header'>Amount</th>
                <th className='table-header'>Purpose</th>
                <th className='table-header'>Date</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500 py-8'>
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request: any) => (
                  <tr key={request._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-mono font-semibold'>
                      {request.requestNumber}
                    </td>
                    <td className='table-cell font-semibold'>Staff Name</td>
                    <td className='table-cell font-bold text-bakery-pink text-lg'>
                      {formatCurrency(request.amountRequested)}
                    </td>
                    <td className='table-cell max-w-xs'>
                      <p className='truncate text-sm'>{request.purpose}</p>
                    </td>
                    <td className='table-cell text-sm'>
                      {formatDate(request.requestDate)}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className='table-cell'>
                      {request.status === "pending" && (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={loading === request._id}
                            className='px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center gap-1'>
                            <CheckCircle size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={loading === request._id}
                            className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded flex items-center gap-1'>
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === "approved" && (
                        <button
                          onClick={() => handleDisburse(request._id)}
                          disabled={loading === request._id}
                          className='px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded flex items-center gap-1'>
                          <DollarSign size={12} />
                          Disburse
                        </button>
                      )}
                      {request.status === "disbursed" && (
                        <button
                          onClick={() => handleRetire(request._id)}
                          disabled={loading === request._id}
                          className='px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded flex items-center gap-1'>
                          <FileCheck size={12} />
                          Retire
                        </button>
                      )}
                      {request.status === "retired" && (
                        <span className='text-xs text-green-600 font-semibold'>
                          ✓ Complete
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className='text-xs text-red-600 font-semibold'>
                          ✗ Rejected
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
    </div>
  );
}
