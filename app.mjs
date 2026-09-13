import { libraryDays, population, clubs, kioskDays, gallery } from './datasets.mjs';
import { librarySummary, wholeNumber, axisRange, drawSample, populationSummary, kioskSummary, gallerySummary, checkVerdictCompleteness } from './domain.mjs';
import { lineChart, compositionChart, scatterChart, emptyChart } from './charts.mjs';
import { registerPageTools } from './webmcp.mjs';

const $ = id => document.getElementById(id);
const views = ['graph', 'sampling', 'correlation', 'verdict'];
const library = librarySummary(), populationStats = populationSummary(), kiosk = kioskSummary(), transfer = gallerySummary();
const baseSeed = 20260912;
const emptyNotes = {
  graph: 'Change an axis and check which numerical conclusion still holds.',
  sampling: 'Draw from both sampling frames, then inspect who was represented.',
  correlation: 'Compare weather groups and consider an alternative explanation.',
};
const state = {
  view: 'graph', axis: { min: 40, max: 60 }, axisValid: true, axisTouched: false,
  method: 'whole', sampleSize: 20, sample: null, drawNumber: 0, seenMethods: new Set(),
  grouped: false, sawGroups: false, notes: {},
};
const percentage = value => `${value.toFixed(1)}%`;
const chosen = name => document.querySelector(`input[name="${name}"]:checked`)?.value;
const markChoice = (name, value) => document.querySelectorAll(`input[name="${name}"]`).forEach(el => { el.checked = el.value === value; });
const clearChoices = name => document.querySelectorAll(`input[name="${name}"]`).forEach(el => { el.checked = false; });
const feedback = (id, text, error = false) => { $(id).textContent = text; $(id).classList.toggle('is-error', error); };
const tableRows = (target, rows) => {
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const tr = document.createElement('tr');
    row.forEach((value, i) => {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) cell.scope = 'row';
      cell.textContent = String(value);
      tr.append(cell);
    });
    fragment.append(tr);
  }
  $(target).replaceChildren(fragment);
};

function renderCharts() {
  if (state.view === 'graph') {
    const points = [{ label: 'Before', value: library.before }, { label: 'After', value: library.after }];
    lineChart($('chart-full'), points, { min: 0, max: 60 }, 'Zero-based view of library means');
    if (state.axisValid) lineChart($('chart-adjusted'), points, state.axis, 'Adjustable view of the same library means');
    else emptyChart($('chart-adjusted'), 'Enter a valid axis range to display this view. The underlying data have not changed.');
  } else if (state.view === 'sampling') {
    compositionChart($('chart-composition'), state.sample ? populationSummary(state.sample) : null);
  } else if (state.view === 'correlation') {
    scatterChart($('chart-correlation'), state.grouped);
  } else {
    lineChart($('chart-gallery'), [{ label: 'Before', value: gallery.before }, { label: 'After', value: gallery.after }], { min: 46, max: 60 }, 'Zoomed fictional gallery means');
  }
}

