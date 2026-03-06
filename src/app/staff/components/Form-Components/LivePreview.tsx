import React from "react";
import { ROLES, STATUSES } from "../staffData";
import { FormValues } from "./validation";

interface iLiveParams {
  selectedRole: (typeof ROLES)[number] | undefined;
  selectedStatus: (typeof STATUSES)[number] | undefined;
  formData: FormValues;
}
export default function LivePreview({
  selectedRole,
  selectedStatus,
  formData,
}: iLiveParams) {
  return (
    <div className='sf-preview'>
      <div className='sf-preview-title'>// Live Preview</div>
      <div
        className='sf-preview-avatar'
        style={{
          background: (selectedRole?.color ?? "#d4a853") + "18",
          color: selectedRole?.color ?? "#d4a853",
        }}>
        {formData.fullName
          ? formData.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
          : "?"}
      </div>
      <div className='sf-preview-name'>{formData.fullName || "Full Name"}</div>
      <div className='sf-preview-email'>
        {formData.email || "email@example.com"}
      </div>

      <div className='sf-preview-divider' />

      <div className='sf-preview-row'>
        <span className='sf-preview-key'>Role</span>
        <span
          className='sf-preview-val'
          style={{ color: selectedRole?.color ?? "#8888a0" }}>
          {selectedRole?.label ?? "—"}
        </span>
      </div>
      <div className='sf-preview-row'>
        <span className='sf-preview-key'>Status</span>
        <span
          className='sf-preview-status'
          style={{
            background: (selectedStatus?.color ?? "#6b7280") + "18",
            color: selectedStatus?.color ?? "#6b7280",
          }}>
          <span
            className='sf-preview-status-dot'
            style={{ background: selectedStatus?.color ?? "#6b7280" }}
          />
          {selectedStatus?.label ?? "—"}
        </span>
      </div>
      <div className='sf-preview-row'>
        <span className='sf-preview-key'>Hired</span>
        <span className='sf-preview-val'>{formData.dateHired || "—"}</span>
      </div>
      <div className='sf-preview-row'>
        <span className='sf-preview-key'>Commission</span>
        <span className='sf-preview-val' style={{ color: "#d4a853" }}>
          {formData.commissionRate ? `${formData.commissionRate}%` : "—"}
        </span>
      </div>
      {formData.baseSalary && (
        <div className='sf-preview-row'>
          <span className='sf-preview-key'>Base Salary</span>
          <span className='sf-preview-val'>
            ₦{parseFloat(formData.baseSalary).toLocaleString()}
          </span>
        </div>
      )}
      {formData.phone && (
        <div className='sf-preview-row'>
          <span className='sf-preview-key'>Phone</span>
          <span className='sf-preview-val'>{formData.phone}</span>
        </div>
      )}
    </div>
  );
}
