"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Users,
  DollarSign,
  Package,
  FileText,
  Briefcase,
  BarChart3,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Doc } from "../convex/_generated/dataModel";

export default function Navigation() {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const user = useQuery(api.users.viewer);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show nav on login page
  if (pathname === "/login") {
    return null;
  }

  const navItems = [
    // Dashboard (all roles)
    {
      href:
        user?.role === "owner" || user?.role === "admin"
          ? "/dashboard/owner"
          : user?.role === "shop_sales" || user?.role === "transport_sales"
            ? "/dashboard/sales"
            : user?.role === "production"
              ? "/dashboard/production"
              : "/dashboard/packaging",
      label: "Dashboard",
      icon: Home,
      roles: [
        "owner",
        "admin",
        "shop_sales",
        "transport_sales",
        "production",
        "packaging",
      ],
    },

    // Owner/Admin only
    { href: "/staff", label: "Staff", icon: Users, roles: ["owner", "admin"] },
    {
      href: "/operations",
      label: "Operations",
      icon: FileText,
      roles: ["owner", "admin"],
    },
    {
      href: "/reports",
      label: "Reports",
      icon: BarChart3,
      roles: ["owner", "admin"],
    },

    // Products (all roles can view)
    {
      href: "/products",
      label: "Products",
      icon: Package,
      roles: [
        "owner",
        "admin",
        "shop_sales",
        "transport_sales",
        "production",
        "packaging",
      ],
    },

    // Inventory (owner, production)
    {
      href: "/inventory",
      label: "Inventory",
      icon: Package,
      roles: ["owner", "admin", "production"],
    },

    // Sales (sales staff + owner)
    {
      href: "/sales/record",
      label: "Record Sale",
      icon: ShoppingCart,
      roles: ["shop_sales", "transport_sales"],
    },

    // Commission (all staff)
    {
      href: "/commission",
      label: "Commission",
      icon: DollarSign,
      roles: [
        "owner",
        "admin",
        "shop_sales",
        "transport_sales",
        "production",
        "packaging",
      ],
    },

    // Imprest (all staff)
    {
      href: "/imprest",
      label: "Imprest",
      icon: Briefcase,
      roles: [
        "owner",
        "admin",
        "shop_sales",
        "transport_sales",
        "production",
        "packaging",
      ],
    },
  ];

  const visibleItems = user
    ? navItems.filter((item) => item.roles.includes(user.role as string))
    : navItems;

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-linear-to-br from-bakery-pink to-bakery-pink-light rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>Z</span>
            </div>
            <span className='text-xl font-bold text-bakery-pink'>
              Zara's Delight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-1'>
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-bakery-pink text-white"
                      : "text-gray-700 hover:bg-bakery-pink-pale"
                  }`}>
                  <Icon size={16} />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className='flex items-center gap-4'>
            {user && (
              <div className='hidden md:flex items-center gap-3'>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {user.fullName}
                  </p>
                  <p className='text-xs text-gray-600 capitalize'>
                    {user.role.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='lg:hidden p-2 rounded-lg hover:bg-gray-100'>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='lg:hidden py-4 border-t'>
            <div className='flex flex-col space-y-1'>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-bakery-pink text-white"
                        : "text-gray-700 hover:bg-bakery-pink-pale"
                    }`}>
                    <Icon size={18} />
                    <span className='font-medium'>{item.label}</span>
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className='border-t my-2 pt-2'>
                    <div className='px-4 py-2'>
                      <p className='text-sm font-semibold text-gray-900'>
                        {user.fullName}
                      </p>
                      <p className='text-xs text-gray-600 capitalize'>
                        {user?.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className='flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                    <LogOut size={18} />
                    <span className='font-medium'>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
