"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { formatCurrency, formatDate } from "../../../../lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Settings,
  Filter,
  X,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Transaction } from "./types";
import SummaryCards from "./components/SummaryCards";
import TransactionFilters from "./components/TransactionFilters";
import TransactionsTable from "./components/TransactionsTable";

export default function TransactionsPage() {
  const transactions = (useQuery(api.inventory.inventory.getTransactions) ??
    []) as Transaction[];

  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const matchesType =
          typeFilter === "all" || t.transactionType === typeFilter;
        const matchesDate = !dateFilter || t.transactionDate === dateFilter;
        return matchesType && matchesDate;
      }),
    [transactions, typeFilter, dateFilter],
  );

  const totalPurchases = useMemo(
    () =>
      filtered
        .filter((t) => t.transactionType === "purchase")
        .reduce((sum, t) => sum + (t.totalCost ?? 0), 0),
    [filtered],
  );

  return (
    <div className='max-w-7xl mx-auto space-y-5'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/inventory'
          className='p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Transaction History
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            All stock movements and changes
          </p>
        </div>
      </div>

      <SummaryCards filtered={filtered} totalPurchases={totalPurchases} />

      <TransactionFilters
        typeFilter={typeFilter}
        dateFilter={dateFilter}
        onTypeChange={setTypeFilter}
        onDateChange={setDateFilter}
        onClear={() => {
          setTypeFilter("all");
          setDateFilter("");
        }}
      />

      <TransactionsTable transactions={filtered} />
    </div>
  );
}
