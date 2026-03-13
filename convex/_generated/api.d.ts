/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as Myauth from "../Myauth.js";
import type * as attendance from "../attendance.js";
import type * as auth from "../auth.js";
import type * as commission_commission from "../commission/commission.js";
import type * as commission_commissionMutations from "../commission/commissionMutations.js";
import type * as customerOrders from "../customerOrders.js";
import type * as debtors_debtorMutations from "../debtors/debtorMutations.js";
import type * as debtors_debtorQueries from "../debtors/debtorQueries.js";
import type * as http from "../http.js";
import type * as imprest_imprest from "../imprest/imprest.js";
import type * as imprest_imprestMutations from "../imprest/imprestMutations.js";
import type * as inventory_inventory from "../inventory/inventory.js";
import type * as inventory_inventoryMutations from "../inventory/inventoryMutations.js";
import type * as operations_operations from "../operations/operations.js";
import type * as operations_operationsMutations from "../operations/operationsMutations.js";
import type * as packaging_packaging from "../packaging/packaging.js";
import type * as production_production from "../production/production.js";
import type * as production_products from "../production/products.js";
import type * as production_productsMutations from "../production/productsMutations.js";
import type * as sales_sales from "../sales/sales.js";
import type * as sales_salesMutations from "../sales/salesMutations.js";
import type * as staffs_penalties from "../staffs/penalties.js";
import type * as staffs_staff from "../staffs/staff.js";
import type * as staffs_staffMutation from "../staffs/staffMutation.js";
import type * as stock_stockMutations from "../stock/stockMutations.js";
import type * as stock_stockQueries from "../stock/stockQueries.js";
import type * as suppliers from "../suppliers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  Myauth: typeof Myauth;
  attendance: typeof attendance;
  auth: typeof auth;
  "commission/commission": typeof commission_commission;
  "commission/commissionMutations": typeof commission_commissionMutations;
  customerOrders: typeof customerOrders;
  "debtors/debtorMutations": typeof debtors_debtorMutations;
  "debtors/debtorQueries": typeof debtors_debtorQueries;
  http: typeof http;
  "imprest/imprest": typeof imprest_imprest;
  "imprest/imprestMutations": typeof imprest_imprestMutations;
  "inventory/inventory": typeof inventory_inventory;
  "inventory/inventoryMutations": typeof inventory_inventoryMutations;
  "operations/operations": typeof operations_operations;
  "operations/operationsMutations": typeof operations_operationsMutations;
  "packaging/packaging": typeof packaging_packaging;
  "production/production": typeof production_production;
  "production/products": typeof production_products;
  "production/productsMutations": typeof production_productsMutations;
  "sales/sales": typeof sales_sales;
  "sales/salesMutations": typeof sales_salesMutations;
  "staffs/penalties": typeof staffs_penalties;
  "staffs/staff": typeof staffs_staff;
  "staffs/staffMutation": typeof staffs_staffMutation;
  "stock/stockMutations": typeof stock_stockMutations;
  "stock/stockQueries": typeof stock_stockQueries;
  suppliers: typeof suppliers;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
