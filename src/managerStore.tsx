import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'resident' | 'manager';

export interface Amenities {
  pool: boolean;
  rooftop: boolean;
  gym: boolean;
  parking: boolean;
  lounge: boolean;
  laundry: boolean;
}

export interface Apartment {
  name: string;
  address: string;
  floors: number;
  unitsPerFloor: number;
  amenities: Amenities;
}

export type UnitStatus = 'occupied' | 'invited' | 'vacant';

export interface Unit {
  id: string;
  label: string;
  floor: number;
  bedrooms: number;
  owner: string;
  email: string;
  status: UnitStatus;
  password: string | null;
  credsSent: boolean;
  balance: number;
}

export type ChargeType = 'apartment' | 'water' | 'energy' | 'gas';
export type ChargeStatus = 'pending' | 'sent' | 'paid';

export interface Charge {
  id: string;
  type: ChargeType;
  target: string; // unit label or 'All units'
  amount: number;
  due: string;
  link: string | null;
  status: ChargeStatus;
}

export interface Announcement {
  id: string;
  category: 'Water' | 'Gas' | 'Energy' | 'General';
  title: string;
  body: string;
  date: string;
  published: boolean;
}

export interface NewsSubmission {
  id: number;
  title: string;
  description: string;
  category: 'Water' | 'Gas' | 'Energy' | 'General';
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  golden: boolean;
}

export type StaffRole = 'Owner' | 'Property Manager' | 'Front Desk' | 'Maintenance' | 'Accountant';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
}

interface ManagerCtx {
  apartment: Apartment | null;
  createApartment: (a: Apartment) => void;
  units: Unit[];
  addUnit: (u: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, patch: Partial<Unit>) => void;
  charges: Charge[];
  addCharge: (c: Omit<Charge, 'id'>) => void;
  updateCharge: (id: string, patch: Partial<Charge>) => void;
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, 'id'>) => void;
  staff: StaffMember[];
  addStaff: (s: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  newsSubmissions: NewsSubmission[];
  addNewsSubmission: (sub: Omit<NewsSubmission, 'id' | 'status' | 'golden'>) => void;
  reviewSubmission: (id: number, status: 'approved' | 'rejected', golden: boolean) => void;
}

const genId = () => Math.random().toString(36).slice(2, 9);
export const genPassword = () =>
  'LUM-' + Math.random().toString(36).slice(2, 6).toUpperCase() + Math.floor(10 + Math.random() * 89);

const seedStaff: StaffMember[] = [
  { id: genId(), name: 'Marcus Webb', email: 'm.webb@lumina.co', role: 'Owner', active: true },
  { id: genId(), name: 'Elena Ross', email: 'e.ross@lumina.co', role: 'Property Manager', active: true },
  { id: genId(), name: 'Danny Cole', email: 'd.cole@lumina.co', role: 'Maintenance', active: true },
];

const ManagerContext = createContext<ManagerCtx | null>(null);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>(seedStaff);
  const [newsSubmissions, setNewsSubmissions] = useState<NewsSubmission[]>([]);
  const [nextSubId, setNextSubId] = useState(1);

  const createApartment = (a: Apartment) => setApartment(a);

  const addUnit = (u: Omit<Unit, 'id'>) => setUnits(prev => [...prev, { ...u, id: genId() }]);
  const updateUnit = (id: string, patch: Partial<Unit>) =>
    setUnits(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));

  const addCharge = (c: Omit<Charge, 'id'>) => setCharges(prev => [{ ...c, id: genId() }, ...prev]);
  const updateCharge = (id: string, patch: Partial<Charge>) =>
    setCharges(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));

  const addAnnouncement = (a: Omit<Announcement, 'id'>) =>
    setAnnouncements(prev => [{ ...a, id: genId() }, ...prev]);

  const addNewsSubmission = (sub: Omit<NewsSubmission, 'id' | 'status' | 'golden'>) => {
    setNewsSubmissions(prev => [...prev, { ...sub, id: nextSubId, status: 'pending', golden: false }]);
    setNextSubId(n => n + 1);
  };
  const reviewSubmission = (id: number, status: 'approved' | 'rejected', golden: boolean) =>
    setNewsSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, golden } : s));

  const addStaff = (s: Omit<StaffMember, 'id'>) => setStaff(prev => [...prev, { ...s, id: genId() }]);
  const updateStaff = (id: string, patch: Partial<StaffMember>) =>
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <ManagerContext.Provider value={{
      apartment, createApartment,
      units, addUnit, updateUnit,
      charges, addCharge, updateCharge,
      announcements, addAnnouncement,
      staff, addStaff, updateStaff,
      newsSubmissions, addNewsSubmission, reviewSubmission,
    }}>
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const ctx = useContext(ManagerContext);
  if (!ctx) throw new Error('useManager must be used within ManagerProvider');
  return ctx;
}

export function useManagerContext() {
  return useManager();
}
