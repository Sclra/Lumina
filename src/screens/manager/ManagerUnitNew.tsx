import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, genPassword } from '../../managerStore';
import { ManagerHeader, Field, inputStyle, PrimaryButton } from './mui';
import { useLang } from '../../lang';

export default function ManagerUnitNew({ params, goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { addUnit, updateUnit, units, apartment } = useManager();
  const existing = units.find(u => u.id === params.unitId);
  const editing = !!params.unitId;

  const [label, setLabel] = useState(existing?.label ?? '');
  const [floor, setFloor] = useState(existing ? String(existing.floor) : '');
  const [owner, setOwner] = useState(existing?.owner ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [invite, setInvite] = useState(true);

  const normalizedLabel = label.trim().toUpperCase();
  const duplicate = units.some(u => u.id !== existing?.id && u.label.toLocaleLowerCase() === normalizedLabel.toLocaleLowerCase());
  const canSubmit = normalizedLabel && Number(floor) > 0 && !duplicate && (!editing || !!existing);

  const submit = () => {
    if (!canSubmit) return;
    const hasOwner = owner.trim().length > 0;
    if (editing && existing) {
      const identityChanged = existing.owner !== owner.trim() || existing.email !== email.trim();
      updateUnit(existing.id, {
        label: normalizedLabel, floor: Number(floor), owner: owner.trim(), email: email.trim(),
        ...(identityChanged ? { status: hasOwner ? 'occupied' : 'vacant', password: null, credsSent: false } : {}),
      });
      goBack();
      return;
    }
    addUnit({
      label: normalizedLabel,
      floor: Number(floor),
      owner: owner.trim(),
      email: email.trim(),
      status: hasOwner ? (invite ? 'invited' : 'occupied') : 'vacant',
      password: hasOwner && invite ? genPassword() : null,
      credsSent: hasOwner && invite,
      balance: 0,
    });
    goBack();
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <ManagerHeader eyebrow={tr('m_eyebrow_asset')} title={tr(editing ? 'm_unit_edit_title' : 'm_unit_new_title')} onBack={goBack} />

      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label={tr('m_unit_label_field')} hint={tr('m_unit_label_hint')}>
              <input value={label} onChange={e => setLabel(e.target.value)} style={inputStyle(t)} placeholder="402-B" />
            </Field>
          </div>
          <div style={{ width: 96 }}>
            <Field label={tr('m_unit_row_floor')}>
              <input value={floor} onChange={e => setFloor(e.target.value.replace(/\D/g, ''))} inputMode="numeric" style={inputStyle(t)}
                placeholder={apartment ? `1–${apartment.floors}` : '1'} />
            </Field>
          </div>
        </div>

        <div style={{ height: 1, background: t.borderLight, margin: '6px 0 16px' }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{tr('m_unit_resident_section')}</p>

        <Field label={tr('m_unit_row_owner')}>
          <input value={owner} onChange={e => setOwner(e.target.value)} style={inputStyle(t)} placeholder={tr('m_unit_name_placeholder')} />
        </Field>
        <Field label={tr('m_unit_row_email')}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle(t)} placeholder="resident@email.com" />
        </Field>

        {!editing && <button onClick={() => setInvite(!invite)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
          background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', marginBottom: 20,
        }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, background: invite ? t.primary : 'transparent', border: `2px solid ${invite ? t.primary : t.textFaint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {invite && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{tr('m_unit_gen_creds')}</p>
            <p style={{ fontSize: 11.5, color: t.textFaint }}>{tr('m_unit_gen_creds_desc')}</p>
          </div>
        </button>}

        {duplicate && <p style={{ fontSize: 12, color: t.dueText, marginBottom: 12 }}>{tr('m_unit_duplicate')}</p>}
        <PrimaryButton onClick={submit} disabled={!canSubmit}>{tr(editing ? 'm_unit_save_btn' : 'm_unit_create_btn')}</PrimaryButton>
      </div>
    </div>
  );
}
