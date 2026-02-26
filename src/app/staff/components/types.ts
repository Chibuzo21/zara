import React from "react";
import { ROLES, STATUSES } from "./staffData";
import { Doc } from "../../../../convex/_generated/dataModel";

export type Role = (typeof ROLES)[number]["value"];
export type Status = (typeof STATUSES)[number]["value"];
export type StaffFormProps = {
  title: string;
  text: string;
  mode: "create" | "edit";
  staff?: Doc<"staff">;
};
