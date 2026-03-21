import Link from "next/link";
import { NavItem } from "../navConfig";

interface NavDesktopProps {
  items: NavItem[];
  pathname: string;
}

export default function NavDesktop({ items, pathname }: NavDesktopProps) {
  return (
    <div className='hidden lg:flex items-center gap-0.5'>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive
                ? "bg-rose-500 text-white"
                : "text-gray-500 hover:text-rose-500 hover:bg-rose-50"
            }`}>
            <span className='hidden xl:block'>
              <Icon size={14} strokeWidth={2} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
