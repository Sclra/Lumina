import type { PaymentType } from '../App';
import { currentSolarDate, type SolarDate } from './solarHijri';

export type MonthStatus = 'PAID' | 'DUE' | 'FUTURE';
export const paymentInfo = {
  apartment: { nameKey: 'payments_apartment', breakdownKeys: ['pb_apartment_base', 'pb_apartment_maintenance', 'pb_apartment_parking', 'pb_apartment_insurance'], amounts: [120, 35, 20, 10] },
  water: { nameKey: 'payments_water', breakdownKeys: ['pb_water_base', 'pb_water_usage', 'pb_water_infra', 'pb_water_env'], amounts: [22, 11.5, 5, 4] },
  energy: { nameKey: 'payments_energy', breakdownKeys: ['pb_energy_base', 'pb_energy_usage', 'pb_energy_network', 'pb_energy_carbon'], amounts: [85, 22.9, 8, 3] },
} as const;

// Prototype billing data, indexed by Solar Hijri year and 1-based month.
// Both the overview and statement use this source until real invoices are connected.
export function getPayment(type: PaymentType, year: number, month: number, today = currentSolarDate()) {
  const period = year * 12 + month;
  const current = today.year * 12 + today.month;
  const status: MonthStatus = period > current ? 'FUTURE'
    : period < current || type === 'apartment' ? 'PAID' : 'DUE';
  const info = paymentInfo[type];
  const dueDate: SolarDate = { year, month, day: 15 };
  const paidDate: SolarDate | null = status === 'PAID' ? { year, month, day: 12 } : null;
  return { ...info, year, month, status, dueDate, paidDate, total: info.amounts.reduce((sum: number, amount) => sum + amount, 0) };
}
