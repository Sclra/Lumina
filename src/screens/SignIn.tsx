import { useState } from 'react';
import type { NavProps } from '../App';
import { useTheme } from '../theme';
import { useManager } from '../managerStore';
import { useLang } from '../lang';

type Role = 'resident' | 'manager';

function BuildingIllustration({ dark }: { dark: boolean }) {
  const bld1 = dark ? '#1E2B26' : '#C8BFB0';
  const bld2 = dark ? '#172018' : '#BCB3A4';
  const bld3 = dark ? '#1C2820' : '#C4BAA8';
  const win = dark ? '#0D1A14' : '#ACA49A';
  const ground = dark ? '#0E1810' : '#C4BAA6';
  const treeFill = dark ? '#1A3020' : '#8EA88A';
  const treeOp = dark ? 0.7 : 0.55;
  const sky = dark ? '#0E1410' : '#E8E3D8';
  const base = dark ? '#111814' : '#EDE9E0';

  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="320" height="180" fill={base} />
      <rect width="320" height="100" fill={sky} />
      <rect x="10" y="68" width="72" height="112" fill={bld1} rx="4" />
      <rect x="20" y="78" width="14" height="11" fill={win} rx="2" opacity="0.7" />
      <rect x="40" y="78" width="14" height="11" fill={win} rx="2" opacity="0.8" />
      <rect x="58" y="78" width="14" height="11" fill={win} rx="2" opacity="0.7" />
      <rect x="20" y="96" width="14" height="11" fill={win} rx="2" opacity="0.6" />
      <rect x="40" y="96" width="14" height="11" fill={win} rx="2" opacity="0.8" />
      <rect x="58" y="96" width="14" height="11" fill={win} rx="2" opacity="0.6" />
      <rect x="20" y="114" width="14" height="11" fill={win} rx="2" opacity="0.7" />
      <rect x="58" y="114" width="14" height="11" fill={win} rx="2" opacity="0.7" />
      <rect x="35" y="148" width="22" height="32" fill={dark ? '#162018' : '#B0A898'} rx="2" />
      <rect x="110" y="22" width="100" height="158" fill={bld2} rx="5" />
      <rect x="122" y="35" width="16" height="12" fill={win} rx="2" opacity="0.75" />
      <rect x="146" y="35" width="16" height="12" fill={win} rx="2" opacity="0.85" />
      <rect x="170" y="35" width="16" height="12" fill={win} rx="2" opacity="0.75" />
      <rect x="122" y="54" width="16" height="12" fill={win} rx="2" opacity="0.7" />
      <rect x="146" y="54" width="16" height="12" fill={win} rx="2" opacity="0.8" />
      <rect x="170" y="54" width="16" height="12" fill={win} rx="2" opacity="0.7" />
      <rect x="122" y="73" width="16" height="12" fill={win} rx="2" opacity="0.8" />
      <rect x="146" y="73" width="16" height="12" fill={win} rx="2" opacity="0.65" />
      <rect x="170" y="73" width="16" height="12" fill={win} rx="2" opacity="0.8" />
      <rect x="122" y="92" width="16" height="12" fill={win} rx="2" opacity="0.75" />
      <rect x="146" y="92" width="16" height="12" fill={win} rx="2" opacity="0.85" />
      <rect x="170" y="92" width="16" height="12" fill={win} rx="2" opacity="0.7" />
      <rect x="122" y="111" width="16" height="12" fill={win} rx="2" opacity="0.7" />
      <rect x="146" y="111" width="16" height="12" fill={win} rx="2" opacity="0.8" />
      <rect x="170" y="111" width="16" height="12" fill={win} rx="2" opacity="0.75" />
      <rect x="148" y="145" width="24" height="35" fill={dark ? '#102018' : '#A89E90'} rx="2" />
      <rect x="228" y="50" width="80" height="130" fill={bld3} rx="4" />
      <rect x="238" y="62" width="14" height="11" fill={win} rx="2" opacity="0.75" />
      <rect x="258" y="62" width="14" height="11" fill={win} rx="2" opacity="0.85" />
      <rect x="278" y="62" width="14" height="11" fill={win} rx="2" opacity="0.75" />
      <rect x="238" y="80" width="14" height="11" fill={win} rx="2" opacity="0.65" />
      <rect x="258" y="80" width="14" height="11" fill={win} rx="2" opacity="0.8" />
      <rect x="278" y="80" width="14" height="11" fill={win} rx="2" opacity="0.65" />
      <rect x="238" y="98" width="14" height="11" fill={win} rx="2" opacity="0.75" />
      <rect x="278" y="98" width="14" height="11" fill={win} rx="2" opacity="0.7" />
      <rect x="249" y="148" width="22" height="32" fill={dark ? '#142018' : '#ACA498'} rx="2" />
      <rect x="0" y="173" width="320" height="7" fill={ground} />
      <ellipse cx="94" cy="148" rx="20" ry="22" fill={treeFill} opacity={treeOp} />
      <rect x="91" y="160" width="6" height="20" fill={dark ? '#122010' : '#7A9470'} opacity="0.5" />
      <ellipse cx="218" cy="152" rx="17" ry="19" fill={treeFill} opacity={treeOp - 0.05} />
      <rect x="215" y="162" width="6" height="18" fill={dark ? '#122010' : '#7A9470'} opacity="0.5" />
      <rect x="128" y="4" width="64" height="14" rx="3" fill={dark ? '#2E8060' : '#1A4A38'} opacity="0.15" />
      <text x="160" y="14" textAnchor="middle" fontSize="7" fill={dark ? '#2E8060' : '#1A4A38'} fontWeight="600" letterSpacing="2" opacity="0.9">LUMINA</text>
    </svg>
  );
}

