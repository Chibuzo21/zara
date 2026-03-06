"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useMemo } from "react";
import { ShieldX } from "lucide-react";

import {
  AttendanceRecord,
  StaffMember,
  AttendanceSummary,
  ReportFilters,
} from "./types";
import AttendanceSummaryCards from "./components/AttendanceSummaryCard";
import AttendanceFilters from "./components/AttendanceFilters";
import AttendanceTable from "./components/AttendanceTable";
import AbsentStaffList from "./components/AbsentStaffList";

export default function AttendanceReportPage() {
  const user = useQuery(api.users.viewer);
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState<ReportFilters>({
    startDate: today,
    endDate: today,
    selectedStaff: "",
  });

  const todayAttendance = (useQuery(api.attendance.getToday) ??
    []) as AttendanceRecord[];

  const report = (useQuery(api.attendance.getReport, {
    startDate: filters.startDate,
    endDate: filters.endDate,
    staffId: filters.selectedStaff
      ? (filters.selectedStaff as Id<"staff">)
      : undefined,
  }) ?? []) as AttendanceRecord[];

  const staff = (useQuery(api.staffs.staff.getAll) ?? []) as StaffMember[];
  const markAbsent = useMutation(api.attendance.markAbsent);

  const activeStaff = useMemo(
    () => staff.filter((s) => s.status === "active"),
    [staff],
  );

  const absentStaff = useMemo(
    () =>
      activeStaff.filter(
        (s) => !todayAttendance.find((a) => a.staffId === s._id),
      ),
    [activeStaff, todayAttendance],
  );

  const summary = useMemo<AttendanceSummary>(
    () => ({
      totalActive: activeStaff.length,
      presentToday: todayAttendance.filter(
        (a) => a.status === "present" || a.status === "late",
      ).length,
      lateToday: todayAttendance.filter((a) => a.status === "late").length,
      absentToday: absentStaff.length,
    }),
    [activeStaff, todayAttendance, absentStaff],
  );

  const handleMarkAbsent = async (staffId: string, date: string) => {
    if (!confirm("Mark this staff member as absent?")) return;
    try {
      await markAbsent({
        staffId: staffId as Id<"staff">,
        date,
        notes: "Marked absent by admin",
      });
    } catch {
      alert("Failed to mark absent. Please try again.");
    }
  };

  // Access guard
  if (user && user.role !== "owner" && user.role !== "admin") {
    return (
      <div className='max-w-md mx-auto mt-20 p-6'>
        <div className='rounded-2xl border border-red-100 bg-red-50/40 p-8 text-center'>
          <div className='w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4'>
            <ShieldX size={22} className='text-red-400' strokeWidth={1.5} />
          </div>
          <h2 className='text-lg font-bold text-gray-800 mb-1'>
            Access Denied
          </h2>
          <p className='text-sm text-gray-400'>
            Only owners and administrators can view attendance reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-5 p-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Attendance Report</h1>
        <p className='text-sm text-gray-400 mt-0.5'>
          Monitor staff attendance and punctuality
        </p>
      </div>

      <AttendanceSummaryCards summary={summary} />

      <AttendanceFilters
        filters={filters}
        staff={staff}
        onChange={setFilters}
      />

      <AttendanceTable records={report} />

      <AbsentStaffList
        absentStaff={absentStaff}
        today={today}
        onMarkAbsent={handleMarkAbsent}
      />
    </div>
  );
}
