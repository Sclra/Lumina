import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import type { LangKey } from '../translations';

const languages: { id: LangKey; flag: string; native: string; labelKey: 'lang_english' | 'lang_persian_label' }[] = [
  { id: 'en', flag: '🇺🇸', native: 'English', labelKey: 'lang_english' },
  { id: 'fa', flag: '🇮🇷', native: 'فارسی',   labelKey: 'lang_persian_label' },
];

export default function LanguageSettings({ goBack }: NavProps) {
  const { t } = useTheme();
  const { lang, setLang, tr } = useLang();

  // pending = what the user clicked but has not yet confirmed
  const [pending, setPending] = useState<LangKey>(lang);
  const hasChange = pending !== lang;

  const handleConfirm = () => {
    setLang(pending);
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('lang_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('lang_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {languages.map((l, i) => {
            const isSelected = pending === l.id;
            const isActive = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setPending(l.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 18px', background: isSelected ? t.primaryPale : 'none', border: 'none', borderBottom: i < languages.length - 1 ? `1px solid ${t.borderLight}` : 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
              >
                <span style={{ fontSize: 24 }}>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{l.native}</p>
                    {isActive && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: t.primary, background: t.primaryPale, padding: '2px 8px', borderRadius: 10 }}>{tr('word_active')}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: t.textFaint }}>{tr(l.labelKey)}</p>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isSelected ? t.primary : t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.15s' }}>
                  {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.primary }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm button — only shown when user has selected a different language */}
      <div style={{ padding: '16px 24px 0' }}>
        <button
          onClick={handleConfirm}
          disabled={!hasChange}
          style={{
            width: '100%', padding: '15px', borderRadius: 14,
            background: hasChange ? t.primary : t.mutedSurface,
            color: hasChange ? '#FFFFFF' : t.textFaint,
            fontWeight: 600, fontSize: 15, border: 'none',
            cursor: hasChange ? 'pointer' : 'default',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {tr('lang_confirm')}
        </button>
      </div>

      <div style={{ margin: '16px 24px 0', background: t.primaryPale, border: `1px solid ${t.primary}30`, borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p style={{ fontSize: 12, color: t.primary, lineHeight: 1.5 }}>
          {pending === 'fa' ? 'پس از تأیید، زبان کل برنامه به فارسی تغییر می‌کند.' : 'After confirming, the entire app will switch to your selected language.'}
        </p>
      </div>
    </div>
  );
}
