import type { Amenity } from '../App';

export const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
export interface Reservation {
  amenity: Amenity;
  date: string;
  start: number;
  end: number;
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function minutes(time: string): number {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function slotStart(slot: string): number {
  const [time, period] = slot.split(' ');
  const [hours, mins] = time.split(':').map(Number);
  return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + mins;
}

export function isReservation(value: unknown): value is Reservation {
  if (!value || typeof value !== 'object') return false;
  const r = value as Reservation;
  return ['gym', 'pool', 'rooftop', 'guest-parking', 'community-hall'].includes(r.amenity)
    && typeof r.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date)
    && Number.isInteger(r.start) && Number.isInteger(r.end)
    && r.start >= 0 && r.end <= 1440 && r.start < r.end;
}

// Half-open intervals permit adjacent bookings, e.g. 10–11 and 11–12.
export function hasConflict(reservations: Reservation[], candidate: Reservation): boolean {
  return reservations.some(r => r.amenity === candidate.amenity && r.date === candidate.date
    && candidate.start < r.end && r.start < candidate.end);
}
