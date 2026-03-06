import { Doc } from "../../../../convex/_generated/dataModel";

export type AttendanceRecord = Doc<"attendance"> & {
  staff?: { fullName: string };
};

export type StaffMember = Doc<"staff">;

export interface AttendanceSummary {
  totalActive: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  selectedStaff: string;
}
