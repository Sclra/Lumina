import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

function Toggle({ on, onChange, primaryColor }: { on: boolean; onChange: (v: boolean) => void; primaryColor: string }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{ width: 44, height: 26, borderRadius: 13, background: on ? primaryColor : '#C0BAB2', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, padding: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
    </button>
  );
}

export default function NotificationsSettings({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('notif_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('notif_subtitle')}</p>
      </div>

      {/* Master toggle */}
      <div style={{ padding: '0 24px', marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.textFaint, textTransform: 'uppercase', marginBottom: 8 }}>{tr('notif_push')}</p>
        <div style={{ background: t.card, border: `1.5px solid ${notificationsOn ? t.primary + '50' : t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 3 }}>
                {notificationsOn ? tr('notif_on_label') : tr('notif_off_label')}
              </p>
              <p style={{ fontSize: 12, color: t.textFaint }}>
                {notificationsOn ? tr('notif_receiving') : tr('notif_disabled')}
              </p>
            </div>
            <Toggle on={notificationsOn} onChange={setNotificationsOn} primaryColor={t.primary} />
          </div>
        </div>
      </div>

      {notificationsOn && (
        <div style={{ padding: '0 24px', marginTop: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.textFaint, textTransform: 'uppercase', marginBottom: 8 }}>{tr('notif_types')}</p>
          <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
            {[
              { label: tr('notif_payment_alerts'), desc: tr('notif_payment_desc'), val: paymentAlerts, set: setPaymentAlerts, last: false },
              { label: tr('notif_booking'),        desc: tr('notif_booking_desc'), val: bookingAlerts, set: setBookingAlerts, last: false },
              { label: tr('notif_news_alerts'),    desc: tr('notif_news_desc'),    val: newsAlerts,    set: setNewsAlerts,    last: true },
            ].map(({ label, desc, val, set, last }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: last ? 'none' : `1px solid ${t.borderLight}`, gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: t.text, fontWeight: 500, marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 12, color: t.textFaint }}>{desc}</p>
                </div>
                <Toggle on={val} onChange={set} primaryColor={t.primary} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!notificationsOn && (
        <div style={{ margin: '12px 24px 0', background: t.dueBg, border: `1px solid ${t.dueDot}30`, borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.dueText} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p style={{ fontSize: 12, color: t.dueText, lineHeight: 1.5 }}>{tr('notif_warn')}</p>
        </div>
      )}
    </div>
  );
}
