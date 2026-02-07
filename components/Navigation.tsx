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
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/operations", label: "Operations", icon: FileText },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/commission", label: "Commission", icon: DollarSign },
  { href: "/imprest", label: "Imprest", icon: Briefcase },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className='bg-white shadow-md'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-linear-to-br from-bakery-pink to-bakery-pink-light rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>Z</span>
            </div>
            <span className='text-xl font-bold text-bakery-pink'>
              Zara's Delight
            </span>
          </Link>

          <div className='hidden md:flex space-x-1'>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-bakery-pink text-white"
                      : "text-gray-700 hover:bg-bakery-pink-pale"
                  }`}>
                  <Icon size={18} />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
