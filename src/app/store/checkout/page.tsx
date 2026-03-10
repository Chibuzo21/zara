"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Truck,
  Store,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const createOrder = useMutation(api.customerOrders.createOrder);

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderType: "delivery",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "cash_on_delivery",
    specialInstructions: "",
  });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0,
  );

  const deliveryFee = formData.orderType === "delivery" ? 1000 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item._id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.basePrice,
        totalPrice: item.basePrice * item.quantity,
      }));

      const result = await createOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        orderType: formData.orderType as "delivery" | "pickup",
        deliveryAddress:
          formData.orderType === "delivery"
            ? formData.deliveryAddress
            : undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        totalAmount: total,
        paymentMethod: formData.paymentMethod as any,
        deliveryDate: formData.deliveryDate || undefined,
        deliveryTime: formData.deliveryTime || undefined,
        specialInstructions: formData.specialInstructions || undefined,
      });

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect to confirmation
      router.push(`/store/order/${result.orderNumber}`);
    } catch (error: any) {
      alert(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md text-center'>
          <ShoppingCart size={64} className='mx-auto text-gray-400 mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Your cart is empty
          </h2>
          <p className='text-gray-600 mb-6'>
            Add some delicious items to get started!
          </p>
          <Link
            href='/store'
            className='bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors inline-block'>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/store'
            className='text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2 mb-4'>
            <ArrowLeft size={20} />
            Back to Store
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='text-gray-600'>Complete your order</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Form */}
          <div className='lg:col-span-2'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Customer Information */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Customer Information
                </h2>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      placeholder='John Doe'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value,
                        })
                      }
                      placeholder='0801 234 5678'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Email (Optional)
                    </label>
                    <input
                      type='email'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      placeholder='john@example.com'
                    />
                  </div>
                </div>
              </div>

              {/* Order Type */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Order Type
                </h2>

                <div className='grid grid-cols-2 gap-4'>
                  <button
                    type='button'
                    onClick={() =>
                      setFormData({ ...formData, orderType: "delivery" })
                    }
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.orderType === "delivery"
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300 hover:border-pink-300"
                    }`}>
                    <Truck size={32} className='mx-auto mb-2 text-pink-600' />
                    <p className='font-semibold'>Delivery</p>
                    <p className='text-sm text-gray-600'>₦1,000 fee</p>
                  </button>

                  <button
                    type='button'
                    onClick={() =>
                      setFormData({ ...formData, orderType: "pickup" })
                    }
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.orderType === "pickup"
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300 hover:border-pink-300"
                    }`}>
                    <Store size={32} className='mx-auto mb-2 text-pink-600' />
                    <p className='font-semibold'>Pickup</p>
                    <p className='text-sm text-gray-600'>Free</p>
                  </button>
                </div>

                {formData.orderType === "delivery" && (
                  <div className='mt-4'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.deliveryAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryAddress: e.target.value,
                        })
                      }
                      placeholder='123 Main Street, Aba, Abia State'
                    />
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      {formData.orderType === "delivery"
                        ? "Delivery"
                        : "Pickup"}{" "}
                      Date
                    </label>
                    <input
                      type='date'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.deliveryDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Preferred Time
                    </label>
                    <input
                      type='time'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      value={formData.deliveryTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Payment Method
                </h2>

                <div className='space-y-3'>
                  {formData.orderType === "delivery" ? (
                    <>
                      <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-pink-300 transition-all'>
                        <input
                          type='radio'
                          name='payment'
                          value='cash_on_delivery'
                          checked={
                            formData.paymentMethod === "cash_on_delivery"
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value,
                            })
                          }
                          className='w-5 h-5 text-pink-600'
                        />
                        <div className='ml-3 flex-1'>
                          <p className='font-semibold'>Cash on Delivery</p>
                          <p className='text-sm text-gray-600'>
                            Pay when order is delivered
                          </p>
                        </div>
                      </label>
                      <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-pink-300 transition-all'>
                        <input
                          type='radio'
                          name='payment'
                          value='transfer'
                          checked={formData.paymentMethod === "transfer"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value,
                            })
                          }
                          className='w-5 h-5 text-pink-600'
                        />
                        <div className='ml-3 flex-1'>
                          <p className='font-semibold'>Bank Transfer</p>
                          <p className='text-sm text-gray-600'>
                            Transfer before delivery
                          </p>
                        </div>
                      </label>
                    </>
                  ) : (
                    <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-pink-300 transition-all'>
                      <input
                        type='radio'
                        name='payment'
                        value='cash_on_pickup'
                        checked={formData.paymentMethod === "cash_on_pickup"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className='w-5 h-5 text-pink-600'
                      />
                      <div className='ml-3 flex-1'>
                        <p className='font-semibold'>Cash on Pickup</p>
                        <p className='text-sm text-gray-600'>
                          Pay when you collect
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Special Instructions
                </h2>
                <textarea
                  rows={3}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialInstructions: e.target.value,
                    })
                  }
                  placeholder='Any special requests? (Optional)'
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'>
                {loading
                  ? "Placing Order..."
                  : `Place Order - ₦${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-md p-6 sticky top-4'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Order Summary
              </h2>

              <div className='space-y-3 mb-4'>
                {cart.map((item) => (
                  <div key={item._id} className='flex justify-between'>
                    <div className='flex-1'>
                      <p className='font-semibold text-sm'>
                        {item.productName}
                      </p>
                      <p className='text-xs text-gray-600'>
                        ₦{item.basePrice.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className='font-semibold'>
                      ₦{(item.basePrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className='border-t pt-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <p>Subtotal</p>
                  <p>₦{subtotal.toLocaleString()}</p>
                </div>
                <div className='flex justify-between text-sm'>
                  <p>Delivery Fee</p>
                  <p>₦{deliveryFee.toLocaleString()}</p>
                </div>
                <div className='flex justify-between text-lg font-bold border-t pt-2'>
                  <p>Total</p>
                  <p className='text-pink-600'>₦{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