export default function SignIn({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { apartment } = useManager();
  const { tr, isRTL } = useLang();
  const [role, setRole] = useState<Role>('resident');
  const [apartmentId, setApartmentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isManager = role === 'manager';

  const handleSignIn = () => {
    if (!apartmentId || !password) {
      setError(isManager ? tr('signin_error_manager') : tr('signin_error_resident'));
      return;
    }
    setError(''); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isManager) navigate(apartment ? 'm-dashboard' : 'm-setup');
      else navigate('home');
    }, 900);
  };

  const switchRole = (r: Role) => { setRole(r); setError(''); setApartmentId(''); setPassword(''); };

  const field: React.CSSProperties = {
    display: 'flex', alignItems: 'center',
    background: t.inputBg, border: `1.5px solid ${t.cardBorder}`,
    borderRadius: 12, padding: '12px 14px', gap: 10,
    transition: 'background 0.3s, border-color 0.3s',
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', transition: 'background 0.3s' }}>
      <div style={{ background: darkMode ? '#0D1210' : '#EDE9E0', overflow: 'hidden' }}>
        <BuildingIllustration dark={darkMode} />
      </div>

      <div style={{ padding: '28px 28px 32px', flex: 1 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: t.primary, textTransform: 'uppercase', marginBottom: 8 }}>
          {tr('app_name')}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 6 }}>{isManager ? tr('signin_manager_title') : tr('signin_resident_title')}</h1>
        <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.5 }}>
          {isManager ? tr('signin_manager_desc') : tr('signin_resident_desc')}
        </p>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: 4, background: t.mutedSurface, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {([['resident', tr('signin_role_resident')], ['manager', tr('signin_role_manager')]] as [Role, string][]).map(([r, label]) => {
            const active = role === r;
            return (
              <button key={r} onClick={() => switchRole(r)} style={{
                flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: active ? t.primary : 'transparent', color: active ? t.primaryText : t.textMuted,
                fontWeight: 600, fontSize: 13, transition: 'background 0.2s, color 0.2s',
              }}>{label}</button>
            );
          })}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{isManager ? tr('signin_manager_email_label') : tr('signin_apartment_id_label')}</label>
          <div style={field}>
            {isManager ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 6 10-6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="7" width="20" height="14" rx="3" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            )}
            <input type="text" placeholder={isManager ? tr('signin_email_placeholder') : tr('signin_apt_placeholder')} value={apartmentId}
              onChange={e => { setApartmentId(e.target.value); setError(''); }}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: t.text }} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{tr('signin_password_label')}</label>
          <div style={field}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: t.text }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {showPassword
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              }
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div onClick={() => setRemember(!remember)} style={{
              width: 18, height: 18, borderRadius: 5,
              border: `2px solid ${remember ? t.primary : t.textFaint}`,
              background: remember ? t.primary : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {remember && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontSize: 13, color: t.textMuted }}>{tr('signin_remember_me')}</span>
          </label>
          <button style={{ fontSize: 13, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('signin_forgot')}</button>
        </div>

        {error && (
          <div style={{ background: t.dueBg, border: `1px solid ${t.dueDot}40`, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: t.dueText, margin: 0 }}>{error}</p>
          </div>
        )}

        <button onClick={handleSignIn} disabled={loading} style={{
          width: '100%', padding: '16px', borderRadius: 14,
          background: loading ? t.primary + 'AA' : t.primary,
          color: t.primaryText, fontWeight: 600, fontSize: 15,
          border: 'none', cursor: loading ? 'default' : 'pointer',
          letterSpacing: 0.2, transition: 'background 0.2s',
        }}>
          {loading ? tr('signin_signing_in') : isManager ? tr('signin_manager_btn') : tr('signin_resident_btn')}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: t.textFaint }}>
          {isManager ? (
            <>{tr('signin_new_property')}{' '}
              <button onClick={() => navigate('m-setup')} style={{ color: t.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('signin_setup_building')}</button>
            </>
          ) : (
            <>{tr('signin_new_resident')}{' '}
              <button style={{ color: t.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('signin_contact_mgmt')}</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
