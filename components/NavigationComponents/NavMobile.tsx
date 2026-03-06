import Link from "next/link";
import { LogOut } from "lucide-react";
import { NavItem } from "../navConfig";

interface NavMobileProps {
  items: NavItem[];
  pathname: string;
  fullName: string;
  role: string;
  onClose: () => void;
  onSignOut: () => void;
}

export default function NavMobile({
  items,
  pathname,
  fullName,
  role,
  onClose,
  onSignOut,
}: NavMobileProps) {
  return (
    <div className='lg:hidden border-t border-gray-50 py-3'>
      <div className='flex flex-col gap-0.5'>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-rose-500 text-white"
                  : "text-gray-600 hover:text-rose-500 hover:bg-rose-50"
              }`}>
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}

        {/* User footer */}
        <div className='mt-2 pt-3 border-t border-gray-50 px-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold text-gray-800'>{fullName}</p>
              <p className='text-xs text-gray-400 capitalize mt-0.5'>
                {role.replace(/_/g, " ")}
              </p>
            </div>
            <button
              onClick={onSignOut}
              className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors'>
              <LogOut size={14} strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
