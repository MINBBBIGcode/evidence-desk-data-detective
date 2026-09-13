# Evidence Desk design contract

## 1. Atmosphere and signature

A compact editorial workbench for a teenager inspecting evidence. Strong serif case headings, humanist interface text, cool white paper and one decisive blue accent. The data take the largest space. The notebook sits across a fine vertical rule on desktop and follows the activity on small screens. This is an investigation, with no marketing hero, dashboard decorations, mascot, timed challenge or score ranking.

Design Read: a hands-on data investigation for teenagers, calm editorial language, Evidence Desk direction. DESIGN_VARIANCE = 5, MOTION_INTENSITY = 1, VISUAL_DENSITY = 5.

## 2. Colour

The declarations below are the canonical tokens. `dist/tokens.css` is generated from this exact block; other styles reference variables. Data colours communicate a recorded category or state, never decorative accents.

```css
:root {
  --bg: #F7F9FC;
  --surface: #FFFFFF;
  --ink: #122231;
  --muted: #47566A;
  --primary: #184FC8;
  --primary-hover: #113D9F;
  --on-primary: #FFFFFF;
  --primary-soft: #E9F0FF;
  --border: #D5DEE8;
  --grid: #E1E8F1;
  --data-secondary: #526984;
  --error: #9D2538;
  --error-soft: #FFF2F4;
  --focus: #184FC8;
  --font-body: "Segoe UI", "Trebuchet MS", Arial, sans-serif;
  --font-heading: Georgia, "Times New Roman", serif;
  --font-number: "Segoe UI", Arial, sans-serif;
  --text-small: 0.875rem;
  --text-body: 1rem;
  --text-lead: 1.125rem;
  --text-subhead: 1.375rem;
  --text-brand: 1.75rem;
  --text-title: 2.25rem;
  --text-title-mobile: 1.75rem;
  --weight-normal: 400;
  --weight-medium: 600;
  --weight-bold: 700;
  --leading-body: 1.6;
  --leading-heading: 1.15;
  --tracking-normal: 0;
  --tracking-heading: -0.02em;
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --radius-control: 0.25rem;
  --radius-panel: 0.5rem;
  --line: 1px;
  --line-chart: 2px;
  --line-active: 3px;
  --focus-offset: 3px;
  --control-min: 3rem;
  --control-number: 7rem;
  --radio-size: 1.125rem;
  --notebook-width: 16rem;
  --page-max: 78rem;
  --measure: 66ch;
  --chart-height: 18rem;
  --chart-wide-height: 21rem;
  --chart-column-min: 20rem;
  --dot-size: 0.5rem;
  --textarea-min: 5.5rem;
  --full: 100%;
  --half: 50%;
  --auto: auto;
  --zero: 0;
  --grow: 1;
  --elevation: none;
  --backdrop-tone: 45%;
  --skip-hidden: -200%;
  --layer-skip: 2;
}
```

Meaning: primary is the action/current-view/sample colour; data-secondary is the baseline/Cool group colour. Error is restricted to validation failures. All body and label text uses ink/muted on background/surface; white appears on primary buttons only. Verify these pairs programmatically against WCAG AA contrast before delivery. Grid/border lines are decorative support; data marks, labels and focused controls must meet their relevant contrast targets.

## 3. Typography

Body: 16px, 400, line-height 1.6. Labels and secondary notes: 14px minimum, 400 or 600. Lead: 18px. Heading ramp: 22px subheads, 28px brand/mobile title, 36px desktop case title; Georgia 700, 1.15, -0.02em. No all-caps eyebrows, artificial letterspacing or manual line breaks. Numerical values use tabular numerals. SVG tick labels stay 14px in an actual-pixel coordinate system; important data labels are 16px and bold. Respect browser text enlargement.

## 4. Spacing and geometry

The 4px scale above owns spacing. Page gutters: 32px desktop, 16px mobile; major vertical rhythm 24px or 32px. Maximum page width 1248px, with a 256px notebook and 32px gap. At 1000px and below the notebook follows the activity; at 680px and below chart pairs stack and the navigation wraps. These named responsive breakpoints are layout tokens, not arbitrary per-component values.

