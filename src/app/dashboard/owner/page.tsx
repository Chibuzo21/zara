"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../../../lib/utils";
import type { TopProduct, DashboardStats } from "../../../../lib/type";
import { DebtorLedger } from "../sales/types";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  BarChart,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";
import { useState } from "react";

// ─── Debt status badge ────────────────────────────────────────────────────────

function DebtBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    outstanding: "bg-red-50 text-red-600 border border-red-100",
    partial: "bg-orange-50 text-orange-600 border border-orange-100",
    settled: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  };
  const labels: Record<string, string> = {
    outstanding: "Outstanding",
    partial: "Partial",
    settled: "Settled",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function DebtProgress({
  amountPaid,
  originalAmount,
}: {
  amountPaid: number;
  originalAmount: number;
}) {
  const pct =
    originalAmount > 0 ? Math.min((amountPaid / originalAmount) * 100, 100) : 0;
  return (
    <div className='w-full bg-gray-100 rounded-full h-1.5 mt-1.5'>
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${pct >= 100 ? "bg-emerald-400" : pct > 0 ? "bg-orange-400" : "bg-red-300"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type DebtFilter = "all" | "outstanding" | "partial" | "settled";

export default function OwnerDashboard() {
  const { isAllowed, isLoading } = useRoleGuard(["owner", "admin"]);

  const stats = useQuery(api.sales.sales.getDashboardStats) as
    | DashboardStats
    | undefined;
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date();
  monthStart.setDate(1);

  const topProducts = useQuery(api.sales.sales.getTopProducts, {
    startDate: monthStart.toISOString().split("T")[0],
    endDate: today,
    limit: 5,
  }) as TopProduct[] | undefined;

  // Full debtors ledger — all staff, all statuses
  const allDebts = (useQuery(api.debtors.debtorQueries.getAll) ??
    []) as DebtorLedger[];

  // Debt filter + expand state
  const [debtFilter, setDebtFilter] = useState<DebtFilter>("outstanding");
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);

  if (isLoading || !isAllowed) return null;

  if (stats === undefined || topProducts === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─── Debt derived numbers ─────────────────────────────────────────────────
  const outstandingDebts = allDebts.filter((d) => d.status === "outstanding");
  const partialDebts = allDebts.filter((d) => d.status === "partial");
  const settledDebts = allDebts.filter((d) => d.status === "settled");
  const totalOutstanding = [...outstandingDebts, ...partialDebts].reduce(
    (acc, d) => acc + d.balance,
    0,
  );
  const totalOriginal = allDebts.reduce((acc, d) => acc + d.originalAmount, 0);
  const totalRecovered = allDebts.reduce((acc, d) => acc + d.amountPaid, 0);

  const filteredDebts =
    debtFilter === "all"
      ? allDebts
      : debtFilter === "outstanding"
        ? outstandingDebts
        : debtFilter === "partial"
          ? partialDebts
          : settledDebts;

  const FILTERS: { key: DebtFilter; label: string; count: number }[] = [
    {
      key: "outstanding",
      label: "Outstanding",
      count: outstandingDebts.length,
    },
    { key: "partial", label: "Partial", count: partialDebts.length },
    { key: "settled", label: "Settled", count: settledDebts.length },
    { key: "all", label: "All", count: allDebts.length },
  ];

  return (
    <div className='space-y-6'>
      {/* ── Header ── */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Owner Dashboard</h1>
          <p className='text-gray-600 mt-1'>{formatDate(new Date())}</p>
        </div>
        <Link href='/operations/new' className='btn-primary'>
          + New Daily Log
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Today's Sales — unchanged */}
        <div className='stat-card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Today's Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(stats.todaySales)}
              </p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
          <div className='flex items-center mt-4 text-sm'>
            {stats.todayProfit >= 0 ? (
              <>
                <TrendingUp size={16} className='mr-1' />
                <span>Profit: {formatCurrency(stats.todayProfit)}</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className='mr-1' />
                <span>Loss: {formatCurrency(Math.abs(stats.todayProfit))}</span>
              </>
            )}
          </div>
        </div>

        {/* Month Sales — unchanged */}
        <div className='bg-linear-to-br from-bakery-gold to-yellow-500 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Month Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(stats.monthSales)}
              </p>
            </div>
            <BarChart size={40} className='text-white/50' />
          </div>
        </div>

        {/* Active Staff — unchanged */}
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Active Staff</p>
              <p className='text-3xl font-bold mt-2'>{stats.activeStaff}</p>
            </div>
            <Users size={40} className='text-white/50' />
          </div>
        </div>

        {/* Low Stock — unchanged */}
        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Low Stock Items</p>
              <p className='text-3xl font-bold mt-2'>{stats.lowStock}</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
          {stats.lowStock > 0 && (
            <Link
              href='/inventory'
              className='flex items-center mt-4 text-sm hover:underline'>
              <AlertTriangle size={16} className='mr-1' />
              <span>View inventory</span>
            </Link>
          )}
        </div>

        {/* Pending Imprest — unchanged */}
        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Pending Imprest</p>
              <p className='text-3xl font-bold mt-2'>{stats.pendingImprest}</p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
          {stats.pendingImprest > 0 && (
            <Link
              href='/imprest'
              className='flex items-center mt-4 text-sm hover:underline'>
              View requests
            </Link>
          )}
        </div>

        {/* ── NEW: Total Outstanding Debt stat card ── */}
        <div className='bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Outstanding Debt</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
            <CreditCard size={40} className='text-white/50' />
          </div>
          <div className='mt-4 space-y-1 text-sm text-white/80'>
            <div className='flex justify-between'>
              <span>
                {outstandingDebts.length + partialDebts.length} open debt
                {outstandingDebts.length + partialDebts.length !== 1 ? "s" : ""}
              </span>
              <span>{formatCurrency(totalRecovered)} recovered</span>
            </div>
            {/* Recovery progress bar */}
            {totalOriginal > 0 && (
              <div className='w-full bg-white/20 rounded-full h-1.5 mt-2'>
                <div
                  className='h-1.5 rounded-full bg-white/70 transition-all duration-300'
                  style={{
                    width: `${Math.min((totalRecovered / totalOriginal) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── NEW: Debtors Ledger panel ── */}
      <div className='card'>
        {/* Panel header */}
        <div className='flex items-start justify-between mb-5'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Debtors Ledger</h2>
            <p className='text-sm text-gray-500 mt-0.5'>
              All credit sales across every salesperson
            </p>
          </div>
          {/* Summary chips */}
          <div className='flex items-center gap-3 flex-wrap justify-end'>
            <div className='text-right'>
              <p className='text-xs text-gray-400'>Total on credit</p>
              <p className='text-base font-bold text-gray-900 tabular-nums'>
                {formatCurrency(totalOriginal)}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-400'>Still owed</p>
              <p className='text-base font-bold text-rose-500 tabular-nums'>
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className='flex gap-2 mb-4 flex-wrap'>
          {FILTERS.map(({ key, label, count }) => (
            <button
              key={key}
              type='button'
              onClick={() => setDebtFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                debtFilter === key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}>
              {label}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  debtFilter === key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Debt rows */}
        {filteredDebts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <CheckCircle2
              size={32}
              className='text-emerald-300 mb-2'
              strokeWidth={1.5}
            />
            <p className='text-gray-500'>
              {debtFilter === "settled"
                ? "No settled debts yet"
                : "No debts in this category"}
            </p>
          </div>
        ) : (
          <div className='space-y-2'>
            {filteredDebts.map((debt) => {
              const isExpanded = expandedDebtId === debt._id;
              const staffName =
                (debt.staff as any)?.fullName ?? "Unknown Staff";

              return (
                <div
                  key={debt._id}
                  className={`rounded-xl border transition-colors ${
                    debt.status === "settled"
                      ? "border-emerald-100 bg-emerald-50/30"
                      : debt.status === "partial"
                        ? "border-orange-100 bg-orange-50/20"
                        : "border-red-100 bg-red-50/20"
                  }`}>
                  {/* Row header — always visible */}
                  <button
                    type='button'
                    onClick={() =>
                      setExpandedDebtId(isExpanded ? null : debt._id)
                    }
                    className='w-full flex items-center gap-4 px-4 py-3 text-left'>
                    {/* Status icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        debt.status === "settled"
                          ? "bg-emerald-100"
                          : debt.status === "partial"
                            ? "bg-orange-100"
                            : "bg-red-100"
                      }`}>
                      {debt.status === "settled" ? (
                        <CheckCircle2
                          size={15}
                          className='text-emerald-500'
                          strokeWidth={2}
                        />
                      ) : (
                        <Clock
                          size={15}
                          className={
                            debt.status === "partial"
                              ? "text-orange-500"
                              : "text-red-500"
                          }
                          strokeWidth={2}
                        />
                      )}
                    </div>

                    {/* Names + meta */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <p className='text-sm font-bold text-gray-900 truncate'>
                          {debt.customerName}
                        </p>
                        <DebtBadge status={debt.status} />
                      </div>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        via{" "}
                        <span className='font-medium text-gray-600'>
                          {staffName}
                        </span>
                        {" · "}
                        Sale date: {debt.saleDate}
                      </p>
                      <DebtProgress
                        amountPaid={debt.amountPaid}
                        originalAmount={debt.originalAmount}
                      />
                    </div>

                    {/* Amounts */}
                    <div className='text-right flex-shrink-0 mr-2'>
                      {debt.status !== "settled" ? (
                        <>
                          <p className='text-sm font-bold text-rose-500 tabular-nums'>
                            {formatCurrency(debt.balance)}
                          </p>
                          <p className='text-[10px] text-gray-400'>remaining</p>
                        </>
                      ) : (
                        <>
                          <p className='text-sm font-bold text-emerald-600 tabular-nums'>
                            {formatCurrency(debt.originalAmount)}
                          </p>
                          <p className='text-[10px] text-gray-400'>
                            settled {debt.settledDate}
                          </p>
                        </>
                      )}
                    </div>

                    {isExpanded ? (
                      <ChevronUp
                        size={14}
                        className='text-gray-300 flex-shrink-0'
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                        className='text-gray-300 flex-shrink-0'
                      />
                    )}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className='border-t border-gray-100 px-4 py-3 bg-white/60'>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
                        {[
                          {
                            label: "Original Amount",
                            value: formatCurrency(debt.originalAmount),
                            color: "text-gray-900",
                          },
                          {
                            label: "Amount Paid",
                            value: formatCurrency(debt.amountPaid),
                            color: "text-emerald-600",
                          },
                          {
                            label: "Balance",
                            value: formatCurrency(debt.balance),
                            color:
                              debt.balance > 0
                                ? "text-rose-500"
                                : "text-emerald-600",
                          },
                          {
                            label: "Salesperson",
                            value: staffName,
                            color: "text-gray-900",
                          },
                        ].map(({ label, value, color }) => (
                          <div key={label}>
                            <p className='text-gray-400 uppercase tracking-wider font-semibold mb-0.5'>
                              {label}
                            </p>
                            <p className={`font-bold ${color}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                      {debt.notes && (
                        <p className='mt-2 text-xs text-gray-400 italic'>
                          {debt.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Top Products — unchanged ── */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Top Products This Month
        </h2>
        {topProducts && topProducts.length > 0 ? (
          <div className='space-y-3'>
            {topProducts.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {product.productName}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {product.quantity} units sold
                  </p>
                </div>
                <p className='font-bold text-bakery-pink'>
                  {formatCurrency(product.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center py-8'>
            No sales data for this month
          </p>
        )}
      </div>

      {/* ── Quick Actions — unchanged ── */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Link
            href='/staff'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <Users className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>Manage Staff</p>
          </Link>
          <Link
            href='/inventory'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <Package className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>View Inventory</p>
          </Link>
          <Link
            href='/commission'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <DollarSign className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>Process Commission</p>
          </Link>
          <Link
            href='/reports'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <BarChart3 className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>View Reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
