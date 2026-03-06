import { Info, AlertTriangle } from "lucide-react";

const INSTRUCTIONS = [
  "Your browser will request permission to access your location",
  "You must be within 100 meters of the bakery to clock in/out",
  "GPS coordinates are recorded for verification",
  "Clock in before 9:00 AM to avoid being marked late",
  "Make sure to clock out at the end of your shift",
];

const TROUBLESHOOTING_TIPS = [
  "Make sure location services are enabled on your device",
  "Allow location access when prompted by your browser",
  "Try refreshing the page and allowing permission again",
  "Use your phone for better GPS accuracy",
  "Go outside for better satellite signal",
];

export function InstructionsCard() {
  return (
    <div className='rounded-2xl border border-amber-100 bg-amber-50/40 p-5'>
      <div className='flex items-center gap-2 mb-3'>
        <Info size={14} className='text-amber-500' strokeWidth={2.5} />
        <h3 className='text-sm font-semibold tracking-widest uppercase text-amber-500'>
          How It Works
        </h3>
      </div>
      <ul className='space-y-2'>
        {INSTRUCTIONS.map((tip, i) => (
          <li key={i} className='flex items-start gap-2 text-xs text-amber-800'>
            <span className='flex-shrink-0 w-4 h-4 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center font-bold text-[10px] mt-0.5'>
              {i + 1}
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TroubleshootingCard() {
  return (
    <div className='rounded-2xl border border-red-100 bg-red-50/40 p-5'>
      <div className='flex items-center gap-2 mb-3'>
        <AlertTriangle size={14} className='text-red-400' strokeWidth={2.5} />
        <h3 className='text-sm font-semibold tracking-widest uppercase text-red-400'>
          Troubleshooting
        </h3>
      </div>
      <ul className='space-y-2'>
        {TROUBLESHOOTING_TIPS.map((tip, i) => (
          <li key={i} className='flex items-start gap-2 text-xs text-red-700'>
            <span className='flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-red-300' />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
