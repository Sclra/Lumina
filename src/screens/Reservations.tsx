import type { NavProps, Amenity } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

const amenities = [
  { id: 'gym' as Amenity, nameKey: 'reservations_gym' as const, availKey: 'reservations_gym_avail' as const, bookKey: 'reservations_gym_book' as const, descKey: 'reservations_gym_desc' as const, image: 'https://images.unsplash.com/photo-1758448756350-3d0eec02ba37?w=600&h=280&fit=crop&auto=format', status: 'available' },
  { id: 'rooftop' as Amenity, nameKey: 'reservations_rooftop' as const, availKey: 'reservations_rooftop_avail' as const, bookKey: 'reservations_rooftop_book' as const, descKey: 'reservations_rooftop_desc' as const, image: 'https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?w=600&h=280&fit=crop&auto=format', status: 'reserved' },
  { id: 'pool' as Amenity, nameKey: 'reservations_pool' as const, availKey: 'reservations_pool_avail' as const, bookKey: 'reservations_pool_book' as const, descKey: 'reservations_pool_desc' as const, image: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=600&h=280&fit=crop&auto=format', status: 'full' },
] as const;

export default function Reservations({ navigate }: NavProps) {
  const { t } = useTheme();
  const { tr } = useLang();

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16, transition: 'background 0.3s' }}>
      <div style={{ padding: '16px 24px 20px' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 4 }}>{tr('reservations_title')}</h1>
        <p style={{ fontSize: 13, color: t.textFaint }}>{tr('reservations_subtitle')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        {amenities.map((a) => (
          <div key={a.id} style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 20, overflow: 'hidden', marginBottom: 14, transition: 'background 0.3s' }}>
            <div style={{ position: 'relative', height: 160, background: t.bgAlt }}>
              <img src={a.image} alt={tr(a.nameKey)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {a.status === 'reserved' && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(20,28,24,0.82)', backdropFilter: 'blur(8px)', color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em' }}>{tr('word_reserved')}</div>
              )}
              {a.status === 'full' && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(201,74,46,0.92)', backdropFilter: 'blur(8px)', color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em' }}>{tr('reservations_fully_booked')}</div>
              )}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 3 }}>{tr(a.nameKey)}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.status === 'full' ? t.dueDot : t.paidDot }} />
                    <span style={{ fontSize: 12, color: t.textMuted }}>{tr(a.availKey)} • {tr(a.bookKey)}</span>
                  </div>
                </div>
                <button
                  onClick={() => a.status !== 'full' && navigate('reservation-booking', { amenity: a.id })}
                  style={{ padding: '8px 18px', borderRadius: 20, background: a.status === 'full' ? t.mutedSurface : t.primary, color: a.status === 'full' ? t.textFaint : '#FFFFFF', fontWeight: 600, fontSize: 13, border: `1px solid ${a.status === 'full' ? t.cardBorder : 'transparent'}`, cursor: a.status === 'full' ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                  {tr('reservations_reserve')}
                </button>
              </div>
              <p style={{ fontSize: 12, color: t.textFaint, lineHeight: 1.5 }}>{tr(a.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
