import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

export type Role = 'resident' | 'manager';

// Display identity for the prototype; never stores passwords or grants access.
export interface CurrentUser {
  role: Role;
  name: string;
  identifier: string;
  email?: string;
  unitLabel?: string;
}

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
  newsId: number;
  category: 'Water' | 'Gas' | 'Energy' | 'General';
  title: string;
  body: string;
  date: string;
  published: boolean;
  golden: boolean;
  publishedAt: number;
}

export interface NewsSubmission {
  id: number;
  title: string;
  description: string;
  category: 'Water' | 'Gas' | 'Energy' | 'General';
  submittedBy: string;
  submittedAt: string;
  publishedAt?: number;
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
  currentUser: CurrentUser | null;
  accounts: CurrentUser[];
  signInUser: (user: CurrentUser) => void;
  switchUser: (user: CurrentUser) => void;
  clearCurrentUser: () => void;
  signOutUser: () => void;
  signOutAccounts: (users: CurrentUser[]) => void;
  apartment: Apartment | null;
  createApartment: (a: Apartment) => void;
  units: Unit[];
  addUnit: (u: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, patch: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  charges: Charge[];
  addCharge: (c: Omit<Charge, 'id'>) => void;
  updateCharge: (id: string, patch: Partial<Charge>) => void;
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, 'id' | 'newsId' | 'publishedAt'>) => void;
  staff: StaffMember[];
  addStaff: (s: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  newsSubmissions: NewsSubmission[];
  addNewsSubmission: (sub: Omit<NewsSubmission, 'id' | 'status' | 'golden' | 'publishedAt'>) => void;
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [accounts, setAccounts] = useState<CurrentUser[]>([]);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const nextAnnouncementId = useRef(1);
  const lastPublishedAt = useRef(0);
  const [staff, setStaff] = useState<StaffMember[]>(seedStaff);
  const [newsSubmissions, setNewsSubmissions] = useState<NewsSubmission[]>([]);
  const [nextSubId, setNextSubId] = useState(1);

  const sameAccount = (a: CurrentUser, b: CurrentUser) =>
    a.role === b.role && a.identifier.toLocaleLowerCase() === b.identifier.toLocaleLowerCase();

  const signInUser = (user: CurrentUser) => {
    setAccounts(prev => [...prev.filter(account => !sameAccount(account, user)), user]);
    setCurrentUser(user);
  };
  const switchUser = (user: CurrentUser) => setCurrentUser(user);
  const clearCurrentUser = () => setCurrentUser(null);
  const signOutAccounts = (users: CurrentUser[]) => {
    const remaining = accounts.filter(account => !users.some(user => sameAccount(account, user)));
    setAccounts(remaining);
    setCurrentUser(current => current && remaining.some(account => sameAccount(account, current))
      ? current : remaining[0] ?? null);
  };
  const signOutUser = () => {
    if (currentUser) signOutAccounts([currentUser]);
    else setCurrentUser(null);
  };

  const publicationTime = () => {
    lastPublishedAt.current = Math.max(Date.now(), lastPublishedAt.current + 1);
    return lastPublishedAt.current;
  };

  const createApartment = (a: Apartment) => setApartment(a);

  const addUnit = (u: Omit<Unit, 'id'>) => setUnits(prev => [...prev, { ...u, id: genId() }]);
  const updateUnit = (id: string, patch: Partial<Unit>) => {
    const previousLabel = units.find(u => u.id === id)?.label;
    setUnits(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
    if (patch.label && previousLabel && patch.label !== previousLabel) {
      setCharges(prev => prev.map(c => c.target === previousLabel ? { ...c, target: patch.label! } : c));
    }
  };
  const deleteUnit = (id: string) => setUnits(prev => prev.filter(u => u.id !== id));

  const addCharge = (c: Omit<Charge, 'id'>) => setCharges(prev => [{ ...c, id: genId() }, ...prev]);
  const updateCharge = (id: string, patch: Partial<Charge>) =>
    setCharges(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));

  const addAnnouncement = (a: Omit<Announcement, 'id' | 'newsId' | 'publishedAt'>) => {
    const newsId = nextAnnouncementId.current++;
    const publishedAt = publicationTime();
    setAnnouncements(prev => [{ ...a, id: genId(), newsId, publishedAt }, ...prev]);
  };

  const addNewsSubmission = (sub: Omit<NewsSubmission, 'id' | 'status' | 'golden' | 'publishedAt'>) => {
    setNewsSubmissions(prev => [...prev, { ...sub, id: nextSubId, status: 'pending', golden: false }]);
    setNextSubId(n => n + 1);
  };
  const reviewSubmission = (id: number, status: 'approved' | 'rejected', golden: boolean) => {
    const publishedAt = status === 'approved' ? publicationTime() : undefined;
    setNewsSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, golden, publishedAt } : s));
  };

  const addStaff = (s: Omit<StaffMember, 'id'>) => setStaff(prev => [...prev, { ...s, id: genId() }]);
  const updateStaff = (id: string, patch: Partial<StaffMember>) =>
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <ManagerContext.Provider value={{
      currentUser, accounts, signInUser, switchUser, clearCurrentUser, signOutUser, signOutAccounts,
      apartment, createApartment,
      units, addUnit, updateUnit, deleteUnit,
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
