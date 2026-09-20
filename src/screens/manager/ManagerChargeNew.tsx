import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useManager, type ChargeType } from '../../managerStore';
import { ManagerHeader, Field, inputStyle, PrimaryButton, Toggle } from './mui';
import { useLang } from '../../lang';

export default function ManagerChargeNew({ goBack }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();
  const { addCharge, updateUnit, units } = useManager();

  const types = [
    { id: 'apartment' as ChargeType, label: tr('m_type_apartment') },
    { id: 'water' as ChargeType, label: tr('m_type_water') },
    { id: 'energy' as ChargeType, label: tr('m_type_energy') },
    { id: 'gas' as ChargeType, label: tr('m_type_gas') },
  ];

  const [type, setType] = useState<ChargeType>('energy');
  const [target, setTarget] = useState(tr('m_charge_all_units'));
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [withLink, setWithLink] = useState(true);
  const [link, setLink] = useState('https://pay.lumina.co/');

  const canSubmit = Number(amount) > 0 && due.trim();

  const submit = () => {
    if (!canSubmit) return;
    const amt = Number(amount);
    addCharge({
      type, target, amount: amt, due: due.trim(),
      link: withLink ? link.trim() : null,
      status: 'sent',
    });
    // Reflect balances on residents so the resident portal stays consistent.
    if (target === tr('m_charge_all_units')) {
      units.filter(u => u.status !== 'vacant').forEach(u => updateUnit(u.id, { balance: u.balance + amt }));
    } else {
      const u = units.find(x => x.label === target);
      if (u) updateUnit(u.id, { balance: u.balance + amt });
    }
    goBack();
  };

  const targetOptions = [tr('m_charge_all_units'), ...units.map(u => u.label)];

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <ManagerHeader eyebrow={tr('m_billing_title')} title={tr('m_charge_new_title')} onBack={goBack} />

      <div style={{ padding: '0 24px' }}>
        <Field label={tr('m_charge_type_field')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {types.map(ty => (
              <button key={ty.id} onClick={() => setType(ty.id)} style={{
                padding: '11px 0', borderRadius: 11, cursor: 'pointer',
                background: type === ty.id ? t.primaryPale : t.card,
                border: `1.5px solid ${type === ty.id ? t.primary : t.cardBorder}`,
                color: type === ty.id ? t.primary : t.textMuted, fontWeight: 600, fontSize: 13.5,
              }}>{ty.label}</button>
            ))}
          </div>
        </Field>

        <Field label={tr('m_charge_apply_to')}>
          <select value={target} onChange={e => setTarget(e.target.value)} style={{ ...inputStyle(t), appearance: 'none', cursor: 'pointer' }}>
            {targetOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label={tr('m_charge_amount')}>
              <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" style={inputStyle(t)} placeholder="118.90" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={tr('m_charge_due_date')}>
              <input value={due} onChange={e => setDue(e.target.value)} style={inputStyle(t)} placeholder="Oct 15, 2026" />
            </Field>
          </div>
        </div>

        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14, transition: 'background 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: t.text, marginBottom: 2 }}>{tr('m_charge_attach_link')}</p>
              <p style={{ fontSize: 11.5, color: t.textFaint }}>{tr('m_charge_attach_desc')}</p>
            </div>
            <Toggle on={withLink} onChange={setWithLink} />
          </div>
          {withLink && (
            <input value={link} onChange={e => setLink(e.target.value)} style={{ ...inputStyle(t), marginTop: 12 }} placeholder="https://pay.lumina.co/energy-oct" />
          )}
        </div>

        <PrimaryButton onClick={submit} disabled={!canSubmit}>{tr('m_charge_issue_btn')}</PrimaryButton>
      </div>
    </div>
  );
}
