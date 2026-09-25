import { useEffect, useLayoutEffect, useRef, type PointerEvent } from 'react';
import { useTheme } from '../theme';
import { useLang } from '../lang';

const wrap = (value: number, count: number) => (value % count + count) % count;

function Wheel({ value, count, label, onChange, hours = false }: {
  value: number; count: number; label: string; onChange: (value: number) => void; hours?: boolean;
}) {
  const { t } = useTheme();
  const element = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const previousValue = useRef(value);
  const animationDuration = useRef(160);
  const drag = useRef<{ id: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };
  useLayoutEffect(() => {
    let distance = value - previousValue.current;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    previousValue.current = value;
    if (!distance || !track.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = track.current.animate([
      { transform: `translateY(${-32 + Math.sign(distance) * 32}px)` },
      { transform: 'translateY(-32px)' },
    ], { duration: animationDuration.current, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    return () => animation.cancel();
  }, [value, count]);
  const step = (amount: number) => {
    const next = wrap(latest.current.value + amount, count);
    latest.current.value = next;
    latest.current.onChange(next);
  };
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    let lastStepAt = -Infinity;
    const scroll = (event: WheelEvent) => {
      event.preventDefault();
      if (!event.deltaY) return;
      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      // One value per wheel event, regardless of delta size. Faster events
      // shorten the transition rather than skipping values or dropping ticks.
      animationDuration.current = Math.max(35, Math.min(160, now - lastStepAt));
      lastStepAt = now;
      const next = wrap(latest.current.value + direction, count);
      latest.current.value = next;
      latest.current.onChange(next);
    };
    node.addEventListener('wheel', scroll, { passive: false });
    return () => node.removeEventListener('wheel', scroll);
  }, [count]);
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const display = (number: number) => String(hours && number === 0 ? 24 : number).padStart(2, '0');
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ textAlign: 'center', fontSize: 10, color: t.textMuted, marginBottom: 6 }}>{label}</p>
      <div ref={element} role="spinbutton" tabIndex={0} aria-label={label}
        aria-valuemin={hours ? 1 : 0} aria-valuemax={hours ? 24 : 59}
        aria-valuenow={hours && value === 0 ? 24 : value} aria-valuetext={display(value)}
        onKeyDown={event => {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            if (event.key === 'Home') onChange(hours ? 1 : 0);
            else if (event.key === 'End') onChange(hours ? 0 : 59);
            else step(event.key === 'ArrowDown' ? 1 : -1);
          }
        }}
        onPointerDown={event => {
          if (event.button !== 0) return;
          suppressClick.current = false;
          drag.current = { id: event.pointerId, y: event.clientY, moved: false };
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const start = drag.current;
          if (!start || start.id !== event.pointerId) return;
          const delta = start.y - event.clientY;
          if (Math.abs(delta) > 5) start.moved = true;
          if (Math.abs(delta) >= 32) { start.y = event.clientY; step(Math.sign(delta)); }
        }}
        onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onClick={event => {
          if (suppressClick.current) return;
          // Hit-test the actual animated row; pointer capture can retarget
          // clicks to the wheel container instead of the number beneath it.
          const row = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-wheel-value]');
          if (!row || !event.currentTarget.contains(row)) return;
          animationDuration.current = 160;
          const next = Number(row.dataset.wheelValue);
          latest.current.value = next;
          latest.current.onChange(next);
        }}
        style={{ height: 160, overflow: 'hidden', touchAction: 'none', userSelect: 'none', cursor: 'pointer', borderRadius: 10 }}>
        <div ref={track} style={{ transform: 'translateY(-32px)' }}>
        {[-3, -2, -1, 0, 1, 2, 3].map(offset => (
          <div key={offset} data-wheel-value={wrap(value + offset, count)} aria-hidden="true" style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: offset === 0 ? 23 : 18, fontWeight: offset === 0 ? 700 : 400, fontVariantNumeric: 'tabular-nums',
            color: offset === 0 ? t.text : t.textMuted, opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.25,
            background: offset === 0 ? t.primaryPale : 'transparent', borderRadius: 8,
            transform: `scale(${offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.9 : 0.8})` }}>
            {display(wrap(value + offset, count))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default function TimeWheel({ label, value, onChange }: {
  label: string; value: string; onChange: (value: string) => void;
}) {
  const { t } = useTheme();
  const { tr } = useLang();
  const [hour, minute] = value.split(':').map(Number);
  const change = (h: number, m: number) => onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  return (
    <fieldset style={{ minWidth: 0, border: `1.5px solid ${t.cardBorder}`, borderRadius: 16, padding: '10px 8px', background: t.card }}>
      <legend style={{ padding: '0 6px', fontSize: 13, fontWeight: 600, color: t.text }}>{label}</legend>
      <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Wheel hours value={hour} count={24} label={tr('booking_hour')} onChange={h => change(h, minute)} />
        <span aria-hidden="true" style={{ color: t.text, paddingTop: 20 }}>:</span>
        <Wheel value={minute} count={60} label={tr('booking_minute')} onChange={m => change(hour, m)} />
      </div>
    </fieldset>
  );
}
