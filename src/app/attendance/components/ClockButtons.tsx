import { Clock, XCircle, Loader } from "lucide-react";
import { AttendanceState } from "../types";

interface ClockButtonsProps {
  state: AttendanceState;
  loading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

export default function ClockButtons({
  state,
  loading,
  onClockIn,
  onClockOut,
}: ClockButtonsProps) {
  const { isClockedIn, isClockedOut, hasNotClockedIn } = state;

  const clockInActive = hasNotClockedIn && !loading;
  const clockOutActive = isClockedIn && !isClockedOut && !loading;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {/* Clock In */}
      <button
        type='button'
        onClick={onClockIn}
        disabled={loading || isClockedIn || isClockedOut}
        className={`p-8 rounded-2xl border-2 transition-all duration-150 text-center ${
          clockInActive
            ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
            : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
        }`}>
        <div
          className={`inline-flex p-4 rounded-2xl mb-4 ${
            clockInActive ? "bg-emerald-500" : "bg-gray-300"
          }`}>
          {loading && hasNotClockedIn ? (
            <Loader size={32} className='text-white animate-spin' />
          ) : (
            <Clock size={32} className='text-white' strokeWidth={1.5} />
          )}
        </div>
        <p className='text-xl font-bold text-gray-800 mb-1'>Clock In</p>
        <p className='text-xs text-gray-400'>
          {isClockedIn || isClockedOut
            ? "Already clocked in today"
            : "Start your workday"}
        </p>
      </button>

      {/* Clock Out */}
      <button
        type='button'
        onClick={onClockOut}
        disabled={loading || !isClockedIn || isClockedOut}
        className={`p-8 rounded-2xl border-2 transition-all duration-150 text-center ${
          clockOutActive
            ? "border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 cursor-pointer"
            : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
        }`}>
        <div
          className={`inline-flex p-4 rounded-2xl mb-4 ${
            clockOutActive ? "bg-red-500" : "bg-gray-300"
          }`}>
          {loading && isClockedIn ? (
            <Loader size={32} className='text-white animate-spin' />
          ) : (
            <XCircle size={32} className='text-white' strokeWidth={1.5} />
          )}
        </div>
        <p className='text-xl font-bold text-gray-800 mb-1'>Clock Out</p>
        <p className='text-xs text-gray-400'>
          {!isClockedIn
            ? "Clock in first"
            : isClockedOut
              ? "Already clocked out"
              : "End your workday"}
        </p>
      </button>
    </div>
  );
}
