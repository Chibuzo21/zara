import { query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
// Get today's sales for a specific staff member (by userId)
export const getTodayByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.eq("saleDate", today))
      .collect();

    // Filter by user if provided, otherwise return all today's sales
    const filtered = args.userId
      ? sales.filter((s) => s.recordedBy === args.userId)
      : sales;

    // Join with product details
    const withProducts = await Promise.all(
      filtered.map(async (sale) => {
        const product = await ctx.db.get(sale.productId);
        return { ...sale, product };
      }),
    );

    return withProducts;
  },
});

// Get sales by date range for a specific user
export const getByUserAndDateRange = query({
  args: {
    userId: v.optional(v.id("users")),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const sales = await ctx.db.query("sales").withIndex("by_date").collect();

    const filtered = sales.filter(
      (s) =>
        s.saleDate >= args.startDate &&
        s.saleDate <= args.endDate &&
        (args.userId ? s.recordedBy === args.userId : true),
    );

    const withProducts = await Promise.all(
      filtered.map(async (sale) => {
        const product = await ctx.db.get(sale.productId);
        return { ...sale, product };
      }),
    );

    return withProducts;
  },
});

// Get sales by date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const sales = await ctx.db.query("sales").withIndex("by_date").collect();

    return sales.filter(
      (sale) =>
        sale.saleDate >= args.startDate && sale.saleDate <= args.endDate,
    );
  },
});

// Get sales with product details

// Get today's sales
export const getToday = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.eq("saleDate", today))
      .collect();

    return sales;
  },
});

// Get sales with product details
export const getWithProducts = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let sales = await ctx.db.query("sales").order("desc").take(100);

    if (args.startDate && args.endDate) {
      sales = sales.filter(
        (sale) =>
          sale.saleDate >= args.startDate! && sale.saleDate <= args.endDate!,
      );
    }

    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await ctx.db.get(sale.productId);
        const staff = sale.salesStaffId
          ? await ctx.db.get(sale.salesStaffId)
          : null;
        return { ...sale, product, staff };
      }),
    );

    return salesWithProducts;
  },
});

// Dashboard stats
export const getDashboardStats = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    // Today's sales
    const todaySales = await ctx.db
      .query("sales")
      .withIndex("by_date", (q) => q.eq("saleDate", today))
      .collect();

    const todayTotal = todaySales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );

    // Active staff count
    const activeStaff = await ctx.db
      .query("staff")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Low stock items
    const inventory = await ctx.db
      .query("inventoryItems")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const lowStock = inventory.filter(
      (item) => item.currentStock <= item.reorderLevel,
    );

    // Pending imprest
    const pendingImprest = await ctx.db
      .query("imprestRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Today's operations
    const todayOps = await ctx.db
      .query("dailyOperations")
      .withIndex("by_date", (q) => q.eq("operationDate", today))
      .first();

    const todayProfit = todayOps
      ? todayOps.totalSales - todayOps.totalExpenses
      : 0;

    // Month sales - get first day of month
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split("T")[0];

    const monthSales = await ctx.db.query("sales").collect();
    const monthTotal = monthSales
      .filter((sale) => sale.saleDate >= monthStartStr)
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      todaySales: todayTotal,
      monthSales: monthTotal,
      activeStaff: activeStaff.length,
      lowStock: lowStock.length,
      pendingImprest: pendingImprest.length,
      todayProfit,
    };
  },
});

// Top products
export const getTopProducts = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const sales = await ctx.db.query("sales").collect();

    const filtered = sales.filter(
      (sale) =>
        sale.saleDate >= args.startDate && sale.saleDate <= args.endDate,
    );

    // Group by product
    const productMap = new Map<
      string,
      { productId: string; quantity: number; amount: number }
    >();

    filtered.forEach((sale) => {
      const key = sale.productId;
      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        existing.quantity += sale.quantitySold;
        existing.amount += sale.totalAmount;
      } else {
        productMap.set(key, {
          productId: sale.productId,
          quantity: sale.quantitySold,
          amount: sale.totalAmount,
        });
      }
    });

    // Get product details and sort
    const products = await Promise.all(
      Array.from(productMap.values()).map(async (item) => {
        const product = await ctx.db.get(item?.productId as Id<"products">);
        return {
          productName: product?.productName,
          quantity: item.quantity,
          amount: item.amount,
        };
      }),
    );

    products.sort((a, b) => b.amount - a.amount);

    return products.slice(0, args.limit || 5);
  },
});
