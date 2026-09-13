import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => fs.readFile(path.join(root, file), 'utf8');
const files = ['index.html', 'styles.css', 'tokens.css', 'datasets.mjs', 'domain.mjs', 'charts.mjs', 'app.mjs', 'webmcp.mjs', 'EDUCATOR_GUIDE.md'];
for (const file of files) assert.ok((await fs.stat(path.join(root, 'dist', file))).size > 0, file);
for (const file of ['README.md', 'TEST_REPORT.md', 'DATA_DICTIONARY.md', 'ATTRIBUTION.md', 'LICENSE', 'DESIGN.md']) {
  assert.ok((await read(file)).trim().length > 50, file);
}
const design = await read('DESIGN.md');
const block = design.match(/```css\r?\n([\s\S]*?)\r?\n```/);
assert.ok(block, 'Canonical design tokens exist');
const tokens = await read('dist/tokens.css');
assert.equal(tokens.trim(), `/* Generated from DESIGN.md by scripts/sync-tokens.mjs. */\n${block[1]}\n`.trim());
const tokenMap = Object.fromEntries([...tokens.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
const html = await read('dist/index.html');
const styles = await read('dist/styles.css');
for (const name of [...styles.matchAll(/var\((--[\w-]+)/g)].map(match => match[1])) assert.ok(name in tokenMap, name);
assert.ok(!/#[\da-f]{3}(?:[\da-f]{3})?\b/i.test(styles), 'Styles use canonical colour variables');
assert.ok(html.includes('lang="en"') && html.includes('name="description"'), 'Document language and description');
assert.ok(html.includes("connect-src 'none'") && html.includes("form-action 'none'"), 'No connection or form submission');
assert.ok(!/[—–]/u.test(html + styles), 'No visible dash separators');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Unique element IDs');
for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (ref.startsWith('#')) assert.ok(ids.includes(ref.slice(1)) || ['graph', 'sampling', 'correlation', 'verdict'].includes(ref.slice(1)), ref);
  else { assert.ok(ref.startsWith('./'), `Bundled local resource: ${ref}`); await fs.stat(path.join(root, 'dist', ref)); }
}
for (const file of files.filter(file => file.endsWith('.mjs'))) {
  const source = await read(`dist/${file}`);
  assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB)\b/.test(source), `No network or persistent storage: ${file}`);
  const syntax = spawnSync(process.execPath, ['--check', path.join(root, 'dist', file)], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, syntax.stderr);
}
assert.ok((await read('HOSTING.md')).includes('GitHub Pages'), 'Documented static hosting');
const luminance = hex => {
  const c = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
};
const pairs = [['--ink','--surface'], ['--ink','--bg'], ['--muted','--bg'], ['--muted','--surface'], ['--primary','--surface'], ['--primary','--primary-soft'], ['--on-primary','--primary'], ['--on-primary','--primary-hover'], ['--error','--error-soft'], ['--error','--bg'], ['--data-secondary','--surface']];
const contrast = pairs.map(([foreground, background]) => {
  const a = luminance(tokenMap[foreground]), b = luminance(tokenMap[background]);
  const ratio = (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
  assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio}`);
  return { foreground, background, ratio: Number(ratio.toFixed(2)), minimum: 4.5 };
});
console.log(JSON.stringify({ verdict: 'PASS', files: files.length, checks: 'required files, token synchronization, resources, unique IDs, JS syntax, privacy constraints, contrast', contrast }, null, 2));
