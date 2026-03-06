import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { ProductFormValues } from "../validation";
import { formatCurrency } from "../../../../lib/utils";

interface ProductFormProps {
  register: UseFormRegister<ProductFormValues>;
  handleSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<ProductFormValues>;
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
  watch: UseFormWatch<ProductFormValues>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className='text-sm text-red-500 mt-1'>{message}</p>;
}

export default function ProductForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isEditing,
  onCancel,
  watch,
}: ProductFormProps) {
  const { basePrice, productionCost } = watch();
  const showMargin = basePrice && productionCost;
  const margin = showMargin ? basePrice - productionCost! : 0;
  const marginPct = showMargin ? (margin / basePrice) * 100 : 0;

  return (
    <div className='card bg-blue-50 border-2 border-blue-200'>
      <h2 className='text-xl font-bold text-gray-900 mb-4'>
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='label'>Product Name *</label>
            <input
              type='text'
              className={`input-field ${errors.productName ? "error" : ""}`}
              placeholder='e.g., White Bread'
              {...register("productName")}
            />
            <FieldError message={errors.productName?.message} />
          </div>

          <div>
            <label className='label'>Category *</label>
            <input
              type='text'
              className={`input-field ${errors.category ? "error" : ""}`}
              placeholder='e.g., Bread, Cake, Pastry'
              {...register("category")}
            />
            <FieldError message={errors.category?.message} />
          </div>

          <div>
            <label className='label'>Selling Price (₦) *</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className={`input-field ${errors.basePrice ? "error" : ""}`}
              placeholder='1000'
              {...register("basePrice")}
            />
            <FieldError message={errors.basePrice?.message} />
          </div>

          <div>
            <label className='label'>Production Cost (₦)</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className='input-field'
              placeholder='500'
              {...register("productionCost")}
            />
            <p className='text-sm text-gray-500 mt-1'>
              Optional — for profit tracking
            </p>
          </div>

          <div>
            <label className='label'>Status *</label>
            <select className='input-field' {...register("status")}>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>

          {showMargin && (
            <div className='p-4 bg-white rounded-lg border border-blue-200'>
              <p className='text-sm text-gray-600'>Profit Margin</p>
              <p className='text-2xl font-bold text-green-600'>
                {formatCurrency(margin)}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                {marginPct.toFixed(1)}% margin
              </p>
            </div>
          )}
        </div>

        <div className='flex gap-3 justify-end'>
          <button type='button' onClick={onCancel} className='btn-outline'>
            Cancel
          </button>
          <button type='submit' disabled={isSubmitting} className='btn-primary'>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
