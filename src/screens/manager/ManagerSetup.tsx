import { useState } from 'react';
import type { NavProps } from '../../App';
import { useTheme } from '../../theme';
import { useLang } from '../../lang';
import { useManager, type Amenities } from '../../managerStore';
import { Field, inputStyle, PrimaryButton } from './mui';

const amenityMeta: { key: keyof Amenities; labelKey: 'm_setup_amenity_pool' | 'm_setup_amenity_rooftop' | 'm_setup_amenity_gym' | 'm_setup_amenity_parking' | 'm_setup_amenity_lounge' | 'm_setup_amenity_laundry' }[] = [
  { key: 'pool', labelKey: 'm_setup_amenity_pool' },
  { key: 'rooftop', labelKey: 'm_setup_amenity_rooftop' },
  { key: 'gym', labelKey: 'm_setup_amenity_gym' },
  { key: 'parking', labelKey: 'm_setup_amenity_parking' },
  { key: 'lounge', labelKey: 'm_setup_amenity_lounge' },
  { key: 'laundry', labelKey: 'm_setup_amenity_laundry' },
];

export default function ManagerSetup({ navigate }: NavProps) {
  const { t } = useTheme();
  const { tr, lang, dir } = useLang();
  const { createApartment } = useManager();

  const [name, setName] = useState(() => lang === 'fa' ? 'مجتمع لومینا' : 'The Lumina Residences');
  const [address, setAddress] = useState('');
  const [floors, setFloors] = useState('12');
  const [unitsPerFloor, setUnitsPerFloor] = useState('4');
  const [amenities, setAmenities] = useState<Amenities>({
    pool: true, rooftop: true, gym: true, parking: true, lounge: false, laundry: false,
  });

  const canSubmit = name.trim() && address.trim() && Number(floors) > 0;

  const submit = () => {
    if (!canSubmit) return;
    createApartment({
      name: name.trim(), address: address.trim(),
      floors: Number(floors), unitsPerFloor: Number(unitsPerFloor), amenities,
    });
    navigate('m-dashboard');
  };

  return (
    <div dir={dir} style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '20px 24px 12px' }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.primaryText} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21V7l7-4v18" /><path d="M10 21V9l8 4v8" /><path d="M3 21h18" />
          </svg>
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 6 }}>{tr('m_setup_title')}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.15, marginBottom: 6 }}>{tr('m_setup_create_title')}</h1>
        <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5, marginBottom: 24 }}>
          {tr('m_setup_create_desc')}
        </p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <Field label={tr('m_setup_building_name')}>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle(t)} placeholder={tr('m_setup_building_name_placeholder')} />
        </Field>
        <Field label={tr('m_setup_address')}>
          <input value={address} onChange={e => setAddress(e.target.value)} style={inputStyle(t)} placeholder={tr('m_setup_address_placeholder')} />
        </Field>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label={tr('m_setup_floors')}>
              <input value={floors} onChange={e => setFloors(e.target.value.replace(/\D/g, ''))} inputMode="numeric" style={inputStyle(t)} />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={tr('m_setup_units_per_floor')}>
              <input value={unitsPerFloor} onChange={e => setUnitsPerFloor(e.target.value.replace(/\D/g, ''))} inputMode="numeric" style={inputStyle(t)} />
            </Field>
          </div>
        </div>

        <label style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10, marginTop: 4 }}>{tr('m_setup_amenities')}</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {amenityMeta.map(({ key, labelKey }) => {
            const on = amenities[key];
            return (
              <button key={key} onClick={() => setAmenities(a => ({ ...a, [key]: !a[key] }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, textAlign: 'start',
                  background: on ? t.primaryPale : t.card, border: `1.5px solid ${on ? t.primary : t.cardBorder}`,
                  borderRadius: 12, padding: '11px 12px', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, background: on ? t.primary : 'transparent', border: `2px solid ${on ? t.primary : t.textFaint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: on ? t.primary : t.text }}>{tr(labelKey)}</span>
              </button>
            );
          })}
        </div>

        <PrimaryButton onClick={submit} disabled={!canSubmit}>{tr('m_setup_create_continue')}</PrimaryButton>
        <button onClick={() => navigate('signin')} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: t.textFaint, fontSize: 13, cursor: 'pointer' }}>{tr('btn_cancel')}</button>
      </div>
    </div>
  );
}