Chart coordinate tokens: single comparison charts use measured CSS width and height 288px; plot left 48px, right 20px, top 40px, bottom 224px. Point x fractions 0.28 and 0.74; radius 5px; stroke 2px; ticks count 5; labels 14px and 16px. Sampling composition plots use height 304px, left 80px, right 48px, row pitch 56px, two bar heights 12px separated by 6px. Scatter plots use measured width and height 336px, left 56px, right 20px, top 40px, bottom 280px, x range 0 to 70 and y range 0 to 40, point radius 5px. These geometries are functional chart tokens; data-derived coordinates are calculations, not discretionary spacing. Visible labels and text alternatives carry the meaning.

Text enlargement: all chart geometry scales with the computed body-font ratio to 16px. A chart is at least 280 times that ratio in CSS pixels; when it cannot fit, its labelled, keyboard-focusable data region scrolls horizontally while page controls still reflow. The chart/table alternatives remain available. Long headings may wrap inside a word when text is enlarged beyond the phone width; the mobile brand can wrap at its space. Auto-fit comparison columns use a 20rem minimum, capped at 100% of the container, so enlarging text stacks the plots before they become narrow.

Population overview: four labelled rows, each with twenty marks; each mark represents exactly four synthetic records. A filled mark indicates four supporters. This is an accurate aggregate data diagram, not a decorative image or a pretend screenshot.

## 5. Components and states

- Shared header: white, bottom border, serif product name; navigation shows the actual selected activity with a blue bottom rule. Links/buttons have at least 48px targets and wrap on phones.
- Case heading: serif title followed by one concise scenario sentence. An initially open, dismissible introduction explains the three cases, final response and local-only notes without hiding the first working controls.
- Charts: real SVG from the same data/functions as the tables, white surfaces and fine grid lines. Chart pairs become a single column on mobile; sampling is a roster + control strip + composition rows; correlation is one wide scatter plot with group comparisons; verdict is a brief evidence panel above a writing form. These are four distinct functional layouts within one shell.
- Notebook: border division, three named observations. Empty observations explain the next action. Only explicitly recorded, correct structured reasoning adds a snapshot; arbitrary prose is never auto-scored.
- Primary button: blue/white, 12px by 20px padding, 4px radius. Hover darkens instantly; active remains dark; focus is a 3px blue outline with 3px offset. Disabled controls use explicit disabled semantics and muted text rather than fading essential text.
- Inputs: white/ink, 1px border, 4px radius, 48px minimum target. Visible labels, keyboard focus and adjacent inline error. Invalid state clears the affected old plot/sample; it never claims old data belong to new invalid controls.
- Choice rows: native radio/checkbox with a padded label and 48px minimum height. Selection has a blue outline and pale blue fill. Feedback is specific and retry stays available.
- Tables: real semantic caption/headers, 14px minimum, right-aligned numeric columns; overflow is confined to a clearly labelled table region if needed. Summary disclosures use native details/summary.
- Reset: an activity reset affects that activity and its notebook entry. Start over uses an accessible confirmation dialog before clearing all in-memory notes. Reload starts fresh; nothing is sent or stored persistently.
- Verdict: three bounded plain-text inputs plus a self-review checklist; completeness feedback never evaluates truth. One possible answer is available as a comparison, not the only acceptable wording.

## 6. Motion

No animated data transitions, counters, autoplay or forced movement. State changes are immediate so learners can compare exact before/after values. Focus transfers use ordinary, non-smooth scrolling. Reduced-motion remains honoured; there is no motion whose removal changes the educational function.

## 7. Depth

Borders and flat tonal surfaces only; elevation token is none. No drop shadows, gradients, glass or decorative texture. Generated images are layout references only and are excluded from the delivered website. The real data visualizations carry the visual work, matching Sites' data-heavy utility exception for decorative imagery.

## Reference mapping and factual corrections

The four generated reference images are design-only artifacts and are excluded from this independently runnable source archive. The interface retains their compact header, serif/cobalt hierarchy, main work area and divided notebook, chart pair/control strip/scatter/form layout families. Implement against this contract, not the incidental generated pixels.

The generated graph image invented five weekdays instead of the specified before/after means. The generated scatter retained a within-group trend; its dots are not source data. The roster image's dot counts and group names also differ from the documented synthetic population. Correct all chart data from `datasets.mjs`. The verdict uses a fresh Harbor Gallery case rather than reusing the earlier library scenario, to fulfil the new-application requirement. These deliberate educational corrections preserve the visual layout while giving the public brief and verified data precedence.

Pre-flight: zero visible em/en-dash separators, zero upper-case tracked eyebrows, no placeholder people/brands, no decorative status dots, no pure-black default, no purple/beige/brass motif, no logo wall, no fake screenshots, no dark/light section inversion and no unverified performance or learning claims.
