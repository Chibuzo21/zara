import { MapPin, Loader, RefreshCw } from "lucide-react";
import { LocationCoords } from "../types";

interface LocationStatusCardProps {
  location: LocationCoords | null;
  locationError: string;
  gettingLocation: boolean;
  onRetry: () => void;
}

export default function LocationStatusCard({
  location,
  locationError,
  gettingLocation,
  onRetry,
}: LocationStatusCardProps) {
  return (
    <div className='rounded-2xl border border-rose-100 shadow-sm bg-white p-5 flex items-start gap-4'>
      <div
        className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
          location
            ? "bg-emerald-50 text-emerald-500"
            : "bg-gray-100 text-gray-400"
        }`}>
        <MapPin size={18} strokeWidth={2} />
      </div>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-gray-700'>GPS Location</p>

        {gettingLocation ? (
          <p className='text-xs text-gray-400 mt-1 flex items-center gap-1.5'>
            <Loader size={12} className='animate-spin' />
            Getting your location…
          </p>
        ) : location ? (
          <div className='mt-1 space-y-0.5'>
            <p className='text-xs font-semibold text-emerald-600'>
              ✓ Location acquired
            </p>
            <p className='text-xs text-gray-400 tabular-nums'>
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            {location.accuracy !== undefined && (
              <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                <span>±{location.accuracy}m accuracy</span>
                {location.accuracy > 100 && (
                  <span className='text-amber-500 font-medium'>
                    · Low accuracy (WiFi-based)
                  </span>
                )}
              </p>
            )}
          </div>
        ) : locationError ? (
          <p className='text-xs text-red-500 mt-1'>{locationError}</p>
        ) : (
          <p className='text-xs text-gray-400 mt-1'>Location not available</p>
        )}
      </div>

      {!location && !gettingLocation && (
        <button
          type='button'
          onClick={onRetry}
          className='flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors'>
          <RefreshCw size={12} strokeWidth={2.5} />
          Retry
        </button>
      )}
    </div>
  );
}
