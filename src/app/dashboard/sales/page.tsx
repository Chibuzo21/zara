"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { formatCurrency, formatDate } from "../../../../lib/utils";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  Wallet,
  Edit2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SalesDashboardPage() {
  const user = useQuery(api.users.viewer);

  // Get today's date
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().split("T")[0];

  // Queries - use user-specific queries
  const todaySales =
    useQuery(api.sales.sales.getTodayByUser, {
      userId: user?._id,
    }) || [];

  const mySales = (useQuery(api.sales.sales.getByUserAndDateRange, {
    userId: user?._id,
    startDate: monthStartStr,
    endDate: today,
  }) || []) as any[];

  const staff = useQuery(api.staffs.staff.getAll) || [];
  const myStaffRecord = staff.find((s: any) => s._id === user?.staffId);

  const commission = useQuery(api.commission.commission.getAll) || [];
  const myCommission = commission.filter(
    (c: any) => c.staffId === user?.staffId,
  );

  const products = useQuery(api.production.products.getAll) || [];

  // Cash tracking state
  const [showCashForm, setShowCashForm] = useState(false);
  const [cashData, setCashData] = useState({
    openingCash: "",
    closingCash: "",
    notes: "",
  });
  const [cashSubmitted, setCashSubmitted] = useState(false);

  const createOperation = useMutation(
    api.operations.operationsMutations.create,
  );

  // Calculations
  const todayTotal = todaySales.reduce(
    (sum: number, s: any) => sum + s.totalAmount,
    0,
  );
  const todayCash = todaySales
    .filter((s: any) => s.paymentMethod === "cash")
    .reduce((sum: number, s: any) => sum + s.totalAmount, 0);
  const todayTransfer = todaySales
    .filter((s: any) => s.paymentMethod === "transfer")
    .reduce((sum: number, s: any) => sum + s.totalAmount, 0);
  const todayPos = todaySales
    .filter((s: any) => s.paymentMethod === "pos")
    .reduce((sum: number, s: any) => sum + s.totalAmount, 0);

  const monthTotal = mySales.reduce(
    (sum: number, s: any) => sum + s.totalAmount,
    0,
  );
  const todayCommission = myStaffRecord
    ? (todayTotal * myStaffRecord.commissionRate) / 100
    : 0;
  const monthCommission = myStaffRecord
    ? (monthTotal * myStaffRecord.commissionRate) / 100
    : 0;

  const pendingCommission = myCommission
    .filter((c: any) => c.status === "pending")
    .reduce((sum: number, c: any) => sum + c.netCommission, 0);

  const handleCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const openingCash = parseFloat(cashData.openingCash);
    const closingCash = parseFloat(cashData.closingCash);
    const cashVariance = closingCash - (openingCash + todayCash);

    try {
      await createOperation({
        operationDate: today,
        openingCash,
        closingCash,
        totalSales: todayTotal,
        totalExpenses: 0, // Sales staff don't track expenses
        cashVariance,
        notes: cashData.notes || `Submitted by ${user?.fullName}`,
        status: "closed",
      });

      setCashSubmitted(true);
      setShowCashForm(false);
      alert(
        `Cash report submitted!\n\nExpected: ${formatCurrency(openingCash + todayCash)}\nActual: ${formatCurrency(closingCash)}\nVariance: ${formatCurrency(cashVariance)}`,
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        `Failed to submit cash report: ${error.message || "Unknown error"}`,
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome, {user?.fullName}! 👋
          </h1>
          <p className='text-gray-600 mt-1'>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          href='/sales/record'
          className='btn-primary flex items-center gap-2'>
          <Plus size={20} />
          Record Sale
        </Link>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Today's Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(todayTotal)}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {todaySales.length} transactions
              </p>
            </div>
            <ShoppingCart size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Today's Commission</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(todayCommission)}
              </p>
              {myStaffRecord && (
                <p className='text-sm mt-1 text-white/80'>
                  {myStaffRecord.commissionRate}% rate
                </p>
              )}
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-bakery-pink to-bakery-gold text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>This Month</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(monthTotal)}
              </p>
              <p className='text-sm mt-1 text-white/80'>
                {mySales.length} sales
              </p>
            </div>
            <TrendingUp size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Month Commission</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(monthCommission)}
              </p>
              <p className='text-sm mt-1 text-white/80'>Estimated</p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Today's Payment Breakdown
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='p-4 bg-green-50 rounded-lg border-2 border-green-200'>
            <p className='text-sm text-gray-600 mb-1'>💵 Cash</p>
            <p className='text-2xl font-bold text-green-600'>
              {formatCurrency(todayCash)}
            </p>
          </div>
          <div className='p-4 bg-blue-50 rounded-lg border-2 border-blue-200'>
            <p className='text-sm text-gray-600 mb-1'>🏦 Transfer</p>
            <p className='text-2xl font-bold text-blue-600'>
              {formatCurrency(todayTransfer)}
            </p>
          </div>
          <div className='p-4 bg-purple-50 rounded-lg border-2 border-purple-200'>
            <p className='text-sm text-gray-600 mb-1'>💳 POS</p>
            <p className='text-2xl font-bold text-purple-600'>
              {formatCurrency(todayPos)}
            </p>
          </div>
          <div className='p-4 bg-orange-50 rounded-lg border-2 border-orange-200'>
            <p className='text-sm text-gray-600 mb-1'>📝 Total</p>
            <p className='text-2xl font-bold text-bakery-pink'>
              {formatCurrency(todayTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Cash Tracking */}
      <div className='card bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-300'>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
              <Wallet size={24} className='text-yellow-600' />
              Cash Reconciliation
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Track your opening and closing cash
            </p>
          </div>
          {!cashSubmitted && !showCashForm && (
            <button
              onClick={() => setShowCashForm(true)}
              className='btn-secondary flex items-center gap-2'>
              <Edit2 size={16} />
              Enter Cash
            </button>
          )}
        </div>

        {cashSubmitted && (
          <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
            <div className='flex items-center gap-3'>
              <CheckCircle className='text-green-600' size={24} />
              <div>
                <p className='font-semibold text-green-900'>
                  Cash report submitted for today!
                </p>
                <p className='text-sm text-green-700'>
                  Your cash reconciliation has been recorded.
                </p>
              </div>
            </div>
          </div>
        )}

        {showCashForm && (
          <form onSubmit={handleCashSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='label'>Opening Cash (₦) *</label>
                <input
                  type='number'
                  className='input-field'
                  placeholder='10000'
                  step='0.01'
                  min='0'
                  value={cashData.openingCash}
                  onChange={(e) =>
                    setCashData({ ...cashData, openingCash: e.target.value })
                  }
                  required
                />
                <p className='text-xs text-gray-600 mt-1'>
                  Cash you started with
                </p>
              </div>

              <div>
                <label className='label'>Closing Cash (₦) *</label>
                <input
                  type='number'
                  className='input-field'
                  placeholder='25000'
                  step='0.01'
                  min='0'
                  value={cashData.closingCash}
                  onChange={(e) =>
                    setCashData({ ...cashData, closingCash: e.target.value })
                  }
                  required
                />
                <p className='text-xs text-gray-600 mt-1'>Cash you have now</p>
              </div>

              <div className='md:col-span-2'>
                <label className='label'>Notes (Optional)</label>
                <textarea
                  className='input-field'
                  rows={2}
                  placeholder="Any notes about today's cash..."
                  value={cashData.notes}
                  onChange={(e) =>
                    setCashData({ ...cashData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            {cashData.openingCash && cashData.closingCash && (
              <div className='p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm font-semibold text-blue-900 mb-2'>
                  Expected vs Actual:
                </p>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div>
                    <p className='text-blue-700'>Expected Cash:</p>
                    <p className='font-bold text-blue-900'>
                      {formatCurrency(
                        parseFloat(cashData.openingCash) + todayCash,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-700'>Actual Cash:</p>
                    <p className='font-bold text-blue-900'>
                      {formatCurrency(parseFloat(cashData.closingCash))}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-700'>Variance:</p>
                    <p
                      className={`font-bold ${
                        parseFloat(cashData.closingCash) -
                          (parseFloat(cashData.openingCash) + todayCash) >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {formatCurrency(
                        parseFloat(cashData.closingCash) -
                          (parseFloat(cashData.openingCash) + todayCash),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='flex gap-3 justify-end'>
              <button
                type='button'
                onClick={() => setShowCashForm(false)}
                className='btn-outline'>
                Cancel
              </button>
              <button type='submit' className='btn-primary'>
                Submit Cash Report
              </button>
            </div>
          </form>
        )}

        {!showCashForm && !cashSubmitted && (
          <div className='text-center py-6 text-gray-500'>
            <p>No cash report submitted yet for today.</p>
            <p className='text-sm mt-1'>
              Click "Enter Cash" to reconcile your cash drawer.
            </p>
          </div>
        )}
      </div>

      {/* Today's Sales List */}
      <div className='card'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>
            Today's Sales ({todaySales.length})
          </h2>
          <Link
            href='/sales/record'
            className='text-bakery-pink hover:underline text-sm'>
            + Add Sale
          </Link>
        </div>

        {todaySales.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
            <ShoppingCart size={48} className='mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 font-semibold'>
              No sales recorded today
            </p>
            <p className='text-gray-500 text-sm mt-2 mb-4'>
              Click "Record Sale" to log your first sale
            </p>
            <Link
              href='/sales/record'
              className='btn-primary inline-flex items-center gap-2'>
              <Plus size={16} />
              Record First Sale
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='table-header'>Time</th>
                  <th className='table-header'>Product</th>
                  <th className='table-header'>Qty</th>
                  <th className='table-header'>Unit Price</th>
                  <th className='table-header'>Amount</th>
                  <th className='table-header'>Commission</th>
                  <th className='table-header'>Payment</th>
                  <th className='table-header'>Type</th>
                  <th className='table-header'>Customer</th>
                </tr>
              </thead>
              <tbody>
                {todaySales.map((sale: any) => {
                  const saleCommission = myStaffRecord
                    ? (sale.totalAmount * myStaffRecord.commissionRate) / 100
                    : 0;

                  return (
                    <tr key={sale._id} className='hover:bg-gray-50 border-b'>
                      <td className='table-cell text-sm text-gray-600'>
                        {new Date(sale._creationTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className='table-cell font-semibold'>
                        {sale.product?.productName || "Unknown"}
                      </td>
                      <td className='table-cell text-center font-semibold'>
                        {sale.quantitySold}
                      </td>
                      <td className='table-cell'>
                        {formatCurrency(sale.unitPrice)}
                      </td>
                      <td className='table-cell font-bold text-bakery-pink text-lg'>
                        {formatCurrency(sale.totalAmount)}
                      </td>
                      <td className='table-cell font-semibold text-green-600'>
                        {formatCurrency(saleCommission)}
                      </td>
                      <td className='table-cell'>
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase'>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className='table-cell'>
                        <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold'>
                          {sale.saleType === "transport"
                            ? "🚚 Transport"
                            : "🏪 Shop"}
                        </span>
                      </td>
                      <td className='table-cell text-sm text-gray-600'>
                        {sale.customerName || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className='bg-gray-100 font-bold'>
                  <td
                    colSpan={4}
                    className='table-cell text-right text-gray-700'>
                    TOTAL:
                  </td>
                  <td className='table-cell text-bakery-pink text-xl'>
                    {formatCurrency(todayTotal)}
                  </td>
                  <td className='table-cell text-green-600 text-xl'>
                    {formatCurrency(todayCommission)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Pending Commission Alert */}
      {pendingCommission > 0 && (
        <div className='card bg-yellow-50 border-2 border-yellow-200'>
          <div className='flex items-center gap-4'>
            <DollarSign size={48} className='text-yellow-600' />
            <div>
              <p className='font-bold text-yellow-900 text-lg'>
                Pending Commission
              </p>
              <p className='text-3xl font-bold text-yellow-600 mt-1'>
                {formatCurrency(pendingCommission)}
              </p>
              <p className='text-sm text-yellow-700 mt-1'>
                Awaiting approval from management
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
