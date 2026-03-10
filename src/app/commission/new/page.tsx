"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calculator } from "lucide-react";
import Link from "next/link";
import { calculateCommission, formatCurrency } from "../../../../lib/utils";

export default function NewCommissionPage() {
  const router = useRouter();
  const createCommission = useMutation(
    api.commission.commissionMutations.create,
  );
  const staff = useQuery(api.staffs.staff.getActive) || [];

  const [formData, setFormData] = useState({
    staffId: "",
    periodStart: "",
    periodEnd: "",
    grossCommission: "",
    deductions: "",
    penalties: "",
  });

  const [loading, setLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  // Get selected staff details
  const selectedStaff = staff.find((s: any) => s._id === formData.staffId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const grossCommission = parseFloat(formData.grossCommission) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      const penalties = parseFloat(formData.penalties) || 0;
      const netCommission = grossCommission - deductions - penalties;

      await createCommission({
        staffId: formData.staffId as any,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        grossCommission,
        deductions,
        penalties,
        netCommission,
        status: "pending",
      });

      router.push("/commission");
    } catch (error) {
      console.error("Error creating commission:", error);
      alert("Failed to create commission record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Auto-calculate commission when staff or amount changes
  const handleCalculate = () => {
    if (!selectedStaff || !calculatedAmount) return;

    // Use the commission calculation from utils
    const commission = calculateCommission(
      calculatedAmount,
      selectedStaff.commissionRate,
      // These would come from commissionConfig table in real scenario
      selectedStaff.role === "production"
        ? 100000
        : selectedStaff.role === "packaging"
          ? 80000
          : selectedStaff.role === "sales"
            ? 150000
            : undefined,
      selectedStaff.role === "production"
        ? 3.0
        : selectedStaff.role === "packaging"
          ? 2.5
          : selectedStaff.role === "sales"
            ? 7.0
            : undefined,
    );

    setFormData({
      ...formData,
      grossCommission: commission.toFixed(2),
    });
  };

  const grossCommission = parseFloat(formData.grossCommission) || 0;
  const deductions = parseFloat(formData.deductions) || 0;
  const penalties = parseFloat(formData.penalties) || 0;
  const netCommission = grossCommission - deductions - penalties;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/commission' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Calculate Commission
            </h1>
            <p className='text-gray-600 mt-1'>Create a new commission record</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Staff Selection */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Calculator size={24} className='text-bakery-pink' />
            Staff & Period
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='md:col-span-3'>
              <label className='label'>Select Staff Member *</label>
              <select
                name='staffId'
                className='input-field'
                value={formData.staffId}
                onChange={handleChange}
                required>
                <option value=''>Choose a staff member...</option>
                {staff &&
                  staff.map((member: any) => (
                    <option key={member._id} value={member._id}>
                      {member.fullName} - {member.role} ({member.commissionRate}
                      %)
                    </option>
                  ))}
              </select>
              {selectedStaff && (
                <p className='text-sm text-bakery-pink mt-2 font-semibold'>
                  Commission Rate: {selectedStaff.commissionRate}% | Role:{" "}
                  {selectedStaff.role}
                </p>
              )}
            </div>

            <div>
              <label className='label'>Period Start *</label>
              <input
                type='date'
                name='periodStart'
                className='input-field'
                value={formData.periodStart}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className='label'>Period End *</label>
              <input
                type='date'
                name='periodEnd'
                className='input-field'
                value={formData.periodEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Auto Calculator */}
        <div className='card bg-blue-50 border-2 border-blue-200'>
          <h2 className='text-xl font-bold text-blue-900 mb-4'>
            🧮 Quick Calculator
          </h2>
          <p className='text-sm text-blue-700 mb-4'>
            Enter the total sales/production amount to auto-calculate commission
          </p>
          <div className='flex gap-4 items-end'>
            <div className='flex-1'>
              <label className='label'>Total Amount (₦)</label>
              <input
                type='number'
                className='input-field'
                placeholder='150000'
                step='0.01'
                value={calculatedAmount}
                onChange={(e) =>
                  setCalculatedAmount(parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <button
              type='button'
              onClick={handleCalculate}
              disabled={!selectedStaff || !calculatedAmount}
              className='btn-secondary h-10.5'>
              Calculate
            </button>
          </div>
        </div>

        {/* Commission Amounts */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            💰 Commission Breakdown
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='label'>Gross Commission (₦) *</label>
              <input
                type='number'
                name='grossCommission'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.grossCommission}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Total earned before deductions
              </p>
            </div>

            <div>
              <label className='label'>Deductions (₦)</label>
              <input
                type='number'
                name='deductions'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.deductions}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>
                Lateness, absence, etc.
              </p>
            </div>

            <div>
              <label className='label'>Penalties (₦)</label>
              <input
                type='number'
                name='penalties'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.penalties}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>
                Quality issues, shortages
              </p>
            </div>
          </div>
        </div>

        {/* Net Commission Preview */}
        <div className='card bg-linear-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📊 Commission Summary
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Gross Commission</p>
              <p className='text-xl font-bold text-green-600 mt-1'>
                {formatCurrency(grossCommission)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Deductions</p>
              <p className='text-xl font-bold text-orange-600 mt-1'>
                -{formatCurrency(deductions)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Penalties</p>
              <p className='text-xl font-bold text-red-600 mt-1'>
                -{formatCurrency(penalties)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border-2 border-bakery-pink'>
              <p className='text-sm text-gray-600'>Net Commission</p>
              <p className='text-2xl font-bold text-bakery-pink mt-1'>
                {formatCurrency(netCommission)}
              </p>
            </div>
          </div>

          <div className='mt-4 p-3 bg-blue-50 rounded-lg text-sm'>
            <p className='font-semibold text-blue-900'>Formula:</p>
            <p className='text-blue-700'>
              Net Commission = Gross Commission - Deductions - Penalties
            </p>
            <p className='text-blue-700 mt-1'>
              = {formatCurrency(grossCommission)} - {formatCurrency(deductions)}{" "}
              - {formatCurrency(penalties)} ={" "}
              <strong>{formatCurrency(netCommission)}</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/commission' className='btn-outline'>
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading}
              className='btn-primary flex items-center gap-2'>
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Commission Record
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
