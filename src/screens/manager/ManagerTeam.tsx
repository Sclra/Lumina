import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type StaffRole } from '../../managerStore';
import { ManagerHeader, Toggle } from './mui';
import { useLang } from '../../lang';

const roleColor: Record<StaffRole, string> = {
  Owner: '#8A5E3A', 'Property Manager': '#1A4A38', 'Front Desk': '#2D7A9E', Maintenance: '#7A5EA0', Accountant: '#5E7A3A',
};

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function ManagerTeam({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();
  const { staff, updateStaff } = useManager();

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <ManagerHeader
        eyebrow={tr('m_eyebrow_access')}
        title={tr('m_team_title')}
        subtitle={tr('m_team_manage_subtitle')}
        action={
          <button onClick={() => navigate('m-staff-new')} style={{ background: t.primary, border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        }
      />

      <div style={{ padding: '0 24px' }}>
        {staff.map(m => {
          const rc = roleColor[m.role];
          return (
            <div key={m.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 10, transition: 'background 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: rc + (darkMode ? '33' : '22'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: rc }}>{initials(m.name)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 2, opacity: m.active ? 1 : 0.5 }}>{m.name}</p>
                  <p style={{ fontSize: 11.5, color: t.textFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: rc, background: rc + (darkMode ? '22' : '18'), padding: '3px 10px', borderRadius: 20, letterSpacing: '0.03em', flexShrink: 0 }}>{m.role}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginTop: 12, borderTop: `1px solid ${t.borderLight}` }}>
                <span style={{ fontSize: 12.5, color: t.textMuted }}>{m.active ? tr('m_team_active_access') : tr('m_team_suspended')}</span>
                <Toggle on={m.active} onChange={v => updateStaff(m.id, { active: v })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
