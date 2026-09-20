import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, genPassword } from '../../managerStore';
import { ManagerHeader, Card, StatusPill, PrimaryButton } from './mui';
import { useLang } from '../../lang';

export default function ManagerUnitDetail({ params, goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { units, updateUnit } = useManager();
  const unit = units.find(u => u.id === params.unitId);
  const [justSent, setJustSent] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (!unit) {
    return (
      <div style={{ background: t.bg, minHeight: '100%' }}>
        <ManagerHeader title={tr('m_units_title')} onBack={goBack} />
        <p style={{ padding: '0 24px', color: t.textMuted, fontSize: 14 }}>{tr('m_unit_not_found')}</p>
      </div>
    );
  }

  const sendCreds = () => {
    const password = unit.password ?? genPassword();
    updateUnit(unit.id, { password, credsSent: true, status: unit.owner ? 'invited' : unit.status });
    setJustSent(true);
    setShowPw(true);
  };

  const rows = [
    { k: tr('m_unit_row_owner'), v: unit.owner || tr('m_word_unassigned') },
    { k: tr('m_unit_row_email'), v: unit.email || '—' },
    { k: tr('m_unit_row_floor'), v: String(unit.floor) },
    { k: tr('m_unit_row_bedrooms'), v: `${unit.bedrooms} BR` },
    { k: tr('m_unit_row_balance'), v: unit.balance > 0 ? `$${unit.balance.toFixed(2)}` : tr('m_word_settled') },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <ManagerHeader eyebrow={`Unit ${unit.label}`} title={unit.owner || tr('m_word_vacant_unit')} onBack={goBack}
        action={<StatusPill label={unit.status} tone={unit.status === 'occupied' ? 'paid' : unit.status === 'invited' ? 'primary' : 'future'} />} />

      <div style={{ padding: '0 24px' }}>
        <Card style={{ marginBottom: 12, padding: 0 }}>
          {rows.map((r, i) => (
            <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderTop: i ? `1px solid ${t.borderLight}` : 'none' }}>
              <span style={{ fontSize: 13, color: t.textMuted }}>{r.k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{r.v}</span>
            </div>
          ))}
        </Card>

        {/* Credentials block */}
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '18px 0 10px' }}>{tr('m_unit_portal_access')}</p>

        {justSent && (
          <div style={{ background: t.paidBg, border: `1px solid ${t.paidDot}40`, borderRadius: 12, padding: '11px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <span style={{ fontSize: 12.5, color: t.paidText, fontWeight: 500 }}>{tr('m_unit_creds_sent_to')} {unit.email || tr('m_word_unassigned')}.</span>
          </div>
        )}

        <Card>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{tr('m_unit_apt_id')}</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: 0.5 }}>{unit.label}</p>
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{tr('m_unit_temp_pw')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: unit.password ? t.text : t.textFaint, letterSpacing: 0.5, fontFamily: 'monospace' }}>
                {unit.password ? (showPw ? unit.password : '••••••••') : tr('m_unit_not_generated')}
              </p>
              {unit.password && (
                <button onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.primary, fontSize: 12, fontWeight: 600, padding: 0 }}>
                  {showPw ? tr('m_word_hide') : tr('m_word_reveal')}
                </button>
              )}
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 14 }}>
          <PrimaryButton onClick={sendCreds}
            icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>}>
            {unit.credsSent ? tr('m_unit_resend_creds') : tr('m_units_send_creds')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
