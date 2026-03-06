import { ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../../../../../lib/utils";
import { Sale, StaffRecord } from "../types";

const PAYMENT_BADGE: Record<string, string> = {
  cash: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  transfer: "bg-blue-50 text-blue-600 border border-blue-100",
  pos: "bg-violet-50 text-violet-600 border border-violet-100",
};

interface TodaySalesTableProps {
  sales: Sale[];
  myStaffRecord: StaffRecord | undefined;
  todayTotal: number;
  todayCommission: number;
}

export default function TodaySalesTable({
  sales,
  myStaffRecord,
  todayTotal,
  todayCommission,
}: TodaySalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
            Today's Sales
          </h2>
          <Link
            href='/sales/record'
            className='text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors'>
            + Add Sale
          </Link>
        </div>
        <div className='flex flex-col items-center justify-center py-14 rounded-xl border-2 border-dashed border-gray-100 text-center'>
          <ShoppingCart
            size={32}
            className='text-gray-200 mb-3'
            strokeWidth={1.5}
          />
          <p className='text-sm font-medium text-gray-400'>
            No sales recorded today
          </p>
          <p className='text-xs text-gray-300 mt-1 mb-4'>
            Click below to log your first sale
          </p>
          <Link
            href='/sales/record'
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors'>
            <Plus size={13} strokeWidth={2.5} />
            Record Sale
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white overflow-hidden'>
      {/* Card header */}
      <div className='px-5 py-4 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between'>
        <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
          Today's Sales
        </h2>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-gray-400'>
            {sales.length} transaction{sales.length !== 1 ? "s" : ""}
          </span>
          <Link
            href='/sales/record'
            className='text-xs font-semibold text-rose-400 hover:text-rose-600 transition-colors'>
            + Add Sale
          </Link>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-50'>
              {[
                "Time",
                "Product",
                "Qty",
                "Unit Price",
                "Amount",
                "Commission",
                "Payment",
                "Type",
                "Customer",
              ].map((h) => (
                <th
                  key={h}
                  className='px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase text-gray-300 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {sales.map((sale) => {
              const saleCommission = myStaffRecord
                ? (sale.totalAmount * myStaffRecord.commissionRate) / 100
                : 0;

              const paymentBadge =
                PAYMENT_BADGE[sale.paymentMethod] ??
                "bg-gray-100 text-gray-500";

              return (
                <tr
                  key={sale._id}
                  className='group hover:bg-rose-50/30 transition-colors'>
                  <td className='px-4 py-3 text-xs text-gray-400 tabular-nums whitespace-nowrap'>
                    {new Date(sale._creationTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors'>
                      {sale.product?.productName ?? "Unknown"}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-center font-semibold text-gray-700 tabular-nums'>
                    {sale.quantitySold}
                  </td>
                  <td className='px-4 py-3 text-gray-600 tabular-nums'>
                    {formatCurrency(sale.unitPrice)}
                  </td>
                  <td className='px-4 py-3 font-bold text-rose-500 tabular-nums'>
                    {formatCurrency(sale.totalAmount)}
                  </td>
                  <td className='px-4 py-3 font-semibold text-emerald-600 tabular-nums'>
                    {formatCurrency(saleCommission)}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase ${paymentBadge}`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-500'>
                      {sale.saleType === "transport"
                        ? "🚚 Transport"
                        : "🏪 Shop"}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-xs text-gray-400'>
                    {sale.customerName ?? (
                      <span className='text-gray-200'>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer totals */}
          <tfoot>
            <tr className='border-t border-rose-100 bg-rose-50/40'>
              <td
                colSpan={4}
                className='px-4 py-3 text-xs font-semibold text-right text-gray-400 uppercase tracking-wider'>
                Total
              </td>
              <td className='px-4 py-3 font-bold text-rose-500 tabular-nums text-base'>
                {formatCurrency(todayTotal)}
              </td>
              <td className='px-4 py-3 font-bold text-emerald-600 tabular-nums text-base'>
                {formatCurrency(todayCommission)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer count */}
      <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
        <span className='text-xs text-gray-400'>
          {sales.length} transaction{sales.length !== 1 ? "s" : ""}
        </span>
        <span className='text-xs text-gray-300'>Sales · Today</span>
      </div>
    </div>
  );
}
