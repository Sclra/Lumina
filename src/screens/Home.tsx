import { useRef, type PointerEvent } from 'react';
import type { Amenity, NavProps } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import { newsDateTimestamp } from '../data/newsData';
import usePublishedNews from '../data/usePublishedNews';

export default function Home({ navigate }: NavProps) {
  const { t, darkMode } = useTheme();
  const { tr } = useLang();
  const amenityDrag = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const didDragAmenities = useRef(false);
  const endAmenityDrag = (event: PointerEvent<HTMLUListElement>) => {
    if (amenityDrag.current?.pointerId !== event.pointerId) return;
    amenityDrag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const s = (style: object) => ({ ...style, transition: 'background 0.3s, border-color 0.3s, color 0.3s' });
  const goldenNews = usePublishedNews()
    .filter(item => item.golden)
    .sort((a, b) => newsDateTimestamp(b.date) - newsDateTimestamp(a.date) || b.id - a.id);

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 20px', background: t.bg }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: t.primary, textTransform: 'uppercase', marginBottom: 4 }}>{tr('app_name_upper')}</p>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, lineHeight: 1.15, marginBottom: 8 }}>{tr('home_hello')}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: t.primary, background: t.primaryPale, padding: '3px 10px', borderRadius: 20 }}>{tr('home_unit')}</span>
              <button style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{tr('btn_view_details')}</button>
            </div>
          </div>
          <button style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: 10, cursor: 'pointer', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <circle cx="18" cy="5" r="3" fill="#C94A2E" stroke={t.bg} strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Amenity Status */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_amenity_status')}</p>
          <button onClick={() => navigate('reservations')} style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('btn_view_details')}</button>
        </div>
        <ul
          className="scrollbar-hide"
          tabIndex={0}
          aria-label={tr('home_amenity_status')}
          onPointerDown={(event) => {
            didDragAmenities.current = false;
            if (event.pointerType !== 'mouse' || event.button !== 0) return;
            amenityDrag.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
          }}
          onPointerMove={(event) => {
            const drag = amenityDrag.current;
            if (!drag || drag.pointerId !== event.pointerId) return;
            if (!didDragAmenities.current && Math.abs(event.clientX - drag.startX) < 6) return;
            didDragAmenities.current = true;
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            event.currentTarget.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
          }}
          onPointerUp={endAmenityDrag}
          onPointerCancel={endAmenityDrag}
          onLostPointerCapture={endAmenityDrag}
          onPointerLeave={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) endAmenityDrag(event);
          }}
          onClickCapture={(event) => {
            if (didDragAmenities.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 8, listStyle: 'none', margin: 0, padding: 0, cursor: 'default', userSelect: 'none' }}
        >
          {[
            // Sample facility statuses until live building data is connected.
            { id: 'gym' as Amenity, name: tr('home_gym'), status: tr('word_open'), statusColor: t.paidText, statusBg: t.paidBg },
            { id: 'pool' as Amenity, name: tr('home_pool'), status: tr('word_under_repair'), statusColor: darkMode ? '#F5C76B' : '#855600', statusBg: darkMode ? '#302510' : '#FFF3D6' },
            { id: 'rooftop' as Amenity, name: tr('home_rooftop'), status: tr('word_open'), statusColor: t.paidText, statusBg: t.paidBg },
            { id: 'guest-parking' as Amenity, name: tr('home_guest_parking'), status: tr('word_open'), statusColor: t.paidText, statusBg: t.paidBg },
            { id: 'community-hall' as Amenity, name: tr('home_community_hall'), status: tr('word_closed'), statusColor: t.dueText, statusBg: t.dueBg },
          ].map((a) => (
            <li key={a.id} style={{ flexShrink: 0 }}>
            <button type="button" onClick={() => navigate('reservation-booking', { amenity: a.id })} style={s({ cursor: 'pointer', display: 'flex', flexShrink: 0, whiteSpace: 'nowrap', scrollSnapAlign: 'start', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 12, padding: '10px 14px' })}>
              <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{a.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: a.statusColor, background: a.statusBg, padding: '3px 8px', borderRadius: 10, letterSpacing: '0.05em', flexShrink: 0 }}>{a.status}</span>
            </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Utilities Overview */}
      <div style={{ padding: '0 24px 18px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{tr('home_utilities')}</p>
        {[
          { icon: 'water', label: tr('home_water_label'), sub: tr('home_water_sub'), status: 'PAID', amount: '$42.5', due: 'Oct 15, 2026', iconBg: '#E8F2FA', iconStroke: '#2D7A9E' },
          { icon: 'energy', label: tr('home_energy_label'), sub: tr('home_energy_sub'), status: 'DUE', amount: '$118.9', due: 'Oct 15, 2026', iconBg: '#F5EEF8', iconStroke: '#7A5EA0' },
        ].map((u) => {
          const isPaid = u.status === 'PAID';
          return (
            <div key={u.label} onClick={() => navigate('payments')}
              style={s({ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '16px', marginBottom: 10, cursor: 'pointer' })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: u.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.icon === 'water'
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={u.iconStroke} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" /></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={u.iconStroke} strokeWidth="1.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 1 }}>{u.label}</p>
                    <p style={{ fontSize: 11, color: t.textFaint }}>{u.sub}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em', background: isPaid ? t.paidBg : t.dueBg, color: isPaid ? t.paidText : t.dueText }}>
                  {isPaid ? tr('word_paid') : tr('word_due')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_due_date')}</p>
                  <p style={{ fontSize: 12, color: t.textMuted }}>{u.due}</p>
                </div>
                <p style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{u.amount}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest News — includes Golden items with their badge */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tr('home_latest_news')}</p>
          <button onClick={() => navigate('news')} style={{ fontSize: 12, color: t.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>{tr('btn_view_all')}</button>
        </div>
        <div tabIndex={0} role="region" aria-label={tr('home_latest_news')}
          style={{ maxHeight: 240, overflowY: 'auto', padding: 2 }}>
          {goldenNews.length === 0 && (
            <p style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 14, padding: '18px 16px', color: t.textMuted, fontSize: 12, textAlign: 'center' }}>
              {tr('home_no_golden_news')}
            </p>
          )}
          {goldenNews.map(item => (
            <button key={item.id} type="button" onClick={() => navigate('news-detail', { newsId: item.id })}
              style={s({ display: 'block', width: '100%', textAlign: 'start', background: t.card,
                border: '1.5px solid #DAA52040', borderInlineStart: '4px solid #DAA520',
                borderRadius: 14, padding: '13px 14px', marginBottom: 10, cursor: 'pointer' })}>
              <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: darkMode ? '#F5C76B' : '#855600', letterSpacing: '0.08em' }}>
                  ? {tr('news_cat_golden').toUpperCase()}
                </span>
                <span style={{ fontSize: 10, color: t.textMuted }}>? {item.date}</span>
              </span>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.4 }}>{item.title}</span>
              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 12, color: t.textMuted, lineHeight: 1.5, marginTop: 6 }}>{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
