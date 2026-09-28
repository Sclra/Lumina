import { useManager, type Role } from './managerStore';
import { useLang } from './lang';

export function useProfile(role: Role) {
  const { currentUser } = useManager();
  const { tr } = useLang();
  const user = currentUser?.role === role ? currentUser : null;
  const roleLabel = tr(role === 'manager' ? 'accounts_manager' : 'accounts_resident');
  const name = user?.name || roleLabel;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('').toUpperCase();
  const subtitle = user?.unitLabel ? `${tr('profile_unit')} ${user.unitLabel}` : roleLabel;

  return { name, initials, subtitle, detail: user?.email || user?.identifier || roleLabel };
}
