export interface SolarDate { year: number; month: number; day: number }

const partsFormatter = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', {
  year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC',
});

export function toSolarHijri(date: Date): SolarDate {
  const parts = partsFormatter.formatToParts(date);
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return { year: part('year'), month: part('month'), day: part('day') };
}

// Find the actual calendar boundary using Intl's Persian calendar, including
// leap years. UTC keeps date-only billing periods independent of browser timezone.
function solarMonthStart(year: number, month: number): Date {
  if (!Number.isInteger(year) || year < 1 || year > 3000 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Invalid Solar Hijri year or month');
  }
  let low = Math.floor(Date.UTC(year + 621, 0, 1) / 86400000);
  let high = Math.floor(Date.UTC(year + 623, 0, 1) / 86400000);
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const solar = toSolarHijri(new Date(middle * 86400000));
    if (solar.year < year || (solar.year === year && solar.month < month)) low = middle + 1;
    else high = middle;
  }
  return new Date(low * 86400000);
}

export function daysInSolarMonth(year: number, month: number): number {
  const start = solarMonthStart(year, month);
  const end = month === 12 ? solarMonthStart(year + 1, 1) : solarMonthStart(year, month + 1);
  return (end.getTime() - start.getTime()) / 86400000;
}

export function fromSolarHijri({ year, month, day }: SolarDate): Date {
  const start = solarMonthStart(year, month);
  if (!Number.isInteger(day) || day < 1 || day > daysInSolarMonth(year, month)) {
    throw new RangeError('Invalid Solar Hijri day');
  }
  start.setUTCDate(start.getUTCDate() + day - 1);
  return start;
}

export function formatSolarDate(date: SolarDate, lang: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    calendar: 'persian', timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric', ...options,
  }).format(fromSolarHijri(date));
}

export function formatSolarMonth(year: number, month: number, lang: string, includeYear = true): string {
  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    calendar: 'persian', timeZone: 'UTC', month: 'long', ...(includeYear ? { year: 'numeric' as const } : {}),
  }).format(solarMonthStart(year, month));
}

export function currentSolarDate(): SolarDate {
  // Billing follows the building's Iranian calendar date, including near midnight.
  const parts = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', {
    timeZone: 'Asia/Tehran', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return { year: part('year'), month: part('month'), day: part('day') };
}
