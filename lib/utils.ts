import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

// Get date ranges
export const getWeekRange = (date: Date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getMonthRange = (date: Date = new Date()) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

// Commission calculation
export const calculateCommission = (
  amount: number,
  baseRate: number,
  tierThreshold?: number,
  tierRate?: number,
): number => {
  if (!tierThreshold || !tierRate || amount <= tierThreshold) {
    return (amount * baseRate) / 100;
  }

  const baseCommission = (tierThreshold * baseRate) / 100;
  const tierCommission = ((amount - tierThreshold) * tierRate) / 100;
  return baseCommission + tierCommission;
};

// WhatsApp report generation
export const generateWhatsAppReport = (data: {
  date: string;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  topProducts?: { productName: string; quantity: number; amount: number }[];
}): string => {
  const { date, totalSales, totalExpenses, netProfit, topProducts } = data;

  let message = `*ZARA'S DELIGHT BAKERY*\n`;
  message += `Daily Report - ${date}\n\n`;
  message += `💰 Total Sales: ${formatCurrency(totalSales)}\n`;
  message += `📊 Total Expenses: ${formatCurrency(totalExpenses)}\n`;
  message += `✅ Net Profit: ${formatCurrency(netProfit)}\n`;

  if (topProducts && topProducts.length > 0) {
    message += `\n*Top Products:*\n`;
    topProducts.forEach((product, index) => {
      message += `${index + 1}. ${product.productName} - ${product.quantity} units (${formatCurrency(product.amount)})\n`;
    });
  }

  return encodeURIComponent(message);
};

export const openWhatsApp = (phoneNumber: string, message: string) => {
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
};

// Stock status checker
export const getStockStatus = (
  currentStock: number,
  reorderLevel: number,
): {
  status: "good" | "low" | "critical";
  color: string;
} => {
  if (currentStock <= 0) {
    return { status: "critical", color: "text-red-600" };
  }
  if (currentStock <= reorderLevel) {
    return { status: "low", color: "text-yellow-600" };
  }
  return { status: "good", color: "text-green-600" };
};

// Generate unique ID
export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Percentage calculation
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Chart color palette
export const chartColors = {
  primary: "#C71585",
  secondary: "#FFD700",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};
