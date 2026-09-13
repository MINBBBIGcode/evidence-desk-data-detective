import { libraryDays, population, clubs, kioskDays, gallery } from './datasets.mjs';

export function mean(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some(v => !Number.isFinite(v))) {
    throw new RangeError('Mean needs at least one finite value.');
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function percentChange(before, after) {
  if (!Number.isFinite(before) || !Number.isFinite(after) || before <= 0) {
    throw new RangeError('A percentage change needs a positive starting value.');
  }
  return (after - before) / before * 100;
}

export function librarySummary() {
  const before = mean(libraryDays.filter(row => row.period === 'Before').map(row => row.visits));
  const after = mean(libraryDays.filter(row => row.period === 'After').map(row => row.visits));
  return Object.freeze({ before, after, difference: after - before, percent: percentChange(before, after) });
}

export function wholeNumber(value, label, min, max) {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') {
    throw new RangeError(`${label}: enter a whole number from ${min} to ${max}.`);
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new RangeError(`${label}: enter a whole number from ${min} to ${max}.`);
  }
  return number;
}

export function axisRange(min, max) {
  return Object.freeze({
    min: wholeNumber(min, 'Axis minimum', 0, 45),
    max: wholeNumber(max, 'Axis maximum', 55, 100),
  });
}

export function projectY(value, range, top, bottom) {
  if (![value, range.min, range.max, top, bottom].every(Number.isFinite) ||
      range.max <= range.min || bottom <= top || value < range.min || value > range.max) {
    throw new RangeError('Cannot plot this value inside the supplied axis.');
  }
  return bottom - (value - range.min) / (range.max - range.min) * (bottom - top);
}

export function seededRandom(seed) {
  let state = wholeNumber(seed, 'Seed', 0, 0xffffffff);
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function drawSample(method, size, seed) {
  if (!['whole', 'robotics'].includes(method)) throw new RangeError('Choose a listed sampling method.');
  const count = wholeNumber(size, 'Sample size', 8, 80);
  const random = seededRandom(seed);
  const pool = population.filter(row => method === 'whole' || row.club === 'Robotics');
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function populationSummary(rows = population) {
  if (!Array.isArray(rows) || rows.length === 0) throw new RangeError('Draw a sample first.');
  const yes = rows.filter(row => row.supportsLateOpening).length;
  return Object.freeze({
    count: rows.length,
    supporters: yes,
    supportPercent: yes / rows.length * 100,
    groups: clubs.map(club => ({
      club,
      count: rows.filter(row => row.club === club).length,
      percent: rows.filter(row => row.club === club).length / rows.length * 100,
    })),
  });
}

export function correlation(rows) {
  if (!Array.isArray(rows) || rows.length < 2 || rows.some(row => !Number.isFinite(row.drinks) || !Number.isFinite(row.hires))) {
    throw new RangeError('Correlation needs at least two finite pairs.');
  }
  const xMean = mean(rows.map(row => row.drinks));
  const yMean = mean(rows.map(row => row.hires));
  let covariance = 0, xSquares = 0, ySquares = 0;
  for (const row of rows) {
    const dx = row.drinks - xMean, dy = row.hires - yMean;
    covariance += dx * dy;
    xSquares += dx * dx;
    ySquares += dy * dy;
  }
  if (xSquares === 0 || ySquares === 0) return null;
  return Math.max(-1, Math.min(1, covariance / Math.sqrt(xSquares * ySquares)));
}

export function kioskSummary() {
  return Object.freeze({
    all: correlation(kioskDays),
    cool: correlation(kioskDays.filter(row => row.weather === 'Cool')),
    warm: correlation(kioskDays.filter(row => row.weather === 'Warm')),
  });
}

export function gallerySummary() {
  return Object.freeze({
    difference: gallery.after - gallery.before,
    percent: percentChange(gallery.before, gallery.after),
    surveyPercent: gallery.supporters / gallery.respondents * 100,
  });
}

// This checks only presence and the learner's own checklist, never prose correctness.
export function checkVerdictCompleteness({ claim, observation, limitation, checks, completedCases }) {
  const missing = [];
  if (completedCases !== 3) missing.push('Record one observation from each of the three cases.');
  for (const [label, value] of [['claim', claim], ['supporting observation', observation], ['limitation', limitation]]) {
    if (typeof value !== 'string' || !value.trim()) missing.push(`Add your ${label}.`);
    else if (value.length > 800) missing.push(`Keep your ${label} within 800 characters.`);
  }
  if (!Array.isArray(checks) || checks.length !== 3 || !checks.every(value => value === true)) {
    missing.push('Use all three self-review checks.');
  }
  return Object.freeze({ complete: missing.length === 0, missing, accuracyAssessed: false });
}
