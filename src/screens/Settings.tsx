import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

const AccountIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BellIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const GlobeIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const SlidersIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>;
const MessageIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const HelpIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" /></svg>;
const LogOutIcon = ({ color }: { color: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const ChevronIcon = ({ color }: { color: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>;

export default function Settings({ navigate, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const [search, setSearch] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const isManager = !!params.isManager;

  const items = [
    { id: 'accounts',               label: tr('settings_accounts'),      Icon: AccountIcon },
    { id: 'notifications-settings', label: tr('settings_notifications'), Icon: BellIcon },
    { id: 'language-settings',      label: tr('settings_language'),      Icon: GlobeIcon },
    { id: 'preferences',            label: tr('settings_preferences'),   Icon: SlidersIcon },
    { id: 'faq',                    label: tr('settings_faq'),           Icon: HelpIcon },
    { id: 'feedback',               label: tr('settings_feedback'),      Icon: MessageIcon },
    { id: 'logout',                 label: tr('settings_logout'),        Icon: LogOutIcon, danger: true },
  ];

  const filtered = search ? items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())) : items;

  const handleItemClick = (id: string) => {
    if (id === 'logout') { setShowLogout(true); return; }
    if (id === 'preferences') { navigate('preferences'); return; }
    if (id === 'faq') { navigate('faq'); return; }
    if (id === 'feedback') { navigate('feedback'); return; }
    if (id === 'language-settings') { navigate('language-settings'); return; }
    if (id === 'notifications-settings') { navigate('notifications-settings'); return; }
    if (id === 'accounts') { navigate('accounts', { isManager }); return; }
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s', position: 'relative' }}>
      <div style={{ padding: '16px 24px 16px' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 2 }}>{tr('settings_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint, marginBottom: 16 }}>
          {isManager ? tr('settings_subtitle_manager') : tr('settings_subtitle_resident')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.inputBg, border: `1.5px solid ${t.cardBorder}`, borderRadius: 14, padding: '12px 14px', transition: 'background 0.3s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input type="text" placeholder={tr('settings_search')} value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: t.text, direction: isRTL ? 'rtl' : 'ltr' }} />
        </div>
      </div>

      {/* Profile card */}
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{ background: t.primary, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>{isManager ? 'AM' : 'SJ'}</span>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 3 }}>
              {isManager ? tr('settings_profile_manager') : tr('settings_profile_resident')}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)' }}>
              {isManager ? tr('settings_profile_manager_sub') : tr('settings_profile_resident_sub')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: t.textFaint, textTransform: 'uppercase' }}>{tr('settings_account_section')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.3s' }}>
          {filtered.map((item, i) => {
            const isDanger = (item as any).danger;
            const color = isDanger ? t.dueText : t.primary;
            const textColor = isDanger ? t.dueText : t.text;
            return (
              <button key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'none', border: 'none', borderBottom: i < filtered.length - 1 ? `1px solid ${t.borderLight}` : 'none', cursor: 'pointer', textAlign: isRTL ? 'right' : 'left' }}>
                <item.Icon color={color} />
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: textColor }}>{item.label}</span>
                {!isDanger && <ChevronIcon color={t.textFaint} />}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: t.textFaint }}>{tr('settings_version')}</p>

      {/* Logout overlay */}
      {showLogout && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ background: t.card, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', transition: 'background 0.3s' }}>
            <div style={{ width: 36, height: 4, background: t.cardBorder, borderRadius: 4, margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, textAlign: 'center', marginBottom: 8 }}>{tr('logout_title')}</h3>
            <p style={{ fontSize: 14, color: t.textFaint, textAlign: 'center', lineHeight: 1.5, marginBottom: 24 }}>
              {isManager ? tr('logout_msg_manager') : tr('logout_msg_resident')}
            </p>
            <button onClick={() => navigate('signin')} style={{ width: '100%', padding: '15px', borderRadius: 14, marginBottom: 10, background: t.dueBg, color: t.dueText, fontWeight: 600, fontSize: 15, border: `1px solid ${t.dueDot}40`, cursor: 'pointer' }}>
              {tr('btn_yes_sign_out')}
            </button>
            <button onClick={() => setShowLogout(false)} style={{ width: '100%', padding: '15px', borderRadius: 14, background: t.mutedSurface, color: t.text, fontWeight: 600, fontSize: 15, border: `1px solid ${t.cardBorder}`, cursor: 'pointer' }}>
              {tr('btn_cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
