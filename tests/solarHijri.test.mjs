import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function loadModule(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  new Function('exports', 'require', outputText)(exports, name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  });
  return exports;
}
const calendar = loadModule('../src/data/solarHijri.ts');
const { getPayment } = loadModule('../src/data/payments.ts', { './solarHijri': calendar });
const { toSolarHijri, fromSolarHijri, daysInSolarMonth, formatSolarMonth, formatSolarDate } = calendar;

test('converts Nowruz boundaries and leap-year Esfand', () => {
  for (const [iso, expected] of [
    ['2025-03-20', { year: 1403, month: 12, day: 30 }],
    ['2025-03-21', { year: 1404, month: 1, day: 1 }],
    ['2026-03-20', { year: 1404, month: 12, day: 29 }],
    ['2026-03-21', { year: 1405, month: 1, day: 1 }],
  ]) {
    assert.deepEqual(toSolarHijri(new Date(`${iso}T00:00:00Z`)), expected);
    assert.equal(fromSolarHijri(expected).toISOString().slice(0, 10), iso);
  }
});
test('uses actual Solar Hijri month lengths and rejects invalid dates', () => {
  for (let month = 1; month <= 6; month++) assert.equal(daysInSolarMonth(1404, month), 31);
  for (let month = 7; month <= 11; month++) assert.equal(daysInSolarMonth(1404, month), 30);
  assert.equal(daysInSolarMonth(1403, 12), 30);
  assert.equal(daysInSolarMonth(1404, 12), 29);
  for (const date of [
    { year: 1404, month: 12, day: 30 }, { year: 1404, month: 7, day: 31 },
    { year: 1404, month: 0, day: 1 }, { year: 1404, month: 13, day: 1 },
    { year: 1404, month: 1, day: 0 },
  ]) assert.throws(() => fromSolarHijri(date), RangeError);
});
test('formats Persian months in both app languages', () => {
  assert.equal(formatSolarMonth(1405, 1, 'fa', false), 'فروردین');
  assert.equal(formatSolarMonth(1405, 12, 'fa', false), 'اسفند');
  assert.equal(formatSolarMonth(1405, 1, 'en', false), 'Farvardin');
  assert.match(formatSolarMonth(1405, 7, 'en'), /1405/);
  assert.match(formatSolarDate({ year: 1405, month: 7, day: 15 }, 'en'), /Mehr/);
});
test('all twelve month boundaries round-trip across multiple years', () => {
  for (const year of [1399, 1400, 1403, 1404, 1405]) {
    for (let month = 1; month <= 12; month++) {
      for (const day of [1, daysInSolarMonth(year, month)]) {
        const date = { year, month, day };
        assert.deepEqual(toSolarHijri(fromSolarHijri(date)), date);
      }
    }
  }
});
test('billing periods compare Solar Hijri years and months, including year rollover', () => {
  const today = { year: 1405, month: 1, day: 20 };
  assert.equal(getPayment('water', 1404, 12, today).status, 'PAID');
  assert.equal(getPayment('water', 1405, 1, today).status, 'DUE');
  assert.equal(getPayment('water', 1405, 2, today).status, 'FUTURE');
  assert.equal(getPayment('water', 1406, 1, today).status, 'FUTURE');
  for (const type of ['apartment', 'water', 'energy']) {
    const payment = getPayment(type, 1405, 1, today);
    assert.equal(payment.total, payment.amounts.reduce((sum, amount) => sum + amount, 0));
    assert.deepEqual(payment.dueDate, { year: 1405, month: 1, day: 15 });
    assert.equal(Boolean(payment.paidDate), payment.status === 'PAID');
  }
});
