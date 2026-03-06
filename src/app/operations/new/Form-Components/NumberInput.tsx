import { UseFormRegister } from "react-hook-form";
import { OperationFormValues } from "../validation";
import FormField from "./Form-Field";

interface NumberInputProps {
  name: keyof OperationFormValues;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  register: UseFormRegister<OperationFormValues>;
}

export default function NumberInput({
  name,
  label,
  hint,
  required,
  error,
  register,
}: NumberInputProps) {
  return (
    <FormField label={label} hint={hint} required={required} error={error}>
      <input
        type='number'
        className={`input-field ${error ? "error" : ""}`}
        placeholder='0.00'
        step='0.01'
        {...register(name)}
      />
    </FormField>
  );
}
