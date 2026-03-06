import React from "react";
import { StaffType } from "./types";
import { stats } from "./staffData";

export default function StatsSummary({ staff }: { staff: StaffType }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
      <div className='card text-center'>
        <p className='text-sm text-gray-600'>Total Staff</p>
        <p className='text-2xl font-bold text-bakery-pink'>{staff?.length}</p>
      </div>
      {stats.map((stat, idx) => (
        <div key={idx} className='card text-center'>
          <p className='text-sm text-gray-600'>{stat.role}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>
            {
              staff?.filter((s) =>
                stat.role === "active"
                  ? s.status === "active"
                  : s.role === stat.role.toLowerCase(),
              ).length
            }
          </p>
        </div>
      ))}
    </div>
  );
}
