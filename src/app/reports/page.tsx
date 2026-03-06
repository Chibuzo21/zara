"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  formatCurrency,
  generateWhatsAppReport,
  openWhatsApp,
} from "../../../lib/utils";
import {
  MessageCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  BarChart2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { ReportPeriod } from "./types";
import { getDateRange, periodLabel } from "./helpers";
import { PeriodSelector } from "./components/PeriodSelector";
import StatCardSkeleton from "./components/StatCardSkeleton";
import { StatCard } from "./components/statCard";
import TopProductsList from "./components/TopProductsList";
import RecentSalesList from "./components/RecentSalesList";
import { useRoleGuard } from "../../../hooks/useRoleGuard";

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const range = useMemo(
    () => getDateRange(period, { start: customStart, end: customEnd }),
    [period, customStart, customEnd],
  );
  const { isAllowed, isLoading: roleLoading } = useRoleGuard([
    "owner",
    "admin",
  ]);
  // Only query when we have a valid range
  const hasRange =
    Boolean(range.start) &&
    Boolean(range.end) &&
    (period !== "custom" || (Boolean(customStart) && Boolean(customEnd)));

  const queryArgs = hasRange
    ? { startDate: range.start, endDate: range.end }
    : "skip";

  const sales = useQuery(api.sales.sales.getByDateRange, queryArgs);
  const topProducts = useQuery(
    api.sales.sales.getTopProducts,
    hasRange
      ? { startDate: range.start, endDate: range.end, limit: 5 }
      : "skip",
  );

  const isLoading = sales === undefined || topProducts === undefined;

  // Derived stats
  const totalSales = sales?.reduce((sum, s) => sum + s.totalAmount, 0) ?? 0;
  const salesCount = sales?.length ?? 0;
  const avgOrder = salesCount > 0 ? totalSales / salesCount : 0;
  const totalExpenses = 0; // placeholder — wire to operations query
  const netProfit = totalSales - totalExpenses;
  const margin =
    totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;

  const handleWhatsApp = () => {
    if (!sales || !topProducts) return;

    const message = generateWhatsAppReport({
      date: periodLabel(period, range),
      totalSales,
      totalExpenses,
      netProfit,
      topProducts: (topProducts ?? []).filter(
        (p): p is { productName: string; quantity: number; amount: number } =>
          p.productName !== undefined,
      ),
    });

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    if (!phoneNumber) {
      alert("Set NEXT_PUBLIC_WHATSAPP_NUMBER in your environment variables.");
      return;
    }
    openWhatsApp(phoneNumber, message);
  };

  const STAT_CARDS = [
    {
      label: "Total Sales",
      value: formatCurrency(totalSales),
      sub: `${salesCount} transaction${salesCount !== 1 ? "s" : ""}`,
      icon: DollarSign,
      accent: "bg-rose-500 text-white border-rose-500",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      sub: "Operational costs",
      icon: TrendingDown,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      sub: `${margin}% margin`,
      icon: TrendingUp,
      accent:
        netProfit >= 0
          ? "bg-emerald-500 text-white border-emerald-500"
          : "bg-red-500 text-white border-red-500",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(avgOrder),
      sub: "Per transaction",
      icon: BarChart2,
      accent: "bg-white text-gray-800 border-gray-100",
    },
  ] as const;

  if (roleLoading || !isAllowed) return null;
  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Reports & Analytics
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            {periodLabel(period, range)}
          </p>
        </div>
        <button
          onClick={handleWhatsApp}
          disabled={isLoading || salesCount === 0}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
          <MessageCircle size={16} strokeWidth={2.5} />
          Send to WhatsApp
        </button>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        period={period}
        onChange={setPeriod}
        startDate={customStart}
        endDate={customEnd}
        onStartChange={setCustomStart}
        onEndChange={setCustomEnd}
      />

      {/* Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : STAT_CARDS.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Bottom grid: Top Products + Recent Sales */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {/* Top Products */}
        <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
              Top Products
            </h2>
            {topProducts && topProducts.length > 0 && (
              <span className='text-xs text-gray-400'>
                {topProducts.length} items
              </span>
            )}
          </div>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='h-12 bg-gray-50 rounded-xl animate-pulse'
                />
              ))}
            </div>
          ) : (
            <TopProductsList products={topProducts ?? []} />
          )}
        </div>

        {/* Recent Transactions */}
        <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
              Recent Transactions
            </h2>
            {sales && sales.length > 0 && (
              <span className='text-xs text-gray-400'>
                {sales.length} total
              </span>
            )}
          </div>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className='h-12 bg-gray-50 rounded-xl animate-pulse'
                />
              ))}
            </div>
          ) : (
            <RecentSalesList sales={sales ?? []} />
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className='text-xs text-gray-300 text-center pb-2'>
        Expenses and commission data — wire to your operations queries to enable
        full P&L
      </p>
    </div>
  );
}
