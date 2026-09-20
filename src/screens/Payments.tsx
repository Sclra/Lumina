import type { NavProps, PaymentType } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

interface PaymentCard { type: PaymentType; name: string; period: string; amount: string; status: 'PAID' | 'DUE' | 'FUTURE'; due: string; icon: 'home' | 'water' | 'energy' }

const paymentDefs: { type: PaymentType; nameKey: string; period: string; amount: string; status: 'PAID' | 'DUE' | 'FUTURE'; due: string; icon: 'home' | 'water' | 'energy' }[] = [
  { type: 'apartment', nameKey: 'payments_apartment', period: 'Aug 2026', amount: '$120.00', status: 'PAID', due: 'Paid Aug 12', icon: 'home' },
  { type: 'water', nameKey: 'payments_water', period: 'Aug 2026', amount: '$42.50', status: 'DUE', due: 'Due Oct 15, 2026', icon: 'water' },
  { type: 'energy', nameKey: 'payments_energy', period: 'Aug 2026', amount: '$118.90', status: 'DUE', due: 'Due Oct 15, 2026', icon: 'energy' },
];

const iconConfigs = {
  home:   { bg: '#E8F0EE', darkBg: '#0E2018', stroke: '#1A4A38', path: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V13h6v8" /></> },
  water:  { bg: '#E8F2FA', darkBg: '#0A1E2A', stroke: '#2D7A9E', path: <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" /> },
  energy: { bg: '#F5EEF8', darkBg: '#1A102A', stroke: '#7A5EA0', path: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
};

export default function Payments({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();

  const payments: PaymentCard[] = paymentDefs.map(({ nameKey, ...d }) => ({ ...d, name: tr(nameKey as Parameters<typeof tr>[0]) }));

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '16px 24px 20px' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('payments_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('payments_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        {payments.map((p) => {
          const ic = iconConfigs[p.icon];
          const statusBg = p.status === 'PAID' ? t.paidBg : p.status === 'DUE' ? t.dueBg : t.futureBg;
          const statusText = p.status === 'PAID' ? t.paidText : p.status === 'DUE' ? t.dueText : t.futureText;
          return (
            <div key={p.type} onClick={() => navigate('payment-detail', { paymentType: p.type })}
              style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, padding: '18px', marginBottom: 12, cursor: 'pointer', transition: 'background 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: darkMode ? ic.darkBg : ic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ic.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ic.path}</svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: t.textFaint }}>{p.period}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.06em', flexShrink: 0, background: statusBg, color: statusText }}>{p.status === 'PAID' ? tr('word_paid') : p.status === 'DUE' ? tr('word_due') : tr('word_future')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${t.borderLight}` }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{p.status === 'PAID' ? tr('payments_payment_date') : tr('payments_due_date')}</p>
                  <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>{p.due}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{p.amount}</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ margin: '4px 24px 0', background: t.primary, borderRadius: 18, padding: '16px 20px' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{tr('payments_outstanding')}</p>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>$161.40</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{tr('payments_due_count')}</p>
      </div>
    </div>
  );
}
