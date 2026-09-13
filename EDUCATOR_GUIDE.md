# Evidence Desk: educator guide

## Purpose and prerequisites

Evidence Desk is a short data-literacy investigation intended for learners around age 15, with adjustments for experience and confidence. It practises reading axes, checking sampling coverage, distinguishing association from causal evidence, and writing a qualified conclusion. It is not an assessment of development or intelligence. No learning-gain study has been conducted.

Learners should recognise axes, count observations, subtract two values, and have an introductory understanding of means and percentages. Pearson's correlation coefficient is optional: the visual group comparison works without teaching its formula. Allow about 10 to 15 minutes for a focused walkthrough, with longer discussion if useful. There is no timer, ranking, punishment or required spoken response.

All organisations, headlines, observations and roster records are fictional. The examples avoid claims about actual students or real club preferences. Do not use the app to enter real learner names or private information, and do not collect children's responses as part of this project.

## Walkthrough

### Graph framing

Begin with two views of the same library means. The app computes 46 visits/day before and 54 after from two sets of ten invented daily records. The increase is 8 visits/day, about 17.4%. Let the learner change the adjustable minimum/maximum or use the demonstration button, then inspect the data table.

Ask what changed: the drawn gap or the recorded values? Discuss that a zoomed axis can reveal detail; a nonzero axis is not inherently dishonest. The reader needs labels, context and the actual numbers. The app uses connected points, not bars whose full lengths falsely imply ratios.

The short check asks for the invariant numerical conclusion. Wrong choices receive a specific explanation and another try. An observation is recorded only after a valid axis interaction and the structured check.

### Sampling

The fictional roster has four clubs of 80 records each. Support counts for later library opening are Art 20, Music 32, Garden 48 and Robotics 60: 160/320, or 50%, in total. The overview's twenty dots per club each represent four records. Filled dots are supporters; this is an exact grouped diagram, not an illustration of a selected sample.

The whole-population method shuffles the complete roster, then selects n without replacement. The Robotics-only method first excludes the other clubs, then shuffles and selects from the remaining 80. Both methods use a fixed pseudorandom sequence; the draw number and seed are displayed. Reset restarts the sequence. See the source archive's DATA_DICTIONARY.md for the complete construction and algorithm.

Ask the learner to draw using both methods. The demonstration selects all 80 Robotics records, producing 75% support even though the full population is 50%. Increasing the size cannot restore excluded groups. A whole-roster sample can still differ from 50% by chance and is not guaranteed to be closer in every individual draw. The toy model deliberately omits nonresponse and errors in the original roster; these would be additional real-world limitations.

Both composition and support summaries come from the selected records. The tables expose group counts, supporter counts and every selected synthetic record. Changing settings clears the prior sample until the next valid draw.

### Correlation

The kiosk example contains sixteen invented days. Pooled drink sales and cycle hires have positive linear association (r about 0.654). Cool and Warm groups have different means; each group has r = 0 in this constructed data. Toggle group comparison and inspect the hollow-circle/filled-diamond encoding or the accessible table.

Ask whether higher drink sales have been shown to cause higher cycle hires. Weather offers a plausible shared explanation, but stratifying this small example does not prove weather is the only cause. Zero Pearson r rules out neither nonlinear patterns nor all possible relationships. The app states that association alone does not establish causation and accepts the structured, appropriately qualified conclusion.

### A fresh headline and a verdict

Harbor Gallery is a new fictional transfer example. Visits rose from 48 to 56, an 8-visit or 16.7% increase, while the zoomed chart starts at 46. A separate survey found 18 favourable responses among 20 poster-launch guests. The headline exaggerates the growth, treats launch guests as a town-wide sample, and implies an untested cause.

Ask for a claim, a supporting observation and a limitation. The learner reviews three checkboxes and can compare with one possible answer. Reasonable interpretations and wording can differ. The app checks only that fields and self-review checks are complete; it does not read, grade or certify the accuracy of prose. Completion requires an observation from each earlier case and a complete response structure.

## Adaptation and co-play

- For lower reading confidence, read one scenario aloud, focus on the visible chart and use its table. Work through one case at a time; the learner can return to any case.
- For less numerical experience, begin with the 8-visit difference and counts before introducing percentages. Leave the optional Pearson-r disclosure closed.
- For greater challenge, compare several sample sizes and draws, identify the target population explicitly, and discuss nonresponse or plausible alternate causes.
- Keyboard users can reach all controls with Tab and use native radio/checkbox keys. No dragging is required. Large pointer targets support touch. A notebook records observations across the current page session.
- A case reset clears that case's entry. Start over asks for confirmation and clears all in-memory work. Refresh starts fresh. There is no persistence, account, upload, analytics, AI chat, remote grading or learner data transmission.
- No audio or motion is required. Reduced-motion preferences do not remove any learning activity. Automated browser walkthroughs and synthetic test journeys were used for verification; no testing with children was performed.

## Content sources

These are educator references, not outbound tasks for the learner. The prose, data and graphics in this app are original; source diagrams and exercises were not copied.

1. OpenStax, **8.2 Visualizing Data**, Contemporary Mathematics. Supports discussion of visual scales and how presentation affects apparent differences. https://openstax.org/books/contemporary-mathematics/pages/8-2-visualizing-data
2. OpenStax, **1.2 Data, Sampling, and Variation in Data and Sampling**, Introductory Business Statistics 2e. Supports the contrast between a whole-roster random sample, a restricted convenience frame and chance variation. https://openstax.org/books/introductory-business-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling
3. Penn State, **3 Describing Data, Part 2**, STAT 200 Elementary Statistics, correlation cautions. Supports limits of Pearson's r, alternative causal explanations and confounding. https://online.stat.psu.edu/stat200/Lesson03

## Offline follow-up

Write two invented means on paper and redraw them on two labelled axes. Then make a small set of labelled cards representing different groups, sample from the whole stack and from one group only, and discuss which people each method could represent. Finish by rewriting a fictional headline with one observation and one limitation. No real personal data or purchases are needed.

## Model limits

The known population is exposed for learning, whereas real surveys usually cannot observe every target member's response. The club differences and weather groups were constructed deliberately. The before/after cases have no random assignment, and the correlation example cannot establish a causal mechanism. A checked structured response demonstrates use of this lesson's reasoning step, not general mastery. A complete free-text response demonstrates form completion and the learner's self-review, not automatically verified truth.
