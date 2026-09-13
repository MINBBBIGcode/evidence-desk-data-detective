// Original synthetic data. No row describes a real person, place or observation.
const freezeRows = rows => Object.freeze(rows.map(row => Object.freeze(row)));

export const libraryDays = freezeRows([
  ...[40, 42, 44, 45, 45, 47, 47, 49, 50, 51].map((visits, i) => ({
    day: `Before ${i + 1}`, period: 'Before', visits,
  })),
  ...[48, 50, 52, 53, 53, 55, 55, 57, 58, 59].map((visits, i) => ({
    day: `After ${i + 1}`, period: 'After', visits,
  })),
]);

export const clubs = Object.freeze(['Art', 'Music', 'Garden', 'Robotics']);
const supporters = [20, 32, 48, 60];
export const population = freezeRows(clubs.flatMap((club, group) =>
  Array.from({ length: 80 }, (_, i) => ({
    id: `${club.toLowerCase()}-${String(i + 1).padStart(2, '0')}`,
    club,
    supportsLateOpening: i < supporters[group],
  })),
));

export const kioskDays = freezeRows([
  ...[10, 20, 30, 40].flatMap(drinks => [8, 12].map(hires => ({
    weather: 'Cool', drinks, hires,
  }))),
  ...[30, 40, 50, 60].flatMap(drinks => [28, 32].map(hires => ({
    weather: 'Warm', drinks, hires,
  }))),
].map((row, i) => ({ day: i + 1, ...row })));

export const gallery = Object.freeze({
  name: 'Harbor Gallery',
  before: 48,
  after: 56,
  respondents: 20,
  supporters: 18,
  sampledFrom: 'Guests who attended the poster launch',
});

export const provenance = Object.freeze({
  status: 'All data and organisations are fictional.',
  library: 'Two invented sets of ten daily counts, with means of 46 and 54 visits per day.',
  population: 'A constructed roster of 320 records. Each club has 80 records; support counts are 20, 32, 48 and 60.',
  kiosk: 'Sixteen invented days. Within each weather group, every drinks value is paired with both hires values.',
  gallery: 'A new fictional headline with two invented daily averages and a convenience survey of launch guests.',
});
