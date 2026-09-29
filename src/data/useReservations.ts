import { useEffect, useState } from 'react';
import { hasConflict, isReservation, type Reservation } from './reservations';

const KEY = 'lumina.reservations.v1';
const EVENT = 'lumina-reservations-changed';

function readReservations(): Reservation[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isReservation)) throw new Error('Invalid reservation data');
  return parsed;
}

export default function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    const refresh = () => {
      try { setReservations(readReservations()); setLoadError(false); }
      catch { setLoadError(true); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(EVENT, refresh);
    };
  }, []);

  const reserve = async (candidate: Reservation): Promise<'success' | 'conflict' | 'error'> => {
    try {
      if (!isReservation(candidate)) return 'error';
      // Serialize the read/check/write across tabs. Fail closed without lock support.
      if (!navigator.locks) return 'error';
      return await navigator.locks.request(KEY, () => {
        const latest = readReservations();
        if (hasConflict(latest, candidate)) {
          setReservations(latest);
          return 'conflict' as const;
        }
        const next = [...latest, candidate];
        localStorage.setItem(KEY, JSON.stringify(next));
        setReservations(next);
        window.dispatchEvent(new Event(EVENT));
        return 'success' as const;
      });
    } catch { return 'error'; }
  };
  return { reservations, loadError, reserve };
}
