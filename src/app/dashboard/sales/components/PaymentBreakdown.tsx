import { formatCurrency } from "../../../../../lib/utils";
import { DerivedStats } from "../types";

interface PaymentBreakdownProps {
  stats: Pick<
    DerivedStats,
    "todayCash" | "todayTransfer" | "todayPos" | "todayTotal"
  >;
}

const PAYMENT_METHODS = [
  {
    key: "todayCash" as const,
    label: "Cash",
    emoji: "💵",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "todayTransfer" as const,
    label: "Transfer",
    emoji: "🏦",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "todayPos" as const,
    label: "POS",
    emoji: "💳",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    key: "todayTotal" as const,
    label: "Total",
    emoji: "📝",
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
] as const;

export default function PaymentBreakdown({ stats }: PaymentBreakdownProps) {
  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
      <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400 mb-4'>
        Today's Payment Breakdown
      </h2>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        {PAYMENT_METHODS.map(({ key, label, emoji, color, bg, border }) => (
          <div key={key} className={`rounded-xl border p-4 ${bg} ${border}`}>
            <p className='text-xs text-gray-500 mb-2 flex items-center gap-1.5'>
              <span>{emoji}</span>
              {label}
            </p>
            <p className={`text-xl font-bold tabular-nums ${color}`}>
              {formatCurrency(stats[key])}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
