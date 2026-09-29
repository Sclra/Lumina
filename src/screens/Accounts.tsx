import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { useManager, type CurrentUser } from '../managerStore';

export default function Accounts({ resetTo, goBack }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const { accounts, currentUser, switchUser, clearCurrentUser, apartment } = useManager();

  const selectAccount = (account: CurrentUser) => {
    if (currentUser?.role === account.role && currentUser.identifier.toLocaleLowerCase() === account.identifier.toLocaleLowerCase()) return;
    switchUser(account);
    resetTo(account.role === 'manager' ? (apartment ? 'm-dashboard' : 'm-setup') : 'home');
  };

  const rolePill = (roleKey: 'accounts_resident' | 'accounts_manager') => {
    const isRes = roleKey === 'accounts_resident';
    return (
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 20, background: isRes ? t.paidBg : t.primaryPale, color: isRes ? t.paidText : t.primary }}>
        {tr(roleKey)}
      </span>
    );
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0', marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('app_name_upper')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('accounts_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('accounts_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.textFaint, textTransform: 'uppercase', marginBottom: 8 }}>{tr('accounts_signed_in')}</p>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {accounts.map((acc, i) => {
            const isCurrent = currentUser?.role === acc.role && currentUser.identifier.toLocaleLowerCase() === acc.identifier.toLocaleLowerCase();
            const roleKey = acc.role === 'manager' ? 'accounts_manager' : 'accounts_resident';
            const initials = acc.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('').toUpperCase();
            return (
              <button type="button" key={`${acc.role}:${acc.identifier.toLocaleLowerCase()}`} onClick={() => selectAccount(acc)} aria-current={isCurrent ? 'true' : undefined}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', border: 'none', borderBottom: i < accounts.length - 1 ? `1px solid ${t.borderLight}` : 'none', background: isCurrent ? t.primaryPale : 'none', transition: 'background 0.15s', cursor: isCurrent ? 'default' : 'pointer', textAlign: isRTL ? 'right' : 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}><bdi>{initials}</bdi></span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><bdi>{acc.name}</bdi></p>
                    {isCurrent && <span style={{ fontSize: 10, fontWeight: 600, color: t.primary, background: t.primaryPale, padding: '2px 7px', borderRadius: 10 }}>{tr('word_active')}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: t.textFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><bdi>{acc.email || acc.identifier}</bdi></p>
                </div>
                {rolePill(roleKey)}
              </button>
            );
          })}

          <button onClick={() => { clearCurrentUser(); resetTo('signin'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'none', border: 'none', borderTop: `1px solid ${t.borderLight}`, cursor: 'pointer', textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.mutedSurface, border: `1.5px dashed ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.primary }}>{tr('accounts_add')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div style={{ margin: '20px 24px 0', background: t.primaryPale, border: `1px solid ${t.primary}30`, borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <p style={{ fontSize: 12, color: t.primary, lineHeight: 1.5 }}>{tr('accounts_hint')}</p>
      </div>
    </div>
  );
}
