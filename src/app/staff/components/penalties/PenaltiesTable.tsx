"use client";

// components/penalties/PenaltiesTable.tsx

import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Trash2 } from "lucide-react";

type Penalty = Doc<"staffPenalties"> & { staffName?: string };

const CATEGORY_CONFIG: Record<
  string,
  { label: string; emoji: string; badge: string }
> = {
  lateness: {
    label: "Lateness",
    emoji: "⏰",
    badge: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  misconduct: {
    label: "Misconduct",
    emoji: "⚠️",
    badge: "bg-orange-50 text-orange-600 border border-orange-100",
  },
  damage: {
    label: "Damage",
    emoji: "💔",
    badge: "bg-red-50 text-red-500 border border-red-100",
  },
  absence: {
    label: "Absence",
    emoji: "🚫",
    badge: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  other: {
    label: "Other",
    emoji: "📝",
    badge: "bg-gray-50 text-gray-500 border border-gray-200",
  },
};

interface PenaltiesTableProps {
  penalties: Penalty[];
  /** Show staff name column + delete button */
  isAdmin?: boolean;
}

export default function PenaltiesTable({
  penalties,
  isAdmin = false,
}: PenaltiesTableProps) {
  const removePenalty = useMutation(api.staffs.penalties.remove);

  const totalDeducted = penalties.reduce((sum, p) => sum + p.amount, 0);

  const handleDelete = async (id: Id<"staffPenalties">) => {
    if (!confirm("Remove this penalty? This cannot be undone.")) return;
    try {
      await removePenalty({ id });
    } catch {
      alert("Failed to remove penalty.");
    }
  };

  const cols = [
    ...(isAdmin ? ["Staff"] : []),
    "Date",
    "Category",
    "Reason",
    "Amount",
    ...(isAdmin ? [""] : []), // actions col
  ];

  return (
    <div className='rounded-2xl overflow-hidden border border-red-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-red-100 bg-red-50/60'>
              {cols.map((h, i) => (
                <th
                  key={i}
                  className='px-5 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-red-400 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {penalties.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length}
                  className='px-5 py-14 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>✅</span>
                    <span>No penalties recorded</span>
                  </div>
                </td>
              </tr>
            ) : (
              penalties.map((p) => {
                const cat =
                  CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG.other;

                // format "YYYY-MM-DD" → readable
                const dateLabel = new Date(
                  p.penaltyDate + "T00:00:00",
                ).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr
                    key={p._id}
                    className='group hover:bg-red-50/20 transition-colors'>
                    {isAdmin && (
                      <td className='px-5 py-4 font-semibold text-gray-800 whitespace-nowrap'>
                        {p.staffName ?? "—"}
                      </td>
                    )}
                    <td className='px-5 py-4 text-gray-500 tabular-nums whitespace-nowrap'>
                      {dateLabel}
                    </td>
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cat.badge}`}>
                        {cat.emoji} {cat.label}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-gray-600 max-w-[200px]'>
                      <p className='truncate'>{p.reason}</p>
                      {p.notes && (
                        <p className='text-xs text-gray-300 mt-0.5 truncate'>
                          {p.notes}
                        </p>
                      )}
                    </td>
                    <td className='px-5 py-4 font-bold text-red-500 tabular-nums whitespace-nowrap'>
                      −₦{p.amount.toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td className='px-5 py-4'>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className='p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors'
                          title='Remove penalty'>
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {penalties.length > 0 && (
        <div className='px-5 py-3 border-t border-red-50 bg-red-50/30 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {penalties.length} record{penalties.length !== 1 ? "s" : ""}
          </span>
          <span className='text-sm font-bold text-red-500 tabular-nums'>
            Total: −₦{totalDeducted.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
