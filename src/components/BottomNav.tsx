import { useTheme } from '../theme';
import { useLang } from '../lang';
import type { Screen } from '../App';

interface Props {
  active: Screen;
  navigate: (screen: Screen) => void;
}

const SettingsIcon = ({ active, color }: { active: boolean; color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PaymentsIcon = ({ active, color }: { active: boolean; color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="15" x2="7.01" y2="15" strokeWidth="3" />
    <line x1="11" y1="15" x2="13" y2="15" />
  </svg>
);

const HomeIcon = ({ active, color, bgColor }: { active: boolean; color: string; bgColor: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" stroke={active ? bgColor : color} strokeWidth={1.5} />
  </svg>
);

const ReservationsIcon = ({ active, color }: { active: boolean; color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill={active ? color : 'none'} />
  </svg>
);

const NewsIcon = ({ active, color }: { active: boolean; color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
    <path d="M14 2v4a1 1 0 0 0 1 1h4" />
    <path d="M2 15h10" />
    <path d="M2 12h6" />
    <path d="M2 18h10" />
  </svg>
);

const tabs = [
  { id: 'settings' as Screen, label: 'Settings' },
  { id: 'payments' as Screen, label: 'Payments' },
  { id: 'home' as Screen, label: 'Home' },
  { id: 'reservations' as Screen, label: 'Reservations' },
  { id: 'news' as Screen, label: 'News' },
];

export default function BottomNav({ active, navigate }: Props) {
  const { t } = useTheme();
  const { tr } = useLang();

  const labels: Record<string, string> = {
    settings: tr('nav_settings'),
    payments: tr('nav_payments'),
    home: tr('nav_home'),
    reservations: tr('nav_reservations'),
    news: tr('nav_news'),
  };

  return (
    <div
      className="bottom-nav flex-shrink-0 flex items-end pt-2"
      style={{ background: t.navBg, borderTop: `1px solid ${t.border}`, transition: 'background 0.3s, border-color 0.3s' }}
    >
      {tabs.map(({ id }) => {
        const label = labels[id] ?? id;
        const isActive = active === id;
        const color = isActive ? t.primary : t.textFaint;
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="flex-1 flex flex-col items-center gap-1 pt-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {id === 'settings' && <SettingsIcon active={isActive} color={color} />}
            {id === 'payments' && <PaymentsIcon active={isActive} color={color} />}
            {id === 'home' && <HomeIcon active={isActive} color={color} bgColor={t.navBg} />}
            {id === 'reservations' && <ReservationsIcon active={isActive} color={color} />}
            {id === 'news' && <NewsIcon active={isActive} color={color} />}
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color, letterSpacing: 0.2 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