function navigate(view, focus = true) {
  if (!views.includes(view)) throw new RangeError('Unknown investigation activity.');
  state.view = view;
  views.forEach(name => { $(`case-${name}`).hidden = name !== view; });
  document.querySelectorAll('nav [data-view]').forEach(link => {
    if (link.dataset.view === view) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  history.replaceState(null, '', `#${view}`);
  if (focus) $(`title-${view}`).focus();
  renderCharts();
}

function updateNotebook() {
  const count = Object.keys(state.notes).length;
  $('progress').textContent = `${count} of 3 observations recorded`;
  for (const name of ['graph', 'sampling', 'correlation']) {
    $(`note-${name}`).textContent = state.notes[name] || emptyNotes[name];
    $(`note-${name}`).closest('section').classList.toggle('is-recorded', Boolean(state.notes[name]));
  }
  if (count !== 3) $('completion').hidden = true;
}

function record(name, text) {
  state.notes[name] = text;
  updateNotebook();
  feedback(`feedback-${name}`, 'Recorded in your notebook. You can keep exploring or continue to the next case.');
}

function applyAxes(minValue, maxValue, fromTool = false) {
  const range = axisRange(minValue, maxValue); // Validate before changing state.
  state.axis = range;
  state.axisValid = true;
  state.axisTouched = true;
  if (fromTool) { $('axis-min').value = String(range.min); $('axis-max').value = String(range.max); }
  $('axis-error').textContent = '';
  $('axis-min').removeAttribute('aria-invalid'); $('axis-max').removeAttribute('aria-invalid');
  renderCharts();
  return { ...range, means: { before: library.before, after: library.after }, difference: library.difference };
}

function onAxisInput() {
  try { applyAxes($('axis-min').value, $('axis-max').value); }
  catch (error) {
    state.axisValid = false;
    $('axis-error').textContent = error.message;
    $('axis-min').setAttribute('aria-invalid', 'true'); $('axis-max').setAttribute('aria-invalid', 'true');
    renderCharts();
  }
}

function renderSample() {
  const summary = state.sample ? populationSummary(state.sample) : null;
  $('method-description').textContent = state.method === 'whole'
    ? 'Method: shuffle a copy of the entire 320-record roster, then take the first n. All clubs can be selected.'
    : 'Method: keep only the 80 Robotics records, shuffle that copy, then take the first n. Other clubs cannot be selected.';
  $('sample-result').textContent = summary
    ? `Sample: ${summary.supporters} of ${summary.count} support later opening (${percentage(summary.supportPercent)}). Known population: 160 of 320 (50.0%).`
    : 'Draw a sample for these settings to compare it with the population.';
  $('draw-detail').textContent = summary
    ? `Draw ${state.drawNumber}. Reproducible seed ${baseSeed + state.drawNumber}. ${state.method === 'whole' ? 'Whole-population' : 'Robotics-only'} selection, without replacement.`
    : 'Each draw uses a fixed pseudorandom seed. Reset starts the sequence again.';
  tableRows('composition-table', clubs.map(club => [club, 80,
    population.filter(row => row.club === club && row.supportsLateOpening).length,
    summary ? summary.groups.find(g => g.club === club).count : 'Not drawn']));
  tableRows('selected-body', (state.sample || []).map(row => [row.id, row.club, row.supportsLateOpening ? 'Yes' : 'No']));
  $('selected-empty').hidden = Boolean(summary); $('selected-table').hidden = !summary;
  if (state.view === 'sampling') renderCharts();
}

function pendingSample() {
  state.sample = null;
  $('sample-error').textContent = '';
  $('sample-size').removeAttribute('aria-invalid');
  try { state.sampleSize = wholeNumber($('sample-size').value, 'Sample size', 8, 80); }
  catch (error) { $('sample-error').textContent = error.message; $('sample-size').setAttribute('aria-invalid', 'true'); }
  renderSample();
}

function sample(method, size) {
  const nextDraw = state.drawNumber + 1;
  const rows = drawSample(method, size, baseSeed + nextDraw); // No state change on validation failure.
  state.method = method; state.sampleSize = Number(size); state.drawNumber = nextDraw; state.sample = rows;
  state.seenMethods.add(method);
  markChoice('sample-method', method); $('sample-size').value = String(size);
  $('sample-error').textContent = ''; $('sample-size').removeAttribute('aria-invalid');
  renderSample();
  return { method, drawNumber: nextDraw, seed: baseSeed + nextDraw, ...populationSummary(rows) };
}

function drawFromControls() {
  try { sample(chosen('sample-method'), $('sample-size').value); }
  catch (error) { state.sample = null; renderSample(); $('sample-error').textContent = error.message; $('sample-size').setAttribute('aria-invalid', 'true'); }
}

function setWeatherView(grouped) {
  if (typeof grouped !== 'boolean') throw new TypeError('Weather comparison must be true or false.');
  state.grouped = grouped; if (grouped) state.sawGroups = true;
  markChoice('weather-view', grouped ? 'groups' : 'all');
  $('weather-legend').textContent = grouped ? 'Hollow circles: Cool days. Filled diamonds: Warm days.' : 'Each filled circle is one fictional day.';
  $('correlation-reading').textContent = grouped
    ? 'Within these weather groups, drink sales do not show the same linear pattern with cycle hires. Group differences help explain the pooled pattern.'
    : 'The pooled points show a positive association. Compare weather groups before choosing a causal explanation.';
  if (state.view === 'correlation') renderCharts();
  return { grouped, correlations: { ...kiosk } };
}

function resetCase(name) {
  delete state.notes[name];
  feedback(`feedback-${name}`, '');
  if (name === 'graph') {
    state.axis = { min: 40, max: 60 }; state.axisValid = true; state.axisTouched = false;
    $('axis-min').value = '40'; $('axis-max').value = '60'; $('axis-error').textContent = '';
    $('axis-min').removeAttribute('aria-invalid'); $('axis-max').removeAttribute('aria-invalid'); clearChoices('graph-answer');
  } else if (name === 'sampling') {
    state.method = 'whole'; state.sampleSize = 20; state.sample = null; state.drawNumber = 0; state.seenMethods.clear();
    markChoice('sample-method', 'whole'); $('sample-size').value = '20'; $('sample-error').textContent = '';
    $('sample-size').removeAttribute('aria-invalid'); clearChoices('sample-answer'); renderSample();
  } else {
    state.sawGroups = false; setWeatherView(false); clearChoices('correlation-answer');
  }
  updateNotebook(); renderCharts();
}

document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); navigate(link.dataset.view);
}));
document.querySelector('.notebook-link').addEventListener('click', event => { event.preventDefault(); $('notebook').focus(); });
$('begin').addEventListener('click', () => { $('introduction').hidden = true; navigate('graph'); });
$('axis-min').addEventListener('input', onAxisInput); $('axis-max').addEventListener('input', onAxisInput);
$('axis-demo').addEventListener('click', () => { applyAxes(0, 60, true); feedback('feedback-graph', 'Both axes now start at zero. Try a tighter minimum, then check the numerical change.'); });
$('record-graph').addEventListener('click', () => {
  if (!state.axisValid) return feedback('feedback-graph', 'Set a valid axis before recording.', true);
  if (!state.axisTouched) return feedback('feedback-graph', 'First change an axis or use “Show both at zero” to compare.', true);
  if (chosen('graph-answer') === 'difference') return record('graph', `The means stayed 46 and 54 visits/day: +8 (${percentage(library.percent)}). My recorded axis was ${state.axis.min} to ${state.axis.max}; the frame changed the appearance, not the data.`);
  feedback('feedback-graph', chosen('graph-answer') ? 'The counts stayed fixed. Subtract 46 from 54; an enlarged drawing does not mean the value tripled. Try again.' : 'Choose a conclusion to check.', true);
});
document.querySelectorAll('input[name="sample-method"]').forEach(input => input.addEventListener('change', () => { state.method = input.value; pendingSample(); }));
$('sample-size').addEventListener('input', pendingSample);
$('draw-sample').addEventListener('click', drawFromControls);
$('sample-demo').addEventListener('click', () => sample('robotics', 80));
$('record-sampling').addEventListener('click', () => {
  if (!state.sample || state.seenMethods.size < 2) return feedback('feedback-sampling', 'Make a valid draw from each method so you can compare their coverage.', true);
  if (chosen('sample-answer') === 'coverage') {
    const result = populationSummary(state.sample);
    return record('sampling', `Coverage matters: Robotics-only excludes three clubs. My recorded ${state.method === 'whole' ? 'whole-population' : 'Robotics-only'} draw had ${result.count} records and ${percentage(result.supportPercent)} support; the known population is 50.0%. Random samples can vary.`);
  }
  feedback('feedback-sampling', chosen('sample-answer') ? 'Check which clubs could enter the sample. A large restricted sample can stay biased, and a whole-roster sample can vary by chance. Try again.' : 'Choose an explanation to check.', true);
});
document.querySelectorAll('input[name="weather-view"]').forEach(input => input.addEventListener('change', () => setWeatherView(input.value === 'groups')));
$('record-correlation').addEventListener('click', () => {
  if (!state.sawGroups) return feedback('feedback-correlation', 'Compare the weather groups first.', true);
  if (chosen('correlation-answer') === 'alternative') return record('correlation', 'The pooled counts were associated. Comparing weather groups suggested a shared explanation; association alone does not establish causation or prove weather is the only cause.');
  feedback('feedback-correlation', chosen('correlation-answer') ? 'The graph does not isolate a cause. Weather could influence both counts, and other explanations remain possible. Try a more cautious claim.' : 'Choose a claim to check.', true);
});
for (const name of ['graph', 'sampling', 'correlation']) $(`reset-${name}`).addEventListener('click', () => resetCase(name));
$('verdict-form').addEventListener('submit', event => {
  event.preventDefault();
  const result = checkVerdictCompleteness({
    claim: $('claim').value, observation: $('observation').value, limitation: $('limitation').value,
    checks: [...document.querySelectorAll('input[name="self-check"]')].map(input => input.checked),
    completedCases: Object.keys(state.notes).length,
  });
  if (!result.complete) { $('completion').hidden = true; return feedback('feedback-verdict', result.missing.join(' '), true); }
  feedback('feedback-verdict', 'Your response is complete in structure. Its accuracy has not been automatically assessed; compare it with your notebook and the example answer.');
  $('completion').hidden = false; $('completion-title').focus();
});
for (const id of ['claim', 'observation', 'limitation']) $(id).addEventListener('input', () => { $('completion').hidden = true; feedback('feedback-verdict', ''); });
document.querySelectorAll('input[name="self-check"]').forEach(input => input.addEventListener('change', () => { $('completion').hidden = true; feedback('feedback-verdict', ''); }));
$('review-cases').addEventListener('click', () => navigate('graph'));
$('restart').addEventListener('click', () => $('restart-dialog').showModal());
$('cancel-restart').addEventListener('click', () => $('restart-dialog').close());
$('confirm-restart').addEventListener('click', () => {
  for (const name of ['graph', 'sampling', 'correlation']) resetCase(name);
  $('verdict-form').reset(); $('completion').hidden = true; feedback('feedback-verdict', '');
  $('introduction').hidden = false; $('restart-dialog').close(); navigate('graph');
});

