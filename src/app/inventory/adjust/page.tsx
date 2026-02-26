"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Settings } from "lucide-react";
import Link from "next/link";

export default function AdjustPage() {
  const router = useRouter();
  const adjustStock = useMutation(api.inventoryMutations.updateStock);
  const inventoryItems = useQuery(api.inventory.getAll) || [];

  const [formData, setFormData] = useState({
    itemId: "",
    adjustmentType: "adjustment" as "adjustment" | "waste",
    quantity: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const selectedItem = inventoryItems.find(
    (item: any) => item._id === formData.itemId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adjustStock({
        itemId: formData.itemId as any,
        quantity: parseFloat(formData.quantity),
        transactionType: formData.adjustmentType,
        notes: formData.reason,
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("Failed to adjust stock. Please try again.");
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

  const quantity = parseFloat(formData.quantity) || 0;
  const currentStock = selectedItem?.currentStock || 0;
  const newStock =
    formData.adjustmentType === "adjustment"
      ? currentStock + quantity
      : currentStock - quantity;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/inventory' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Adjust Stock</h1>
            <p className='text-gray-600 mt-1'>
              Manual stock corrections and waste tracking
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Item Selection */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Settings size={24} className='text-bakery-pink' />
            Adjustment Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label className='label'>Select Item *</label>
              <select
                name='itemId'
                className='input-field'
                value={formData.itemId}
                onChange={handleChange}
                required>
                <option value=''>Choose an item...</option>
                {inventoryItems.map((item: any) => (
                  <option key={item._id} value={item._id}>
                    {item.itemName} - Current Stock: {item.currentStock}{" "}
                    {item.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='label'>Adjustment Type *</label>
              <select
                name='adjustmentType'
                className='input-field'
                value={formData.adjustmentType}
                onChange={handleChange}
                required>
                <option value='adjustment'>Adjustment (Add/Subtract)</option>
                <option value='waste'>Waste/Damage (Subtract Only)</option>
              </select>
              <p className='text-sm text-gray-500 mt-1'>
                {formData.adjustmentType === "adjustment"
                  ? "Positive = Add stock, Negative = Reduce stock"
                  : "Tracks damaged or wasted materials"}
              </p>
            </div>

            <div>
              <label className='label'>Quantity *</label>
              <input
                type='number'
                name='quantity'
                className='input-field'
                placeholder={
                  formData.adjustmentType === "adjustment" ? "+10 or -5" : "5"
                }
                step='0.01'
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                {formData.adjustmentType === "adjustment"
                  ? "Use + to add, - to subtract, or just enter number"
                  : "Amount wasted/damaged (will subtract from stock)"}
              </p>
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Reason for Adjustment *</label>
              <textarea
                name='reason'
                className='input-field'
                rows={3}
                placeholder='e.g., Physical count correction, Damaged during storage, etc.'
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {selectedItem && formData.quantity && (
          <div className='card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200'>
            <h2 className='text-xl font-bold text-blue-900 mb-4'>
              📊 Adjustment Preview
            </h2>

            <div className='grid grid-cols-3 gap-4'>
              <div className='p-4 bg-white rounded-lg border border-blue-200'>
                <p className='text-sm text-gray-600'>Current Stock</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>
                  {currentStock.toFixed(2)} {selectedItem.unit}
                </p>
              </div>

              <div className='p-4 bg-white rounded-lg border border-blue-200'>
                <p className='text-sm text-gray-600'>Adjustment</p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    formData.adjustmentType === "waste" || quantity < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}>
                  {formData.adjustmentType === "waste"
                    ? "-"
                    : quantity >= 0
                      ? "+"
                      : ""}
                  {Math.abs(quantity).toFixed(2)} {selectedItem.unit}
                </p>
              </div>

              <div className='p-4 bg-white rounded-lg border-2 border-blue-300'>
                <p className='text-sm text-gray-600'>New Stock</p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    newStock < 0
                      ? "text-red-600"
                      : newStock <= selectedItem.reorderLevel
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}>
                  {newStock.toFixed(2)} {selectedItem.unit}
                </p>
              </div>
            </div>

            <div className='mt-4 p-3 bg-white rounded-lg border border-blue-200'>
              <p className='font-semibold text-blue-900'>Formula:</p>
              <p className='text-blue-700 mt-1'>
                {currentStock.toFixed(2)}{" "}
                {formData.adjustmentType === "waste" || quantity < 0
                  ? "-"
                  : "+"}{" "}
                {Math.abs(quantity).toFixed(2)} ={" "}
                <strong>
                  {newStock.toFixed(2)} {selectedItem.unit}
                </strong>
              </p>
            </div>

            {newStock < 0 && (
              <div className='mt-4 p-3 bg-red-50 rounded-lg border border-red-200'>
                <p className='text-red-800'>
                  ⚠️ <strong>Warning:</strong> This adjustment will result in
                  negative stock. Please verify the quantity.
                </p>
              </div>
            )}

            {newStock >= 0 && newStock <= selectedItem.reorderLevel && (
              <div className='mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
                <p className='text-yellow-800'>
                  ⚠️ <strong>Low Stock Alert:</strong> New stock level will be
                  at or below reorder level ({selectedItem.reorderLevel}{" "}
                  {selectedItem.unit}).
                </p>
              </div>
            )}
          </div>
        )}

        {/* Common Reasons */}
        <div className='card bg-gray-50'>
          <h3 className='font-bold text-gray-900 mb-3'>
            💡 Common Adjustment Reasons
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
            <div>
              <p className='font-semibold text-gray-700'>Add Stock (+):</p>
              <ul className='list-disc list-inside text-gray-600 mt-1 space-y-1'>
                <li>Physical count shows more than system</li>
                <li>Found additional stock in storage</li>
                <li>Correction from previous error</li>
              </ul>
            </div>
            <div>
              <p className='font-semibold text-gray-700'>Reduce Stock (-):</p>
              <ul className='list-disc list-inside text-gray-600 mt-1 space-y-1'>
                <li>Damaged during storage</li>
                <li>Expired materials discarded</li>
                <li>Spillage or waste</li>
                <li>Physical count shows less</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <Link href='/inventory' className='btn-outline'>
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading || !formData.itemId}
              className='btn-primary flex items-center gap-2'>
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Adjusting...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Apply Adjustment
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
