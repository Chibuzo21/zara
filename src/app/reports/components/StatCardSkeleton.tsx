export default function StatCardSkeleton() {
  return (
    <div className='rounded-2xl p-5 border border-gray-100 bg-white space-y-3 animate-pulse'>
      <div className='h-3 w-24 bg-gray-100 rounded' />
      <div className='h-7 w-32 bg-gray-100 rounded' />
      <div className='h-3 w-20 bg-gray-100 rounded' />
    </div>
  );
}
