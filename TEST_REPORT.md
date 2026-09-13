# Evidence Desk verification

Original verification, 12 September 2026 (Asia/Seoul): this report covers the supplied static source and synthetic test journeys. At original packaging, public deployment and submission had not yet happened. The source was subsequently delivered as SUB-3XBT7EKH. A September 14 hosting correction is being prepared; fresh public checks will be recorded separately before corrective submission. No testing with children was conducted.

## Environment and scope

- Windows, Node.js 22.22.2, dependency-free production files served by `node serve.mjs` on a loopback HTTP origin.
- Installed Google Chrome **152.0.7977.83**, exercised through isolated Playwright CLI 0.1.19 sessions. These are full Chrome processes in headless mode, not Chromium headless-shell.
- Desktop/tablet/mobile viewport widths: **1280, 768, 390 and 360 CSS pixels**, all four activity views. Heights were 960 pixels for larger viewports and 844 for phone viewports.
- Touch: a 360px emulated Pixel 10 context with one touch point. Its emulated user-agent reports Android 16 / Chrome 153; the actual browser engine is Chrome 152. This is not a physical-device test.
- Text enlargement: 200% root text size (body 32px), every activity at 1280px and 360px. This is a text-resizing check, not a claim to have tested every browser's page-zoom implementation.
- Native WebMCP was unavailable. Its optional registration/action contract was tested with mocks; ordinary browser use was tested with the feature absent.

## Acceptance examples

| Requirement | Steps and observed result | Evidence |
| --- | --- | --- |
| Axis changes rendering, not data/statistics | Change the adjustable axis; then set both plots to 0–60. Displayed means stay 46 and 54, increase stays 8 visits/day and 17.4%; equal ranges give equal plotted positions. Blank and fractional bounds clear the obsolete plot and show an adjacent error. | `tests/domain.test.mjs`; journey checks 1–9; screenshots 1 and 2 below |
| Labelled charts, tables and reset | Read each chart's axis labels/units; open its data disclosure. The sample table exposes all selected synthetic IDs; the scatter table has all 16 points. Case reset clears only its own notebook observation. Global reset requires confirmation; Cancel and Escape preserve work. | Journey checks 14, 16, 24, 32–39; screenshots 1–5 |
| Sampling matches its definitions | Select Robotics-only and all 80 records: 60/80 = 75%, versus 160/320 = 50% in the population. Switch to whole population: the pool includes all four clubs. Both algorithms shuffle copies without replacement; neither mutates the population. | `tests/domain.test.mjs`; journey checks 13–21; screenshot 3; `DATA_DICTIONARY.md` |
| Repeated draws are reproducible | Identical seed/method/size produces identical IDs; selected IDs are unique. Repeated draws advance the displayed seed. Reset restores the initial draw sequence and clears method-history prerequisites. | Domain tests; journey checks 18–21 and 39 |
| Association does not establish causation | Toggle All days / Compare weather groups. All 16 points remain; hollow circles and filled diamonds distinguish groups. Pooled r is approximately 0.65372; each constructed group has r = 0. A causal overclaim receives specific feedback. Copy explicitly preserves uncertainty and the limits of Pearson r. | Domain tests; journey checks 22–25; screenshot 4 |
| Final claim, observation, limitation and feedback | Complete three case observations, read the new gallery headline, then fill three response fields and the self-review checklist. Blank fields receive specific completeness feedback. A complete structure shows a useful summary; editing it clears completion. The UI expressly says accuracy was not assessed. | `tests/domain.test.mjs`; journey checks 26–31; screenshot 5 |

## Interaction and accessibility observations

The automated, simulated browser walkthrough passed **41 checks**, covering valid and invalid inputs, wrong-answer retry, notebook prerequisites, repeated actions, case reset, confirmation, cancel, Escape, refresh, and absence of persistent browser data. The touch walkthrough passed **12 checks**, with zero outside-origin requests and zero page runtime errors. These are browser-driven synthetic journeys, not manual human usability trials.

Keyboard operation was exercised through native ArrowUp and Tab, verified visible focus, and Escape in the confirmation dialog. Source inspection confirmed native controls for radios, checkboxes, buttons and disclosures. Every essential action has a non-drag control. This does not establish complete screen-reader compatibility.

