export interface LocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface TodayStatus {
  clockInTime?: string;
  clockOutTime?: string;
  status?: string;
  locationVerified?: boolean;
  distanceFromBakery?: number;
}

export interface AttendanceState {
  isClockedIn: boolean;
  isClockedOut: boolean;
  hasNotClockedIn: boolean;
}
