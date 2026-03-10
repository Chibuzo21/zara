"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Truck,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const order = useQuery(api.customerOrders.getOrderByNumber, {
    orderNumber,
  });

  if (order === undefined) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600'></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md text-center'>
          <div className='text-red-500 text-6xl mb-4'>❌</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Order Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            We couldn't find an order with number: {orderNumber}
          </p>
          <Link
            href='/store'
            className='bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors inline-block'>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig: Record<
    string,
    { icon: string; color: string; text: string }
  > = {
    pending: { icon: "⏳", color: "yellow", text: "Pending Confirmation" },
    confirmed: { icon: "✅", color: "blue", text: "Confirmed" },
    preparing: { icon: "👨‍🍳", color: "purple", text: "Being Prepared" },
    ready: { icon: "📦", color: "green", text: "Ready" },
    out_for_delivery: { icon: "🚚", color: "blue", text: "Out for Delivery" },
    completed: { icon: "✅", color: "green", text: "Completed" },
    cancelled: { icon: "❌", color: "red", text: "Cancelled" },
  };

  const currentStatus = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white py-12'>
      <div className='container mx-auto px-4 max-w-3xl'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
            <CheckCircle size={48} className='text-green-600' />
          </div>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
            Order Placed Successfully! 🎉
          </h1>
          <p className='text-gray-600 text-lg'>
            Thank you for your order, {order.customerName}!
          </p>
        </div>

        {/* Order Number Card */}
        <div className='bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl shadow-lg p-6 mb-6'>
          <p className='text-pink-100 text-sm mb-1'>Your Order Number</p>
          <p className='text-3xl font-bold mb-4'>{order.orderNumber}</p>
          <p className='text-pink-100 text-sm'>
            Save this number to track your order
          </p>
        </div>

        {/* Current Status */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            Current Status
          </h2>
          <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
            <div className='text-5xl'>{currentStatus.icon}</div>
            <div className='flex-1'>
              <p className='text-2xl font-bold text-gray-900'>
                {currentStatus.text}
              </p>
              <p className='text-gray-600'>
                {order.status === "pending" && "We'll confirm your order soon"}
                {order.status === "confirmed" &&
                  "Your order has been confirmed"}
                {order.status === "preparing" &&
                  "We're baking your items fresh"}
                {order.status === "ready" &&
                  order.orderType === "delivery" &&
                  "Ready for delivery"}
                {order.status === "ready" &&
                  order.orderType === "pickup" &&
                  "Ready for pickup at our bakery"}
                {order.status === "out_for_delivery" &&
                  "Your order is on the way"}
                {order.status === "completed" && "Enjoy your delicious treats!"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            Order Details
          </h2>

          {/* Items */}
          <div className='space-y-3 mb-4 pb-4 border-b'>
            {order.items.map((item, index) => (
              <div key={index} className='flex justify-between'>
                <div>
                  <p className='font-semibold'>{item.productName}</p>
                  <p className='text-sm text-gray-600'>
                    ₦{item.unitPrice.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p className='font-semibold'>
                  ₦{item.totalPrice.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <p>Subtotal</p>
              <p>₦{order.subtotal.toLocaleString()}</p>
            </div>
            <div className='flex justify-between text-sm'>
              <p>Delivery Fee</p>
              <p>₦{order.deliveryFee.toLocaleString()}</p>
            </div>
            <div className='flex justify-between text-lg font-bold pt-2 border-t'>
              <p>Total</p>
              <p className='text-pink-600'>
                ₦{order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery/Pickup Information */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            {order.orderType === "delivery" ? "Delivery" : "Pickup"} Information
          </h2>

          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              {order.orderType === "delivery" ? (
                <Truck className='text-pink-600 mt-1' size={20} />
              ) : (
                <Store className='text-pink-600 mt-1' size={20} />
              )}
              <div>
                <p className='font-semibold text-gray-700'>
                  {order.orderType === "delivery"
                    ? "Delivery Address"
                    : "Pickup Location"}
                </p>
                <p className='text-gray-600'>
                  {order.orderType === "delivery"
                    ? order.deliveryAddress
                    : "Zara's Delight Bakery, Aba, Abia State"}
                </p>
              </div>
            </div>

            {order.deliveryDate && (
              <div className='flex items-start gap-3'>
                <Clock className='text-pink-600 mt-1' size={20} />
                <div>
                  <p className='font-semibold text-gray-700'>
                    {order.orderType === "delivery" ? "Delivery" : "Pickup"}{" "}
                    Time
                  </p>
                  <p className='text-gray-600'>
                    {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {order.deliveryTime && ` at ${order.deliveryTime}`}
                  </p>
                </div>
              </div>
            )}

            <div className='flex items-start gap-3'>
              <Phone className='text-pink-600 mt-1' size={20} />
              <div>
                <p className='font-semibold text-gray-700'>Contact</p>
                <p className='text-gray-600'>{order.customerPhone}</p>
              </div>
            </div>

            {order.customerEmail && (
              <div className='flex items-start gap-3'>
                <Mail className='text-pink-600 mt-1' size={20} />
                <div>
                  <p className='font-semibold text-gray-700'>Email</p>
                  <p className='text-gray-600'>{order.customerEmail}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Payment</h2>
          <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
            <div>
              <p className='font-semibold text-gray-900'>
                {order.paymentMethod === "cash_on_delivery" &&
                  "Cash on Delivery"}
                {order.paymentMethod === "cash_on_pickup" && "Cash on Pickup"}
                {order.paymentMethod === "transfer" && "Bank Transfer"}
              </p>
              <p className='text-sm text-gray-600'>
                {order.paymentStatus === "pending" && "Payment pending"}
                {order.paymentStatus === "paid" && "Payment received"}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
              {order.paymentStatus === "paid" ? "Paid" : "Pending"}
            </div>
          </div>

          {order.paymentMethod === "transfer" &&
            order.paymentStatus === "pending" && (
              <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='font-semibold text-blue-900 mb-2'>Bank Details</p>
                <div className='space-y-1 text-sm text-blue-800'>
                  <p>
                    <strong>Bank:</strong> Access Bank
                  </p>
                  <p>
                    <strong>Account Name:</strong> Zara's Delight Bakery
                  </p>
                  <p>
                    <strong>Account Number:</strong> 0123456789
                  </p>
                  <p>
                    <strong>Amount:</strong> ₦
                    {order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <p className='text-xs text-blue-700 mt-3'>
                  Please use your order number ({order.orderNumber}) as
                  reference
                </p>
              </div>
            )}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>
              Special Instructions
            </h2>
            <p className='text-gray-600'>{order.specialInstructions}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Link
            href={`/store/track?order=${order.orderNumber}`}
            className='bg-pink-600 text-white py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-center flex items-center justify-center gap-2'>
            Track Order
            <ArrowRight size={20} />
          </Link>

          <Link
            href='/store'
            className='bg-white border-2 border-pink-600 text-pink-600 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors text-center'>
            Order Again
          </Link>
        </div>

        {/* Contact Info */}
        <div className='mt-8 text-center text-gray-600'>
          <p className='mb-2'>Need help with your order?</p>
          <p className='font-semibold text-pink-600'>
            Call us: +234 XXX XXX XXXX
          </p>
          <p className='text-sm mt-1'>Monday - Saturday: 7AM - 7PM</p>
        </div>
      </div>
    </div>
  );
}
