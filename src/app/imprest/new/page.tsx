"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import Link from "next/link";
import { generateId, formatCurrency } from "../../../../lib/utils";

export default function NewImprestPage() {
  const router = useRouter();
  const createImprest = useMutation(api.imprestMutations.create);
  const staff = useQuery(api.staff.getActive) || [];

  const [formData, setFormData] = useState({
    requestNumber: generateId("IMP"),
    requestedBy: "",
    amountRequested: "",
    purpose: "",
    requestDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createImprest({
        requestNumber: formData.requestNumber,
        requestedBy: formData.requestedBy as any,
        amountRequested: parseFloat(formData.amountRequested),
        purpose: formData.purpose,
        requestDate: formData.requestDate,
        notes: formData.notes || undefined,
        status: "pending",
      });

      router.push("/imprest");
    } catch (error) {
      console.error("Error creating imprest request:", error);
      alert("Failed to create imprest request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedStaff = staff.find((s: any) => s._id === formData.requestedBy);
  const amount = parseFloat(formData.amountRequested) || 0;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/imprest' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              New Imprest Request
            </h1>
            <p className='text-gray-600 mt-1'>Create a new imprest request</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Request Details */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Briefcase size={24} className='text-bakery-pink' />
            Request Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Request Number *</label>
              <input
                type='text'
                name='requestNumber'
                className='input-field bg-gray-50'
                value={formData.requestNumber}
                onChange={handleChange}
                required
                readOnly
              />
              <p className='text-sm text-gray-500 mt-1'>Auto-generated</p>
            </div>

            <div>
              <label className='label'>Request Date *</label>
              <input
                type='date'
                name='requestDate'
                className='input-field'
                value={formData.requestDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Requested By *</label>
              <select
                name='requestedBy'
                className='input-field'
                value={formData.requestedBy}
                onChange={handleChange}
                required>
                <option value=''>Select staff member...</option>
                {staff &&
                  staff.map((member: any) => (
                    <option key={member._id} value={member._id}>
                      {member.fullName} - {member.role} ({member.employeeId})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Amount & Purpose */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            💰 Amount & Purpose
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label className='label'>Amount Requested (₦) *</label>
              <input
                type='number'
                name='amountRequested'
                className='input-field'
                placeholder='50000.00'
                step='0.01'
                min='0'
                value={formData.amountRequested}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Amount needed for the imprest
              </p>
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Purpose *</label>
              <textarea
                name='purpose'
                className='input-field'
                rows={3}
                placeholder='Describe what the imprest will be used for...'
                value={formData.purpose}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Detailed explanation of imprest usage
              </p>
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Additional Notes</label>
              <textarea
                name='notes'
                className='input-field'
                rows={2}
                placeholder='Any additional information...'
                value={formData.notes}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>Optional</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className='card bg-gradient-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📋 Request Preview
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Request Number</p>
              <p className='text-xl font-bold text-gray-900 mt-1'>
                {formData.requestNumber}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Requested By</p>
              <p className='text-xl font-bold text-gray-900 mt-1'>
                {selectedStaff?.fullName || "Not selected"}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border-2 border-bakery-pink'>
              <p className='text-sm text-gray-600'>Amount Requested</p>
              <p className='text-3xl font-bold text-bakery-pink mt-1'>
                {formatCurrency(amount)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Request Date</p>
              <p className='text-xl font-bold text-gray-900 mt-1'>
                {new Date(formData.requestDate).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className='mt-6 p-4 bg-white rounded-lg border border-bakery-pink'>
            <p className='text-sm text-gray-600 mb-2'>Purpose</p>
            <p className='text-gray-900'>
              {formData.purpose || "Not provided"}
            </p>
          </div>

          {/* Workflow Info */}
          <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='font-semibold text-blue-900 mb-2'>
              📊 Imprest Workflow
            </p>
            <div className='flex items-center gap-2 text-sm text-blue-700'>
              <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold'>
                1. Pending
              </span>
              <span>→</span>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold'>
                2. Approved
              </span>
              <span>→</span>
              <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded font-semibold'>
                3. Disbursed
              </span>
              <span>→</span>
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded font-semibold'>
                4. Retired
              </span>
            </div>
            <p className='text-xs text-blue-600 mt-2'>
              This request will start as "Pending" and can be approved by the
              owner/admin
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/imprest' className='btn-outline'>
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading}
              className='btn-primary flex items-center gap-2'>
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Submit Imprest Request
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
