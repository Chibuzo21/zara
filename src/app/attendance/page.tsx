"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { LocationCoords, TodayStatus, AttendanceState } from "./types";
import AttendanceStatusCard from "./components/AttendanceStatusCard";
import LocationStatusCard from "./components/LocationStatusCard";
import ClockButtons from "./components/ClockButtons";
import { InstructionsCard, TroubleshootingCard } from "./components/InfoCard";

export default function AttendancePage() {
  const user = useQuery(api.users.viewer);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  // Redirect owner/admin
  useEffect(() => {
    if (user && user.role === "owner") {
      router.push("/attendance/report");
    }
  }, [user, router]);

  const todayStatus = useQuery(
    api.attendance.getMyTodayStatus,
    user?.staffId ? { staffId: user.staffId as Id<"staff"> } : "skip",
  ) as TodayStatus | null | undefined;

  const clockIn = useMutation(api.attendance.clockIn);
  const clockOut = useMutation(api.attendance.clockOut);

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  // Derived state
  const attendanceState: AttendanceState = {
    isClockedIn: Boolean(
      todayStatus?.clockInTime && !todayStatus?.clockOutTime,
    ),
    isClockedOut: Boolean(
      todayStatus?.clockInTime && todayStatus?.clockOutTime,
    ),
    hasNotClockedIn: !todayStatus?.clockInTime,
  };

  const getCurrentLocation = useCallback((): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGettingLocation(false);
          const coords: LocationCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
          };
          setLocation(coords);
          setLocationError("");
          resolve(coords);
        },
        (error) => {
          setGettingLocation(false);
          const messages: Record<number, string> = {
            [error.PERMISSION_DENIED]:
              "Location permission denied. Please enable location access.",
            [error.POSITION_UNAVAILABLE]: "Location information unavailable.",
            [error.TIMEOUT]: "Location request timed out.",
          };
          const message = messages[error.code] ?? "Unable to get your location";
          setLocationError(message);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  }, []);

  // Auto-get location on mount
  useEffect(() => {
    getCurrentLocation().catch(() => {});
  }, [getCurrentLocation]);

  const handleClockIn = async () => {
    if (!user?.staffId) {
      alert("Staff ID not found");
      return;
    }
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      const time = new Date().toTimeString().split(" ")[0];
      await clockIn({
        staffId: user.staffId as Id<"staff">,
        userId: user._id as Id<"users">,
        latitude: coords.lat,
        longitude: coords.lng,
        date: today,
        time,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user?.staffId) {
      alert("Staff ID not found");
      return;
    }
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      const time = new Date().toTimeString().split(" ")[0];
      await clockOut({
        staffId: user.staffId as Id<"staff">,
        latitude: coords.lat,
        longitude: coords.lng,
        date: today,
        time,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to clock out");
    } finally {
      setLoading(false);
    }
  };

  // Show redirect spinner for owner/admin
  if (user && (user.role === "owner" || user.role === "admin")) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-3 text-gray-400'>
          <Loader size={32} className='animate-spin' strokeWidth={1.5} />
          <p className='text-sm'>Redirecting to attendance report…</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className='max-w-2xl mx-auto space-y-4 p-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Attendance</h1>
        <p className='text-sm text-gray-400 mt-0.5'>{formattedDate}</p>
      </div>

      <AttendanceStatusCard todayStatus={todayStatus} state={attendanceState} />

      <LocationStatusCard
        location={location}
        locationError={locationError}
        gettingLocation={gettingLocation}
        onRetry={() => getCurrentLocation().catch(() => {})}
      />

      <ClockButtons
        state={attendanceState}
        loading={loading}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />

      <InstructionsCard />

      {locationError && <TroubleshootingCard />}
    </div>
  );
}
