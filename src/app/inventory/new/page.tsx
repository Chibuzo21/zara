"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package } from "lucide-react";
import Link from "next/link";

export default function NewInventoryPage() {
  const router = useRouter();
  const createItem = useMutation(api.inventoryMutations.create);
  const suppliers = useQuery(api.suppliers?.getAll) || [];

  const [formData, setFormData] = useState({
    itemName: "",
    category: "flour" as
      | "flour"
      | "sugar"
      | "dairy"
      | "eggs"
      | "flavoring"
      | "packaging"
      | "other",
    unit: "",
    reorderLevel: "",
    currentStock: "",
    unitCost: "",
    supplierId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createItem({
        itemName: formData.itemName,
        category: formData.category,
        unit: formData.unit,
        reorderLevel: parseFloat(formData.reorderLevel),
        currentStock: parseFloat(formData.currentStock),
        unitCost: parseFloat(formData.unitCost),
        supplierId: formData.supplierId
          ? (formData.supplierId as any)
          : undefined,
        status: "active",
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error creating inventory item:", error);
      alert("Failed to add inventory item. Please try again.");
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

  const totalValue =
    (parseFloat(formData.currentStock) || 0) *
    (parseFloat(formData.unitCost) || 0);
  const isLowStock =
    (parseFloat(formData.currentStock) || 0) <=
    (parseFloat(formData.reorderLevel) || 0);

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/inventory' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Add Inventory Item
            </h1>
            <p className='text-gray-600 mt-1'>
              Add a new item to your inventory
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Item Details */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <Package size={24} className='text-bakery-pink' />
            Item Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
              <label className='label'>Item Name *</label>
              <input
                type='text'
                name='itemName'
                className='input-field'
                placeholder='e.g., All Purpose Flour'
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className='label'>Category *</label>
              <select
                name='category'
                className='input-field'
                value={formData.category}
                onChange={handleChange}
                required>
                <option value='flour'>Flour</option>
                <option value='sugar'>Sugar</option>
                <option value='dairy'>Dairy</option>
                <option value='eggs'>Eggs</option>
                <option value='flavoring'>Flavoring</option>
                <option value='packaging'>Packaging</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div>
              <label className='label'>Unit of Measurement *</label>
              <input
                type='text'
                name='unit'
                className='input-field'
                placeholder='e.g., kg, liters, pieces'
                value={formData.unit}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                kg, liters, pieces, bags, etc.
              </p>
            </div>

            <div>
              <label className='label'>Supplier</label>
              <select
                name='supplierId'
                className='input-field'
                value={formData.supplierId}
                onChange={handleChange}>
                <option value=''>No Supplier</option>
                {suppliers &&
                  suppliers.map((supplier: any) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.supplierName}
                    </option>
                  ))}
              </select>
              <p className='text-sm text-gray-500 mt-1'>Optional</p>
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            📊 Stock Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='label'>Current Stock *</label>
              <input
                type='number'
                name='currentStock'
                className='input-field'
                placeholder='0'
                step='0.01'
                value={formData.currentStock}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Current quantity in stock
              </p>
            </div>

            <div>
              <label className='label'>Reorder Level *</label>
              <input
                type='number'
                name='reorderLevel'
                className='input-field'
                placeholder='0'
                step='0.01'
                value={formData.reorderLevel}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>
                Alert when stock reaches this level
              </p>
            </div>

            <div>
              <label className='label'>Unit Cost (₦) *</label>
              <input
                type='number'
                name='unitCost'
                className='input-field'
                placeholder='0.00'
                step='0.01'
                value={formData.unitCost}
                onChange={handleChange}
                required
              />
              <p className='text-sm text-gray-500 mt-1'>Cost per unit</p>
            </div>
          </div>
        </div>

        {/* Preview & Calculations */}
        <div className='card bg-gradient-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📈 Stock Preview
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Total Value</p>
              <p className='text-2xl font-bold text-bakery-pink mt-1'>
                ₦{totalValue.toFixed(2)}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                {formData.currentStock || 0} × ₦{formData.unitCost || 0}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Stock Status</p>
              <p
                className={`text-lg font-bold mt-1 ${
                  !formData.currentStock
                    ? "text-gray-400"
                    : parseFloat(formData.currentStock) === 0
                      ? "text-red-600"
                      : isLowStock
                        ? "text-yellow-600"
                        : "text-green-600"
                }`}>
                {!formData.currentStock
                  ? "Not Set"
                  : parseFloat(formData.currentStock) === 0
                    ? "🔴 OUT OF STOCK"
                    : isLowStock
                      ? "🟡 LOW STOCK"
                      : "🟢 GOOD STOCK"}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Stock Level</p>
              <p className='text-2xl font-bold text-blue-600 mt-1'>
                {formData.currentStock || 0} {formData.unit}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                Reorder at: {formData.reorderLevel || 0}
              </p>
            </div>
          </div>

          {isLowStock && formData.currentStock && formData.reorderLevel && (
            <div className='mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
              <p className='text-sm text-yellow-800'>
                ⚠️ <strong>Warning:</strong> Current stock is at or below
                reorder level. Consider ordering more stock.
              </p>
            </div>
          )}
        </div>

        {/* Item Summary */}
        <div className='card border-2 border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>📋 Summary</h2>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-gray-600'>Item Name</p>
              <p className='font-semibold text-gray-900'>
                {formData.itemName || "-"}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Category</p>
              <p className='font-semibold text-gray-900 capitalize'>
                {formData.category}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Current Stock</p>
              <p className='font-semibold text-gray-900'>
                {formData.currentStock || "0"} {formData.unit}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Reorder Level</p>
              <p className='font-semibold text-gray-900'>
                {formData.reorderLevel || "0"} {formData.unit}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Unit Cost</p>
              <p className='font-semibold text-gray-900'>
                ₦{formData.unitCost || "0.00"}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Total Value</p>
              <p className='font-semibold text-bakery-pink'>
                ₦{totalValue.toFixed(2)}
              </p>
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
                  Add to Inventory
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
