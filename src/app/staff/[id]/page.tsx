"use client";

// app/staff/[id]/page.tsx  — staff detail page (admin view)
// Shows penalties table, add form, and monthly pay summary side by side.

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";
import AddPenaltyForm from "../components/penalties/AddPenaltyForm";
import PenaltiesTable from "../components/penalties/PenaltiesTable";
import MonthlyPaySummary from "../components/penalties/MonthlyPaySummary";

export default function StaffDetailPage() {
  const { id } = useParams();
  const { isLoading, isAllowed } = useRoleGuard(["owner", "admin"]);

  const staff = useQuery(api.staffs.staff.getById, { id: id as Id<"staff"> });
  const penalties =
    useQuery(api.staffs.penalties.getByStaff, {
      staffId: id as Id<"staff">,
    }) ?? [];

  if (isLoading || !isAllowed) return null;
  if (!staff)
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-10 h-10 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin' />
      </div>
    );

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      {/* Back + edit */}
      <div className='flex items-center justify-between'>
        <Link
          href='/staff'
          className='inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors'>
          <ArrowLeft size={14} /> Back to Staff
        </Link>
        <Link
          href={`/staff/${id}/edit`}
          className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/40 transition-colors'>
          <Edit2 size={13} strokeWidth={2} /> Edit
        </Link>
      </div>

      {/* Staff header */}
      <div className='rounded-2xl border border-rose-100 bg-white shadow-sm p-5 flex items-center gap-4'>
        <div className='w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg'>
          {staff.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className='text-xl font-bold text-gray-900'>{staff.fullName}</h1>
          <p className='text-sm text-gray-400 capitalize'>
            {staff.role} · {staff.status}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        {/* Penalties history — takes 2 cols */}
        <div className='lg:col-span-2 space-y-4'>
          <h2 className='text-xs font-semibold tracking-widest uppercase text-gray-400'>
            Penalty History
          </h2>
          <PenaltiesTable penalties={penalties} isAdmin />

          {/* Add form below the table */}
          <AddPenaltyForm preselectedStaffId={id as Id<"staff">} />
        </div>

        {/* Pay summary — 1 col */}
        <div className='space-y-4'>
          <h2 className='text-xs font-semibold tracking-widest uppercase text-gray-400'>
            Pay Summary
          </h2>
          {staff.baseSalary !== undefined ? (
            <MonthlyPaySummary
              staffId={staff._id}
              baseSalary={staff.baseSalary}
              // Pass commission from commissionRecords if you query it here
              // commissionAmount={latestCommission?.netCommission}
            />
          ) : (
            <div className='rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400'>
              No base salary set. Edit staff to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
