import React from "react";
import { formatCurrency, formatDate } from "../../../../lib/utils";
import { Doc } from "../../../../convex/_generated/dataModel";
import { CheckCircle2, Clock } from "lucide-react";

type Operation = Doc<"dailyOperations">;

interface OperationsTableProps {
  operations: Operation[];
  dateFilter?: string;
}

export default function OperationsTable({
  operations,
  dateFilter,
}: OperationsTableProps) {
  const filteredOps = dateFilter
    ? operations.filter((op) => op.operationDate === dateFilter)
    : operations;

  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-rose-100 bg-rose-50/60'>
              {[
                "Date",
                "Opening Cash",
                "Closing Cash",
                "Total Sales",
                "Total Expenses",
                "Net Profit",
                "Variance",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className='px-5 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-rose-400 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {filteredOps.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>📋</span>
                    <span>No operations logged yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOps.map((op) => {
                const netProfit = op.totalSales - op.totalExpenses;
                const expectedCash =
                  op.openingCash + op.totalSales - op.totalExpenses;
                const variance = op.closingCash - expectedCash;
                const varianceIsNeutral = Math.abs(variance) < 100;

                return (
                  <tr
                    key={op._id}
                    className='group transition-colors duration-150 hover:bg-rose-50/40'>
                    {/* Date */}
                    <td className='px-5 py-4'>
                      <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors'>
                        {formatDate(op.operationDate)}
                      </span>
                    </td>

                    {/* Opening Cash */}
                    <td className='px-5 py-4 text-gray-600 tabular-nums'>
                      {formatCurrency(op.openingCash)}
                    </td>

                    {/* Closing Cash */}
                    <td className='px-5 py-4 text-gray-600 tabular-nums'>
                      {formatCurrency(op.closingCash)}
                    </td>

                    {/* Total Sales */}
                    <td className='px-5 py-4 font-semibold text-emerald-600 tabular-nums'>
                      {formatCurrency(op.totalSales)}
                    </td>

                    {/* Total Expenses */}
                    <td className='px-5 py-4 font-semibold text-red-500 tabular-nums'>
                      {formatCurrency(op.totalExpenses)}
                    </td>

                    {/* Net Profit */}
                    <td className='px-5 py-4 tabular-nums'>
                      <span
                        className={`font-bold ${
                          netProfit >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}>
                        {formatCurrency(netProfit)}
                      </span>
                    </td>

                    {/* Variance */}
                    <td className='px-5 py-4 tabular-nums'>
                      <span
                        className={`font-semibold ${
                          varianceIsNeutral
                            ? "text-gray-400"
                            : variance > 0
                              ? "text-emerald-600"
                              : "text-red-500"
                        }`}>
                        {variance > 0 ? "+" : ""}
                        {formatCurrency(variance)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className='px-5 py-4'>
                      {op.status === "open" ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100'>
                          <Clock size={11} strokeWidth={2.5} />
                          Open
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100'>
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredOps.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {filteredOps.length} record{filteredOps.length !== 1 ? "s" : ""}
            {filteredOps.filter((op) => op.status === "open").length > 0 && (
              <span className='ml-2 text-amber-500 font-medium'>
                · {filteredOps.filter((op) => op.status === "open").length} open
              </span>
            )}
          </span>
          <span className='text-xs text-gray-300'>
            Operations · Last updated now
          </span>
        </div>
      )}
    </div>
  );
}
