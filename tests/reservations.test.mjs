import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// Compile the standalone rules without requiring a browser or a test framework.
const source = readFileSync(new URL('../src/data/reservations.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const rules = {};
new Function('exports', outputText)(rules);
const { hasConflict, isReservation, dateKey, slotStart, minutes } = rules;
const booking = { amenity: 'guest-parking', date: '2026-10-01', start: 600, end: 720 };

test('rejects duplicate, partial, contained and enclosing intervals', () => {
  for (const [start, end] of [[600, 720], [590, 610], [710, 730], [630, 660], [540, 780]]) {
    assert.equal(hasConflict([booking], { ...booking, start, end }), true);
  }
});
test('allows adjacent intervals and different amenities or dates', () => {
  for (const candidate of [
    { ...booking, start: 540, end: 600 },
    { ...booking, start: 720, end: 780 },
    { ...booking, amenity: 'gym' },
    { ...booking, date: '2026-10-02' },
  ]) assert.equal(hasConflict([booking], candidate), false);
});
test('a rooftop reservation blocks the entire selected day only', () => {
  const rooftop = { ...booking, amenity: 'rooftop', start: 0, end: 1440 };
  assert.equal(hasConflict([rooftop], rooftop), true);
  assert.equal(hasConflict([rooftop], { ...rooftop, start: 1439 }), true);
  assert.equal(hasConflict([rooftop], { ...rooftop, date: '2026-10-02' }), false);
});
test('normalizes local dates and AM/PM slots', () => {
  assert.equal(dateKey(new Date(2026, 9, 1)), '2026-10-01');
  assert.equal(slotStart('12:00 AM'), 0);
  assert.equal(slotStart('12:00 PM'), 720);
  assert.equal(slotStart('3:00 PM'), 900);
  assert.equal(minutes('00:30'), 30);
});
test('rejects invalid ranges and malformed stored records', () => {
  assert.equal(isReservation(booking), true);
  for (const value of [null, {}, { ...booking, start: 720 }, { ...booking, end: 500 },
    { ...booking, start: -1 }, { ...booking, end: 1441 }, { ...booking, start: NaN },
    { ...booking, amenity: 'unknown' }]) assert.equal(isReservation(value), false);
});
