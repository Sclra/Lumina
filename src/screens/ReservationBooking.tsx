import { useState, useRef, type PointerEvent } from 'react';
import type { NavProps, Amenity } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';
import TimeWheel from '../components/TimeWheel';

const amenityNameKey: Record<Amenity, 'reservations_gym' | 'reservations_rooftop' | 'reservations_pool' | 'home_guest_parking' | 'home_community_hall'> = {
  gym: 'reservations_gym', rooftop: 'reservations_rooftop', pool: 'reservations_pool',
  'guest-parking': 'home_guest_parking', 'community-hall': 'home_community_hall'
};
const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];
const UNAVAILABLE = ['3:00 PM'];

export default function ReservationBooking({ navigate, goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL, lang } = useLang();
  const amenity = params.amenity ?? 'gym';
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [parkingFrom, setParkingFrom] = useState('10:00');
  const [parkingTo, setParkingTo] = useState('12:00');
  const [confirmed, setConfirmed] = useState(false);

  const dayOnly = amenity === 'rooftop';
  const isParking = amenity === 'guest-parking';
  const [today] = useState(() => { const date = new Date(); date.setHours(0, 0, 0, 0); return date; });
  const days = Array.from({ length: dayOnly ? 21 : 14 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return date;
  });
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
  const validParkingRange = Boolean(parkingFrom && parkingTo && parkingTo > parkingFrom);
  const invalidParkingRange = Boolean(parkingFrom && parkingTo && !validParkingRange);
  const canConfirm = selectedDay !== null && (dayOnly || (isParking ? validParkingRange : selectedTime !== null));
  const formatTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date(today);
    date.setHours(hours, minutes);
    return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hourCycle: 'h24' });
  };
  const drag = useRef<{ id: number; x: number; left: number } | null>(null);
  const dragged = useRef(false);
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (confirmed) {
    return (
      <div style={{ background: t.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, transition: 'background 0.3s' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: t.paidBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, textAlign: 'center', marginBottom: 8 }}>{tr('booking_confirmed_title')}</h2>
        <p style={{ fontSize: 14, color: t.textFaint, textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>{tr('booking_confirmed_desc')}</p>

        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, padding: '20px', width: '100%', marginBottom: 20, transition: 'background 0.3s' }}>
          {[
            { label: tr('booking_amenity_label'), value: tr(amenityNameKey[amenity]) },
            { label: tr('booking_date_label'), value: selectedDay !== null ? days[selectedDay].toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '' },
            ...(isParking ? [
              { label: tr('booking_from'), value: formatTime(parkingFrom) },
              { label: tr('booking_to'), value: formatTime(parkingTo) },
            ] : !dayOnly ? [{ label: tr('booking_time_label'), value: selectedTime ?? '' }] : []),
            { label: tr('word_status'), value: tr('word_confirmed') },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${t.borderLight}` }}>
              <span style={{ fontSize: 13, color: t.textFaint }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: item.label === tr('word_status') ? t.paidText : t.text }}>{item.value}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('reservations')} style={{ width: '100%', padding: '16px', borderRadius: 14, background: t.primary, color: '#FFFFFF', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
          {tr('booking_back')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: t.bg, minHeight: '100%', paddingBottom: 32, transition: 'background 0.3s' }}>
      <div style={{ padding: '14px 24px 0' }}>
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" style={{ transform: isRTL ? 'scaleX(-1)' : undefined }}><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontSize: 12, color: t.textMuted }}>{tr('booking_breadcrumb')}</span>
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 24 }}>{tr(amenityNameKey[amenity])}{tr('booking_title_suffix')}</h1>
      </div>

      {/* Date selector */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{tr('booking_select_date')}</p>
        <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>{tr(dayOnly ? 'booking_three_weeks' : 'booking_two_weeks')}</p>
        <div className="scrollbar-hide" tabIndex={0} role="group" aria-label={tr('booking_select_date')}
          onPointerDown={event => {
            dragged.current = false;
            if (event.pointerType === 'mouse' && event.button === 0) drag.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft };
          }}
          onPointerMove={event => {
            const start = drag.current;
            if (!start || start.id !== event.pointerId) return;
            if (!dragged.current && Math.abs(event.clientX - start.x) < 6) return;
            dragged.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.scrollLeft = start.left - (event.clientX - start.x);
          }}
          onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
          onPointerLeave={event => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) endDrag(event); }}
          onClickCapture={event => { if (dragged.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } }}
          style={{ display: 'flex', gap: 8, overflowX: 'auto', userSelect: 'none', padding: 2 }}>
          {days.map((day, i) => {
            const isSel = i === selectedDay;
            return (
              <button key={day.getTime()} aria-pressed={isSel} aria-label={day.toLocaleDateString(locale, { dateStyle: 'full' })} onClick={() => { setSelectedDay(i); setSelectedTime(null); }} style={{ flex: '0 0 76px', padding: '12px 0', borderRadius: 14, background: isSel ? t.primary : t.card, border: `1.5px solid ${isSel ? t.primary : t.cardBorder}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'background 0.2s' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: isSel ? 'rgba(255,255,255,0.7)' : t.textFaint, letterSpacing: '0.06em' }}>{day.toLocaleDateString(locale, { weekday: 'short' })}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isSel ? '#FFFFFF' : t.text }}>{day.toLocaleDateString(locale, { day: 'numeric' })}</span>
                <span style={{ fontSize: 11, color: isSel ? '#FFFFFF' : t.textMuted }}>{day.toLocaleDateString(locale, { month: 'short' })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {isParking && <div style={{ padding: '0 24px', marginBottom: 28 }}>
        <p id="parking-time-hint" style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>{tr('booking_parking_range')} {tr('booking_wheel_hint')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { id: 'parking-from', label: tr('booking_from'), value: parkingFrom, onChange: setParkingFrom },
            { id: 'parking-to', label: tr('booking_to'), value: parkingTo, onChange: setParkingTo },
          ].map(field => (
            <TimeWheel key={field.id} label={field.label} value={field.value} onChange={field.onChange} />
          ))}
        </div>
        {invalidParkingRange && <p id="parking-time-error" role="alert" style={{ fontSize: 12, color: t.dueText, marginTop: 10 }}>{tr('booking_invalid_range')}</p>}
      </div>}
      {!dayOnly && !isParking && <div style={{ padding: '0 24px', marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{tr('booking_available_slots')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {TIME_SLOTS.map((slot) => {
            const isUnavailable = UNAVAILABLE.includes(slot);
            const isSel = selectedTime === slot && !isUnavailable;
            return (
              <button key={slot} onClick={() => !isUnavailable && setSelectedTime(slot)} disabled={isUnavailable}
                style={{ padding: '14px 16px', borderRadius: 14, background: isSel ? t.primary : isUnavailable ? t.mutedSurface : t.card, border: `1.5px solid ${isSel ? t.primary : isUnavailable ? t.borderLight : t.cardBorder}`, cursor: isUnavailable ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.2s' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: isSel ? '#FFFFFF' : isUnavailable ? t.textFaint : t.text }}>{slot}</span>
                {isUnavailable && <span style={{ fontSize: 9, fontWeight: 600, color: t.textFaint, letterSpacing: '0.06em' }}>{tr('word_na')}</span>}
                {isSel && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
              </button>
            );
          })}
        </div>
      </div>}

      {/* Confirm */}
      <div style={{ padding: '0 24px' }}>
        <button disabled={!canConfirm} onClick={() => canConfirm && setConfirmed(true)} style={{ width: '100%', padding: '16px', borderRadius: 14, background: canConfirm ? t.primary : t.mutedSurface, color: canConfirm ? '#FFFFFF' : t.textFaint, fontWeight: 600, fontSize: 15, border: `1px solid ${canConfirm ? 'transparent' : t.cardBorder}`, cursor: canConfirm ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
          {canConfirm ? tr('booking_confirm_btn') : tr(selectedDay === null ? 'booking_select_date' : isParking ? 'booking_select_range' : 'booking_select_slot')}
        </button>
      </div>
    </div>
  );
}
