import NavLogo from "./NavLogo";

export default function NavSkeleton() {
  return (
    <nav className='bg-white border-b border-gray-100 sticky top-0 z-50 h-14'>
      <div className='container mx-auto px-4 h-full flex items-center justify-between'>
        <NavLogo />

        {/* Skeleton nav pills */}
        <div className='hidden lg:flex items-center gap-1.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='h-7 rounded-xl bg-gray-100 animate-pulse'
              style={{ width: `${60 + i * 10}px` }}
            />
          ))}
        </div>

        {/* Skeleton user menu */}
        <div className='hidden md:flex items-center gap-3'>
          <div className='w-8 h-8 rounded-xl bg-gray-100 animate-pulse' />
          <div className='space-y-1.5'>
            <div className='h-2.5 w-20 bg-gray-100 rounded animate-pulse' />
            <div className='h-2 w-14 bg-gray-100 rounded animate-pulse' />
          </div>
        </div>

        {/* Mobile skeleton */}
        <div className='lg:hidden w-8 h-8 rounded-xl bg-gray-100 animate-pulse' />
      </div>
    </nav>
  );
}
