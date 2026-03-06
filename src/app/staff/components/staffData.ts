export const ROLES = [
  {
    value: "sales",
    label: "Sales",
    color: "#f59e0b",
    commission: "5.0% base / 7.0% above ₦150k",
  },
  {
    value: "production",
    label: "Production",
    color: "#3b82f6",
    commission: "2.0% base / 3.0% above ₦100k",
  },
  {
    value: "packaging",
    label: "Packaging",
    color: "#10b981",
    commission: "1.5% base / 2.5% above ₦80k",
  },
  {
    value: "owner",
    label: "Owner",
    color: "#ef4444",
    commission: "Not applicable",
  },
  {
    value: "transport_sales",
    label: "Transport Sales",
    color: "#f97316",
    commission: "Custom",
  },
] as const;

export const STATUSES = [
  { value: "active", label: "Active", color: "#10b981" },
  { value: "inactive", label: "Inactive", color: "#6b7280" },
  { value: "suspended", label: "Suspended", color: "#ef4444" },
] as const;
export const stats = [
  { role: "Active", color: "text-green-600" },
  {
    role: "Production",
    color: "text-blue-600",
  },
  {
    role: "Packaging",
    color: "text-green-600",
  },
  {
    role: "Production",
    color: "text-yellow-600",
  },
];
