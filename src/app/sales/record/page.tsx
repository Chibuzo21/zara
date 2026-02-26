"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Trash2, Save } from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";

import { Id } from "../../../../convex/_generated/dataModel";
import StaffCommission from "./component/staffCommission";

type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

export default function RecordSalePage() {
  const router = useRouter();
  const user = useQuery(api.users.viewer);
  const products = useQuery(api.production.products.getActive) || [];
  const recordSale = useMutation(api.sales.salesMutations.create);

  const [items, setItems] = useState<SaleItem[]>([]);
  const [saleInfo, setSaleInfo] = useState({
    saleType:
      user?.role === "transport_sales"
        ? ("transport" as const)
        : ("shop" as const),
    location: "",
    customerName: "",
    paymentMethod: "cash" as "cash" | "transfer" | "pos" | "credit",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill product name and price when product is selected
    if (field === "productId") {
      const product = products.find((p: any) => p._id === value);
      if (product) {
        newItems[index].productName = product.productName;
        newItems[index].unitPrice = product.basePrice;
      }
    }

    // Auto-calculate total
    newItems[index].totalAmount =
      newItems[index].quantity * newItems[index].unitPrice;

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (!user) {
      alert("Staff ID not found. Please contact admin.");
      return;
    }

    setLoading(true);

    try {
      const saleDate = new Date().toISOString().split("T")[0];

      // Record each item as a separate sale
      for (const item of items) {
        await recordSale({
          saleDate,
          productId: item.productId as any,
          quantitySold: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.totalAmount,
          salesStaffId: user.staffId as any,
          paymentMethod: saleInfo.paymentMethod,
          customerName: saleInfo.customerName || undefined,
          notes: saleInfo.notes || undefined,
          productName: item.productName,
          recordedBy: user._id as Id<"users">,
          saleType: saleInfo.saleType,
          location: saleInfo.location || undefined,
        });
      }

      alert(
        `Success! ${items.length} sale(s) recorded.\nTotal: ${formatCurrency(totalAmount)}`,
      );

      // Reset form
      setItems([]);
      setSaleInfo({
        ...saleInfo,
        customerName: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Failed to record sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Record Sale</h1>
          <p className='text-gray-600 mt-1'>
            Log your sales for commission tracking
          </p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-gray-600'>Logged in as:</p>
          <p className='font-semibold text-gray-900'>{user.fullName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Sale Info */}
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <ShoppingCart size={24} className='text-bakery-pink' />
            Sale Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='label'>Sale Type *</label>
              <select
                className='input-field'
                value={saleInfo.saleType}
                onChange={(e) =>
                  setSaleInfo({ ...saleInfo, saleType: e.target.value as any })
                }>
                <option value='shop'>Shop Sale</option>
                <option value='transport'>Transport/Delivery Sale</option>
              </select>
            </div>

            {saleInfo.saleType === "transport" && (
              <div>
                <label className='label'>Delivery Location</label>
                <input
                  type='text'
                  className='input-field'
                  placeholder='e.g., Ikeja, Lekki, etc.'
                  value={saleInfo.location}
                  onChange={(e) =>
                    setSaleInfo({ ...saleInfo, location: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label className='label'>Payment Method *</label>
              <select
                className='input-field'
                value={saleInfo.paymentMethod}
                onChange={(e) =>
                  setSaleInfo({
                    ...saleInfo,
                    paymentMethod: e.target.value as any,
                  })
                }>
                <option value='cash'>Cash</option>
                <option value='transfer'>Bank Transfer</option>
                <option value='pos'>POS</option>
                <option value='credit'>Credit</option>
              </select>
            </div>

            <div>
              <label className='label'>Customer Name (Optional)</label>
              <input
                type='text'
                className='input-field'
                placeholder='John Doe'
                value={saleInfo.customerName}
                onChange={(e) =>
                  setSaleInfo({ ...saleInfo, customerName: e.target.value })
                }
              />
            </div>

            <div className='md:col-span-2'>
              <label className='label'>Notes (Optional)</label>
              <input
                type='text'
                className='input-field'
                placeholder='Any additional notes...'
                value={saleInfo.notes}
                onChange={(e) =>
                  setSaleInfo({ ...saleInfo, notes: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-gray-900'>Items Sold</h2>
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
                Click "Add Item" to start recording sales
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {items.map((item, index) => (
                <div
                  key={index}
                  className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                    <div className='md:col-span-2'>
                      <label className='label text-xs'>Product *</label>
                      <select
                        className='input-field'
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, "productId", e.target.value)
                        }
                        required>
                        <option value=''>Select product...</option>
                        {products.map((product: any) => (
                          <option key={product._id} value={product._id}>
                            {product.productName} -{" "}
                            {formatCurrency(product.basePrice)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='label text-xs'>Quantity *</label>
                      <input
                        type='number'
                        className='input-field'
                        placeholder='1'
                        min='1'
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className='label text-xs'>Unit Price</label>
                      <input
                        type='number'
                        className='input-field bg-gray-100'
                        value={item.unitPrice}
                        step='0.01'
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>

                    <div className='flex items-end gap-2'>
                      <div className='flex-1'>
                        <label className='label text-xs'>Total</label>
                        <input
                          type='text'
                          className='input-field bg-bakery-pink-pale font-bold text-bakery-pink'
                          value={formatCurrency(item.totalAmount)}
                          readOnly
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => removeItem(index)}
                        className='btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white h-[42px] px-3'>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className='card bg-linear-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
          <h2 className='text-xl font-bold text-bakery-pink mb-4'>
            📊 Sale Summary
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
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg border-2 border-bakery-pink'>
              <p className='text-sm text-gray-600'>Total Amount</p>
              <p className='text-3xl font-bold text-bakery-pink mt-1'>
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <StaffCommission
            formatCurrency={formatCurrency}
            totalAmount={totalAmount}
            userId={user?._id}
          />
        </div>

        {/* Actions */}
        <div className='card'>
          <div className='flex gap-4 justify-end'>
            <button
              type='button'
              onClick={() => router.back()}
              className='btn-outline'>
              Cancel
            </button>
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
                  Record Sale ({items.length} items)
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
