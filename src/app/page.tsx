"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import type { TopProduct, DashboardStats } from "../../lib/type";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const stats = useQuery(api.sales.getDashboardStats) as
    | DashboardStats
    | undefined;
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date();
  monthStart.setDate(1);

  const topProducts = useQuery(api.sales.getTopProducts, {
    startDate: monthStart.toISOString().split("T")[0],
    endDate: today,
    limit: 5,
  }) as TopProduct[] | undefined;

  if (stats === undefined || topProducts === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Owner Dashboard</h1>
          <p className='text-gray-600 mt-1'>{formatDate(new Date())}</p>
        </div>
        <Link href='/operations/new' className='btn-primary'>
          + New Daily Log
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='stat-card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Today's Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(stats.todaySales)}
              </p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
          <div className='flex items-center mt-4 text-sm'>
            {stats.todayProfit >= 0 ? (
              <>
                <TrendingUp size={16} className='mr-1' />
                <span>Profit: {formatCurrency(stats.todayProfit)}</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className='mr-1' />
                <span>Loss: {formatCurrency(Math.abs(stats.todayProfit))}</span>
              </>
            )}
          </div>
        </div>

        <div className='bg-linear-to-br from-bakery-gold to-yellow-500 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Month Sales</p>
              <p className='text-3xl font-bold mt-2'>
                {formatCurrency(stats.monthSales)}
              </p>
            </div>
            <BarChart size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Active Staff</p>
              <p className='text-3xl font-bold mt-2'>{stats.activeStaff}</p>
            </div>
            <Users size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Low Stock Items</p>
              <p className='text-3xl font-bold mt-2'>{stats.lowStock}</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
          {stats.lowStock > 0 && (
            <Link
              href='/inventory'
              className='flex items-center mt-4 text-sm hover:underline'>
              <AlertTriangle size={16} className='mr-1' />
              <span>View inventory</span>
            </Link>
          )}
        </div>

        <div className='bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Pending Imprest</p>
              <p className='text-3xl font-bold mt-2'>{stats.pendingImprest}</p>
            </div>
            <DollarSign size={40} className='text-white/50' />
          </div>
          {stats.pendingImprest > 0 && (
            <Link
              href='/imprest'
              className='flex items-center mt-4 text-sm hover:underline'>
              View requests
            </Link>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Top Products This Month
        </h2>
        {topProducts && topProducts.length > 0 ? (
          <div className='space-y-3'>
            {topProducts.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {product.productName}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {product.quantity} units sold
                  </p>
                </div>
                <p className='font-bold text-bakery-pink'>
                  {formatCurrency(product.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center py-8'>
            No sales data for this month
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className='card'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Link
            href='/staff'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <Users className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>Manage Staff</p>
          </Link>
          <Link
            href='/inventory'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <Package className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>View Inventory</p>
          </Link>
          <Link
            href='/commission'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <DollarSign className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>Process Commission</p>
          </Link>
          <Link
            href='/reports'
            className='p-4 text-center border-2 border-gray-200 rounded-lg hover:border-bakery-pink hover:bg-bakery-pink-pale transition-colors'>
            <BarChart3 className='mx-auto mb-2 text-bakery-pink' size={32} />
            <p className='font-semibold text-sm'>View Reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
