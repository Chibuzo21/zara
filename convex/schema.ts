import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // AUTH TABLES
  ...authTables,
  // Replace the users table definition entirely
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Your custom fields
    fullName: v.optional(v.string()),
    role: v.optional(v.string()),
    staffId: v.optional(v.id("staff")),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("staffId", ["staffId"]),
  // STAFF TABLES
  staff: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("transport_sales"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(),
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
    userId: v.optional(v.id("users")), // ✅ add this
  })
    .index("by_role", ["role"])
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("userId", ["userId"]), // ✅ add this

  staffPerformance: defineTable({
    staffId: v.id("staff"),
    reviewDate: v.string(),
    performanceScore: v.number(),
    feedback: v.optional(v.string()),
    reviewedBy: v.optional(v.id("staff")),
  }).index("by_staff", ["staffId"]),

  // SUPPLIER & INVENTORY
  suppliers: defineTable({
    supplierName: v.string(),
    contactPerson: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }).index("by_status", ["status"]),

  inventoryItems: defineTable({
    itemName: v.string(),
    category: v.union(
      v.literal("flour"),
      v.literal("sugar"),
      v.literal("dairy"),
      v.literal("eggs"),
      v.literal("flavoring"),
      v.literal("packaging"),
      v.literal("other"),
    ),
    unit: v.string(),
    reorderLevel: v.number(),
    currentStock: v.number(),
    unitCost: v.number(),
    supplierId: v.optional(v.id("suppliers")),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }).index("by_status", ["status"]),

  inventoryTransactions: defineTable({
    itemId: v.id("inventoryItems"),
    transactionType: v.union(
      v.literal("purchase"),
      v.literal("usage"),
      v.literal("waste"),
      v.literal("adjustment"),
    ),
    quantity: v.number(),
    unitCost: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    supplierId: v.optional(v.id("suppliers")),
    notes: v.optional(v.string()),
    loggedBy: v.optional(v.id("users")),
    transactionDate: v.string(),
  })
    .index("by_item", ["itemId"])
    .index("by_date", ["transactionDate"]),

  // PRODUCTS & PRODUCTION
  products: defineTable({
    productName: v.string(),
    category: v.string(),
    basePrice: v.number(),
    productionCost: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  }),

  productionLog: defineTable({
    productId: v.id("products"),
    quantityProduced: v.number(),
    productionDate: v.string(),
    staffId: v.optional(v.id("staff")),
    notes: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_date", ["productionDate"]),

  // SALES
  sales: defineTable({
    saleDate: v.string(),
    productId: v.id("products"),
    productName: v.optional(v.string()),
    quantitySold: v.number(),
    unitPrice: v.number(),
    totalAmount: v.number(),
    salesStaffId: v.optional(v.id("staff")),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("transfer"),
      v.literal("pos"),
      v.literal("credit"),
    ),
    customerName: v.optional(v.string()),
    notes: v.optional(v.string()),
    recordedBy: v.optional(v.id("users")),
    saleType: v.optional(v.union(v.literal("shop"), v.literal("transport"))),
    location: v.optional(v.string()),
  })
    .index("by_date", ["saleDate"])
    .index("by_product", ["productId"])
    .index("by_staff", ["salesStaffId"])
    .index("by_recorded_by", ["recordedBy"]),

  // COMMISSION
  commissionConfig: defineTable({
    role: v.string(),
    baseRate: v.number(),
    tierThreshold: v.optional(v.number()),
    tierRate: v.optional(v.number()),
  }),

  commissionRecords: defineTable({
    staffId: v.id("staff"),
    periodStart: v.string(),
    periodEnd: v.string(),
    grossCommission: v.number(),
    deductions: v.number(),
    penalties: v.number(),
    netCommission: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("paid"),
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.string()),
  }).index("by_staff", ["staffId"]),

  commissionDeductions: defineTable({
    commissionId: v.id("commissionRecords"),
    deductionType: v.string(),
    amount: v.number(),
    reason: v.optional(v.string()),
  }),

  // IMPREST
  imprestRequests: defineTable({
    requestNumber: v.string(),
    requestedBy: v.id("staff"),
    amountRequested: v.number(),
    purpose: v.string(),
    requestDate: v.string(),
    approvedBy: v.optional(v.id("users")),
    approvedDate: v.optional(v.string()),
    disbursedDate: v.optional(v.string()),
    retirementDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("disbursed"),
      v.literal("retired"),
      v.literal("rejected"),
    ),
  })
    .index("by_status", ["status"])
    .index("by_requested_by", ["requestedBy"]),

  imprestRetirements: defineTable({
    imprestId: v.id("imprestRequests"),
    amountSpent: v.number(),
    receipts: v.optional(v.string()),
    retirementDate: v.string(),
    notes: v.optional(v.string()),
  }),

  // OPERATIONS
  dailyOperations: defineTable({
    operationDate: v.string(),
    openingCash: v.number(),
    closingCash: v.number(),
    totalSales: v.number(),
    totalExpenses: v.number(),
    cashVariance: v.number(),
    notes: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("closed")),
    loggedBy: v.optional(v.id("users")),
  }).index("by_date", ["operationDate"]),

  dailyExpenses: defineTable({
    operationId: v.id("dailyOperations"),
    expenseCategory: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
  }),

  // PACKAGING
  packagingTasks: defineTable({
    productId: v.id("products"),
    productionLogId: v.optional(v.id("productionLog")),
    targetQuantity: v.number(),
    packedQuantity: v.number(),
    assignedTo: v.optional(v.id("staff")),
    taskDate: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_date", ["taskDate"])
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"]),

  // ATTENDANCE
  attendance: defineTable({
    staffId: v.id("staff"),
    userId: v.optional(v.id("users")),
    date: v.string(),
    clockInTime: v.optional(v.string()),
    clockOutTime: v.optional(v.string()),
    clockInLat: v.optional(v.number()),
    clockInLng: v.optional(v.number()),
    clockOutLat: v.optional(v.number()),
    clockOutLng: v.optional(v.number()),
    distanceFromBakery: v.optional(v.number()),
    status: v.union(
      v.literal("present"),
      v.literal("absent"),
      v.literal("late"),
      v.literal("half_day"),
    ),
    locationVerified: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_staff", ["staffId"])
    .index("by_date", ["date"])
    .index("by_staff_and_date", ["staffId", "date"]),
  // ONLINE STORE - CUSTOMER ORDERS
  customerOrders: defineTable({
    orderNumber: v.string(),
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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("out_for_delivery"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    paymentMethod: v.union(
      v.literal("cash_on_delivery"),
      v.literal("cash_on_pickup"),
      v.literal("transfer"),
      v.literal("online"),
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
    ),
    orderDate: v.string(),
    deliveryDate: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    specialInstructions: v.optional(v.string()),
    processedBy: v.optional(v.id("users")),
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_date", ["orderDate"])
    .index("by_customer_phone", ["customerPhone"]),

  dailyStock: defineTable({
    staffId: v.id("staff"),
    recordedBy: v.id("users"),
    entryDate: v.string(), // "YYYY-MM-DD"
    productId: v.id("products"),
    productName: v.optional(v.string()),
    openingQty: v.number(),
    damagedQty: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_date", ["entryDate"])
    .index("by_staff", ["staffId"])
    .index("by_staff_and_date", ["staffId", "entryDate"])
    .index("by_product_and_date", ["productId", "entryDate"]),

  debtorLedger: defineTable({
    saleId: v.id("sales"), // the credit sale that created this debt
    salesStaffId: v.id("staff"), // staff who made the sale
    recordedBy: v.id("users"), // user who recorded the sale
    customerName: v.string(), // debtor name (copied from sale)
    saleDate: v.string(), // "YYYY-MM-DD"
    originalAmount: v.number(), // full amount owed at time of sale
    amountPaid: v.number(), // cumulative amount paid so far
    balance: v.number(), // originalAmount - amountPaid
    status: v.union(
      v.literal("outstanding"), // nothing paid yet
      v.literal("partial"), // some paid, still owes
      v.literal("settled"), // fully paid
    ),
    settledDate: v.optional(v.string()), // "YYYY-MM-DD" when fully settled
    notes: v.optional(v.string()),
  })
    .index("by_staff", ["salesStaffId"])
    .index("by_sale", ["saleId"])
    .index("by_status", ["status"])
    .index("by_customer", ["customerName"])
    .index("by_staff_and_status", ["salesStaffId", "status"]),

  // Each repayment row now links to a debtorLedger entry.
  // REPLACE your existing debtorRepayments table definition with this one.
  debtorRepayments: defineTable({
    debtorLedgerId: v.id("debtorLedger"), // which debt this repayment reduces
    staffId: v.id("staff"), // staff receiving the payment
    recordedBy: v.id("users"),
    repaymentDate: v.string(), // "YYYY-MM-DD"
    debtorName: v.string(), // denormalised for easy display
    amount: v.number(), // amount paid in this repayment
    note: v.optional(v.string()),
    balanceAfter: v.number(), // balance remaining after this payment
  })
    .index("by_date", ["repaymentDate"])
    .index("by_staff", ["staffId"])
    .index("by_staff_and_date", ["staffId", "repaymentDate"])
    .index("by_ledger", ["debtorLedgerId"]),
  // ─── ADD THIS TABLE inside defineSchema({...}) in convex/schema.ts ───────────
  // Place it after the attendance table block

  staffPenalties: defineTable({
    staffId: v.id("staff"),
    amount: v.number(),
    reason: v.string(),
    category: v.union(
      v.literal("lateness"),
      v.literal("misconduct"),
      v.literal("damage"),
      v.literal("absence"),
      v.literal("other"),
    ),
    penaltyDate: v.string(), // "YYYY-MM-DD"
    recordedBy: v.id("users"),
    notes: v.optional(v.string()),
  })
    .index("by_staff", ["staffId"])
    .index("by_date", ["penaltyDate"])
    .index("by_staff_and_date", ["staffId", "penaltyDate"]),
});
