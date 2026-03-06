"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Sale, StaffRecord, CommissionRecord, DerivedStats } from "./types";
import KpiCards from "./components/KpiCards";
import PaymentBreakdown from "./components/PaymentBreakdown";
import CashReconciliationCard from "./components/CashReconciliationCard";
import TodaySalesTable from "./components/TodaySalesTable";
import PendingCommissionBanner from "./components/PendingCommissionBanner";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";

export default function SalesDashboardPage() {
  const user = useQuery(api.users.viewer);
  const { isAllowed, isLoading } = useRoleGuard([
    "admin",
    "sales",
    "transport_sales",
  ]);
  const today = new Date().toISOString().split("T")[0];
  const monthStartStr = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split("T")[0];
  }, []);

  // Queries
  const todaySales = (useQuery(api.sales.sales.getTodayByUser, {
    userId: user?._id,
  }) ?? []) as Sale[];

  const mySales = (useQuery(api.sales.sales.getByUserAndDateRange, {
    userId: user?._id,
    startDate: monthStartStr,
    endDate: today,
  }) ?? []) as Sale[];

  const staff = (useQuery(api.staffs.staff.getAll) ?? []) as StaffRecord[];
  const myStaffRecord = staff.find((s) => s._id === user?.staffId);

  const commission = (useQuery(api.commission.commission.getAll) ??
    []) as CommissionRecord[];
  const myCommission = commission.filter((c) => c.staffId === user?.staffId);

  // Derived stats
  const stats = useMemo<DerivedStats>(() => {
    const sum = (arr: Sale[], filter?: (s: Sale) => boolean) =>
      (filter ? arr.filter(filter) : arr).reduce(
        (acc, s) => acc + s.totalAmount,
        0,
      );

    const todayTotal = sum(todaySales);
    const monthTotal = sum(mySales);
    const rate = myStaffRecord?.commissionRate ?? 0;

    return {
      todayTotal,
      todayCash: sum(todaySales, (s) => s.paymentMethod === "cash"),
      todayTransfer: sum(todaySales, (s) => s.paymentMethod === "transfer"),
      todayPos: sum(todaySales, (s) => s.paymentMethod === "pos"),
      monthTotal,
      todayCommission: (todayTotal * rate) / 100,
      monthCommission: (monthTotal * rate) / 100,
      pendingCommission: myCommission
        .filter((c) => c.status === "pending")
        .reduce((acc, c) => acc + c.netCommission, 0),
    };
  }, [todaySales, mySales, myStaffRecord, myCommission]);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (isLoading || !isAllowed) return null;

  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Welcome, {user?.fullName ?? "—"} 👋
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>{formattedDate}</p>
        </div>
        <Link
          href='/sales/record'
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors'>
          <Plus size={16} strokeWidth={2.5} />
          Record Sale
        </Link>
      </div>

      <KpiCards
        stats={stats}
        salesCount={todaySales.length}
        monthlySalesCount={mySales.length}
        myStaffRecord={myStaffRecord}
      />

      <PaymentBreakdown stats={stats} />

      <CashReconciliationCard
        todayCash={stats.todayCash}
        todayTotal={stats.todayTotal}
        today={today}
        staffName={user?.fullName ?? "Staff"}
      />

      <TodaySalesTable
        sales={todaySales}
        myStaffRecord={myStaffRecord}
        todayTotal={stats.todayTotal}
        todayCommission={stats.todayCommission}
      />

      <PendingCommissionBanner amount={stats.pendingCommission} />
    </div>
  );
}
