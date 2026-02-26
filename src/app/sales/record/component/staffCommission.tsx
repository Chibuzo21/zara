import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface iCommission {
  userId: Id<"users">;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}
export default function StaffCommission({
  userId,
  totalAmount,
  formatCurrency,
}: iCommission) {
  const staff = useQuery(api.staffs.staff.getByUserId, { userId });
  if (!staff) return null;
  return (
    <div>
      {staff && (
        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
          <p className='text-sm font-semibold text-blue-900'>
            💰 Your Commission (Est.)
          </p>
          <p className='text-2xl font-bold text-blue-600 mt-1'>
            {formatCurrency(totalAmount * (staff.commissionRate / 100))}
          </p>
          <p className='text-xs text-blue-700 mt-1'>
            Based on {staff.commissionRate}% commission rate
          </p>
        </div>
      )}
    </div>
  );
}
