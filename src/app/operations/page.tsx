"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import OperationsTable from "./components/operationsTable";
import QuickStats from "./components/QuickStats";
import Filters from "./components/Filters";
import OperationsHeader from "./components/Operations-Header";
import { useRoleGuard } from "../../../hooks/useRoleGuard";

export default function OperationsPage() {
  // You'll need to create these queries in convex/operations.ts
  const { isAllowed, isLoading } = useRoleGuard(["owner", "admin"]);
  const operations = useQuery(api.operations.operations.getAll) || [];

  const [dateFilter, setDateFilter] = useState("");
  if (isLoading || !isAllowed) return null;

  if (operations === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}

      <OperationsHeader />

      {/* Quick Stats */}

      <QuickStats operations={operations} />

      {/* Filters */}

      <Filters dateFilter={dateFilter} setDateFilter={setDateFilter} />

      {/* Operations Table */}

      <OperationsTable operations={operations} dateFilter={dateFilter} />
    </div>
  );
}
