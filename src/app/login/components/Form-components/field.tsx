import { LucideIcon } from "lucide-react";
import React from "react";
import { EyeOff, Eye } from "lucide-react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FormData } from "../validation";
interface iParams {
  type: string;
  placeholder: string;
  label: string;
  register: UseFormRegister<FormData>;
  handlePassword?: () => void;
  name: keyof FormData;
  children?: React.ReactNode;
  Icon: LucideIcon;
  visible?: boolean;
  error: FieldError;
  className?: string;
}
export default function Field(props: iParams) {
  return (
    <div>
      <label className='label'>{props.label}</label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <props.Icon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          {...props.register(props.name)}
          className={`input-field pl-10 ${props.className}`}
          placeholder={props.placeholder}
          type={props.type}
          required
        />
        {props.name === "password" && (
          <button
            type='button'
            onClick={props.handlePassword}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            {props.visible ? (
              <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        )}
      </div>
      {props.error && (
        <p className=' text-red-500 mt-1'>{props.error.message as string}</p>
      )}
    </div>
  );
}
