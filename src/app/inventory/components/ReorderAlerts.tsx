import { AlertTriangle } from "lucide-react";
import React from "react";
import { ReorderAlertsProps } from "./types";

export default function ReorderAlerts({
  lowStockCount,
  outOfStockCount,
}: ReorderAlertsProps) {
  return (
    <>
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className='card bg-orange-50 border-2 border-orange-200'>
          <div className='flex items-start gap-4'>
            <AlertTriangle
              size={24}
              className='text-orange-600 shrink-0 mt-1'
            />
            <div className='flex-1'>
              <h3 className='font-bold text-orange-900 text-lg'>
                Reorder Alert
              </h3>
              <p className='text-orange-800 mt-1'>
                You have {lowStockCount} item{lowStockCount !== 1 ? "s" : ""}{" "}
                running low
                {outOfStockCount > 0 &&
                  ` and ${outOfStockCount} item${outOfStockCount !== 1 ? "s" : ""} out of stock`}
                . Please reorder soon to avoid production delays.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
