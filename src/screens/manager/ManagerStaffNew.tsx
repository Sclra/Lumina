import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type StaffRole } from '../../managerStore';
import { ManagerHeader, Field, inputStyle, PrimaryButton } from './mui';
import { useLang } from '../../lang';

export default function ManagerStaffNew({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { addStaff } = useManager();

  const roles: { id: StaffRole; desc: string }[] = [
    { id: 'Property Manager', desc: tr('m_staff_role_pm_desc') },
    { id: 'Front Desk', desc: tr('m_staff_role_fd_desc') },
    { id: 'Maintenance', desc: tr('m_staff_role_maint_desc') },
    { id: 'Accountant', desc: tr('m_staff_role_acct_desc') },
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('Property Manager');

  const canSubmit = name.trim() && email.trim();

  const submit = () => {
    if (!canSubmit) return;
    addStaff({ name: name.trim(), email: email.trim(), role, active: true });
    goBack();
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <ManagerHeader eyebrow={tr('m_eyebrow_access')} title={tr('m_staff_new_title')} onBack={goBack} />

      <div style={{ padding: '0 24px' }}>
        <Field label={tr('m_staff_name_field')}>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle(t)} placeholder="e.g. Priya Nair" />
        </Field>
        <Field label={tr('m_staff_email_field')}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle(t)} placeholder="name@lumina.co" />
        </Field>

        <label style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>{tr('m_staff_role_perms')}</label>
        <div style={{ marginBottom: 20 }}>
          {roles.map(r => {
            const on = role === r.id;
            return (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                background: on ? t.primaryPale : t.card, border: `1.5px solid ${on ? t.primary : t.cardBorder}`,
                borderRadius: 12, padding: '13px 14px', cursor: 'pointer', marginBottom: 8, transition: 'all 0.15s',
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${on ? t.primary : t.textFaint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <div style={{ width: 9, height: 9, borderRadius: '50%', background: t.primary }} />}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: on ? t.primary : t.text, marginBottom: 1 }}>{r.id}</p>
                  <p style={{ fontSize: 11.5, color: t.textFaint }}>{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <PrimaryButton onClick={submit} disabled={!canSubmit}>{tr('m_staff_send_invite')}</PrimaryButton>
      </div>
    </div>
  );
}
