import type { NavProps, PaymentType } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { formatMoney } from '../formatMoney';
import { getPayment, paymentInfo, type MonthStatus } from '../data/payments';
import { currentSolarDate, formatSolarMonth } from '../data/solarHijri';

export default function PaymentDetail({ navigate, goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL, lang } = useLang();
  const type = params.paymentType ?? 'apartment';
  const today = currentSolarDate();
  const year = params.year ?? today.year;
  const name = tr(paymentInfo[type].nameKey);

  const dotColor = (s: MonthStatus) => s === 'PAID' ? t.paidDot : s === 'DUE' ? t.dueDot : t.futureDot;
  const labelColor = (s: MonthStatus) => s === 'PAID' ? t.paidText : s === 'DUE' ? t.dueText : t.futureText;

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 24 }}>
      <div style={{ padding: '14px 24px 0' }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('payments_breadcrumb')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 20 }}>{name}</h1>
      </div>

      <div style={{ padding: '0 24px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: t.textMuted, marginBottom: 12 }}>{new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', { useGrouping: false }).format(year)}</p>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {Array.from({ length: 4 }, (_, rowIdx) => (
            <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: rowIdx < 3 ? `1px solid ${t.borderLight}` : 'none' }}>
              {[0, 1, 2].map((colIdx) => {
                const monthIdx = rowIdx * 3 + colIdx;
                const payment = getPayment(type, year, monthIdx + 1, today);
                const { status, total: amount } = payment;
                return (
                  <div key={colIdx} onClick={() => status !== 'FUTURE' && navigate('monthly-detail', { paymentType: type, month: monthIdx + 1, year })}
                    style={{
                      padding: '14px 16px',
                      borderRight: colIdx < 2 ? `1px solid ${t.borderLight}` : 'none',
                      cursor: status !== 'FUTURE' ? 'pointer' : 'default',
                      background: status === 'FUTURE' ? t.mutedSurface : 'transparent',
                    }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: status === 'FUTURE' ? t.textFaint : t.text, marginBottom: 5 }}>{formatSolarMonth(year, monthIdx + 1, lang, false)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor(status), flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: labelColor(status), letterSpacing: '0.04em' }}>{status === 'PAID' ? tr('word_paid') : status === 'DUE' ? tr('word_due') : tr('word_future')}</span>
                    </div>
                    {status !== 'FUTURE' && <p style={{ fontSize: 11, color: t.textFaint, marginTop: 3 }}>{formatMoney(amount.toFixed(2), lang)}</p>}
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
