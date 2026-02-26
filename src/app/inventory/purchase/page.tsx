"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../../../../lib/utils";

type PurchaseItem = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
};

export default function PurchasePage() {
  const router = useRouter();
  const recordPurchase = useMutation(api.inventoryMutations.recordBulkPurchase);
  const inventoryItems = useQuery(api.inventory.getAll) || [];
  const suppliers = useQuery(api.suppliers?.getAll) || [];

  const [supplierId, setSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        itemId: "",
        itemName: "",
        quantity: 0,
        unitCost: 0,
        totalCost: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-calculate total cost
    if (field === "quantity" || field === "unitCost") {
      newItems[index].totalCost =
        newItems[index].quantity * newItems[index].unitCost;
    }

    // Auto-fill item name when item is selected
    if (field === "itemId") {
      const selectedItem = inventoryItems.find(
        (item: any) => item._id === value,
      );
      if (selectedItem) {
        newItems[index].itemName = selectedItem.itemName;
        newItems[index].unitCost = selectedItem.unitCost;
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add at least one item to purchase");
      return;
    }

    setLoading(true);

    try {
      await recordPurchase({
        supplierId: supplierId || undefined,
        purchaseDate,
        notes: notes || undefined,
        items: items.map((item) => ({
          itemId: item.itemId as any,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.totalCost,
        })),
      });

      router.push("/inventory");
    } catch (error) {
      console.error("Error recording purchase:", error);
      alert("Failed to record purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0);

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
              Record Purchase Order
            </h1>
            <p className='text-gray-600 mt-1'>
              Add multiple items to inventory at once
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Purchase Details */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <ShoppingCart size={24} className='text-bakery-pink' />
            Purchase Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='label'>Supplier</label>
              <select
                className='input-field'
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}>
                <option value=''>No Supplier</option>
                {suppliers &&
                  suppliers.map((supplier: any) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.supplierName}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className='label'>Purchase Date *</label>
              <input
                type='date'
                className='input-field'
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className='label'>Notes</label>
              <input
                type='text'
                className='input-field'
                placeholder='Invoice #, delivery notes, etc.'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-gray-900'>
              Items to Purchase
            </h2>
            <button
              type='button'
              onClick={addItem}
              className='btn-secondary flex items-center gap-2'>
              <Plus size={20} />
              Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
              <ShoppingCart size={48} className='mx-auto text-gray-400 mb-4' />
              <p className='text-gray-600 font-semibold'>No items added yet</p>
              <p className='text-gray-500 text-sm mt-2'>
                Click "Add Item" to start building your purchase order
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
                      <label className='label text-xs'>Item *</label>
                      <select
                        className='input-field'
                        value={item.itemId}
                        onChange={(e) =>
                          updateItem(index, "itemId", e.target.value)
                        }
                        required>
                        <option value=''>Select item...</option>
                        {inventoryItems.map((invItem: any) => (
                          <option key={invItem._id} value={invItem._id}>
                            {invItem.itemName} ({invItem.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='label text-xs'>Quantity *</label>
                      <input
                        type='number'
                        className='input-field'
                        placeholder='100'
                        step='0.01'
                        min='0'
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
                    </div>

                    <div>
                      <label className='label text-xs'>Unit Cost (₦) *</label>
                      <input
                        type='number'
                        className='input-field'
                        placeholder='450'
                        step='0.01'
                        min='0'
                        value={item.unitCost || ""}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitCost",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className='label text-xs'>Total Cost</label>
                      <input
                        type='text'
                        className='input-field bg-gray-100 font-bold text-bakery-pink'
                        value={formatCurrency(item.totalCost)}
                        readOnly
                      />
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className='card bg-gradient-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📊 Purchase Summary
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Total Items</p>
              <p className='text-3xl font-bold text-blue-600 mt-1'>
                {items.length}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
              <p className='text-sm text-gray-600'>Total Units</p>
              <p className='text-3xl font-bold text-green-600 mt-1'>
                {items.reduce((sum, item) => sum + item.quantity, 0).toFixed(2)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border-2 border-bakery-pink'>
              <p className='text-sm text-gray-600'>Total Amount</p>
              <p className='text-3xl font-bold text-bakery-pink mt-1'>
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <div className='mt-4 p-3 bg-blue-50 rounded-lg text-sm'>
            <p className='font-semibold text-blue-900'>💡 What Happens Next:</p>
            <ul className='text-blue-700 mt-2 space-y-1 list-disc list-inside'>
              <li>Stock levels will be increased automatically</li>
              <li>Purchase will be recorded in transaction history</li>
              <li>Each item's "current stock" will update</li>
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
                  Record Purchase ({items.length} items)
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
