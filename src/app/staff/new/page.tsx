import React from "react";
import StaffForm from "../components/staffForm";

export default function CreateStaff() {
  return (
    <div>
      <StaffForm
        title='Add new Staff Member'
        text='Create a new staff member record'
        mode='create'
      />
    </div>
  );
}
