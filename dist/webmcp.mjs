// Optional page-scoped tools. No network calls, persistence or access to learner prose.
export function registerPageTools(actions, context = globalThis.document?.modelContext) {
  if (!context?.registerTool) return { supported: false };
  const lifecycle = new AbortController();
  const exactObject = (value, keys) => {
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
        Object.keys(value).some(key => !keys.includes(key)) || keys.some(key => !(key in value))) {
      throw new TypeError('Supply exactly the named input fields.');
    }
    return value;
  };
  const tools = [
    { name: 'read_investigation_summary', title: 'Read investigation summary',
      description: 'Read the active case and synthetic-data results. Excludes all learner writing.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: input => { exactObject(input, []); return actions.readSummary(); } },
    { name: 'configure_graph_axes', title: 'Configure graph axes',
      description: 'Set the adjustable library axis, updating the same controls and chart as the page. Does not change data or record an answer.',
      inputSchema: { type: 'object', properties: { min: { type: 'integer', minimum: 0, maximum: 45 }, max: { type: 'integer', minimum: 55, maximum: 100 } }, required: ['min', 'max'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: input => { const x = exactObject(input, ['min', 'max']); if (!Number.isInteger(x.min) || !Number.isInteger(x.max)) throw new TypeError('Axes must be integers.'); return actions.configureAxes(x.min, x.max); } },
    { name: 'draw_synthetic_sample', title: 'Draw synthetic sample',
      description: 'Draw a reproducible sample with the same method and size controls as the learner UI. Advances the visible draw number; does not record an answer.',
      inputSchema: { type: 'object', properties: { method: { type: 'string', enum: ['whole', 'robotics'] }, size: { type: 'integer', minimum: 8, maximum: 80 } }, required: ['method', 'size'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: input => { const x = exactObject(input, ['method', 'size']); if (!Number.isInteger(x.size)) throw new TypeError('Size must be an integer.'); return actions.drawSample(x.method, x.size); } },
    { name: 'set_weather_comparison', title: 'Set weather comparison',
      description: 'Switch the same scatter plot between pooled days and weather groups. Does not record an answer.',
      inputSchema: { type: 'object', properties: { grouped: { type: 'boolean' } }, required: ['grouped'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: input => { const x = exactObject(input, ['grouped']); return actions.compareWeather(x.grouped); } },
  ];
  for (const tool of tools) {
    try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
    catch { /* Optional browser capability; core lesson remains available. */ }
  }
  globalThis.addEventListener?.('pagehide', () => lifecycle.abort(), { once: true });
  return { supported: true, names: tools.map(tool => tool.name) };
}
