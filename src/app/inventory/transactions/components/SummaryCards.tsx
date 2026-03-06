import { AlertTriangle, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";
import { Transaction } from "../types";

export default function SummaryCards({
  filtered,
  totalPurchases,
}: {
  filtered: Transaction[];
  totalPurchases: number;
}) {
  const cards = [
    {
      label: "Total Purchases",
      value: formatCurrency(totalPurchases),
      icon: TrendingUp,
      accent: "bg-emerald-500 text-white border-emerald-500",
    },
    {
      label: "Usage Records",
      value: String(
        filtered.filter((t) => t.transactionType === "usage").length,
      ),
      icon: TrendingDown,
      accent: "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Waste Records",
      value: String(
        filtered.filter((t) => t.transactionType === "waste").length,
      ),
      icon: AlertTriangle,
      accent: filtered.some((t) => t.transactionType === "waste")
        ? "bg-red-500 text-white border-red-500"
        : "bg-white text-gray-800 border-gray-100",
    },
    {
      label: "Total Transactions",
      value: String(filtered.length),
      icon: Receipt,
      accent: "bg-white text-gray-800 border-gray-100",
    },
  ] as const;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className={`rounded-2xl border p-5 shadow-sm flex flex-col gap-3 ${accent}`}>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-widest opacity-60'>
              {label}
            </span>
            <Icon size={15} className='opacity-30' strokeWidth={2} />
          </div>
          <p className='text-2xl font-bold tabular-nums leading-none'>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
