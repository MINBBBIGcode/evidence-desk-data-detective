import test from 'node:test';
import assert from 'node:assert/strict';
import { libraryDays, population, kioskDays } from '../dist/datasets.mjs';
import { mean, percentChange, librarySummary, axisRange, projectY, drawSample, populationSummary, correlation, kioskSummary, gallerySummary, checkVerdictCompleteness } from '../dist/domain.mjs';

test('library means and change reconcile to the raw counts', () => {
  assert.equal(libraryDays.length, 20);
  assert.equal(libraryDays.slice(0, 10).reduce((n, x) => n + x.visits, 0), 460);
  assert.equal(libraryDays.slice(10).reduce((n, x) => n + x.visits, 0), 540);
  assert.deepEqual(librarySummary(), { before: 46, after: 54, difference: 8, percent: 8 / 46 * 100 });
});

test('axis changes only the projection, never counts or statistics', () => {
  const original = JSON.stringify(libraryDays), statistics = librarySummary();
  const full = axisRange(0, 60), tight = axisRange(40, 60);
  const gap = range => projectY(46, range, 40, 224) - projectY(54, range, 40, 224);
  assert.ok(Math.abs(gap(tight) / gap(full) - 3) < 1e-12);
  assert.notEqual(projectY(46, full, 40, 224), projectY(46, tight, 40, 224));
  assert.equal(JSON.stringify(libraryDays), original);
  assert.deepEqual(librarySummary(), statistics);
});

test('invalid axes cannot quietly produce a chart', () => {
  for (const x of ['', ' ', 'abc', -1, 46, 4.5, Infinity, null]) assert.throws(() => axisRange(x, 60));
  for (const x of ['', 'abc', 54, 101, 65.5, NaN]) assert.throws(() => axisRange(40, x));
  assert.deepEqual(axisRange('0', '100'), { min: 0, max: 100 });
  assert.throws(() => projectY(46, { min: 47, max: 60 }, 40, 224));
  assert.throws(() => projectY(46, { min: 40, max: 40 }, 40, 224));
});

test('the constructed population has four equal groups and 50 percent support', () => {
  assert.equal(population.length, 320);
  assert.equal(new Set(population.map(x => x.id)).size, 320);
  const summary = populationSummary();
  assert.equal(summary.supporters, 160); assert.equal(summary.supportPercent, 50);
  assert.deepEqual(summary.groups.map(g => g.count), [80, 80, 80, 80]);
  assert.deepEqual(['Art', 'Music', 'Garden', 'Robotics'].map(club => population.filter(x => x.club === club && x.supportsLateOpening).length), [20, 32, 48, 60]);
});

test('a full Robotics-only sample stays biased even at the maximum size', () => {
  for (const seed of [0, 1, 42, 20260913, 0xffffffff]) {
    const sample = drawSample('robotics', 80, seed);
    assert.ok(sample.every(x => x.club === 'Robotics'));
    const summary = populationSummary(sample);
    assert.equal(summary.supportPercent, 75);
    assert.deepEqual(summary.groups.map(g => g.count), [0, 0, 0, 80]);
  }
});

test('sampling is deterministic without replacement and does not mutate the roster', () => {
  const original = JSON.stringify(population);
  const sample = drawSample('whole', 20, 42);
  assert.deepEqual(sample, drawSample('whole', 20, 42));
  assert.notDeepEqual(sample, drawSample('whole', 20, 43));
  assert.equal(new Set(sample.map(x => x.id)).size, 20);
  assert.ok(sample.every(x => population.includes(x)));
  assert.deepEqual(populationSummary(sample).groups.map(g => g.count), [4, 5, 6, 5]);
  assert.equal(populationSummary(sample).supportPercent, 60);
  assert.equal(JSON.stringify(population), original);
});

test('whole-roster sampling includes every club across a documented fixed set of seeds', () => {
  const observed = new Set();
  for (let seed = 1; seed <= 32; seed++) for (const row of drawSample('whole', 8, seed)) observed.add(row.club);
  assert.deepEqual([...observed].sort(), ['Art', 'Garden', 'Music', 'Robotics']);
  // A fixed small random sample need not exactly reproduce the population percentage.
  assert.notEqual(populationSummary(drawSample('whole', 20, 42)).supportPercent, 50);
});

