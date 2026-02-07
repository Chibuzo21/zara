"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import Link from "next/link";
import { generateId } from "../../../..//lib/utils";

export default function NewStaffPage() {
  const router = useRouter();
  const createStaff = useMutation(api.staffMutation.create);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "sales" as "owner" | "production" | "packaging" | "sales" | "admin",
    status: "active" as "active" | "inactive" | "suspended",
    dateHired: new Date().toISOString().split("T")[0],
    baseSalary: "",
    commissionRate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStaff({
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.status,
        dateHired: formData.dateHired,
        baseSalary: formData.baseSalary
          ? parseFloat(formData.baseSalary)
          : undefined,
        commissionRate: parseFloat(formData.commissionRate) || 0,
      });

      router.push("/staff");
    } catch (error) {
      console.error("Error creating staff:", error);
      alert("Failed to add staff member. Please try again.");
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

  // Commission rate suggestions based on role
  const getCommissionSuggestion = () => {
    switch (formData.role) {
      case "production":
        return "2.0% (base) / 3.0% (tier above ₦100k)";
      case "packaging":
        return "1.5% (base) / 2.5% (tier above ₦80k)";
      case "sales":
        return "5.0% (base) / 7.0% (tier above ₦150k)";
      default:
        return "0% (not applicable)";
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/staff' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Add New Staff</h1>
            <p className='text-gray-600 mt-1'>
              Create a new staff member record
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <UserPlus size={24} className='text-bakery-pink' />
            Basic Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='label'>Full Name *</label>
              <input
                type='text'
                name='fullName'
                className='input-field'
                placeholder='John Doe'
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className='label'>Email</label>
              <input
                type='email'
                name='email'
                className='input-field'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>Optional</p>
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Phone</label>
              <input
                type='tel'
                name='phone'
                className='input-field'
                placeholder='08012345678'
                value={formData.phone}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>Optional</p>
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            👔 Role & Status
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='label'>Role *</label>
              <select
                name='role'
                className='input-field'
                value={formData.role}
                onChange={handleChange}
                required>
                <option value='sales'>Sales</option>
                <option value='production'>Production</option>
                <option value='packaging'>Packaging</option>
                <option value='admin'>Admin</option>
                <option value='owner'>Owner</option>
              </select>
            </div>

            <div>
              <label className='label'>Status *</label>
              <select
                name='status'
                className='input-field'
                value={formData.status}
                onChange={handleChange}
                required>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='suspended'>Suspended</option>
              </select>
            </div>

            <div>
              <label className='label'>Date Hired *</label>
              <input
                type='date'
                name='dateHired'
                className='input-field'
                value={formData.dateHired}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            💰 Compensation
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Base Salary (₦)</label>
              <input
                type='number'
                name='baseSalary'
                className='input-field'
                placeholder='50000'
                step='0.01'
                value={formData.baseSalary}
                onChange={handleChange}
              />
              <p className='text-sm text-gray-500 mt-1'>
                Monthly base salary (optional)
              </p>
            </div>

            <div>
              <label className='label'>Commission Rate (%) *</label>
              <input
                type='number'
                name='commissionRate'
                className='input-field'
                placeholder='5.0'
                step='0.1'
                min='0'
                max='100'
                value={formData.commissionRate}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-bakery-pink mt-1 font-semibold'>
                💡 {getCommissionSuggestion()}
              </p>
            </div>
          </div>

          {/* Commission Info Box */}
          <div className='mt-6 p-4 bg-bakery-pink-pale rounded-lg border-2 border-bakery-pink'>
            <h3 className='font-bold text-bakery-pink mb-2'>
              Commission Rates by Role
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <p className='font-semibold text-blue-700'>Production</p>
                <p className='text-gray-700'>Base: 2.0%</p>
                <p className='text-gray-700'>Tier: 3.0% (₦100k plus)</p>
              </div>
              <div>
                <p className='font-semibold text-green-700'>Packaging</p>
                <p className='text-gray-700'>Base: 1.5%</p>
                <p className='text-gray-700'>Tier: 2.5% ( ₦80k plus)</p>
              </div>
              <div>
                <p className='font-semibold text-yellow-700'>Sales</p>
                <p className='text-gray-700'>Base: 5.0%</p>
                <p className='text-gray-700'>Tier: 7.0% ( ₦150k plus)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className='card bg-linear-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            👤 Preview
          </h2>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-gray-600'>Full Name</p>
              <p className='font-semibold text-gray-900'>
                {formData.fullName || "-"}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Role</p>
              <p className='font-semibold text-gray-900 capitalize'>
                {formData.role}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Status</p>
              <p className='font-semibold text-gray-900 capitalize'>
                {formData.status}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Commission Rate</p>
              <p className='font-semibold text-bakery-pink'>
                {formData.commissionRate || "0"}%
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Date Hired</p>
              <p className='font-semibold text-gray-900'>
                {formData.dateHired}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/staff' className='btn-outline'>
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
                  Add Staff Member
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
