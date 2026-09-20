import { useState } from 'react';
import type { NavProps, PaymentType } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

const paymentInfoBase: Record<PaymentType, { nameKey: string; breakdownKeys: string[]; breakdownAmounts: number[]; dueDay: number; paidDay: number | null }> = {
  apartment: { nameKey: 'payments_apartment', breakdownKeys: ['pb_apartment_base','pb_apartment_maintenance','pb_apartment_parking','pb_apartment_insurance'], breakdownAmounts: [120,35,20,10], dueDay: 15, paidDay: 12 },
  water:     { nameKey: 'payments_water',     breakdownKeys: ['pb_water_base','pb_water_usage','pb_water_infra','pb_water_env'], breakdownAmounts: [22,11.5,5,4], dueDay: 15, paidDay: null },
  energy:    { nameKey: 'payments_energy',    breakdownKeys: ['pb_energy_base','pb_energy_usage','pb_energy_network','pb_energy_carbon'], breakdownAmounts: [85,22.9,8,3], dueDay: 15, paidDay: null },
};

export default function MonthlyDetail({ goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const [downloaded, setDownloaded] = useState(false);
  const type = params.paymentType ?? 'apartment';
  const month = params.month ?? 0;

  const MONTHS = [tr('month_full_jan'),tr('month_full_feb'),tr('month_full_mar'),tr('month_full_apr'),tr('month_full_may'),tr('month_full_jun'),tr('month_full_jul'),tr('month_full_aug'),tr('month_full_sep'),tr('month_full_oct'),tr('month_full_nov'),tr('month_full_dec')];

  const infoBase = paymentInfoBase[type];
  const info = {
    name: tr(infoBase.nameKey as Parameters<typeof tr>[0]),
    breakdowns: infoBase.breakdownKeys.map((k, i) => ({ label: tr(k as Parameters<typeof tr>[0]), amount: infoBase.breakdownAmounts[i] })),
    dueDay: infoBase.dueDay,
    paidDay: infoBase.paidDay,
  };
  const total = info.breakdowns.reduce((s, b) => s + b.amount, 0);
  const isPaid = info.paidDay !== null && month < 8;
  const status: 'PAID' | 'DUE' | 'FUTURE' = isPaid ? 'PAID' : month < 8 ? 'DUE' : 'FUTURE';

  const statusBg = status === 'PAID' ? t.paidBg : status === 'DUE' ? t.dueBg : t.futureBg;
  const statusTx = status === 'PAID' ? t.paidText : status === 'DUE' ? t.dueText : t.futureText;

  const handleDownload = () => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0' }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 2 }}>{MONTHS[month]} 2026</h1>
        <p style={{ fontSize: 13, color: t.textFaint, marginBottom: 18 }}>{info.name}</p>
      </div>

      {/* Amount + Status */}
      <div style={{ padding: '0 24px', marginBottom: 18 }}>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, padding: '20px', transition: 'background 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.06em', display: 'inline-block', marginBottom: 8, background: statusBg, color: statusTx }}>{status === 'PAID' ? tr('word_paid') : status === 'DUE' ? tr('word_due') : tr('word_future')}</span>
              <p style={{ fontSize: 34, fontWeight: 700, color: t.text, lineHeight: 1 }}>${total.toFixed(2)}</p>
              <p style={{ fontSize: 11, color: t.textFaint, marginTop: 4 }}>{info.name}</p>
            </div>
            {status === 'PAID' && (
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.paidBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 14, borderTop: `1px solid ${t.borderLight}` }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{tr('payments_due_date')}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Jan {info.dueDay}, 2026</p>
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{tr('monthly_charged_on')}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: status === 'PAID' ? t.paidText : t.textFaint }}>
                {status === 'PAID' ? `Jan ${info.paidDay}, 2026` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ padding: '0 24px', marginBottom: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{tr('monthly_breakdown')}</p>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {info.breakdowns.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < info.breakdowns.length - 1 ? `1px solid ${t.borderLight}` : 'none' }}>
              <span style={{ fontSize: 14, color: t.text }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>${item.amount.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: t.mutedSurface, borderTop: `2px solid ${t.cardBorder}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Total Statement</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Statement No */}
      <div style={{ padding: '0 24px 4px' }}>
        <p style={{ fontSize: 11, color: t.textFaint }}>Statement No. <span style={{ color: t.textMuted, fontWeight: 500 }}>#LUM-2026-{String(month + 1).padStart(2, '0')}</span></p>
      </div>

      {/* Payment Method */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Payment Method</p>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 26, borderRadius: 5, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>VISA</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Visa Ending in 4242</p>
              <p style={{ fontSize: 12, color: t.textFaint }}>Charged automatically</p>
            </div>
          </div>
          {status === 'PAID' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
        </div>
      </div>

      {/* Download Receipt */}
      <div style={{ padding: '0 24px' }}>
        {downloaded ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px', borderRadius: 14, background: t.paidBg, border: `1.5px solid ${t.paidDot}40` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: t.paidText }}>{tr('monthly_downloaded')}</span>
          </div>
        ) : (
          <button onClick={handleDownload} style={{ width: '100%', padding: '16px', borderRadius: 14, background: t.card, border: `1.5px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.3s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: t.primary }}>{tr('monthly_download')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
