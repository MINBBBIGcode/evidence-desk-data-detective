import test from 'node:test';
import assert from 'node:assert/strict';
import { registerPageTools } from '../dist/webmcp.mjs';
import { axisRange, drawSample, populationSummary } from '../dist/domain.mjs';

test('optional tools validate their contract and invoke shared actions without reading prose', async () => {
  const registered = new Map(); let state = { min: 40, max: 60 }, draws = 0;
  const actions = {
    readSummary: () => ({ axis: { ...state }, learnerTextIncluded: false }),
    configureAxes: (min, max) => { const valid = axisRange(min, max); state = valid; return state; },
    drawSample: (method, size) => { const rows = drawSample(method, size, 42); draws++; return populationSummary(rows); },
    compareWeather: grouped => { if (typeof grouped !== 'boolean') throw new TypeError(); return { grouped }; },
  };
  assert.deepEqual(registerPageTools(actions, null), { supported: false });
  const result = registerPageTools(actions, { registerTool: (tool, options) => { assert.ok(options.signal instanceof AbortSignal); registered.set(tool.name, tool); } });
  assert.equal(result.names.length, 4);
  const axis = registered.get('configure_graph_axes');
  assert.deepEqual(axis.execute({ min: 0, max: 100 }), { min: 0, max: 100 });
  for (const input of [{ min: '', max: 60 }, { min: 1.5, max: 60 }, { min: 46, max: 60 }, { min: 0, max: 60, extra: true }]) assert.throws(() => axis.execute(input));
  assert.deepEqual(state, { min: 0, max: 100 });
  const sample = registered.get('draw_synthetic_sample');
  assert.equal(sample.execute({ method: 'robotics', size: 80 }).supportPercent, 75);
  assert.throws(() => sample.execute({ method: 'invalid', size: 20 }));
  assert.equal(draws, 1);
  assert.throws(() => registered.get('set_weather_comparison').execute({ grouped: 'yes' }));
  const summary = registered.get('read_investigation_summary');
  assert.equal(summary.annotations.readOnlyHint, true);
  assert.equal(summary.execute({}).learnerTextIncluded, false);
  assert.throws(() => summary.execute({ claim: 'learner text' }));
});

test('registration failure is optional and does not break the lesson', () => {
  assert.doesNotThrow(() => registerPageTools({}, { registerTool() { throw new Error('Unavailable'); } }));
});