All **16 ordinary responsive views** and **8 text-enlarged views** passed page-width and control-bounds checks. SVG text stayed within its computed chart geometry. At enlarged phone sizes, labelled keyboard-focusable chart/data regions may scroll horizontally; core page controls reflow. At ordinary sizes, the measured button/input/choice targets were at least 48px high. Reduced-motion emulation was true and no running animations were present.

An independent reviewer read all ordinary responsive captures and the initial graph enlargement capture and found no required visual fixes. The parent subsequently fixed and verified long-heading/brand wrapping at 360px with 200% text. Another independent reviewer reconciled all datasets, equations, teaching cautions, resets and optional-tool validation; it independently ran all 16 domain/tool tests, with no required findings.

## Automated commands and records

`npm test` runs **16 passing tests, 0 failures** using Node's built-in test runner. They exercise meaningful domain boundaries: axis invariance and invalid ranges, seed repeatability and population immutability, restricted sample coverage, invalid sample settings, correlation edge cases, presence-only completion, and optional-tool validation before mutation.

`npm run check` validates required files, canonical token synchronization, local resource references, IDs, JavaScript syntax, absence of app network/storage APIs, and actual text/data colour pairs. All tested text pairs meet 4.5:1. These checks are not WCAG certification.

The `docs/evidence/` folder contains the actual domain output, static check, browser journey, responsive/touch results and Lighthouse summary. No credentials, account records or actual learner responses are included.

## Performance audit and limits

Lighthouse 13.4.1 audited the locally served production `dist/` through installed Chrome. Three mobile runs and three desktop runs give median scores **Performance 100, Accessibility 100, Best Practices 100, SEO 91**. These scores describe only those runs and do not prove general accessibility or deployed-site performance.

The SEO deduction is a confirmed measurement limitation: Lighthouse's `Network.loadNetworkResource` fetch of `robots.txt` reports a CSP violation because this app deliberately uses `connect-src 'none'`. A direct HTTP GET returns 200, `text/plain`, and valid `User-agent: *` / `Allow: /` contents. The connection restriction was preserved. No score was relabelled as 100, and no content or interaction was hidden to improve a score. The local preview also uses `Cache-Control: no-store`; Lighthouse notes the resulting back/forward-cache limitation. Hosting behavior must be checked again on the actual public deployment.

## Numbered screenshot walkthrough

1. [Compare the original graph frames](docs/walkthrough/01-graph.png). Start the lesson, read the two means and change the right-hand bounds. The shared statistics stay visible.
2. [Try an invalid axis](docs/walkthrough/02-graph-invalid.png). Clear a bound. The affected plot clears and an inline message identifies the allowed integer range; enter a valid bound to retry.
3. [Inspect a large restricted sample](docs/walkthrough/03-sampling.png). Use “Try all 80 Robotics records”, compare its 75% support with the known population's 50%, then select Whole population and draw again.
4. [Compare weather groups](docs/walkthrough/04-correlation.png). Switch the scatter view, inspect both marker shapes, and explain why the association is insufficient for the stated causal claim.
5. [Write a qualified verdict](docs/walkthrough/05-verdict.png). After recording three observations, use the new headline, three writing fields and self-review checklist. Completion checks structure, not truth.
6. [Use the graph on a 360px screen](docs/walkthrough/06-mobile-graph.png). Charts stack, navigation wraps and essential controls fit the page.
7. [Use sampling on a 360px screen](docs/walkthrough/07-mobile-sampling.png). The same full population, methods, controls and tables remain available.
8. [Enlarge text to 200%](docs/walkthrough/08-enlarged-graph.png). Controls reflow and chart geometry scales; the data region retains its labels and deliberate scroll affordance where needed.

## Remaining validation boundaries

Firefox, Safari, physical phones/tablets, screen readers and native WebMCP are unverified. No learning-efficacy or universal age-suitability claim is made. The typed verdict is never semantically graded. Data are intentionally small and synthetic; stratification does not establish a causal mechanism, and one random sample need not be closer to the known population than every restricted sample. Public hosting remains a separate verification step.
