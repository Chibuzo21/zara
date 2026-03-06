import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
} from "lucide-react";
import React from "react";
import { formatCurrency, getStockStatus } from "../../../../lib/utils";
import { InventoryTableProps } from "./types";

export default function InventoryTable({ filteredItems }: InventoryTableProps) {
  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-rose-100 bg-rose-50/60'>
              {[
                "Item Name",
                "Category",
                "Stock",
                "Reorder At",
                "Unit",
                "Unit Cost",
                "Total Value",
                "Supplier",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className='px-5 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-rose-400 whitespace-nowrap'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>🍞</span>
                    <span>No inventory items found</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const stockStatus = getStockStatus(
                  item.currentStock,
                  item.reorderLevel,
                );
                const totalValue = item.currentStock * item.unitCost;

                const isOut = item.currentStock === 0;
                const isLow =
                  item.currentStock > 0 &&
                  item.currentStock <= item.reorderLevel;
                const isGood = item.currentStock > item.reorderLevel;

                return (
                  <tr
                    key={item._id}
                    className='group transition-colors duration-150 hover:bg-rose-50/40'>
                    {/* Item Name */}
                    <td className='px-5 py-4'>
                      <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors'>
                        {item.itemName}
                      </span>
                    </td>

                    {/* Category */}
                    <td className='px-5 py-4'>
                      <span className='inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-gray-100 text-gray-500'>
                        {item.category}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className='px-5 py-4'>
                      <span
                        className={`text-base font-bold tabular-nums ${
                          isOut
                            ? "text-red-500"
                            : isLow
                              ? "text-amber-500"
                              : "text-emerald-600"
                        }`}>
                        {item.currentStock}
                      </span>
                    </td>

                    {/* Reorder Level */}
                    <td className='px-5 py-4'>
                      <span className='text-gray-400 tabular-nums font-medium'>
                        {item.reorderLevel}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className='px-5 py-4'>
                      <span className='text-gray-500'>{item.unit}</span>
                    </td>

                    {/* Unit Cost */}
                    <td className='px-5 py-4'>
                      <span className='font-medium text-gray-700 tabular-nums'>
                        {formatCurrency(item.unitCost)}
                      </span>
                    </td>

                    {/* Total Value */}
                    <td className='px-5 py-4'>
                      <span className='font-semibold text-rose-500 tabular-nums'>
                        {formatCurrency(totalValue)}
                      </span>
                    </td>

                    {/* Supplier */}
                    {/* <td className="px-5 py-4">
                      <span className="text-gray-500 text-sm">
                        {item?.supplier?.supplierName || (
                          <span className="text-gray-300 italic">—</span>
                        )}
                      </span>
                    </td> */}

                    {/* Status */}
                    <td className='px-5 py-4'>
                      {isOut && (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100'>
                          <XCircle size={11} strokeWidth={2.5} />
                          Out of Stock
                        </span>
                      )}
                      {isLow && (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100'>
                          <TrendingDown size={11} strokeWidth={2.5} />
                          Low Stock
                        </span>
                      )}
                      {isGood && (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100'>
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          In Stock
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

      {/* Footer row count */}
      {filteredItems.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
          </span>
          <span className='text-xs text-gray-300'>
            Inventory · Last updated now
          </span>
        </div>
      )}
    </div>
  );
}
