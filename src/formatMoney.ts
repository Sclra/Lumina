import type { LangKey } from './translations';

// Display only: the prototype keeps the same numeric amounts in both languages.
export function formatMoney(amount: string | number, lang: LangKey): string {
  const value = String(amount);
  return lang === 'fa' ? `${value} ریال` : `$${value}`;
}
