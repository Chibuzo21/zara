import { ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";
import { DerivedStats, StaffRecord } from "../types";

interface KpiCardsProps {
  stats: DerivedStats;
  salesCount: number;
  monthlySalesCount: number;
  myStaffRecord: StaffRecord | undefined;
}

export default function KpiCards({
  stats,
  salesCount,
  monthlySalesCount,
  myStaffRecord,
}: KpiCardsProps) {
  const cards = [
    {
      label: "Today's Sales",
      value: formatCurrency(stats.todayTotal),
      sub: `${salesCount} transaction${salesCount !== 1 ? "s" : ""}`,
      icon: ShoppingCart,
      accent: "bg-rose-500 text-white border-rose-500",
    },
    {
      label: "Today's Commission",
      value: formatCurrency(stats.todayCommission),
      sub: myStaffRecord
        ? `${myStaffRecord.commissionRate}% rate`
        : "No rate set",
      icon: DollarSign,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "This Month",
      value: formatCurrency(stats.monthTotal),
      sub: `${monthlySalesCount} sale${monthlySalesCount !== 1 ? "s" : ""}`,
      icon: TrendingUp,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Month Commission",
      value: formatCurrency(stats.monthCommission),
      sub: "Estimated",
      icon: DollarSign,
      accent: "bg-rose-500 text-white border-rose-500",
    },
  ] as const;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map(({ label, value, sub, icon: Icon, accent }) => (
        <div
          key={label}
          className={`rounded-2xl border p-5 shadow-sm flex flex-col gap-3 ${accent}`}>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-widest opacity-60'>
              {label}
            </span>
            <Icon size={16} className='opacity-30' strokeWidth={2} />
          </div>
          <p className='text-2xl font-bold tabular-nums leading-none'>
            {value}
          </p>
          <p className='text-xs opacity-60'>{sub}</p>
        </div>
      ))}
    </div>
  );
}
