"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, TrendingDown } from "lucide-react";
import Link from "next/link";

type UsageItem = {
  itemId: string;
  itemName: string;
  currentStock: number;
  unit: string;
  quantity: number;
  reason: string; // NEW: production, damaged, missing, waste, expired
};

export default function UsagePage() {
  const router = useRouter();
  const recordUsage = useMutation(api.inventory.inventoryMutations.recordUsage);
  const inventoryItems = useQuery(api.inventory.inventory.getAll) || [];

  const [usageDate, setUsageDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<UsageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        itemId: "",
        itemName: "",
        currentStock: 0,
        unit: "",
        quantity: 0,
        reason: "production", // Default to production
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof UsageItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill item details when item is selected
    if (field === "itemId") {
      const selectedItem = inventoryItems.find(
        (item: any) => item._id === value,
      );
      if (selectedItem) {
        newItems[index].itemName = selectedItem.itemName;
        newItems[index].currentStock = selectedItem.currentStock;
        newItems[index].unit = selectedItem.unit;
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    // Check if any item exceeds current stock
    const invalidItems = items.filter(
      (item) => item.quantity > item.currentStock,
    );
    if (invalidItems.length > 0) {
      alert(
        `Cannot use more than available stock for: ${invalidItems.map((i) => i.itemName).join(", ")}`,
      );
      return;
    }

    setLoading(true);

    try {
      await recordUsage({
        items: items.map((item) => ({
          itemId: item.itemId as any,
          quantity: item.quantity,
          reason: item.reason,
        })),
        usageDate,
        notes: notes || undefined,
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error recording usage:", error);
      alert("Failed to record usage. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/inventory' className='p-2 hover:bg-gray-100 rounded-lg'>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Record Stock Usage
            </h1>
            <p className='text-gray-600 mt-1'>
              Track materials used in production
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Usage Details */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <TrendingDown size={24} className='text-bakery-pink' />
            Usage Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='label'>Usage Date *</label>
              <input
                type='date'
                className='input-field'
                value={usageDate}
                onChange={(e) => setUsageDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className='label'>Purpose/Notes</label>
              <input
                type='text'
                className='input-field'
                placeholder='e.g., Bread production batch #123'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-gray-900'>Materials Used</h2>
            <button
              type='button'
              onClick={addItem}
              className='btn-secondary flex items-center gap-2'>
              <Plus size={20} />
              Add Material
            </button>
          </div>

          {items.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
              <TrendingDown size={48} className='mx-auto text-gray-400 mb-4' />
              <p className='text-gray-600 font-semibold'>
                No materials added yet
              </p>
              <p className='text-gray-500 text-sm mt-2'>
                Click "Add Material" to record stock usage
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {items.map((item, index) => (
                <div
                  key={index}
                  className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                    <div className='md:col-span-2'>
                      <label className='label text-xs'>Material *</label>
                      <select
                        className='input-field'
                        value={item.itemId}
                        onChange={(e) =>
                          updateItem(index, "itemId", e.target.value)
                        }
                        required>
                        <option value=''>Select material...</option>
                        {inventoryItems.map((invItem: any) => (
                          <option key={invItem._id} value={invItem._id}>
                            {invItem.itemName} (Available:{" "}
                            {invItem.currentStock} {invItem.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='label text-xs'>Available</label>
                      <input
                        type='text'
                        className='input-field bg-gray-100 font-bold text-blue-600'
                        value={`${item.currentStock} ${item.unit}`}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className='label text-xs'>Quantity *</label>
                      <input
                        type='number'
                        className='input-field'
                        placeholder='10'
                        step='0.01'
                        min='0'
                        max={item.currentStock}
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        required
                      />
                      {item.quantity > item.currentStock && (
                        <p className='text-xs text-red-600 mt-1'>
                          ⚠️ Exceeds stock!
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='label text-xs'>Reason *</label>
                      <select
                        className='input-field'
                        value={item.reason}
                        onChange={(e) =>
                          updateItem(index, "reason", e.target.value)
                        }
                        required>
                        <option value='production'>🍞 Production</option>
                        <option value='damaged'>💔 Damaged</option>
                        <option value='missing'>❓ Missing</option>
                        <option value='waste'>🗑️ Waste</option>
                        <option value='expired'>⏰ Expired</option>
                        <option value='spillage'>💧 Spillage</option>
                      </select>
                    </div>

                    <div className='flex items-end'>
                      <button
                        type='button'
                        onClick={() => removeItem(index)}
                        className='w-full btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center gap-2'>
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* New Stock Preview */}
                  {item.itemId && (
                    <div className='mt-3 p-2 bg-blue-50 rounded text-sm'>
                      <p className='text-blue-900'>
                        <span className='font-semibold'>New Stock:</span>{" "}
                        {item.currentStock} - {item.quantity} ={" "}
                        <strong
                          className={
                            item.currentStock - item.quantity < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }>
                          {item.currentStock - item.quantity} {item.unit}
                        </strong>
                        <span className='ml-3 text-gray-600'>
                          • Reason: {item.reason}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className='card bg-linear-to-br from-orange-50 to-white border-2 border-orange-300'>
          <h2 className='text-xl font-bold text-orange-900 mb-4'>
            📊 Usage Summary
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-orange-300'>
              <p className='text-sm text-gray-600'>Materials Used</p>
              <p className='text-3xl font-bold text-orange-600 mt-1'>
                {items.length}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-orange-300'>
              <p className='text-sm text-gray-600'>Total Units</p>
              <p className='text-3xl font-bold text-orange-600 mt-1'>
                {totalUnits.toFixed(2)}
              </p>
            </div>
          </div>

          <div className='mt-4 p-3 bg-orange-100 rounded-lg text-sm'>
            <p className='font-semibold text-orange-900'>
              ⚠️ This Action Will:
            </p>
            <ul className='text-orange-700 mt-2 space-y-1 list-disc list-inside'>
              <li>Reduce stock levels for all selected materials</li>
              <li>Record usage in transaction history</li>
              <li>Cannot be undone (use adjustments to fix mistakes)</li>
            </ul>
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
              disabled={loading || items.length === 0}
              className='btn-primary flex items-center gap-2'>
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Recording...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Record Usage ({items.length} items)
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
