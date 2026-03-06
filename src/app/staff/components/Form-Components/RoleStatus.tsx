import { ChevronDown } from "lucide-react";
import React from "react";
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { ROLES, STATUSES } from "../staffData";
import { FormValues } from "./validation";
import { Control } from "react-hook-form";

interface iRoleParams {
  activeSection: string;
  toggle: (section: string) => void;
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  FieldError: React.FC<{ message?: string }>;
  selectedRole: (typeof ROLES)[number] | undefined;
  control: Control<FormValues>;
}
export default function RoleStatus({
  activeSection,
  control,
  toggle,
  FieldError,
  errors,
  selectedRole,
  register,
}: iRoleParams) {
  return (
    <div className={`sf-section ${activeSection === "role" ? "open" : ""}`}>
      <div className='sf-section-header' onClick={() => toggle("role")}>
        <div className='sf-section-left'>
          <span className='sf-section-num'>02</span>
          <span className='sf-section-label'>Role & Status</span>
        </div>
        <ChevronDown size={16} className='sf-chevron' />
      </div>

      {activeSection === "role" && (
        <div className='sf-section-body'>
          <div className='sf-field'>
            <label className='sf-label'>
              Role <span>*</span>
            </label>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <div className='sf-role-grid'>
                  {ROLES.map((r) => (
                    <div
                      key={r.value}
                      className={`sf-role-pill ${field.value === r.value ? "active" : ""}`}
                      style={{
                        borderColor:
                          field.value === r.value ? r.color + "40" : "",
                      }}
                      onClick={() => field.onChange(r.value)}>
                      <div
                        className='sf-role-pill-dot'
                        style={{ background: r.color }}
                      />
                      <div className='sf-role-pill-name'>{r.label}</div>
                    </div>
                  ))}
                </div>
              )}
            />
            {selectedRole && (
              <span className='sf-hint gold'>
                💡 Commission: {selectedRole.commission}
              </span>
            )}
            <FieldError message={errors.role?.message} />
          </div>

          <div className='sf-field'>
            <label className='sf-label'>
              Status <span>*</span>
            </label>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <div className='sf-status-row'>
                  {STATUSES.map((s) => (
                    <div
                      key={s.value}
                      className={`sf-status-pill ${field.value === s.value ? "active" : ""}`}
                      style={{
                        borderColor:
                          field.value === s.value ? s.color + "50" : "",
                        color: field.value === s.value ? s.color : "",
                      }}
                      onClick={() => field.onChange(s.value)}>
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            />
            <FieldError message={errors.status?.message} />
          </div>

          <div className='sf-field'>
            <label className='sf-label'>
              Date Hired <span>*</span>
            </label>
            <input
              className={`sf-input ${errors.dateHired ? "error" : ""}`}
              type='date'
              {...register("dateHired")}
            />
            <FieldError message={errors.dateHired?.message} />
          </div>
        </div>
      )}
    </div>
  );
}
