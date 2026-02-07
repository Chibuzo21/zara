/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as commission from "../commission.js";
import type * as commissionMutations from "../commissionMutations.js";
import type * as imprest from "../imprest.js";
import type * as imprestMutations from "../imprestMutations.js";
import type * as inventory from "../inventory.js";
import type * as inventoryMutations from "../inventoryMutations.js";
import type * as operations from "../operations.js";
import type * as operationsMutations from "../operationsMutations.js";
import type * as sales from "../sales.js";
import type * as salesMutations from "../salesMutations.js";
import type * as staff from "../staff.js";
import type * as staffMutation from "../staffMutation.js";
import type * as suppliers from "../suppliers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  commission: typeof commission;
  commissionMutations: typeof commissionMutations;
  imprest: typeof imprest;
  imprestMutations: typeof imprestMutations;
  inventory: typeof inventory;
  inventoryMutations: typeof inventoryMutations;
  operations: typeof operations;
  operationsMutations: typeof operationsMutations;
  sales: typeof sales;
  salesMutations: typeof salesMutations;
  staff: typeof staff;
  staffMutation: typeof staffMutation;
  suppliers: typeof suppliers;
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
