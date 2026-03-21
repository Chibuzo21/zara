import { LogOut } from "lucide-react";

interface UserMenuProps {
  fullName: string;
  role: string;
  onSignOut: () => void;
}

export default function UserMenu({ fullName, role, onSignOut }: UserMenuProps) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className='flex items-center gap-3'>
      {/* Avatar + name */}
      <div className='flex items-center gap-2.5'>
        <div className='w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0'>
          {initials}
        </div>
        <div className='text-right leading-tight'>
          <p className='text-xs font-semibold text-gray-800'>{fullName}</p>
          <p className='text-[11px] text-gray-400 capitalize'>
            {role.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className='w-px h-6 bg-gray-100' />

      {/* Logout */}
      <button
        onClick={onSignOut}
        className='lg:flex hidden items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors'>
        <LogOut size={14} strokeWidth={2} />
        Logout
      </button>
    </div>
  );
}
