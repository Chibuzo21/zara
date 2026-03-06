"use client";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import React, { JSX, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues } from "./validation";

interface iBasicParams {
  activeSection: string;
  toggle: (section: string) => void;
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  mode: "create" | "edit";
  FieldError: React.FC<{ message?: string }>;
}

export default function BasicInfo({
  activeSection,
  toggle,
  errors,
  register,
  FieldError,
  mode,
}: iBasicParams) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`sf-section ${activeSection === "basic" ? "open" : ""}`}>
      <div className='sf-section-header' onClick={() => toggle("basic")}>
        <div className='sf-section-left'>
          <span className='sf-section-num'>01</span>
          <span className='sf-section-label'>Basic Information</span>
        </div>
        <ChevronDown size={16} className='sf-chevron' />
      </div>

      {activeSection === "basic" && (
        <div className='sf-section-body sf-grid-2'>
          <div className='sf-field'>
            <label className='sf-label'>
              Full Name <span>*</span>
            </label>
            <input
              className={`sf-input ${errors.fullName ? "error" : ""}`}
              type='text'
              placeholder='Ada Okafor'
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className='sf-field'>
            <label className='sf-label'>
              Email <span>*</span>
            </label>
            <input
              className={`sf-input ${errors.email ? "error" : ""}`}
              type='email'
              placeholder='ada@example.com'
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className='sf-field'>
            <label className='sf-label'>Phone</label>
            <input
              className='sf-input'
              type='tel'
              placeholder='08012345678'
              {...register("phone")}
            />
            <span className='sf-hint'>Optional</span>
          </div>

          <div className='sf-field'>
            <label className='sf-label'>
              Password {mode === "create" && <span>*</span>}
            </label>
            <div className='sf-input-wrap'>
              <input
                className={`sf-input ${errors.password ? "error" : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder={
                  mode === "edit" ? "Leave blank to keep" : "Min. 8 characters"
                }
                {...register("password")}
              />
              <button
                type='button'
                className='sf-eye'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
            {mode === "edit" && (
              <span className='sf-hint'>
                Leave blank to keep current password
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
