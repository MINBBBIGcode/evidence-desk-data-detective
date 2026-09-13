# Static hosting

Preview: https://minbbbigcode.github.io/evidence-desk-data-detective/
Source: https://github.com/MINBBBIGcode/evidence-desk-data-detective

The website is the ten files in `dist/`, served unchanged over HTTPS. There is no build step, server, paid endpoint or account requirement for learners. The published `gh-pages` branch contains only these ten files and an empty `.nojekyll` marker. GitHub Pages serves this branch from `/`. Relative asset paths work under the project URL.

To reproduce: run `npm test`, `npm run check`, and `npm run preview`. For public deployment, copy all `dist/` files to the root of a static hosting branch, add an empty `.nojekyll`, and configure GitHub Pages to publish that branch. A requester account is not required to use the supplied preview or run the source locally.

The initial Sites host automatically records traffic analytics. That conflicts with the brief's ban on analytics/tracking, so this package omits the Sites manifest. Do not restore that host unless the restriction can be met. On September14, the published host passed a fresh anonymous41-check browser journey and exact-file checks for all ten application files. No cookies, persistent learner storage, learner-result transmission or injected scripts were observed. See docs/evidence/hosting-correction.json. Hosting services may retain ordinary server logs; this project does not enable analytics or claim to control provider infrastructure.

Keep the corrected preview available through requester review. The source stays independently runnable if hosting disappears.
