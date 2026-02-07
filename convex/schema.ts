import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // STAFF MANAGEMENT
  // ============================================
  staff: defineTable({
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("owner"),
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
      v.literal("admin"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    dateHired: v.string(), // ISO date string
    baseSalary: v.optional(v.number()),
    commissionRate: v.number(),
  })
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  staffPerformance: defineTable({
    staffId: v.id("staff"),
    reviewDate: v.string(),
    performanceScore: v.number(), // 0-5
    attendanceScore: v.number(), // 0-5
    qualityScore: v.number(), // 0-5
    notes: v.optional(v.string()),
    reviewedBy: v.id("staff"),
  }).index("by_staff", ["staffId"]),

  // ============================================
  // INVENTORY MANAGEMENT
  // ============================================
  suppliers: defineTable({
    supplierName: v.string(),
    contactPerson: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
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
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

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
    loggedBy: v.optional(v.id("staff")),
    transactionDate: v.string(), // ISO date string
  })
    .index("by_item", ["itemId"])
    .index("by_date", ["transactionDate"]),

  // ============================================
  // PRODUCTS & PRODUCTION
  // ============================================
  products: defineTable({
    productName: v.string(),
    category: v.union(
      v.literal("bread"),
      v.literal("cake"),
      v.literal("pastry"),
      v.literal("cookies"),
      v.literal("custom"),
    ),
    basePrice: v.number(),
    productionCost: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

  productionLog: defineTable({
    productId: v.id("products"),
    quantityProduced: v.number(),
    productionDate: v.string(),
    productionStaffId: v.optional(v.id("staff")),
    packagingStaffId: v.optional(v.id("staff")),
    qualityCheck: v.boolean(),
    wasteQuantity: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_date", ["productionDate"]),

  // ============================================
  // SALES & TRANSACTIONS
  // ============================================
  sales: defineTable({
    saleDate: v.string(),
    productId: v.id("products"),
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
  })
    .index("by_date", ["saleDate"])
    .index("by_product", ["productId"])
    .index("by_staff", ["salesStaffId"]),

  // ============================================
  // COMMISSION SYSTEM
  // ============================================
  commissionConfig: defineTable({
    role: v.union(
      v.literal("production"),
      v.literal("packaging"),
      v.literal("sales"),
    ),
    baseRate: v.number(),
    tierThreshold: v.optional(v.number()),
    tierRate: v.optional(v.number()),
    effectiveFrom: v.string(),
    effectiveTo: v.optional(v.string()),
  }).index("by_role", ["role"]),

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
    approvedBy: v.optional(v.id("staff")),
    approvedAt: v.optional(v.string()),
  })
    .index("by_staff", ["staffId"])
    .index("by_status", ["status"])
    .index("by_period", ["periodStart", "periodEnd"]),

  commissionDeductions: defineTable({
    commissionRecordId: v.id("commissionRecords"),
    deductionType: v.union(
      v.literal("lateness"),
      v.literal("absence"),
      v.literal("quality_issue"),
      v.literal("shortage"),
      v.literal("other"),
    ),
    amount: v.number(),
    description: v.optional(v.string()),
    appliedBy: v.optional(v.id("staff")),
  }).index("by_record", ["commissionRecordId"]),

  // ============================================
  // IMPREST MANAGEMENT
  // ============================================
  imprestRequests: defineTable({
    requestNumber: v.string(),
    requestedBy: v.id("staff"),
    amountRequested: v.number(),
    purpose: v.string(),
    requestDate: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("disbursed"),
      v.literal("retired"),
      v.literal("rejected"),
    ),
    approvedBy: v.optional(v.id("staff")),
    approvedDate: v.optional(v.string()),
    disbursedDate: v.optional(v.string()),
    retirementDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_request_number", ["requestNumber"])
    .index("by_status", ["status"])
    .index("by_staff", ["requestedBy"]),

  imprestRetirements: defineTable({
    imprestRequestId: v.id("imprestRequests"),
    itemDescription: v.string(),
    amountSpent: v.number(),
    receiptNumber: v.optional(v.string()),
  }).index("by_request", ["imprestRequestId"]),

  // ============================================
  // DAILY OPERATIONS LOG
  // ============================================
  dailyOperations: defineTable({
    operationDate: v.string(),
    openingCash: v.number(),
    closingCash: v.number(),
    totalSales: v.number(),
    totalExpenses: v.number(),
    cashVariance: v.number(),
    loggedBy: v.optional(v.id("staff")),
    notes: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("closed")),
  })
    .index("by_date", ["operationDate"])
    .index("by_status", ["status"]),

  dailyExpenses: defineTable({
    dailyOperationId: v.id("dailyOperations"),
    expenseCategory: v.union(
      v.literal("utilities"),
      v.literal("transport"),
      v.literal("maintenance"),
      v.literal("supplies"),
      v.literal("other"),
    ),
    amount: v.number(),
    description: v.optional(v.string()),
    receiptNumber: v.optional(v.string()),
  }).index("by_operation", ["dailyOperationId"]),
});
