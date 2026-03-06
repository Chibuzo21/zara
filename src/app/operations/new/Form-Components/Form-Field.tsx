import React from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  hint,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className='label'>
        {label} {required && <span>*</span>}
      </label>
      {children}
      {hint && !error && <p className='text-sm text-gray-500 mt-1'>{hint}</p>}
      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
}
