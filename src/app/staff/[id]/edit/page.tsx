"use client";
import StaffForm from "../../components/staffForm";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
export default function page() {
  const { id } = useParams();

  const staffs = useQuery(api.staffs.staff.getById, { id: id as any });
  if (!staffs) return <p>Loading...</p>;
  return (
    <div>
      <StaffForm
        title='Update Staff info'
        text='Edit  new staff member record'
        mode='edit'
        staff={staffs}
      />
    </div>
  );
}
