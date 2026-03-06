import { formatCurrency, formatDate } from "../../../../../lib/utils";
import { TYPE_CONFIG } from "../config";
import { Transaction, TransactionType } from "../types";

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-rose-100 bg-rose-50/60'>
              {[
                "Date",
                "Type",
                "Item",
                "Quantity",
                "Unit Cost",
                "Total Cost",
                "Supplier",
                "Notes",
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
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>📭</span>
                    <span>No transactions found</span>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const type = t.transactionType as TransactionType;
                const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.adjustment;
                const TypeIcon = cfg.icon;
                const isPositive = cfg.qty === "positive";

                return (
                  <tr
                    key={t._id}
                    className='group transition-colors duration-150 hover:bg-rose-50/40'>
                    {/* Date */}
                    <td className='px-5 py-4'>
                      <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors whitespace-nowrap'>
                        {formatDate(t.transactionDate)}
                      </span>
                    </td>

                    {/* Type badge */}
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.badge}`}>
                        <TypeIcon size={11} strokeWidth={2.5} />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Item */}
                    <td className='px-5 py-4 font-semibold text-gray-700'>
                      {t.item?.itemName ?? (
                        <span className='text-gray-300 italic'>Unknown</span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className='px-5 py-4 tabular-nums'>
                      <span
                        className={`font-bold ${
                          isPositive ? "text-emerald-600" : "text-red-500"
                        }`}>
                        {isPositive ? "+" : "−"}
                        {t.quantity}{" "}
                        <span className='text-xs font-medium opacity-60'>
                          {t.item?.unit}
                        </span>
                      </span>
                    </td>

                    {/* Unit Cost */}
                    <td className='px-5 py-4 text-gray-500 tabular-nums'>
                      {t.unitCost ? (
                        formatCurrency(t.unitCost)
                      ) : (
                        <span className='text-gray-200'>—</span>
                      )}
                    </td>

                    {/* Total Cost */}
                    <td className='px-5 py-4 font-semibold text-rose-500 tabular-nums'>
                      {t.totalCost ? (
                        formatCurrency(t.totalCost)
                      ) : (
                        <span className='text-gray-200 font-normal'>—</span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className='px-5 py-4 text-gray-500 text-xs'>
                      {t.supplier?.supplierName ?? (
                        <span className='text-gray-200'>—</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className='px-5 py-4 max-w-45'>
                      <p className='text-xs text-gray-400 truncate'>
                        {t.notes ?? <span className='text-gray-200'>—</span>}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </span>
          <span className='text-xs text-gray-300'>
            Inventory · Transactions
          </span>
        </div>
      )}
    </div>
  );
}
