"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  formatCurrency,
  formatDate,
  generateWhatsAppReport,
  openWhatsApp,
  getWeekRange,
  getMonthRange,
} from "../../../lib/utils";
import { MessageCircle, DollarSign, TrendingUp, Package } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ReportPeriod = "today" | "week" | "month" | "custom";

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate date range based on period
  let dateStart = "";
  let dateEnd = "";

  switch (period) {
    case "today":
      dateStart = dateEnd = new Date().toISOString().split("T")[0];
      break;
    case "week":
      const weekRange = getWeekRange();
      dateStart = weekRange.start.toISOString().split("T")[0];
      dateEnd = weekRange.end.toISOString().split("T")[0];
      break;
    case "month":
      const monthRange = getMonthRange();
      dateStart = monthRange.start.toISOString().split("T")[0];
      dateEnd = monthRange.end.toISOString().split("T")[0];
      break;
    case "custom":
      dateStart = startDate;
      dateEnd = endDate;
      break;
  }

  const sales = useQuery(
    api.sales.getByDateRange,
    dateStart && dateEnd ? { startDate: dateStart, endDate: dateEnd } : "skip",
  );

  const topProducts = useQuery(
    api.sales.getTopProducts,
    dateStart && dateEnd
      ? { startDate: dateStart, endDate: dateEnd, limit: 5 }
      : "skip",
  );

  const sendWhatsAppReport = () => {
    if (!sales || !topProducts) return;

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = 0; // You'd get this from operations
    const netProfit = totalSales - totalExpenses;

    const message = generateWhatsAppReport({
      date:
        period === "today"
          ? "Today"
          : `${formatDate(dateStart)} - ${formatDate(dateEnd)}`,
      totalSales,
      totalExpenses,
      netProfit,
      topProducts: topProducts || [],
    });

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

    if (!phoneNumber) {
      alert(
        "Please set NEXT_PUBLIC_WHATSAPP_NUMBER in your environment variables",
      );
      return;
    }

    openWhatsApp(phoneNumber, message);
  };

  const COLORS = ["#C71585", "#FFD700", "#10B981", "#3B82F6", "#F59E0B"];

  if (sales === undefined || topProducts === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const totalSales =
    sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
  const salesCount = sales?.length || 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Reports & Analytics
          </h1>
          <p className='text-gray-600 mt-1'>
            Business insights and performance metrics
          </p>
        </div>
        <button onClick={sendWhatsAppReport} className='btn-primary'>
          <MessageCircle size={20} className='inline mr-2' />
          Send to WhatsApp
        </button>
      </div>

      {/* Period Selector */}
      <div className='card'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='md:col-span-4'>
            <label className='label'>Report Period</label>
            <div className='flex gap-2'>
              <button
                onClick={() => setPeriod("today")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === "today"
                    ? "bg-bakery-pink text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Today
              </button>
              <button
                onClick={() => setPeriod("week")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === "week"
                    ? "bg-bakery-pink text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                This Week
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === "month"
                    ? "bg-bakery-pink text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                This Month
              </button>
              <button
                onClick={() => setPeriod("custom")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === "custom"
                    ? "bg-bakery-pink text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Custom
              </button>
            </div>
          </div>

          {period === "custom" && (
            <>
              <div className='md:col-span-2'>
                <label className='label'>Start Date</label>
                <input
                  type='date'
                  className='input-field'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className='md:col-span-2'>
                <label className='label'>End Date</label>
                <input
                  type='date'
                  className='input-field'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='stat-card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(totalSales)}
              </p>
              <p className='text-sm mt-2 text-white/80'>
                {salesCount} transactions
              </p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total Expenses</p>
              <p className='text-3xl font-bold mt-2'>{formatCurrency(0)}</p>
            </div>
            <TrendingUp size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Net Profit</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(totalSales)}
              </p>
              <p className='text-sm mt-2 text-white/80'>
                Margin: {totalSales > 0 ? "100" : "0"}%
              </p>
            </div>
            <TrendingUp size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Commission Paid</p>
              <p className='text-3xl font-bold mt-2'>{formatCurrency(0)}</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Top Selling Products
        </h2>
        <div className='space-y-3'>
          {topProducts && topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-bakery-pink text-white rounded-full flex items-center justify-center font-bold'>
                    {index + 1}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      {product.productName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {product.quantity} units sold
                    </p>
                  </div>
                </div>
                <p className='font-bold text-bakery-pink text-lg'>
                  {formatCurrency(product.amount)}
                </p>
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-center py-8'>
              No sales data for this period
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
