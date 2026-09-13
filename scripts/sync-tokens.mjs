import fs from 'node:fs/promises';
const design = await fs.readFile(new URL('../DESIGN.md', import.meta.url), 'utf8');
const css = design.match(/```css\n([\s\S]*?)\n```/);
if (!css) throw new Error('DESIGN.md has no canonical CSS token block.');
await fs.writeFile(new URL('../dist/tokens.css', import.meta.url), `/* Generated from DESIGN.md by scripts/sync-tokens.mjs. */\n${css[1]}\n`);
