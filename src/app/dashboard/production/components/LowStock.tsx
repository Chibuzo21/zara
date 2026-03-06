import React from "react";
import { XCircle, TrendingDown } from "lucide-react";
import { iLowStock } from "../types";

export default function LowStock({ lowStockItems }: iLowStock) {
  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      {/* Header */}
      <div className='px-5 py-4 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between'>
        <h2 className='text-sm font-semibold tracking-widest uppercase text-rose-400'>
          Low Stock Items
        </h2>
        {lowStockItems?.length > 0 && (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-500'>
            <TrendingDown size={11} strokeWidth={2.5} />
            {lowStockItems.length} alert{lowStockItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-50'>
              {[
                "Item",
                "Category",
                "Current Stock",
                "Reorder At",
                "Status",
              ].map((th) => (
                <th
                  key={th}
                  className='px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase text-gray-300 whitespace-nowrap'>
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {lowStockItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>🎉</span>
                    <span>All items have sufficient stock</span>
                  </div>
                </td>
              </tr>
            ) : (
              lowStockItems.map((item: any) => {
                const isOut = item.currentStock === 0;

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
                          isOut ? "text-red-500" : "text-amber-500"
                        }`}>
                        {item.currentStock}
                        <span className='text-xs font-medium ml-1 opacity-70'>
                          {item.unit}
                        </span>
                      </span>
                    </td>

                    {/* Reorder Level */}
                    <td className='px-5 py-4'>
                      <span className='text-gray-400 tabular-nums font-medium'>
                        {item.reorderLevel}
                        <span className='text-xs ml-1'>{item.unit}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className='px-5 py-4'>
                      {isOut ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100'>
                          <XCircle size={11} strokeWidth={2.5} />
                          Out of Stock
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100'>
                          <TrendingDown size={11} strokeWidth={2.5} />
                          Low Stock
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
      {lowStockItems.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {lowStockItems.filter((i: any) => i.currentStock === 0).length} out
            of stock
            {" · "}
            {lowStockItems.filter((i: any) => i.currentStock > 0).length} low
          </span>
          <span className='text-xs text-gray-300'>Inventory · Live</span>
        </div>
      )}
    </div>
  );
}
