import { ChevronDown } from "lucide-react";
import React from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues } from "./validation";
import { ROLES } from "../staffData";

interface iCompensationParams {
  activeSection: string;
  toggle: (section: string) => void;
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  selectedRole: (typeof ROLES)[number] | undefined;
  FieldError: React.FC<{ message?: string }>;
}
export default function Compensation({
  activeSection,
  toggle,
  FieldError,
  errors,
  register,
  selectedRole,
}: iCompensationParams) {
  return (
    <div className={`sf-section ${activeSection === "comp" ? "open" : ""}`}>
      <div className='sf-section-header' onClick={() => toggle("comp")}>
        <div className='sf-section-left'>
          <span className='sf-section-num'>03</span>
          <span className='sf-section-label'>Compensation</span>
        </div>
        <ChevronDown size={16} className='sf-chevron' />
      </div>

      {activeSection === "comp" && (
        <div className='sf-section-body sf-grid-2'>
          <div className='sf-field'>
            <label className='sf-label'>Base Salary (₦)</label>
            <input
              className='sf-input'
              type='number'
              placeholder='50000'
              step='0.01'
              {...register("baseSalary")}
            />
            <span className='sf-hint'>Monthly base, optional</span>
          </div>

          <div className='sf-field'>
            <label className='sf-label'>
              Commission Rate (%) <span>*</span>
            </label>
            <input
              className={`sf-input ${errors.commissionRate ? "error" : ""}`}
              type='number'
              placeholder='5.0'
              step='0.1'
              min='0'
              max='100'
              {...register("commissionRate")}
            />
            {selectedRole && (
              <span className='sf-hint gold'>
                Suggested: {selectedRole.commission}
              </span>
            )}
            <FieldError message={errors.commissionRate?.message} />
          </div>
        </div>
      )}
    </div>
  );
}
