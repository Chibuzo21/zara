import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// BAKERY LOCATION - IMPORTANT: Update these with your actual bakery coordinates!
// To get coordinates: Open Google Maps, right-click on your bakery, click the coordinates
const BAKERY_LAT = 5.147023; // ← Replace with your bakery's latitude
const BAKERY_LNG = 7.343916; // ← Replace with your bakery's longitude
const ALLOWED_RADIUS_METERS = 100; // Staff must be within 100 meters to clock in

// Calculate distance between two GPS coordinates (Haversine formula)
function getDistanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if current time is "late" (after 9:00 AM)
function isLate(timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours > 9 || (hours === 9 && minutes > 0);
}

// CLOCK IN
export const clockIn = mutation({
  args: {
    staffId: v.id("staff"),
    userId: v.optional(v.id("users")),
    latitude: v.number(),
    longitude: v.number(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already clocked in today
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", args.staffId).eq("date", args.date),
      )
      .first();

    if (existing?.clockInTime) {
      throw new Error("Already clocked in today!");
    }

    // Calculate distance from bakery
    const distance = getDistanceInMeters(
      args.latitude,
      args.longitude,
      BAKERY_LAT,
      BAKERY_LNG,
    );

    const locationVerified = distance <= ALLOWED_RADIUS_METERS;

    if (!locationVerified) {
      throw new Error(
        `You are ${Math.round(distance)} meters from the bakery. ` +
          `You must be within ${ALLOWED_RADIUS_METERS} meters to clock in.`,
      );
    }

    // Determine status (present or late)
    const status = isLate(args.time) ? "late" : "present";

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        clockInTime: args.time,
        clockInLat: args.latitude,
        clockInLng: args.longitude,
        distanceFromBakery: Math.round(distance),
        locationVerified,
        status,
      });
      return existing._id;
    } else {
      // Create new attendance record
      return await ctx.db.insert("attendance", {
        staffId: args.staffId,
        userId: args.userId,
        date: args.date,
        clockInTime: args.time,
        clockInLat: args.latitude,
        clockInLng: args.longitude,
        distanceFromBakery: Math.round(distance),
        locationVerified,
        status,
      });
    }
  },
});

// CLOCK OUT
export const clockOut = mutation({
  args: {
    staffId: v.id("staff"),
    latitude: v.number(),
    longitude: v.number(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    // Find today's attendance record
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", args.staffId).eq("date", args.date),
      )
      .first();

    if (!existing) {
      throw new Error("No clock-in found for today. Clock in first!");
    }

    if (existing.clockOutTime) {
      throw new Error("Already clocked out today!");
    }

    const distance = getDistanceInMeters(
      args.latitude,
      args.longitude,
      BAKERY_LAT,
      BAKERY_LNG,
    );

    await ctx.db.patch(existing._id, {
      clockOutTime: args.time,
      clockOutLat: args.latitude,
      clockOutLng: args.longitude,
    });

    return existing._id;
  },
});

// UPDATE BAKERY LOCATION (owner sets this once)
export const setBakeryLocation = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    // Store in a config-like way
    // For now just return the values so owner knows it's set
    return {
      message: `Bakery location set to: ${args.latitude}, ${args.longitude}`,
      note: "Update BAKERY_LAT and BAKERY_LNG in attendance.ts with these values",
      latitude: args.latitude,
      longitude: args.longitude,
    };
  },
});

// MARK ABSENT (owner can mark staff as absent)
export const markAbsent = mutation({
  args: {
    staffId: v.id("staff"),
    date: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", args.staffId).eq("date", args.date),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: "absent", notes: args.notes });
      return existing._id;
    } else {
      return await ctx.db.insert("attendance", {
        staffId: args.staffId,
        date: args.date,
        status: "absent",
        locationVerified: false,
        notes: args.notes,
      });
    }
  },
});

// GET TODAY'S ATTENDANCE (all staff)
export const getToday = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const records = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    const withStaff = await Promise.all(
      records.map(async (record) => {
        const staff = await ctx.db.get(record.staffId);
        return { ...record, staff };
      }),
    );

    return withStaff;
  },
});

// GET MY ATTENDANCE (for staff member)
export const getMyAttendance = query({
  args: {
    staffId: v.id("staff"),
    month: v.string(), // "2026-02"
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("attendance")
      .withIndex("by_staff", (q) => q.eq("staffId", args.staffId))
      .collect();

    return records.filter((r) => r.date.startsWith(args.month));
  },
});

// GET MY TODAY STATUS
export const getMyTodayStatus = query({
  args: {
    staffId: v.id("staff"),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    return await ctx.db
      .query("attendance")
      .withIndex("by_staff_and_date", (q) =>
        q.eq("staffId", args.staffId).eq("date", today),
      )
      .first();
  },
});

// GET ATTENDANCE REPORT (owner view - all staff for a date range)
export const getReport = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    staffId: v.optional(v.id("staff")),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("attendance")
      .withIndex("by_date")
      .collect();

    const filtered = records.filter(
      (r) =>
        r.date >= args.startDate &&
        r.date <= args.endDate &&
        (args.staffId ? r.staffId === args.staffId : true),
    );

    const withStaff = await Promise.all(
      filtered.map(async (record) => {
        const staff = await ctx.db.get(record.staffId);
        return { ...record, staff };
      }),
    );

    return withStaff.sort((a, b) => b.date.localeCompare(a.date));
  },
});
