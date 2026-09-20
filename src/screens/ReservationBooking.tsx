import { useState } from 'react';
import type { NavProps, Amenity } from '../App';
import { useTheme } from '../theme';
import { useLang } from '../lang';

const amenityNameKey: Record<Amenity, 'reservations_gym' | 'reservations_rooftop' | 'reservations_pool'> = {
  gym: 'reservations_gym', rooftop: 'reservations_rooftop', pool: 'reservations_pool'
};
const DAYS_DATA = [{ date: 12 }, { date: 13 }, { date: 14 }, { date: 15 }, { date: 16 }];
const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];
const UNAVAILABLE = ['3:00 PM'];

export default function ReservationBooking({ navigate, goBack, params }: NavProps) {
  const { t } = useTheme();
  const { tr, isRTL } = useLang();
  const amenity = params.amenity ?? 'gym';
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const DAY_LABELS = [tr('day_mon'), tr('day_tue'), tr('day_wed'), tr('day_thu'), tr('day_fri')];

  if (confirmed) {
    return (
      <div style={{ background: t.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, transition: 'background 0.3s' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: t.paidBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={t.paidText} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, textAlign: 'center', marginBottom: 8 }}>{tr('booking_confirmed_title')}</h2>
        <p style={{ fontSize: 14, color: t.textFaint, textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>Your booking for the {tr(amenityNameKey[amenity])} has been confirmed.</p>

        <div style={{ background: t.card, border: `1.5px solid ${t.cardBorder}`, borderRadius: 18, padding: '20px', width: '100%', marginBottom: 20, transition: 'background 0.3s' }}>
          {[
            { label: tr('booking_amenity_label'), value: tr(amenityNameKey[amenity]) },
            { label: tr('booking_date_label'), value: `${DAY_LABELS[selectedDay]}, Oct ${DAYS_DATA[selectedDay].date}, 2026` },
            { label: tr('booking_time_label'), value: selectedTime ?? '' },
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
        <div style={{ display: 'flex', gap: 8 }}>
          {DAYS_DATA.map((day, i) => {
            const isSel = i === selectedDay;
            return (
              <button key={i} onClick={() => setSelectedDay(i)} style={{ flex: 1, padding: '12px 0', borderRadius: 14, background: isSel ? t.primary : t.card, border: `1.5px solid ${isSel ? t.primary : t.cardBorder}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'background 0.2s' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: isSel ? 'rgba(255,255,255,0.7)' : t.textFaint, letterSpacing: '0.06em' }}>{DAY_LABELS[i]}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isSel ? '#FFFFFF' : t.text }}>{day.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div style={{ padding: '0 24px', marginBottom: 28 }}>
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
      </div>

      {/* Confirm */}
      <div style={{ padding: '0 24px' }}>
        <button onClick={() => selectedTime && setConfirmed(true)} style={{ width: '100%', padding: '16px', borderRadius: 14, background: selectedTime ? t.primary : t.mutedSurface, color: selectedTime ? '#FFFFFF' : t.textFaint, fontWeight: 600, fontSize: 15, border: `1px solid ${selectedTime ? 'transparent' : t.cardBorder}`, cursor: selectedTime ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
          {selectedTime ? tr('booking_confirm_btn') : tr('booking_select_slot')}
        </button>
      </div>
    </div>
  );
}
