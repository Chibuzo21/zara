import React from "react";
import { ROLES, STATUSES } from "./staffData";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import z from "zod";
import { createSchema } from "./Form-Components/validation";

export type Role = (typeof ROLES)[number]["value"];
export type Status = (typeof STATUSES)[number]["value"];
export type StaffFormProps = {
  title: string;
  text: string;
  mode: "create" | "edit";
  staff?: Doc<"staff">;
};
export type StaffType =
  | {
      _id: Id<"staff">;
      _creationTime: number;
      phone?: string | undefined;
      baseSalary?: number | undefined;
      userId?: Id<"users"> | undefined;
      email: string;
      fullName: string;
      role: "packaging" | "production" | "sales" | "owner" | "transport_sales";
      status: "active" | "inactive" | "suspended";
      dateHired: string;
      commissionRate: number;
    }[]
  | undefined;
export interface iFilter {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  roleFilter: string;
  setRoleFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}
export interface iTableParams {
  filteredStaff: StaffType;
  roleColors: Record<string, string>;
  statusColors: Record<string, string>;
  handleDelete: (id: Id<"staff">) => Promise<void>;
  formatDate: (date: string | Date) => string;
}
