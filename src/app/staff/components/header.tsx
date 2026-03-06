import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { StaffType } from "./types";

export default function Header({ staff }: { staff: StaffType }) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Staff Management</h1>
        <p className='text-gray-600 mt-1'>
          {staff?.length} total staff members
        </p>
      </div>
      <Link href='/staff/new' className='btn-primary'>
        <Plus size={20} className='inline mr-2' />
        Add Staff
      </Link>
    </div>
  );
}
