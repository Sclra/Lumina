import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

export default function Feedback({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const [text, setText] = useState('');
  const [categoryKey, setCategoryKey] = useState<'feedback_general' | 'feedback_bug' | 'feedback_feature' | 'feedback_billing'>('feedback_general');
  const [submitted, setSubmitted] = useState(false);

  const categories: { key: typeof categoryKey }[] = [
    { key: 'feedback_general' },
    { key: 'feedback_bug' },
    { key: 'feedback_feature' },
    { key: 'feedback_billing' },
  ];

  if (submitted) {
    return (
      <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
          <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 10 }}>{tr('feedback_thanks')}</h2>
          <p style={{ fontSize: 14, color: t.textFaint, lineHeight: 1.6, marginBottom: 28 }}>{tr('feedback_thanks_msg')}</p>
          <button onClick={goBack}
            style={{ padding: '14px 32px', borderRadius: 14, background: t.primary, color: '#FFFFFF', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
            {tr('feedback_back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('feedback_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('feedback_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: t.textFaint, textTransform: 'uppercase', marginBottom: 10 }}>{tr('feedback_category')}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(({ key }) => {
              const isActive = categoryKey === key;
              return (
                <button key={key} onClick={() => setCategoryKey(key)}
                  style={{ padding: '8px 16px', borderRadius: 20, background: isActive ? t.primary : t.card, border: `1.5px solid ${isActive ? t.primary : t.cardBorder}`, color: isActive ? '#FFFFFF' : t.textMuted, fontWeight: isActive ? 600 : 400, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {tr(key)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: t.textFaint, textTransform: 'uppercase', marginBottom: 10 }}>{tr('feedback_your_feedback')}</p>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={tr('feedback_placeholder')} rows={6}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 14, background: t.inputBg, border: `1.5px solid ${t.cardBorder}`, color: t.text, fontSize: 14, lineHeight: 1.6, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'background 0.3s' }} />
          <p style={{ fontSize: 12, color: t.textFaint, marginTop: 6, textAlign: 'right' }}>{text.length} / 500</p>
        </div>

        <button onClick={() => { if (text.trim()) setSubmitted(true); }} disabled={!text.trim()}
          style={{ width: '100%', padding: '15px', borderRadius: 14, background: text.trim() ? t.primary : t.mutedSurface, color: text.trim() ? '#FFFFFF' : t.textFaint, fontWeight: 600, fontSize: 15, border: 'none', cursor: text.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}>
          {tr('feedback_submit')}
        </button>
      </div>
    </div>
  );
}
