"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

import { getVisibleItems } from "./navConfig";
import NavLogo from "./NavigationComponents/NavLogo";
import NavDesktop from "./NavigationComponents/NavDesktop";
import NavMobile from "./NavigationComponents/NavMobile";
import UserMenu from "./NavigationComponents/UserMenu";
import NavSkeleton from "./NavigationComponents/NavSkeleton";

export default function Navigation() {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  const user = useQuery(api.users.viewer);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't render on login page at all
  if (pathname === "/login") return null;

  // Show skeleton while user is loading — prevents layout shift
  if (user === undefined) return <NavSkeleton />;

  const items = getVisibleItems(user?.role);

  const handleSignOut = () => {
    signOut();
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <nav className='bg-white border-b border-gray-100 sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-14'>
          <NavLogo />

          <NavDesktop items={items} pathname={pathname} />

          <div className='flex items-center gap-2'>
            {user && (
              <UserMenu
                fullName={user.fullName ?? ""}
                role={user.role ?? ""}
                onSignOut={handleSignOut}
              />
            )}

            {/* Mobile toggle */}
            <button
              type='button'
              onClick={() => setMobileOpen((o) => !o)}
              className='lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'
              aria-label='Toggle menu'>
              {mobileOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && user && (
          <NavMobile
            items={items}
            pathname={pathname}
            fullName={user.fullName ?? ""}
            role={user.role ?? ""}
            onClose={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        )}
      </div>
    </nav>
  );
}
