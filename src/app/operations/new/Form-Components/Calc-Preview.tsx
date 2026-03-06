interface CalcPreviewProps {
  openingCash: number;
  closingCash: number;
  totalSales: number;
  totalExpenses: number;
}

function StatCard({
  label,
  value,
  colorClass,
  warning,
}: {
  label: string;
  value: string;
  colorClass: string;
  warning?: string;
}) {
  return (
    <div className='p-4 bg-white rounded-lg border border-bakery-pink'>
      <p className='text-sm text-gray-600'>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
      {warning && <p className='text-xs text-orange-600 mt-1'>{warning}</p>}
    </div>
  );
}

export default function CalcPreview({
  openingCash,
  closingCash,
  totalSales,
  totalExpenses,
}: CalcPreviewProps) {
  const expectedCash = openingCash + totalSales - totalExpenses;
  const cashVariance = closingCash - expectedCash;
  const netProfit = totalSales - totalExpenses;

  return (
    <div className='card bg-linear-to-br from-bakery-pink-pale to-white border-2 border-bakery-pink'>
      <h2 className='text-xl font-bold text-bakery-pink mb-4'>
        📈 Auto-Calculations
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='Net Profit/Loss'
          value={`₦${netProfit.toFixed(2)}`}
          colorClass={netProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          label='Expected Cash'
          value={`₦${expectedCash.toFixed(2)}`}
          colorClass='text-blue-600'
        />
        <StatCard
          label='Cash Variance'
          value={`₦${cashVariance.toFixed(2)}`}
          colorClass={
            Math.abs(cashVariance) < 100
              ? "text-gray-600"
              : cashVariance > 0
                ? "text-green-600"
                : "text-red-600"
          }
          warning={
            Math.abs(cashVariance) > 100
              ? "⚠️ Significant variance detected"
              : undefined
          }
        />
      </div>
      <div className='mt-4 p-3 bg-blue-50 rounded-lg text-sm'>
        <p className='font-semibold text-blue-900'>Formula:</p>
        <p className='text-blue-700 mt-1'>
          Expected Cash = Opening Cash + Total Sales - Total Expenses
        </p>
        <p className='text-blue-700'>
          Cash Variance = Closing Cash - Expected Cash
        </p>
      </div>
    </div>
  );
}
