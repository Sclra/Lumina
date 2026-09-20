import type { NavProps, PaymentType } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

type MonthStatus = 'PAID' | 'DUE' | 'FUTURE';

const paymentDataBase: Record<PaymentType, { nameKey: string; statuses: MonthStatus[]; amounts: number[] }> = {
  apartment: { nameKey: 'payments_apartment', statuses: ['PAID','PAID','PAID','PAID','PAID','PAID','PAID','PAID','PAID','FUTURE','FUTURE','FUTURE'], amounts: [185,185,185,185,185,185,185,185,185,185,185,185] },
  water:     { nameKey: 'payments_water', statuses: ['PAID','PAID','PAID','PAID','PAID','PAID','PAID','DUE','FUTURE','FUTURE','FUTURE','FUTURE'], amounts: [38,41,36,44,39,43,40,42.5,42,42,42,42] },
  energy:    { nameKey: 'payments_energy', statuses: ['PAID','PAID','PAID','PAID','PAID','PAID','PAID','DUE','FUTURE','FUTURE','FUTURE','FUTURE'], amounts: [102,98,112,95,108,118,105,118.9,115,115,115,115] },
};

export default function PaymentDetail({ navigate, goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const type = params.paymentType ?? 'apartment';
  const MONTHS = [tr('month_jan'),tr('month_feb'),tr('month_mar'),tr('month_apr'),tr('month_may'),tr('month_jun'),tr('month_jul'),tr('month_aug'),tr('month_sep'),tr('month_oct'),tr('month_nov'),tr('month_dec')];
  const base = paymentDataBase[type];
  const data = { ...base, name: tr(base.nameKey as Parameters<typeof tr>[0]) };

  const dotColor = (s: MonthStatus) => s === 'PAID' ? t.paidDot : s === 'DUE' ? t.dueDot : t.futureDot;
  const labelColor = (s: MonthStatus) => s === 'PAID' ? t.paidText : s === 'DUE' ? t.dueText : t.futureText;

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 24 }}>
      <div style={{ padding: '14px 24px 0' }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('payments_breadcrumb')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 20 }}>{data.name}</h1>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {Array.from({ length: 4 }, (_, rowIdx) => (
            <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: rowIdx < 3 ? `1px solid ${t.borderLight}` : 'none' }}>
              {[0, 1, 2].map((colIdx) => {
                const monthIdx = rowIdx * 3 + colIdx;
                const status = data.statuses[monthIdx];
                const amount = data.amounts[monthIdx];
                return (
                  <div key={colIdx} onClick={() => status !== 'FUTURE' && navigate('monthly-detail', { paymentType: type, month: monthIdx })}
                    style={{
                      padding: '14px 16px',
                      borderRight: colIdx < 2 ? `1px solid ${t.borderLight}` : 'none',
                      cursor: status !== 'FUTURE' ? 'pointer' : 'default',
                      background: status === 'FUTURE' ? t.mutedSurface : 'transparent',
                    }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: status === 'FUTURE' ? t.textFaint : t.text, marginBottom: 5 }}>{MONTHS[monthIdx]}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor(status), flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: labelColor(status), letterSpacing: '0.04em' }}>{status === 'PAID' ? tr('word_paid') : status === 'DUE' ? tr('word_due') : tr('word_future')}</span>
                    </div>
                    {status !== 'FUTURE' && <p style={{ fontSize: 11, color: t.textFaint, marginTop: 3 }}>${amount.toFixed(0)}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 18, marginTop: 16, padding: '0 4px' }}>
          {(['PAID','DUE','FUTURE'] as MonthStatus[]).map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor(s) }} />
              <span style={{ fontSize: 11, color: t.textFaint, fontWeight: 500 }}>{s === 'PAID' ? tr('word_paid_cap') : s === 'DUE' ? tr('word_due_cap') : tr('word_upcoming')}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: t.textFaint, marginTop: 10, textAlign: 'center' }}>{tr('payments_tap_hint')}</p>
      </div>
    </div>
  );
}
