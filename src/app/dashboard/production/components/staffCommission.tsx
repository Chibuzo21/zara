import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function StaffCommission({ userId }: { userId: Id<"users"> }) {
  const staff = useQuery(api.staffs.staff.getByUserId, { userId });
  if (!staff) return null;

  return (
    <div className='card bg-blue-50 border-2 border-blue-200'>
      <h3 className='font-bold text-blue-900 mb-2'>💰 Your Commission Rate</h3>
      <p className='text-2xl font-bold text-blue-600'>
        {staff.commissionRate}%
      </p>
      <p className='text-sm text-blue-700 mt-2'>
        Production staff earn commission on production output. Tier rate: 3% for
        production above ₦100,000
      </p>
    </div>
  );
}
