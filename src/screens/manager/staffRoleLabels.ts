import type { StaffRole } from '../../managerStore';

export const staffRoleLabelKeys = {
  Owner: 'm_staff_role_owner',
  'Property Manager': 'm_staff_role_pm',
  'Front Desk': 'm_staff_role_fd',
  Maintenance: 'm_staff_role_maint',
  Accountant: 'm_staff_role_acct',
} as const satisfies Record<StaffRole, string>;
