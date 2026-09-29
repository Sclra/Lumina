import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme, type AccentTone } from '../theme';
import { useLang } from '../lang';

const ACCENT_COLORS: { tone: AccentTone; color: string; labelKey: 'pref_accent_green' | 'pref_accent_purple' | 'pref_accent_blue' }[] = [
  { tone: 'green', color: '#2E8060', labelKey: 'pref_accent_green' },
  { tone: 'purple', color: '#7A5EA0', labelKey: 'pref_accent_purple' },
  { tone: 'blue', color: '#285A91', labelKey: 'pref_accent_blue' },
];

function Toggle({ on, onChange, primaryColor }: { on: boolean; onChange: (v: boolean) => void; primaryColor: string }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 44, height: 26, borderRadius: 13, background: on ? primaryColor : '#C0BAB2', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, padding: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
    </button>
  );
}

export default function Preferences({ goBack }: NavProps) {
  const { t, darkMode, setDarkMode, accentTone, setAccentTone } = useTheme();
  const { tr, isRTL } = useLang();
  const [pendingAccent, setPendingAccent] = useState<AccentTone>(accentTone);

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('pref_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('pref_subtitle')}</p>
      </div>

      {/* DISPLAY */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.textFaint, textTransform: 'uppercase', padding: '0 24px', marginBottom: 8 }}>{tr('pref_display')}</p>
      <div style={{ margin: '0 24px 20px', background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
        {/* Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: `1px solid ${t.borderLight}` }}>
          <span style={{ fontSize: 14, color: t.text, fontWeight: 500 }}>{tr('pref_dark_mode')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: t.textFaint }}>{darkMode ? tr('word_on') : tr('word_off')}</span>
            <Toggle on={darkMode} onChange={setDarkMode} primaryColor={t.primary} />
          </div>
        </div>

        {/* Accent Tone */}
        <div style={{ padding: '16px 18px' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 12 }}>{tr('pref_accent_tone')}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {ACCENT_COLORS.map(({ tone, color, labelKey }) => (
              <button key={tone} type="button" onClick={() => setPendingAccent(tone)} aria-label={tr(labelKey)} aria-pressed={pendingAccent === tone}
                style={{ width: 30, height: 30, borderRadius: '50%', background: color, border: `3px solid ${pendingAccent === tone ? t.text : 'transparent'}`, outline: pendingAccent === tone ? `2px solid ${color}` : 'none', outlineOffset: 2, cursor: 'pointer', padding: 0, transition: 'outline 0.15s' }} />
            ))}
          </div>
          {pendingAccent !== accentTone && (
            <button type="button" onClick={() => setAccentTone(pendingAccent)}
              style={{ width: '100%', marginTop: 18, padding: '12px 16px', border: 'none', borderRadius: 12, background: t.primary, color: t.primaryText, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {tr('pref_confirm_accent')}
            </button>
          )}
        </div>
      </div>

      {/* Dark mode hint */}
      <div style={{ margin: '0 24px', background: t.primaryPale, border: `1px solid ${t.primary}30`, borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p style={{ fontSize: 12, color: t.primary, lineHeight: 1.5 }}>
          {darkMode ? tr('pref_hint_dark_on') : tr('pref_hint_dark_off')}
        </p>
      </div>
    </div>
  );
}