tableRows('library-table', Array.from({ length: 10 }, (_, i) => [i + 1, libraryDays[i].visits, libraryDays[i + 10].visits]).concat([
  ['Mean', library.before, library.after],
]));
$('library-result').textContent = `Same data in both views: ${library.before} to ${library.after} visits/day. Increase: ${library.difference} visits/day (${percentage(library.percent)}).`;
for (const group of populationStats.groups) {
  const row = document.createElement('div'); row.className = 'population-row';
  const label = document.createElement('p');
  const name = document.createElement('strong'); name.textContent = `${group.club}: 80 records`;
  const count = population.filter(record => record.club === group.club && record.supportsLateOpening).length;
  const support = document.createElement('span'); support.textContent = `${count} support later opening`;
  label.append(name, support);
  const dots = document.createElement('div'); dots.className = 'dot-row'; dots.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 20; i++) { const dot = document.createElement('span'); dot.className = `population-dot${i < count / 4 ? ' supports' : ''}`; dots.append(dot); }
  row.append(label, dots); $('population-dots').append(row);
}
tableRows('kiosk-table', kioskDays.map(row => [row.day, row.weather, row.drinks, row.hires]));
$('correlation-statistics').textContent = `Pearson's r, computed from these data: pooled ${kiosk.all.toFixed(2)}; Cool ${kiosk.cool.toFixed(2)}; Warm ${kiosk.warm.toFixed(2)}.`;
tableRows('gallery-table', [['Before, mean visits/day', gallery.before], ['After, mean visits/day', gallery.after], ['Increase, visits/day', transfer.difference], ['Relative increase', percentage(transfer.percent)], ['Poster supporters among launch guests', `${gallery.supporters} of ${gallery.respondents} (${percentage(transfer.surveyPercent)})`], ['Sampling frame', gallery.sampledFrom]]);
$('exemplar-text').textContent = `Harbor Gallery's recorded average rose by ${transfer.difference} visits a day, from 48 to 56 (about ${percentage(transfer.percent)}), not double. Eighteen of twenty launch guests liked the poster, but they were not a representative town-wide sample. The before/after comparison does not show that the poster caused the rise; other changes could contribute.`;
renderSample(); setWeatherView(false); updateNotebook();
const initialView = location.hash.slice(1); navigate(views.includes(initialView) ? initialView : 'graph', false);
let resizePending = false;
const redraw = () => { if (!resizePending) { resizePending = true; requestAnimationFrame(() => { resizePending = false; renderCharts(); }); } };
window.addEventListener('resize', redraw);
const resizeObserver = new ResizeObserver(redraw);
resizeObserver.observe($('main'));
window.addEventListener('pagehide', () => resizeObserver.disconnect(), { once: true });

registerPageTools({
  readSummary: () => ({ view: state.view, observationsRecorded: Object.keys(state.notes).length,
    axisValid: state.axisValid, axis: { ...state.axis }, library: { ...library },
    sample: state.sample ? { method: state.method, drawNumber: state.drawNumber, ...populationSummary(state.sample) } : null,
    grouped: state.grouped, correlations: { ...kiosk }, learnerTextIncluded: false }),
  configureAxes: (min, max) => applyAxes(min, max, true),
  drawSample: sample,
  compareWeather: setWeatherView,
});