test('invalid sampling inputs fail before a sample can be produced', () => {
  for (const size of ['', 'banana', 0, 7, 81, 400, 20.5, Infinity, null]) assert.throws(() => drawSample('whole', size, 42));
  for (const method of ['', 'all', 'Robotics', null]) assert.throws(() => drawSample(method, 20, 42));
  for (const seed of [-1, 1.5, 0x100000000]) assert.throws(() => drawSample('whole', 20, seed));
  assert.throws(() => populationSummary([]));
});

test('kiosk data reconcile pooled and group correlations', () => {
  assert.equal(kioskDays.length, 16);
  const { all, cool, warm } = kioskSummary();
  assert.ok(Math.abs(all - 0.6537204504606134) < 1e-12);
  assert.equal(cool, 0); assert.equal(warm, 0);
  assert.equal(mean(kioskDays.filter(x => x.weather === 'Cool').map(x => x.drinks)), 25);
  assert.equal(mean(kioskDays.filter(x => x.weather === 'Warm').map(x => x.drinks)), 45);
  assert.equal(mean(kioskDays.filter(x => x.weather === 'Cool').map(x => x.hires)), 10);
  assert.equal(mean(kioskDays.filter(x => x.weather === 'Warm').map(x => x.hires)), 30);
});

test('correlation handles perfect, reversed and constant examples honestly', () => {
  assert.equal(correlation([{ drinks: 1, hires: 2 }, { drinks: 2, hires: 4 }, { drinks: 3, hires: 6 }]), 1);
  assert.equal(correlation([{ drinks: 1, hires: 6 }, { drinks: 2, hires: 4 }, { drinks: 3, hires: 2 }]), -1);
  assert.equal(correlation([{ drinks: 1, hires: 2 }, { drinks: 1, hires: 4 }]), null);
  assert.throws(() => correlation([]));
  assert.throws(() => correlation([{ drinks: NaN, hires: 2 }, { drinks: 1, hires: 4 }]));
});

test('fresh headline uses its own values and the correct survey denominator', () => {
  const g = gallerySummary();
  assert.equal(g.difference, 8); assert.ok(Math.abs(g.percent - 16.6666666667) < 1e-8);
  assert.equal(g.surveyPercent, 90); assert.notEqual(g.percent, librarySummary().percent);
});

test('empty, overlong and unfinished verdicts cannot become completion', () => {
  assert.equal(checkVerdictCompleteness({}).complete, false);
  assert.equal(checkVerdictCompleteness({ claim: ' ', observation: 'x', limitation: 'x', checks: [true, true, true], completedCases: 3 }).complete, false);
  assert.equal(checkVerdictCompleteness({ claim: 'x'.repeat(801), observation: 'x', limitation: 'x', checks: [true, true, true], completedCases: 3 }).complete, false);
  assert.equal(checkVerdictCompleteness({ claim: 'x', observation: 'x', limitation: 'x', checks: [true, false, true], completedCases: 3 }).complete, false);
  assert.equal(checkVerdictCompleteness({ claim: 'x', observation: 'x', limitation: 'x', checks: [true, true, true], completedCases: 2 }).complete, false);
});

test('verdict completeness does not pretend to judge truth or understand prose', () => {
  const result = checkVerdictCompleteness({ claim: 'A deliberately unsupported claim.', observation: 'Arbitrary text.', limitation: 'Arbitrary text.', checks: [true, true, true], completedCases: 3 });
  assert.equal(result.complete, true); assert.equal(result.accuracyAssessed, false);
  assert.deepEqual(result.missing, []);
});

test('basic numeric failures are explicit', () => {
  assert.throws(() => mean([])); assert.throws(() => mean([NaN]));
  assert.throws(() => percentChange(0, 10)); assert.throws(() => percentChange(-2, 10));
});
