import {
  Home,
  Users,
  DollarSign,
  Package,
  FileText,
  Briefcase,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

export function getDashboardHref(role: string | undefined): string {
  switch (role) {
    case "owner":
      return "/dashboard/owner";
    case "sales":
    case "transport_sales":
      return "/dashboard/sales";
    case "production":
      return "/dashboard/production";
    default:
      return "/dashboard/packaging";
  }
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "__dashboard__", // resolved dynamically
    label: "Dashboard",
    icon: Home,
    roles: [
      "owner",
      "admin",
      "sales",
      "transport_sales",
      "production",
      "packaging",
    ],
  },
  { href: "/staff", label: "Staff", icon: Users, roles: ["owner", "admin"] },
  {
    href: "/operations",
    label: "Operations",
    icon: FileText,
    roles: ["owner"],
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["owner"],
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
    roles: [
      "owner",
      "admin",
      "sales",
      "transport_sales",
      "production",
      "packaging",
    ],
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: Package,
    roles: ["owner", "production"],
  },
  {
    href: "/sales/record",
    label: "Record Sale",
    icon: ShoppingCart,
    roles: ["sales", "transport_sales"],
  },
  {
    href: "/attendance",
    label: "Attendance",
    icon: Users,
    roles: ["owner", "sales", "transport_sales", "production", "packaging"],
  },
  // {
  //   href: "/commission",
  //   label: "Commission",
  //   icon: DollarSign,
  //   roles: [
  //     "owner",
  //     "sales",
  //     "transport_sales",
  //     "production",
  //     "packaging",
  //   ],
  // },
  // {
  //   href: "/imprest",
  //   label: "Imprest",
  //   icon: Briefcase,
  //   roles: [
  //     "owner",
  //     "admin",
  //     "shop_sales",
  //     "transport_sales",
  //     "production",
  //     "packaging",
  //   ],
  // },
];

export function getVisibleItems(role: string | undefined): NavItem[] {
  if (!role) return [];
  const dashboardHref = getDashboardHref(role);
  return NAV_ITEMS.map((item) =>
    item.href === "__dashboard__" ? { ...item, href: dashboardHref } : item,
  ).filter((item) => item.roles.includes(role));
}
