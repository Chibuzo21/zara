export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-3 shadow-sm border ${accent}`}>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold uppercase tracking-widest opacity-70'>
          {label}
        </span>
        <Icon size={18} className='opacity-40' strokeWidth={2} />
      </div>
      <p className='text-2xl font-bold tabular-nums leading-none'>{value}</p>
      {sub && <p className='text-xs opacity-60'>{sub}</p>}
    </div>
  );
}
