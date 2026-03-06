"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDate } from "../../../lib/utils";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import Header from "./components/header";
import StaffFilter from "./components/staffFilter";
import StaffTable from "./components/staffTable";
import StatsSummary from "./components/statsSummary";
import { useRoleGuard } from "../../../hooks/useRoleGuard";

export default function StaffPage() {
  const staff = useQuery(api.staffs.staff.getAll);
  const deleteStaff = useMutation(api.staffs.staffMutation.remove);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { isAllowed, isLoading } = useRoleGuard(["owner", "admin"]);

  // Renders nothing while loading or while redirecting unauthorized users
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

  if (isLoading || !isAllowed) return null;
  return (
    <div className='space-y-6'>
      {/* Header */}
      <Header staff={staff} />

      {/* Filters */}
      <StaffFilter
        statusFilter={statusFilter}
        setSearchTerm={setSearchTerm}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* Staff Table */}
      <StaffTable
        formatDate={formatDate}
        handleDelete={handleDelete}
        filteredStaff={filteredStaff}
        roleColors={roleColors}
        statusColors={statusColors}
      />

      {/* Stats Summary */}

      <StatsSummary staff={staff} />
    </div>
  );
}
