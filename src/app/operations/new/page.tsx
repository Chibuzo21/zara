"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewOperationPage() {
  const router = useRouter();
  const createOperation = useMutation(
    api.operations.operationsMutations.create,
  );

  const [formData, setFormData] = useState({
    operationDate: new Date().toISOString().split("T")[0],
    openingCash: "",
    closingCash: "",
    totalSales: "",
    totalExpenses: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const openingCash = parseFloat(formData.openingCash) || 0;
      const closingCash = parseFloat(formData.closingCash) || 0;
      const totalSales = parseFloat(formData.totalSales) || 0;
      const totalExpenses = parseFloat(formData.totalExpenses) || 0;

      // Calculate cash variance
      const expectedCash = openingCash + totalSales - totalExpenses;
      const cashVariance = closingCash - expectedCash;

      await createOperation({
        operationDate: formData.operationDate,
        openingCash,
        closingCash,
        totalSales,
        totalExpenses,
        cashVariance,
        notes: formData.notes || undefined,
        status: "open",
      });

      router.push("/operations");
    } catch (error) {
      console.error("Error creating operation:", error);
      alert("Failed to create daily log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate preview values
  const openingCash = parseFloat(formData.openingCash) || 0;
  const closingCash = parseFloat(formData.closingCash) || 0;
  const totalSales = parseFloat(formData.totalSales) || 0;
  const totalExpenses = parseFloat(formData.totalExpenses) || 0;
  const expectedCash = openingCash + totalSales - totalExpenses;
  const cashVariance = closingCash - expectedCash;
  const netProfit = totalSales - totalExpenses;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/operations' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>New Daily Log</h1>
            <p className='text-gray-600 mt-1'>Record today's operations</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Date */}
        <div className='card'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Operation Date *</label>
              <input
                type='date'
                name='operationDate'
                className='input-field'
                value={formData.operationDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Cash Section */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            💰 Cash Management
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Opening Cash *</label>
              <input
                type='number'
                name='openingCash'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.openingCash}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Cash in register at start of day
              </p>
            </div>

            <div>
              <label className='label'>Closing Cash *</label>
              <input
                type='number'
                name='closingCash'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.closingCash}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Cash in register at end of day
              </p>
            </div>
          </div>
        </div>

        {/* Sales & Expenses */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            📊 Sales & Expenses
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Total Sales *</label>
              <input
                type='number'
                name='totalSales'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.totalSales}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Total revenue for the day
              </p>
            </div>

            <div>
              <label className='label'>Total Expenses *</label>
              <input
                type='number'
                name='totalExpenses'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.totalExpenses}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Total costs for the day
              </p>
            </div>
          </div>
        </div>

        {/* Calculations Preview */}
        <div className='card bg-linear-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📈 Auto-Calculations
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Net Profit/Loss</p>
              <p
                className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₦{netProfit.toFixed(2)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Expected Cash</p>
              <p className='text-2xl font-bold text-blue-600 mt-1'>
                ₦{expectedCash.toFixed(2)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Cash Variance</p>
              <p
                className={`text-2xl font-bold mt-1 ${Math.abs(cashVariance) < 100 ? "text-gray-600" : cashVariance > 0 ? "text-green-600" : "text-red-600"}`}>
                ₦{cashVariance.toFixed(2)}
              </p>
              {Math.abs(cashVariance) > 100 && (
                <p className='text-xs text-orange-600 mt-1'>
                  ⚠️ Significant variance detected
                </p>
              )}
            </div>
          </div>

          <div className='mt-4 p-3 bg-blue-50 rounded-lg text-sm'>
            <p className='font-semibold text-blue-900'>Formula:</p>
            <p className='text-blue-700 mt-1'>
              Expected Cash = Opening Cash + Total Sales - Total Expenses
            </p>
            <p className='text-blue-700'>
              Cash Variance = Closing Cash - Expected Cash
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>📝 Notes</h2>
          <div>
            <label className='label'>Additional Notes (Optional)</label>
            <textarea
              name='notes'
              className='input-field'
              rows={4}
              placeholder="Any special notes about today's operations..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/operations' className='btn-outline'>
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
