import type { LangKey } from './translations';

const englishMonths: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function parseEnglishDate(value: string): Date | null {
  const match = value.trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{4})$/);
  if (!match || englishMonths[match[1]] === undefined) return null;
  const date = new Date(Number(match[3]), englishMonths[match[1]], Number(match[2]));
  return date.getFullYear() === Number(match[3]) && date.getMonth() === englishMonths[match[1]] && date.getDate() === Number(match[2]) ? date : null;
}

export function formatDate(date: Date, lang: LangKey, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', options).format(date);
}

export function displayStoredDate(value: string, lang: LangKey): string {
  if (lang === 'en') return value;
  const date = parseEnglishDate(value);
  return date ? formatDate(date, lang) : value;
}

export function displayGregorianPeriod(value: string, lang: LangKey, short = false): string {
  if (lang === 'en') return value;
  const match = value.trim().match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (!match || englishMonths[match[1]] === undefined) return value;
  const year = Number(match[2]);
  const month = englishMonths[match[1]];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: short ? 'short' : 'long' });
  const startMonth = formatter.format(first);
  const endMonth = formatter.format(last);
  const startYear = formatDate(first, 'fa', { year: 'numeric' });
  const endYear = formatDate(last, 'fa', { year: 'numeric' });
  const months = startMonth === endMonth ? startMonth : `${startMonth}–${endMonth}`;
  return short ? months : `${months} ${startYear === endYear ? startYear : `${startYear}–${endYear}`}`;
}
