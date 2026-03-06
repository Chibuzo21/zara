"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { operationSchema, type OperationFormValues } from "./validation";
import NumberInput from "./Form-Components/NumberInput";
import FormField from "./Form-Components/Form-Field";
import CalcPreview from "./Form-Components/Calc-Preview";
import type { Resolver } from "react-hook-form";

export default function NewOperationPage() {
  const router = useRouter();
  const createOperation = useMutation(
    api.operations.operationsMutations.create,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema) as Resolver<OperationFormValues>,
    defaultValues: {
      operationDate: new Date().toISOString().split("T")[0],
      openingCash: 0,
      closingCash: 0,
      totalSales: 0,
      totalExpenses: 0,
      notes: "",
    },
  });

  const { openingCash, closingCash, totalSales, totalExpenses } = watch();

  const onSubmit = async (data: OperationFormValues) => {
    const expectedCash =
      data.openingCash + data.totalSales - data.totalExpenses;
    const cashVariance = data.closingCash - expectedCash;

    try {
      await createOperation({
        ...data,
        cashVariance,
        notes: data.notes || undefined,
        status: "open",
      });
      router.push("/operations");
    } catch (err) {
      console.error("Error creating operation:", err);
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/operations' className='p-2 hover:bg-gray-100 rounded-lg'>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>New Daily Log</h1>
          <p className='text-gray-600 mt-1'>Record today's operations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Date */}
        <div className='card'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              label='Operation Date'
              required
              error={errors.operationDate?.message}>
              <input
                type='date'
                className={`input-field ${errors.operationDate ? "error" : ""}`}
                {...register("operationDate")}
              />
            </FormField>
          </div>
        </div>

        {/* Cash */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            💰 Cash Management
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <NumberInput
              name='openingCash'
              label='Opening Cash'
              hint='Cash in register at start of day'
              required
              error={errors.openingCash?.message}
              register={register}
            />
            <NumberInput
              name='closingCash'
              label='Closing Cash'
              hint='Cash in register at end of day'
              required
              error={errors.closingCash?.message}
              register={register}
            />
          </div>
        </div>

        {/* Sales & Expenses */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            📊 Sales & Expenses
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <NumberInput
              name='totalSales'
              label='Total Sales'
              hint='Total revenue for the day'
              required
              error={errors.totalSales?.message}
              register={register}
            />
            <NumberInput
              name='totalExpenses'
              label='Total Expenses'
              hint='Total costs for the day'
              required
              error={errors.totalExpenses?.message}
              register={register}
            />
          </div>
        </div>

        {/* Live Calculations */}
        <CalcPreview
          openingCash={openingCash}
          closingCash={closingCash}
          totalSales={totalSales}
          totalExpenses={totalExpenses}
        />

        {/* Notes */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>📝 Notes</h2>
          <FormField label='Additional Notes' hint='Optional'>
            <textarea
              className='input-field'
              rows={4}
              placeholder="Any special notes about today's operations..."
              {...register("notes")}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/operations' className='btn-outline'>
              Cancel
            </Link>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn-primary flex items-center gap-2'>
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Daily Log
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
