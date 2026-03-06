import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href='/' className='flex items-center gap-2.5 flex-shrink-0'>
      <div className='w-9 h-9 bg-gradient-to-br from-rose-500 to-rose-400 rounded-xl flex items-center justify-center shadow-sm'>
        <span className='text-white font-bold text-lg leading-none'>Z</span>
      </div>
      <span className='text-base font-bold text-rose-500 hidden sm:block'>
        Zara's Delight
      </span>
    </Link>
  );
}
