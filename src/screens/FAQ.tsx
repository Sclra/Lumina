import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

export default function FAQ({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: tr('faq_q1'), a: tr('faq_a1') },
    { q: tr('faq_q2'), a: tr('faq_a2') },
    { q: tr('faq_q3'), a: tr('faq_a3') },
    { q: tr('faq_q4'), a: tr('faq_a4') },
    { q: tr('faq_q5'), a: tr('faq_a5') },
    { q: tr('faq_q6'), a: tr('faq_a6') },
  ];

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('faq_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('faq_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ background: t.card, border: `1.5px solid ${isOpen ? t.primary + '60' : t.cardBorder}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, background 0.3s' }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, lineHeight: 1.4 }}>{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"
                  style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {isOpen && (
                <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${t.borderLight}` }}>
                  <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, marginTop: 12 }}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ margin: '20px 24px 0', background: t.primaryPale, border: `1px solid ${t.primary}30`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p style={{ fontSize: 12, color: t.primary, lineHeight: 1.5 }}>{tr('faq_hint')}</p>
      </div>
    </div>
  );
}
