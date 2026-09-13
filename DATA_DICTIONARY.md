# Original synthetic datasets

Every row, organisation and headline is fictional. The records are teaching examples, not findings about actual learners, clubs or places. No information is collected from children.

The bundled `dist/datasets.mjs` constructs the same frozen arrays on every load. Its small explicit arrays and construction rules are the source data for both tables and charts. No remote dataset or random population generation is used.

| Dataset | Field | Meaning and unit | Construction |
| --- | --- | --- | --- |
| `libraryDays` | `day` | Fictional weekday identifier | Before 1 to 10; After 1 to 10 |
| | `period` | Before or after a fictional late-opening change | Ten days in each group |
| | `visits` | Visits per day | Before: 40,42,44,45,45,47,47,49,50,51. After: each corresponding value plus 8. Means are 46 and 54. |
| `population` | `id` | Synthetic roster identifier | Club prefix and index 01 to 80; not a real account or person |
| | `club` | Art, Music, Garden or Robotics | Exactly 80 records each; the club labels are arbitrary teaching labels |
| | `supportsLateOpening` | Invented yes/no response | First 20 Art, 32 Music, 48 Garden and 60 Robotics records say yes. Total 160 of 320, or 50%. |
| `kioskDays` | `day` | Fictional day number | 1 to 16 |
| | `weather` | Cool or Warm group | Eight days per group; no actual temperature measurements |
| | `drinks` | Cold drinks sold per day | Cool: 10,20,30,40, each twice. Warm: 30,40,50,60, each twice. |
| | `hires` | Cycles hired per day | Each Cool drinks value pairs once with 8 and once with 12 hires; each Warm value pairs with 28 and 32. |
| `gallery` | `before`, `after` | Invented average daily visits | 48 and 56. Separate transfer example, not reused library data. |
| | `supporters`, `respondents` | Fictional poster-survey counts | 18 favourable responses among 20 guests at the poster launch |
| | `sampledFrom` | Sampling frame | Launch guests; no resident-wide sample was taken |

## Sampling definition

`whole` applies a Fisher-Yates shuffle to a copy of all 320 records and takes the first n without replacement. `robotics` filters the roster to its 80 Robotics records, shuffles that copy, then takes n without replacement. Size is a whole number from 8 to 80. The first method gives every roster record a chance of inclusion; the second excludes three entire groups. Neither simulates nonresponse or a flawed original roster.

The shuffle uses a documented 32-bit linear congruential pseudorandom generator: new state = (1664525 × old state + 1013904223) modulo 2^32, divided by 2^32. The visible draw number selects a fixed seed. This is reproducible educational sampling, not cryptographic randomness. Taking all 80 Robotics records always yields 75% support, still different from the constructed population's 50%.

## Statistical definitions and limits

- Daily means are sums divided by the ten recorded days. Relative change is (after minus before) divided by before; axis controls never enter this calculation.
- Charts plot those means rather than individual daily counts. Both the individual values and summaries are available in the interface.
- Support percentage is yes responses divided by selected records. A single whole-roster sample can differ from the population by chance; it is not guaranteed to be closer than every biased sample.
- Pearson r is a unitless measure of linear association. The kiosk construction gives zero linear correlation within each weather group and positive pooled correlation. Zero r does not establish no possible relationship, and grouping alone does not prove causation or rule out other explanations.
- The gallery transfer example combines an enlarged visual gap, a convenience survey and an unsupported causal headline. Its raw visit increase is 8 visits/day, or about 16.7%; 90% refers only to the 20 launch guests surveyed.

The model intentionally exposes its population so learners can check samples against a known reference. In real surveys the full target population's responses are generally unavailable. No measured learning benefit or universal age suitability is claimed.
