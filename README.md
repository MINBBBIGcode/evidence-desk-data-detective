# Evidence Desk

A locally runnable, client-side data-literacy lesson with graph framing, sampling, correlation and a fresh fictional-headline verdict. Prepared for Taskmarket TSK-5DV55M47. All examples are synthetic. No accounts, learner data collection, tracking, network services or runtime AI are used.

## Run and reproduce

- Runtime: Node.js 22.x; development and domain verification use 22.22.2 (`.nvmrc`).
- Dependencies: none. There is no installation step or dependency lockfile to resolve. `package.json` only names built-in Node commands.
- Development: `node serve.mjs` (or `npm run dev`). Open the printed `http://127.0.0.1:4177` URL. Use `node serve.mjs --port 4180` if the default port is already occupied.
- Production preview: `npm run preview` serves the same static assets with no transformation.
- Build: no compilation is required. `dist/` contains the complete authored production website. After changing canonical design tokens, run `node scripts/sync-tokens.mjs` and then `npm run check`.
- Domain/state tests: `npm test`.
- Static/package validation: `npm run check`.
- Stop the local preview with Ctrl+C. The preview binds only to the local machine and serves only `dist/`.

Use an HTTP origin for JavaScript modules; opening index.html through `file://` can be restricted by the browser. Once served, the core lesson has no external runtime dependency. It can be hosted as ordinary static files on any suitable free HTTPS host; no requester account or paid subscription is needed. The corrected public preview is https://minbbbigcode.github.io/evidence-desk-data-detective/. Publish the exact contents of `dist/` using a static host with no automatic analytics. See HOSTING.md for GitHub Pages commands and the reason for this correction.

## Source layout

- `dist/index.html`, `styles.css`, `tokens.css`: semantic interface and responsive presentation.
- `dist/datasets.mjs`: original deterministic, frozen datasets and provenance.
- `dist/domain.mjs`: means, percentage change, axis validation/projection, seeded sampling, summaries, Pearson correlation and presence-only verdict checks.
- `dist/charts.mjs`: actual SVG views from the same data/functions used by tables; figures resize in CSS-pixel coordinates to keep labels readable.
- `dist/app.mjs`: in-memory activity state, controls, feedback, reset and observation snapshots.
- `dist/webmcp.mjs`: optional feature-detected page tools calling the same axis/sample/group actions. They omit learner writing and have no network or storage capability. Their absence or registration failure does not prevent the lesson.
- `dist/EDUCATOR_GUIDE.md`: objectives, walkthrough, adaptation, references and offline follow-up.
- `DATA_DICTIONARY.md`: construction, fields, units and limitations.
- `tests/`: dependency-free domain and optional-tool contract checks.
- `TEST_REPORT.md`: actual browser/viewport evidence and remaining limitations.

## State and privacy

The active view, axis range, seeded draw count, current sample, weather grouping and three observation snapshots live in a single page-local state object. Browser-native form controls hold the three bounded prose fields. Nothing is persisted across reloads. Case reset clears only that case; global reset asks for confirmation and clears everything.

Structured case checks compare fixed answer choices and supply specific feedback. Arbitrary writing is checked only for presence, length and the learner's own checklist, never truth or quality. No evaluation service, account or personal record is involved. A restrictive content-security policy blocks connection APIs, embedded frames, objects and external scripts.

## Browser expectations and limits

The interface targets modern browsers with JavaScript modules, native dialog, ResizeObserver and CSS `:has`. The exact browsers and viewport sizes actually exercised are recorded in TEST_REPORT.md; untested engines are not represented as verified. The text tables offer equivalents to essential chart information. No sound, dragging or animation is needed.

This is a deliberately small teaching model with a known population, synthetic group differences and a limited number of observations. It does not certify learning gains, universal age suitability, survey validity or causation. See the educator guide and data dictionary for the intended reasoning boundaries.

## Submission and hosting status

This September 14 hosting correction supersedes the preview address supplied in Taskmarket submission SUB-3XBT7EKH. The original application files are unchanged. The first host automatically collects traffic statistics, which conflicts with the task brief; the corrected delivery uses GitHub Pages. The correction archive and preview document identify one later version, with the public host verified on September14. The Taskmarket receipt supplies the assigned submission reference. It is not a second independent contest entry or a claim for additional payment. Original source and assets are licensed under MIT; see ATTRIBUTION.md and HOST_CORRECTION.md.
