"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Plus,
  CheckCircle2,
  Circle,
  ChevronRight,
  ShoppingCart,
  Package,
  UserCheck,
  Wallet,
  TrendingUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Sale,
  StaffRecord,
  CommissionRecord,
  DerivedStats,
  DebtorRepayment,
} from "./types";
import PaymentBreakdown from "./components/PaymentBreakdown";
import CashReconciliationCard from "./components/CashReconciliationCard";
import TodaySalesTable from "./components/TodaySalesTable";
import PendingCommissionBanner from "./components/PendingCommissionBanner";
import StockReconciliationCard from "./components/StockReconciliationCard";
import DebtorRepaymentCard from "./components/DebtorRepaymentCard";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";
import { formatCurrency } from "../../../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = "stock" | "sales" | "repayments" | "close";

type StepDef = {
  id: StepId;
  number: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
  border: string;
  pillBg: string;
  pillText: string;
  activeDot: string;
};

const STEPS: StepDef[] = [
  {
    id: "stock",
    number: 1,
    label: "Morning Stock",
    sublabel: "Enter goods received today",
    icon: Package,
    accent: "text-amber-500",
    border: "border-amber-100",
    pillBg: "bg-amber-100",
    pillText: "text-amber-700",
    activeDot: "bg-amber-500",
  },
  {
    id: "sales",
    number: 2,
    label: "Record Sales",
    sublabel: "Log transactions as they happen",
    icon: ShoppingCart,
    accent: "text-rose-500",
    border: "border-rose-100",
    pillBg: "bg-rose-100",
    pillText: "text-rose-700",
    activeDot: "bg-rose-500",
  },
  {
    id: "repayments",
    number: 3,
    label: "Debt Repayments",
    sublabel: "Record cash received from debtors",
    icon: UserCheck,
    accent: "text-blue-500",
    border: "border-blue-100",
    pillBg: "bg-blue-100",
    pillText: "text-blue-700",
    activeDot: "bg-blue-500",
  },
  {
    id: "close",
    number: 4,
    label: "Close Day",
    sublabel: "Reconcile your cash drawer",
    icon: Wallet,
    accent: "text-emerald-500",
    border: "border-emerald-100",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    activeDot: "bg-emerald-500",
  },
];

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({
  done,
  active,
  locked,
  step,
}: {
  done: boolean;
  active: boolean;
  locked: boolean;
  step: StepDef;
}) {
  if (done)
    return (
      <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100'>
        <CheckCircle2 size={10} strokeWidth={2.5} /> Done
      </span>
    );
  if (locked)
    return (
      <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400'>
        <Lock size={9} strokeWidth={2.5} /> Locked
      </span>
    );
  if (active)
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${step.pillBg} ${step.pillText}`}>
        <Circle size={7} className='fill-current' /> In Progress
      </span>
    );
  return (
    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400'>
      Pending
    </span>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  done,
  active,
  locked,
  expanded,
  onToggle,
  summary,
  children,
}: {
  step: StepDef;
  done: boolean;
  active: boolean;
  locked: boolean;
  expanded: boolean;
  onToggle: () => void;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-opacity duration-200 ${
        locked
          ? "border-gray-100 bg-gray-50/50 opacity-50"
          : done
            ? "border-emerald-100 bg-white"
            : `${step.border} bg-white`
      }`}>
      <button
        type='button'
        onClick={onToggle}
        disabled={locked}
        className='w-full flex items-center gap-3 px-5 py-4 text-left disabled:cursor-not-allowed'>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${
            done
              ? "bg-emerald-500 text-white"
              : locked
                ? "bg-gray-200 text-gray-400"
                : active
                  ? `${step.activeDot} text-white`
                  : "bg-gray-100 text-gray-500"
          }`}>
          {done ? <CheckCircle2 size={15} strokeWidth={2.5} /> : step.number}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span
              className={`text-sm font-bold ${locked ? "text-gray-400" : "text-gray-900"}`}>
              {step.label}
            </span>
            <StatusPill
              done={done}
              active={active}
              locked={locked}
              step={step}
            />
          </div>
          <p className='text-xs text-gray-400 mt-0.5 truncate'>
            {done && summary ? summary : step.sublabel}
          </p>
        </div>

        {!locked && (
          <ChevronRight
            size={15}
            className={`text-gray-300 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {expanded && !locked && (
        <>
          <div className={`border-t ${step.border}`} />
          <div className='p-5 pt-4'>{children}</div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  // ─── Queries ───────────────────────────────────────────────────────────────
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

  // Today's repayments — now uses the updated query name
  const todayRepayments = (useQuery(
    api.debtors.debtorQueries.getRepaymentsByStaffAndDate,
    user?.staffId ? { staffId: user.staffId, date: today } : "skip",
  ) ?? []) as DebtorRepayment[];

  const debtorRepaymentTotal = todayRepayments.reduce(
    (acc, r) => acc + r.amount,
    0,
  );

  // ─── Derived stats ─────────────────────────────────────────────────────────
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
      debtorRepaymentTotal,
    };
  }, [todaySales, mySales, myStaffRecord, myCommission, debtorRepaymentTotal]);

  // ─── Step state ────────────────────────────────────────────────────────────
  const [stockDone, setStockDone] = useState(false);
  const [closeDone, setCloseDone] = useState(false);

  const salesHasSales = todaySales.length > 0;
  const repaymentsDone = todayRepayments.length > 0;
  const laterStepsLocked = !stockDone && !salesHasSales;

  const doneCount = [
    stockDone,
    salesHasSales,
    repaymentsDone,
    closeDone,
  ].filter(Boolean).length;

  const defaultOpen: StepId = !stockDone
    ? "stock"
    : salesHasSales
      ? "sales"
      : "repayments";
  const [expandedStep, setExpandedStep] = useState<StepId>(defaultOpen);

  const toggle = (id: StepId) =>
    setExpandedStep((prev) => (prev === id ? ("" as StepId) : id));

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (isLoading || !isAllowed) return null;

  return (
    <div className='max-w-2xl mx-auto space-y-5 pb-28'>
      {/* Header */}
      <div className='flex items-start justify-between pt-1'>
        <div>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>
            {formattedDate}
          </p>
          <h1 className='text-2xl font-bold text-gray-900 mt-0.5'>
            {user?.fullName?.split(" ")[0] ?? "Hey"} 👋
          </h1>
        </div>

        {/* Day progress ring */}
        <div className='flex flex-col items-center gap-1 flex-shrink-0'>
          <div className='relative w-12 h-12'>
            <svg className='w-full h-full -rotate-90' viewBox='0 0 48 48'>
              <circle
                cx='24'
                cy='24'
                r='20'
                fill='none'
                stroke='#f3f4f6'
                strokeWidth='5'
              />
              <circle
                cx='24'
                cy='24'
                r='20'
                fill='none'
                stroke='#f43f5e'
                strokeWidth='5'
                strokeLinecap='round'
                strokeDasharray={`${(doneCount / 4) * 125.6} 125.6`}
                className='transition-all duration-500'
              />
            </svg>
            <span className='absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700'>
              {doneCount}/4
            </span>
          </div>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider'>
            Today
          </p>
        </div>
      </div>

      {/* Compact stats strip */}
      <div className='grid grid-cols-3 gap-3'>
        {[
          {
            label: "Revenue",
            value: formatCurrency(stats.todayTotal),
            valueColor: "text-rose-500",
            bg: "bg-rose-50",
            border: "border-rose-100",
          },
          {
            label: "Commission",
            value: formatCurrency(stats.todayCommission),
            valueColor: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "Txns",
            value: String(todaySales.length),
            valueColor: "text-gray-800",
            bg: "bg-gray-50",
            border: "border-gray-100",
          },
        ].map(({ label, value, valueColor, bg, border }) => (
          <div
            key={label}
            className={`rounded-2xl border ${border} ${bg} px-4 py-3`}>
            <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1'>
              {label}
            </p>
            <p className={`text-base font-bold tabular-nums ${valueColor}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Guided steps */}
      <div className='space-y-3'>
        {/* Step 1 — Morning Stock */}
        <StepCard
          step={STEPS[0]}
          done={stockDone}
          active={!stockDone}
          locked={false}
          expanded={expandedStep === "stock"}
          onToggle={() => toggle("stock")}
          summary='Stock entered for today'>
          {user?._id && user?.staffId ? (
            <StockReconciliationCard
              todaySales={todaySales}
              staffId={user.staffId}
              recordedBy={user._id}
              today={today}
              onSubmitSuccess={() => {
                setStockDone(true);
                setExpandedStep("sales");
              }}
            />
          ) : null}
        </StepCard>

        {/* Step 2 — Record Sales */}
        <StepCard
          step={STEPS[1]}
          done={false}
          active={true}
          locked={false}
          expanded={expandedStep === "sales"}
          onToggle={() => toggle("sales")}
          summary={
            salesHasSales
              ? `${todaySales.length} txn${todaySales.length !== 1 ? "s" : ""} · ${formatCurrency(stats.todayTotal)}`
              : undefined
          }>
          <div className='space-y-4'>
            <Link
              href='/sales/record'
              className='flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0'>
                  <Plus size={17} strokeWidth={2.5} />
                </div>
                <div>
                  <p className='text-sm font-bold'>Record a Sale</p>
                  <p className='text-xs text-rose-200'>
                    Tap to log a new transaction
                  </p>
                </div>
              </div>
              <ChevronRight size={17} className='text-rose-200' />
            </Link>

            {salesHasSales ? (
              <TodaySalesTable
                sales={todaySales}
                myStaffRecord={myStaffRecord}
                todayTotal={stats.todayTotal}
                todayCommission={stats.todayCommission}
              />
            ) : (
              <div className='flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-gray-100 text-center'>
                <ShoppingCart
                  size={26}
                  className='text-gray-200 mb-2'
                  strokeWidth={1.5}
                />
                <p className='text-sm text-gray-400'>No sales yet today</p>
              </div>
            )}
          </div>
        </StepCard>

        {/* Step 3 — Debt Repayments */}
        <StepCard
          step={STEPS[2]}
          done={repaymentsDone}
          active={!repaymentsDone && !laterStepsLocked}
          locked={laterStepsLocked}
          expanded={expandedStep === "repayments"}
          onToggle={() => toggle("repayments")}
          summary={
            repaymentsDone
              ? `${todayRepayments.length} repayment${todayRepayments.length !== 1 ? "s" : ""} · ${formatCurrency(debtorRepaymentTotal)}`
              : undefined
          }>
          {user?._id && user?.staffId ? (
            <DebtorRepaymentCard
              repayments={todayRepayments}
              today={today}
              staffId={user.staffId}
              recordedBy={user._id}
            />
          ) : null}
        </StepCard>

        {/* Step 4 — Close Day */}
        <StepCard
          step={STEPS[3]}
          done={closeDone}
          active={!closeDone && !laterStepsLocked}
          locked={laterStepsLocked}
          expanded={expandedStep === "close"}
          onToggle={() => toggle("close")}
          summary={closeDone ? "Cash reconciliation submitted" : undefined}>
          <CashReconciliationCard
            todayCash={stats.todayCash}
            todayTotal={stats.todayTotal}
            today={today}
            staffName={user?.fullName ?? "Staff"}
            debtorRepaymentTotal={debtorRepaymentTotal}
            onSubmitSuccess={() => setCloseDone(true)}
          />
        </StepCard>
      </div>

      {/* Monthly summary + breakdowns */}
      <div className='space-y-4 pt-2'>
        <div className='rounded-2xl border border-gray-100 bg-white p-5'>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
            <TrendingUp size={12} /> This Month
          </p>
          <div className='grid grid-cols-2 gap-4'>
            {[
              {
                label: "Total Sales",
                value: formatCurrency(stats.monthTotal),
                color: "text-gray-900",
              },
              {
                label: "Commission",
                value: formatCurrency(stats.monthCommission),
                color: "text-emerald-600",
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className='text-xs text-gray-400 mb-1'>{label}</p>
                <p className={`text-xl font-bold tabular-nums ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <PaymentBreakdown stats={stats} />
        <PendingCommissionBanner amount={stats.pendingCommission} />
      </div>

      {/* Floating Record Sale FAB */}
      <div className='fixed bottom-6 right-5 z-50'>
        <Link
          href='/sales/record'
          className='inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold bg-rose-500 text-white shadow-lg shadow-rose-200/60 hover:bg-rose-600 active:scale-95 transition-all'>
          <Plus size={17} strokeWidth={2.5} />
          Record Sale
        </Link>
      </div>
    </div>
  );
}
