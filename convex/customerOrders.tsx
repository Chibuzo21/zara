import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD${year}${month}${day}${random}`;
}

// CREATE ORDER (Public - no auth required)
export const createOrder = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    customerPhone: v.string(),
    deliveryAddress: v.optional(v.string()),
    orderType: v.union(v.literal("pickup"), v.literal("delivery")),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    totalAmount: v.number(),
    paymentMethod: v.union(
      v.literal("cash_on_delivery"),
      v.literal("cash_on_pickup"),
      v.literal("transfer"),
      v.literal("online"),
    ),
    deliveryDate: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    specialInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderNumber = generateOrderNumber();
    const orderDate = new Date().toISOString().split("T")[0];

    const orderId = await ctx.db.insert("customerOrders", {
      orderNumber,
      ...args,
      orderDate,
      status: "pending",
      paymentStatus: "pending",
    });

    return { orderId, orderNumber };
  },
});

// GET PUBLIC PRODUCTS (for storefront)
export const getPublicProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return products;
  },
});

// GET ORDER BY NUMBER (for customer to track)
export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("customerOrders")
      .withIndex("by_order_number", (q) =>
        q.eq("orderNumber", args.orderNumber),
      )
      .first();

    return order;
  },
});

// GET ALL ORDERS (admin only)
export const getAllOrders = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("preparing"),
        v.literal("ready"),
        v.literal("out_for_delivery"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let orders;

    if (args.status) {
      orders = await ctx.db
        .query("customerOrders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      orders = await ctx.db.query("customerOrders").order("desc").take(100);
    }

    return orders;
  },
});

// GET TODAY'S ORDERS
export const getTodaysOrders = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const orders = await ctx.db
      .query("customerOrders")
      .withIndex("by_date", (q) => q.eq("orderDate", today))
      .collect();

    return orders;
  },
});

// UPDATE ORDER STATUS
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("customerOrders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("out_for_delivery"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    processedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      processedBy: args.processedBy,
    });
    return args.orderId;
  },
});

// UPDATE PAYMENT STATUS
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("customerOrders"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      paymentStatus: args.paymentStatus,
    });
    return args.orderId;
  },
});

// GET ORDER STATS
export const getOrderStats = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const todayOrders = await ctx.db
      .query("customerOrders")
      .withIndex("by_date", (q) => q.eq("orderDate", today))
      .collect();

    const pending = todayOrders.filter((o) => o.status === "pending").length;
    const confirmed = todayOrders.filter(
      (o) => o.status === "confirmed",
    ).length;
    const preparing = todayOrders.filter(
      (o) => o.status === "preparing",
    ).length;
    const completed = todayOrders.filter(
      (o) => o.status === "completed",
    ).length;
    const revenue = todayOrders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      todayTotal: todayOrders.length,
      pending,
      confirmed,
      preparing,
      completed,
      revenue,
    };
  },
});
