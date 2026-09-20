import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager } from '../../managerStore';
import { useLang } from '../../lang';
import { Card } from './mui';

export default function ManagerDashboard({ navigate }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { apartment, units, charges, announcements } = useManager();

  if (!apartment) {
    return (
      <div style={{ background: t.bg, minHeight: '100%', padding: 24 }}>
        <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 16 }}>{tr('m_no_property')}</p>
        <button onClick={() => navigate('m-setup')} style={{ color: t.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>{tr('m_create_building')}</button>
      </div>
    );
  }

  const occupied = units.filter(u => u.status === 'occupied').length;
  const invited = units.filter(u => u.status === 'invited').length;
  const outstanding = charges.filter(c => c.status !== 'paid').reduce((s, c) => s + c.amount, 0);
  const activeAmenities = Object.entries(apartment.amenities).filter(([, v]) => v).length;

  const quickActions = [
    { labelKey: 'm_add_unit' as const, screen: 'm-unit-new' as const, icon: <><path d="M3 21V7l7-4v18" /><path d="M10 21V9l8 4v8" /><path d="M3 21h18" /></> },
    { labelKey: 'm_new_charge' as const, screen: 'm-charge-new' as const, icon: <><path d="M4 3h13l3 3v15l-3-2-3 2-3-2-3 2-3-2V3z" /><line x1="8" y1="8" x2="16" y2="8" /></> },
    { labelKey: 'm_post_news' as const, screen: 'm-news-new' as const, icon: <><path d="M4 22h14a2 2 0 0 0 2-2V4H5a1 1 0 0 0-1 1v15a2 2 0 0 1-4 0V8" /><line x1="8" y1="8" x2="16" y2="8" /></> },
    { labelKey: 'm_add_staff' as const, screen: 'm-staff-new' as const, icon: <><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" /></> },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <div style={{ padding: '16px 24px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('m_console')}</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, lineHeight: 1.15, marginBottom: 4 }}>{apartment.name}</h1>
          <p style={{ fontSize: 12, color: t.textFaint }}>{apartment.address}</p>
        </div>
        <button onClick={() => navigate('signin')} title="Sign out" style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: 10, cursor: 'pointer', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        </button>
      </div>

      {/* Outstanding hero */}
      <div style={{ padding: '0 24px 14px' }}>
        <div style={{ background: t.primary, borderRadius: 18, padding: '18px 20px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>{tr('m_outstanding_label')}</p>
          <p style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1 }}>${outstanding.toFixed(2)}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{charges.filter(c => c.status !== 'paid').length} {tr('m_open_charges')} • {occupied} {tr('m_paying_residents')}</p>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ padding: '0 24px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: tr('m_units_stat'), value: String(units.length), sub: `${occupied} ${tr('m_occupied')} · ${invited} ${tr('m_invited')}`, onClick: () => navigate('m-units') },
          { label: tr('m_capacity_stat'), value: `${apartment.floors * apartment.unitsPerFloor}`, sub: `${apartment.floors} ${tr('m_floors')}` },
          { label: tr('m_amenities_stat'), value: String(activeAmenities), sub: tr('m_active_facilities') },
          { label: tr('m_bulletins_stat'), value: String(announcements.length), sub: tr('m_published'), onClick: () => navigate('m-news') },
        ].map(s => (
          <Card key={s.label} onClick={s.onClick} style={{ padding: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: t.textFaint, marginTop: 4 }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{tr('m_quick_actions')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {quickActions.map(a => (
            <button key={a.labelKey} onClick={() => navigate(a.screen)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.3s' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: t.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tr(a.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
