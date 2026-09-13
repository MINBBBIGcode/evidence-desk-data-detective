import { projectY } from './domain.mjs';
import { kioskDays } from './datasets.mjs';

const NS = 'http://www.w3.org/2000/svg';
const element = (tag, attrs = {}, text) => {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
};
const tickLabel = n => Number.isInteger(n) ? String(n) : n.toFixed(1);

function canvas(root, height, title, description) {
  const available = Math.round(root.getBoundingClientRect().width);
  if (available < 1) return null;
  const scale = Math.max(1, parseFloat(getComputedStyle(root).fontSize) / 16);
  const width = Math.max(available, 280 * scale);
  const actualHeight = height * scale;
  if (width > available) {
    root.tabIndex = 0;
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', `${title}. Scrollable chart; a data table is available below.`);
  } else {
    root.removeAttribute('tabindex'); root.removeAttribute('role'); root.removeAttribute('aria-label');
  }
  const svg = element('svg', { viewBox: `0 0 ${width} ${actualHeight}`, width, height: actualHeight, role: 'img',
    'aria-labelledby': `${root.id}-title ${root.id}-desc` });
  svg.append(element('title', { id: `${root.id}-title` }, title));
  svg.append(element('desc', { id: `${root.id}-desc` }, description));
  root.replaceChildren(svg);
  return { svg, width, scale };
}

export function emptyChart(root, message) {
  const paragraph = document.createElement('p');
  paragraph.className = 'empty-chart';
  paragraph.textContent = message;
  root.replaceChildren(paragraph);
}

export function lineChart(root, points, range, title) {
  const c = canvas(root, 288, title,
    `${points.map(p => `${p.label}: ${p.value} visits per day`).join('; ')}. Vertical axis ${range.min} to ${range.max}. The data table supplies the same values.`);
  if (!c) return;
  const { svg, width, scale: s } = c;
  const left = 48 * s, right = width - 20 * s, top = 40 * s, bottom = 224 * s;
  svg.append(element('text', { x: 0, y: 18 * s }, 'Mean visits / day'));
  for (let i = 0; i < 5; i++) {
    const value = range.min + (range.max - range.min) * i / 4;
    const y = projectY(value, range, top, bottom);
    svg.append(element('line', { x1: left, x2: right, y1: y, y2: y, class: 'grid' }));
    svg.append(element('text', { x: left - 8 * s, y: y + 5 * s, 'text-anchor': 'end' }, tickLabel(value)));
  }
  svg.append(element('line', { x1: left, x2: left, y1: top, y2: bottom, class: 'axis' }));
  svg.append(element('line', { x1: left, x2: right, y1: bottom, y2: bottom, class: 'axis' }));
  const positions = points.map((point, i) => ({
    ...point, x: left + (right - left) * (i === 0 ? 0.28 : 0.74),
    y: projectY(point.value, range, top, bottom),
  }));
  svg.append(element('polyline', { points: positions.map(p => `${p.x},${p.y}`).join(' '), class: 'data-line' }));
  for (const p of positions) {
    svg.append(element('circle', { cx: p.x, cy: p.y, r: 5 * s, class: 'data-point' }));
    svg.append(element('text', { x: p.x, y: p.y - 12 * s, 'text-anchor': 'middle', class: 'chart-value' }, String(p.value)));
    svg.append(element('text', { x: p.x, y: bottom + 24 * s, 'text-anchor': 'middle' }, p.label));
  }
  svg.append(element('text', { x: (left + right) / 2, y: 280 * s, 'text-anchor': 'middle' }, 'Period'));
}

export function compositionChart(root, summary) {
  if (!summary) return emptyChart(root, 'Draw a sample to see its composition alongside the known population.');
  const c = canvas(root, 304, 'Population and sample composition',
    summary.groups.map(g => `${g.club}: population 25 percent, sample ${g.percent.toFixed(1)} percent (${g.count} records)`).join('; '));
  if (!c) return;
  const { svg, width, scale: s } = c;
  const left = 80 * s, right = width - 48 * s, plotWidth = Math.max(1, right - left);
  for (const n of [0, 25, 50, 75, 100]) {
    const x = left + n / 100 * plotWidth;
    svg.append(element('line', { x1: x, x2: x, y1: 16 * s, y2: 248 * s, class: 'grid' }));
    svg.append(element('text', { x, y: 272 * s, 'text-anchor': 'middle' }, `${n}`));
  }
  for (const [i, g] of summary.groups.entries()) {
    const y = (24 + i * 56) * s;
    svg.append(element('text', { x: 0, y: y + 19 * s }, g.club));
    svg.append(element('rect', { x: left, y, width: plotWidth * 0.25, height: 12 * s, class: 'population-bar' }));
    svg.append(element('text', { x: left + plotWidth * 0.25 + 6 * s, y: y + 11 * s }, '25%'));
    svg.append(element('rect', { x: left, y: y + 18 * s, width: plotWidth * g.percent / 100, height: 12 * s, class: 'sample-bar' }));
    svg.append(element('text', { x: left + plotWidth * g.percent / 100 + 6 * s, y: y + 29 * s }, `${tickLabel(g.percent)}%`));
  }
  svg.append(element('text', { x: (left + right) / 2, y: 298 * s, 'text-anchor': 'middle' }, 'Share of records (%)'));
}

export function scatterChart(root, grouped) {
  const c = canvas(root, 336, 'Cold drinks sold and cycles hired per day',
    `Sixteen fictional days. ${grouped ? 'Cool days use hollow circles; warm days use filled diamonds. Weather groups shift both averages.' : 'All days appear together as filled circles with a positive pooled association.'} A table lists every point.`);
  if (!c) return;
  const { svg, width, scale: s } = c;
  const left = 56 * s, right = width - 20 * s, top = 40 * s, bottom = 280 * s;
  const x = value => left + value / 70 * (right - left);
  const y = value => bottom - value / 40 * (bottom - top);
  svg.append(element('text', { x: 0, y: 18 * s }, 'Cycles hired / day'));
  for (const n of [0, 10, 20, 30, 40]) {
    svg.append(element('line', { x1: left, x2: right, y1: y(n), y2: y(n), class: 'grid' }));
    svg.append(element('text', { x: left - 8 * s, y: y(n) + 5 * s, 'text-anchor': 'end' }, String(n)));
  }
  for (const n of [0, 20, 40, 60]) {
    svg.append(element('line', { x1: x(n), x2: x(n), y1: top, y2: bottom, class: 'grid' }));
    svg.append(element('text', { x: x(n), y: bottom + 24 * s, 'text-anchor': 'middle' }, String(n)));
  }
  svg.append(element('line', { x1: left, x2: left, y1: top, y2: bottom, class: 'axis' }));
  svg.append(element('line', { x1: left, x2: right, y1: bottom, y2: bottom, class: 'axis' }));
  for (const row of kioskDays) {
    const px = x(row.drinks), py = y(row.hires);
    const point = grouped && row.weather === 'Warm'
      ? element('polygon', { points: `${px},${py - 6 * s} ${px + 6 * s},${py} ${px},${py + 6 * s} ${px - 6 * s},${py}`, class: 'data-point' })
      : element('circle', { cx: px, cy: py, r: 5 * s, class: grouped ? 'cool-point' : 'data-point' });
    point.append(element('title', {}, `Day ${row.day}: ${row.drinks} drinks, ${row.hires} hires, ${row.weather}`));
    svg.append(point);
  }
  svg.append(element('text', { x: (left + right) / 2, y: 330 * s, 'text-anchor': 'middle' }, 'Cold drinks sold / day'));
}
