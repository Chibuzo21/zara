"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Store,
  ArrowLeft,
} from "lucide-react";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState("");

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      setSearchedOrder(orderParam);
    }
  }, [searchParams]);

  const order = useQuery(
    api.customerOrders.getOrderByNumber,
    searchedOrder ? { orderNumber: searchedOrder } : "skip",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedOrder(orderNumber);
  };

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: Clock },
    { key: "ready", label: "Ready", icon: CheckCircle },
  ];

  if (order?.orderType === "delivery") {
    statusSteps.push(
      { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
      { key: "completed", label: "Delivered", icon: CheckCircle },
    );
  } else {
    statusSteps.push({
      key: "completed",
      label: "Completed",
      icon: CheckCircle,
    });
  }

  const getStepIndex = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/store'
            className='text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2 mb-4'>
            <ArrowLeft size={20} />
            Back to Store
          </Link>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
            Track Your Order
          </h1>
          <p className='text-gray-600'>
            Enter your order number to see the current status
          </p>
        </div>

        {/* Search Box */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-8'>
          <form onSubmit={handleSearch} className='flex gap-3'>
            <input
              type='text'
              placeholder='Enter order number (e.g., ORD26030612345)'
              className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            />
            <button
              type='submit'
              className='bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2'>
              <Search size={20} />
              Track
            </button>
          </form>
        </div>

        {/* Order Status */}
        {searchedOrder && (
          <>
            {order === undefined && (
              <div className='bg-white rounded-xl shadow-md p-8 text-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto'></div>
                <p className='text-gray-600 mt-4'>Loading order details...</p>
              </div>
            )}

            {order === null && (
              <div className='bg-white rounded-xl shadow-md p-8 text-center'>
                <div className='text-6xl mb-4'>😕</div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Order Not Found
                </h2>
                <p className='text-gray-600 mb-6'>
                  We couldn't find an order with number:{" "}
                  <strong>{searchedOrder}</strong>
                </p>
                <p className='text-sm text-gray-500'>
                  Please check your order number and try again
                </p>
              </div>
            )}

            {order && order.status !== "cancelled" && (
              <div className='space-y-6'>
                {/* Order Info Card */}
                <div className='bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl shadow-lg p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <p className='text-pink-100 text-sm mb-1'>Order Number</p>
                      <p className='text-2xl font-bold'>{order.orderNumber}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-pink-100 text-sm mb-1'>Order Date</p>
                      <p className='font-semibold'>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 pt-4 border-t border-pink-500'>
                    <div className='flex-1'>
                      <p className='text-pink-100 text-sm'>Customer</p>
                      <p className='font-semibold'>{order.customerName}</p>
                    </div>
                    <div className='flex-1 text-right'>
                      <p className='text-pink-100 text-sm'>Total Amount</p>
                      <p className='text-xl font-bold'>
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className='bg-white rounded-xl shadow-md p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-6'>
                    Order Progress
                  </h2>

                  {/* Desktop Progress */}
                  <div className='hidden md:block'>
                    <div className='relative'>
                      {/* Progress Line */}
                      <div className='absolute top-6 left-0 right-0 h-1 bg-gray-200'>
                        <div
                          className='h-full bg-pink-600 transition-all duration-500'
                          style={{
                            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Steps */}
                      <div className='relative flex justify-between'>
                        {statusSteps.map((step, index) => {
                          const Icon = step.icon;
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;

                          return (
                            <div
                              key={step.key}
                              className='flex flex-col items-center'>
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                                  isCompleted
                                    ? "bg-pink-600 text-white"
                                    : "bg-gray-200 text-gray-400"
                                } ${isCurrent ? "ring-4 ring-pink-200" : ""}`}>
                                <Icon size={24} />
                              </div>
                              <p
                                className={`text-sm font-semibold text-center ${
                                  isCompleted
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Progress */}
                  <div className='md:hidden space-y-4'>
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className={`flex items-center gap-4 p-4 rounded-lg ${
                            isCurrent
                              ? "bg-pink-50 border-2 border-pink-600"
                              : "bg-gray-50"
                          }`}>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-pink-600 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}>
                            <Icon size={20} />
                          </div>
                          <p
                            className={`font-semibold ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current Status Message */}
                  <div className='mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200'>
                    <p className='text-pink-900 font-semibold'>
                      {order.status === "pending" &&
                        "🕐 Your order is being reviewed"}
                      {order.status === "confirmed" &&
                        "✅ Your order has been confirmed!"}
                      {order.status === "preparing" &&
                        "👨‍🍳 We're baking your items fresh"}
                      {order.status === "ready" &&
                        order.orderType === "pickup" &&
                        "📦 Your order is ready for pickup!"}
                      {order.status === "ready" &&
                        order.orderType === "delivery" &&
                        "📦 Your order is ready and will be delivered soon"}
                      {order.status === "out_for_delivery" &&
                        "🚚 Your order is on the way!"}
                      {order.status === "completed" &&
                        "🎉 Order delivered! Enjoy your treats!"}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className='bg-white rounded-xl shadow-md p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-4'>
                    Order Items
                  </h2>
                  <div className='space-y-3'>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                        <div>
                          <p className='font-semibold'>{item.productName}</p>
                          <p className='text-sm text-gray-600'>
                            Qty: {item.quantity} × ₦
                            {item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <p className='font-bold text-pink-600'>
                          ₦{item.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery/Pickup Info */}
                <div className='bg-white rounded-xl shadow-md p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-4'>
                    {order.orderType === "delivery" ? "Delivery" : "Pickup"}{" "}
                    Details
                  </h2>
                  <div className='space-y-3'>
                    {order.orderType === "delivery" ? (
                      <>
                        <div className='flex items-start gap-3'>
                          <Truck className='text-pink-600 mt-1' size={20} />
                          <div>
                            <p className='font-semibold text-gray-700'>
                              Delivery Address
                            </p>
                            <p className='text-gray-600'>
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='flex items-start gap-3'>
                        <Store className='text-pink-600 mt-1' size={20} />
                        <div>
                          <p className='font-semibold text-gray-700'>
                            Pickup Location
                          </p>
                          <p className='text-gray-600'>
                            Zara's Delight Bakery, Aba, Abia State
                          </p>
                        </div>
                      </div>
                    )}

                    {order.deliveryDate && (
                      <div className='flex items-start gap-3'>
                        <Clock className='text-pink-600 mt-1' size={20} />
                        <div>
                          <p className='font-semibold text-gray-700'>
                            Scheduled Time
                          </p>
                          <p className='text-gray-600'>
                            {new Date(order.deliveryDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                            {order.deliveryTime && ` at ${order.deliveryTime}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className='bg-gray-50 rounded-xl p-6 text-center'>
                  <p className='text-gray-700 mb-2'>
                    Need help with your order?
                  </p>
                  <p className='font-bold text-pink-600 text-lg'>
                    Call us: +234 XXX XXX XXXX
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    Mon-Sat: 7AM - 7PM
                  </p>
                </div>
              </div>
            )}

            {order && order.status === "cancelled" && (
              <div className='bg-white rounded-xl shadow-md p-8 text-center'>
                <div className='text-6xl mb-4'>❌</div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Order Cancelled
                </h2>
                <p className='text-gray-600 mb-4'>
                  Order {order.orderNumber} has been cancelled
                </p>
                <Link
                  href='/store'
                  className='inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors'>
                  Place New Order
                </Link>
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        {!searchedOrder && (
          <div className='bg-white rounded-xl shadow-md p-8'>
            <div className='text-center mb-6'>
              <div className='text-6xl mb-4'>📦</div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Track Your Order
              </h2>
              <p className='text-gray-600'>
                Enter your order number above to see real-time updates
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-4 mt-8'>
              <div className='text-center p-4'>
                <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Package className='text-pink-600' size={24} />
                </div>
                <h3 className='font-semibold mb-1'>Order Placed</h3>
                <p className='text-sm text-gray-600'>
                  Get instant confirmation
                </p>
              </div>

              <div className='text-center p-4'>
                <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Clock className='text-pink-600' size={24} />
                </div>
                <h3 className='font-semibold mb-1'>Track Progress</h3>
                <p className='text-sm text-gray-600'>See live status updates</p>
              </div>

              <div className='text-center p-4'>
                <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <CheckCircle className='text-pink-600' size={24} />
                </div>
                <h3 className='font-semibold mb-1'>Enjoy!</h3>
                <p className='text-sm text-gray-600'>
                  Receive your fresh baked goods
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
