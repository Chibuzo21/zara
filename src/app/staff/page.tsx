"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDate } from "../../../lib/utils";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useState } from "react";

import type { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";

export default function StaffPage() {
  const staff = useQuery(api.staff.getAll);
  const deleteStaff = useMutation(api.staffMutation.remove);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleDelete = async (id: Id<"staff">) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await deleteStaff({ id });
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  if (staff === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 text-purple-800",
    production: "bg-blue-100 text-blue-800",
    packaging: "bg-green-100 text-green-800",
    sales: "bg-yellow-100 text-yellow-800",
    admin: "bg-gray-100 text-gray-800",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Staff Management</h1>
          <p className='text-gray-600 mt-1'>
            {staff.length} total staff members
          </p>
        </div>
        <Link href='/staff/new' className='btn-primary'>
          <Plus size={20} className='inline mr-2' />
          Add Staff
        </Link>
      </div>

      {/* Filters */}
      <div className='card'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='label'>Search</label>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Search by name or ID...'
                className='input-field pl-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='label'>Role</label>
            <select
              className='input-field'
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}>
              <option value='all'>All Roles</option>
              <option value='production'>Production</option>
              <option value='packaging'>Packaging</option>
              <option value='sales'>Sales</option>
              <option value='admin'>Admin</option>
              <option value='owner'>Owner</option>
            </select>
          </div>

          <div>
            <label className='label'>Status</label>
            <select
              className='input-field'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='suspended'>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Name</th>
                <th className='table-header'>Role</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Contact</th>
                <th className='table-header'>Commission Rate</th>
                <th className='table-header'>Date Hired</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className='table-cell text-center text-gray-500 py-8'>
                    No staff members found
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member._id} className='hover:bg-gray-50'>
                    <td className='table-cell font-semibold'>
                      {member.fullName}
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[member.role]}`}>
                        {member.role.toUpperCase()}
                      </span>
                    </td>
                    <td className='table-cell'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[member.status]}`}>
                        {member.status.toUpperCase()}
                      </span>
                    </td>
                    <td className='table-cell'>
                      <div className='text-sm'>
                        <div>{member.phone || "N/A"}</div>
                        <div className='text-gray-500'>
                          {member.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className='table-cell font-semibold text-bakery-pink'>
                      {member.commissionRate}%
                    </td>
                    <td className='table-cell'>
                      {formatDate(member.dateHired)}
                    </td>
                    <td className='table-cell'>
                      <div className='flex space-x-2'>
                        <button className='p-2 text-blue-600 hover:bg-blue-50 rounded'>
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='card text-center'>
          <p className='text-sm text-gray-600'>Total Staff</p>
          <p className='text-2xl font-bold text-bakery-pink'>{staff.length}</p>
        </div>
        <div className='card text-center'>
          <p className='text-sm text-gray-600'>Active</p>
          <p className='text-2xl font-bold text-green-600'>
            {staff.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className='card text-center'>
          <p className='text-sm text-gray-600'>Production</p>
          <p className='text-2xl font-bold text-blue-600'>
            {staff.filter((s) => s.role === "production").length}
          </p>
        </div>
        <div className='card text-center'>
          <p className='text-sm text-gray-600'>Packaging</p>
          <p className='text-2xl font-bold text-green-600'>
            {staff.filter((s) => s.role === "packaging").length}
          </p>
        </div>
        <div className='card text-center'>
          <p className='text-sm text-gray-600'>Sales</p>
          <p className='text-2xl font-bold text-yellow-600'>
            {staff.filter((s) => s.role === "sales").length}
          </p>
        </div>
      </div>
    </div>
  );
}
