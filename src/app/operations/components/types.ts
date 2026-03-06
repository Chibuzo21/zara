// QuickStats
import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";

export interface QuickStatsProps {
  operations: Doc<"dailyOperations">[]; // or Doc<"operations">[]
}

// Filters
export interface FiltersProps {
  dateFilter: string;
  setDateFilter: React.Dispatch<React.SetStateAction<string>>;
}

// OperationsTable
export interface OperationsTableProps {
  operations: Doc<"dailyOperations">[]; // or Doc<"operations">[]
  dateFilter: string;
}

// OperationsHeader - no props
