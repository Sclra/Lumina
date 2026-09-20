import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type UnitStatus } from '../../managerStore';
import { ManagerHeader, StatusPill } from './mui';
import { useLang } from '../../lang';

const statusTone: Record<UnitStatus, 'paid' | 'primary' | 'future'> = {
  occupied: 'paid', invited: 'primary', vacant: 'future',
};

export default function ManagerUnits({ navigate }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { units, apartment } = useManager();

  const statusLabel: Record<UnitStatus, string> = {
    occupied: tr('m_units_occupied'),
    invited: tr('m_units_invited'),
    vacant: tr('m_units_vacant'),
  };

  const sorted = [...units].sort((a, b) => a.floor - b.floor || a.label.localeCompare(b.label));

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <ManagerHeader
        eyebrow={tr('m_eyebrow_asset')}
        title={tr('m_units_title')}
        subtitle={apartment ? `${units.length} of ${apartment.floors * apartment.unitsPerFloor} units created` : undefined}
        action={
          <button onClick={() => navigate('m-unit-new')} style={{ background: t.primary, border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        }
      />

      <div style={{ padding: '0 24px' }}>
        {sorted.length === 0 && (
          <div style={{ background: t.card, border: `1.5px dashed ${t.cardBorder}`, borderRadius: 16, padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: t.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V7l7-4v18" /><path d="M10 21V9l8 4v8" /><path d="M3 21h18" /></svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 5 }}>{tr('m_units_no_yet')}</p>
            <p style={{ fontSize: 13, color: t.textFaint, lineHeight: 1.5, marginBottom: 16 }}>{tr('m_units_empty_desc')}</p>
            <button onClick={() => navigate('m-unit-new')} style={{ background: t.primary, color: t.primaryText, border: 'none', borderRadius: 12, padding: '11px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{tr('m_units_add')}</button>
          </div>
        )}

        {sorted.map(u => (
          <div key={u.id} onClick={() => navigate('m-unit-detail', { unitId: u.id })}
            style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 10, cursor: 'pointer', transition: 'background 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t.primaryPale, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.primary, lineHeight: 1 }}>{u.label}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 2 }}>{u.owner || tr('m_word_unassigned')}</p>
                  <p style={{ fontSize: 11.5, color: t.textFaint }}>Floor {u.floor} • {u.bedrooms} BR</p>
                </div>
              </div>
              <StatusPill label={statusLabel[u.status]} tone={statusTone[u.status]} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${t.borderLight}` }}>
              <span style={{ fontSize: 11.5, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 5 }}>
                {u.credsSent
                  ? <><span style={{ width: 7, height: 7, borderRadius: '50%', background: t.paidDot }} /> {tr('m_units_creds_sent')}</>
                  : <><span style={{ width: 7, height: 7, borderRadius: '50%', background: t.futureDot }} /> {tr('m_units_not_invited')}</>}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: u.balance > 0 ? t.dueText : t.textMuted }}>
                {u.balance > 0 ? `$${u.balance.toFixed(2)} ${tr('word_due_cap')}` : tr('m_word_settled')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
