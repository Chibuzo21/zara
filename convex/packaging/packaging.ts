import { api, internal } from "../_generated/api";
import {
  action,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values";

// CREATE PACKAGING TASK
export const createTask = mutation({
  args: {
    productId: v.id("products"),
    productionLogId: v.optional(v.id("productionLog")),
    targetQuantity: v.number(),
    assignedTo: v.optional(v.id("staff")),
    taskDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("packagingTasks", {
      ...args,
      packedQuantity: 0,
      status: "pending",
    });
  },
});

// UPDATE PROGRESS
export const updateProgress = mutation({
  args: {
    taskId: v.id("packagingTasks"),
    packedQuantity: v.number(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const newPacked = args.packedQuantity;
    const isComplete = newPacked >= task.targetQuantity;

    const updates: any = {
      packedQuantity: newPacked,
    };

    // Update status
    if (isComplete) {
      updates.status = "completed";
      updates.completedAt = new Date().toISOString();
    } else if (newPacked > 0 && task.status === "pending") {
      updates.status = "in_progress";
      updates.startedAt = new Date().toISOString();
    }

    await ctx.db.patch(args.taskId, updates);
    return args.taskId;
  },
});

// MARK TASK COMPLETE
export const markComplete = mutation({
  args: {
    taskId: v.id("packagingTasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      status: "completed",
      packedQuantity: task.targetQuantity, // Auto-set to target
      completedAt: new Date().toISOString(),
    });

    return args.taskId;
  },
});

// GET TASKS BY DATE
async function fetchTasksWithDetails(ctx: QueryCtx, date: string) {
  const tasks = await ctx.db
    .query("packagingTasks")
    .withIndex("by_date", (q) => q.eq("taskDate", date))
    .collect();

  return await Promise.all(
    tasks.map(async (task) => {
      const [product, assignedStaff] = await Promise.all([
        ctx.db.get(task.productId),
        task.assignedTo ? ctx.db.get(task.assignedTo) : null,
      ]);

      return {
        ...task,
        product,
        assignedStaff,
      };
    }),
  );
}

// 2. The Internal Query (for use by other files/actions)
export const getByDate = internalQuery({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await fetchTasksWithDetails(ctx, args.date);
  },
});

// 3. The Public Query
export const getToday = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    // We call the TS helper directly. No ctx.runQuery!
    return await fetchTasksWithDetails(ctx, today);
  },
});
export const getMyTasks = query({
  args: {
    staffId: v.id("staff"),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const date = args.date || new Date().toISOString().split("T")[0];

    const tasks = await ctx.db
      .query("packagingTasks")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.staffId))
      .collect();

    const filtered = tasks.filter((t) => t.taskDate === date);

    const withProducts = await Promise.all(
      filtered.map(async (task) => {
        const product = await ctx.db.get(task.productId);
        return { ...task, product };
      }),
    );

    return withProducts;
  },
});

// DELETE TASK
export const deleteTask = mutation({
  args: {
    taskId: v.id("packagingTasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// ADD NOTE TO TASK
export const addNote = mutation({
  args: {
    taskId: v.id("packagingTasks"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const existingNotes = task.notes || "";
    const timestamp = new Date().toLocaleString();
    const newNotes = existingNotes
      ? `${existingNotes}\n[${timestamp}] ${args.note}`
      : `[${timestamp}] ${args.note}`;

    await ctx.db.patch(args.taskId, { notes: newNotes });
    return args.taskId;
  },
});
