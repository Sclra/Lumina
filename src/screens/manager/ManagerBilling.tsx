import type { ReactElement } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type ChargeType, type ChargeStatus } from '../../managerStore';
import { ManagerHeader, StatusPill } from './mui';
import { useLang } from '../../lang';

const typeMeta: Record<ChargeType, { bg: string; darkBg: string; stroke: string; icon: ReactElement }> = {
  apartment: { bg: '#E8F0EE', darkBg: '#0E2018', stroke: '#1A4A38', icon: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V13h6v8" /></> },
  water: { bg: '#E8F2FA', darkBg: '#0A1E2A', stroke: '#2D7A9E', icon: <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" /> },
  energy: { bg: '#F5EEF8', darkBg: '#1A102A', stroke: '#7A5EA0', icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
  gas: { bg: '#F5EDE0', darkBg: '#1E160A', stroke: '#8A5E3A', icon: <path d="M9 2s5 3 5 8a3 3 0 0 1-6 0c0-1 .5-2 .5-2S6 11 6 14a6 6 0 0 0 12 0c0-6-9-12-9-12z" /> },
};

const statusTone: Record<ChargeStatus, 'future' | 'primary' | 'paid'> = { pending: 'future', sent: 'primary', paid: 'paid' };

export default function ManagerBilling({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();
  const { charges } = useManager();

  const typeLabels: Record<ChargeType, string> = {
    apartment: tr('m_type_apartment'),
    water: tr('m_type_water'),
    energy: tr('m_type_energy'),
    gas: tr('m_type_gas'),
  };

  const outstanding = charges.filter(c => c.status !== 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <ManagerHeader
        eyebrow={tr('m_billing_title')}
        title={tr('m_billing_charges_title')}
        subtitle={tr('m_billing_charges_subtitle')}
        action={
          <button onClick={() => navigate('m-charge-new')} style={{ background: t.primary, border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        }
      />

      <div style={{ padding: '0 24px 14px' }}>
        <div style={{ background: t.primary, borderRadius: 16, padding: '15px 18px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 5 }}>{tr('m_billing_outstanding')}</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>${outstanding.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {charges.length === 0 && (
          <div style={{ background: t.card, border: `1.5px dashed ${t.cardBorder}`, borderRadius: 16, padding: '30px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 5 }}>{tr('m_billing_no_charges_title')}</p>
            <p style={{ fontSize: 13, color: t.textFaint, lineHeight: 1.5, marginBottom: 16 }}>{tr('m_billing_no_charges_desc')}</p>
            <button onClick={() => navigate('m-charge-new')} style={{ background: t.primary, color: t.primaryText, border: 'none', borderRadius: 12, padding: '11px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{tr('m_billing_create_btn')}</button>
          </div>
        )}

        {charges.map(c => {
          const m = typeMeta[c.type];
          return (
            <div key={c.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 10, transition: 'background 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: darkMode ? m.darkBg : m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={m.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 2 }}>{typeLabels[c.type]} {tr('m_billing_charge_word')}</p>
                    <p style={{ fontSize: 11.5, color: t.textFaint }}>{c.target}</p>
                  </div>
                </div>
                <StatusPill label={c.status} tone={statusTone[c.status]} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${t.borderLight}` }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{tr('word_due_cap')}</p>
                  <p style={{ fontSize: 12.5, color: t.textMuted, fontWeight: 500 }}>{c.due}</p>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: t.text }}>${c.amount.toFixed(2)}</p>
              </div>
              {c.link && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, background: t.mutedSurface, borderRadius: 10, padding: '8px 12px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  <span style={{ fontSize: 12, color: t.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.link}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
