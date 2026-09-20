import type { ReactNode, CSSProperties } from 'react';
import { useTheme, type ThemeTokens } from '../../theme';
import { useLang } from '../../lang';

export function useMui() {
  const { t, darkMode } = useTheme();
  return { t, darkMode };
}

export function ManagerHeader({
  eyebrow, title, subtitle, onBack, action,
}: { eyebrow?: string; title: string; subtitle?: string; onBack?: () => void; action?: ReactNode }) {
  const { t } = useTheme();
  const { tr } = useLang();
  return (
    <div style={{ padding: onBack ? '10px 24px 16px' : '16px 24px 16px' }}>
      {onBack && (
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 13, padding: 0, marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          {tr('btn_back')}
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {eyebrow && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{eyebrow}</p>}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.15, marginBottom: subtitle ? 4 : 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: t.textFaint }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Field({
  label, children, hint,
}: { label: string; children: ReactNode; hint?: string }) {
  const { t } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: t.textFaint, marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

export function inputStyle(t: ThemeTokens): CSSProperties {
  return {
    width: '100%', background: t.inputBg, border: `1.5px solid ${t.cardBorder}`,
    borderRadius: 12, padding: '12px 14px', fontSize: 15, color: t.text,
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };
}

export function PrimaryButton({
  children, onClick, disabled, icon,
}: { children: ReactNode; onClick?: () => void; disabled?: boolean; icon?: ReactNode }) {
  const { t } = useTheme();
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '15px', borderRadius: 14,
      background: disabled ? t.primary + '99' : t.primary, color: t.primaryText,
      fontWeight: 600, fontSize: 15, border: 'none', cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
    }}>
      {icon}{children}
    </button>
  );
}

export function Card({ children, style, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  const { t } = useTheme();
  return (
    <div onClick={onClick} style={{
      background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: 16,
      transition: 'background 0.3s, border-color 0.3s', cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      {children}
    </div>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: 'paid' | 'due' | 'future' | 'primary' }) {
  const { t } = useTheme();
  const map = {
    paid: { bg: t.paidBg, fg: t.paidText },
    due: { bg: t.dueBg, fg: t.dueText },
    future: { bg: t.futureBg, fg: t.futureText },
    primary: { bg: t.primaryPale, fg: t.primary },
  }[tone];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em', background: map.bg, color: map.fg, textTransform: 'uppercase' }}>{label}</span>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useTheme();
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 46, height: 27, borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? t.primary : t.futureDot, position: 'relative', transition: 'background 0.2s', padding: 0,
    }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}
