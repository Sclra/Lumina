import type { ReactElement } from 'react';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import type { Screen } from '../App';

interface Props {
  active: Screen;
  navigate: (screen: Screen) => void;
}

const icons: Record<string, (a: boolean, c: string) => ReactElement> = {
  'm-settings': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  'm-dashboard': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  'm-units': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V7l7-4v18" /><path d="M10 21V9l8 4v8" /><path d="M3 21h18" />
      <line x1="6" y1="10" x2="6.01" y2="10" /><line x1="6" y1="14" x2="6.01" y2="14" /><line x1="14" y1="14" x2="14.01" y2="14" />
    </svg>
  ),
  'm-billing': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3h13l3 3v15l-3-2-3 2-3-2-3 2-3-2V3z" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  'm-news': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h14a2 2 0 0 0 2-2V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v16a2 2 0 0 1-2 2 2 2 0 0 1-2-2V8" />
      <line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  'm-team': (a, c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={a ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const tabs: { id: Screen; label: string }[] = [
  { id: 'm-settings', label: 'Settings' },
  { id: 'm-dashboard', label: 'Overview' },
  { id: 'm-units', label: 'Units' },
  { id: 'm-billing', label: 'Billing' },
  { id: 'm-news', label: 'News' },
  { id: 'm-team', label: 'Team' },
];

export default function ManagerNav({ active, navigate }: Props) {
  const { t } = useTheme();
  const { tr } = useLang();
  const labelMap: Record<string, string> = {
    'm-settings': tr('nav_settings'),
    'm-dashboard': tr('nav_overview'),
    'm-units': tr('nav_units'),
    'm-billing': tr('nav_billing'),
    'm-news': tr('nav_news'),
    'm-team': tr('nav_team'),
  };
  return (
    <div className="bottom-nav flex-shrink-0 flex items-end pt-2"
      style={{ background: t.navBg, borderTop: `1px solid ${t.border}`, transition: 'background 0.3s, border-color 0.3s' }}>
      {tabs.map(({ id }) => {
        const label = labelMap[id] ?? id;
        const isActive = active === id;
        const color = isActive ? t.primary : t.textFaint;
        return (
          <button key={id} onClick={() => navigate(id)} className="flex-1 flex flex-col items-center gap-1 pt-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            {icons[id](isActive, color)}
            <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, color, letterSpacing: 0.2 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
