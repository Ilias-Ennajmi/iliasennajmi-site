/**
 * Case data for the portfolio at /portfolio/.
 *
 * Every case below is a SAMPLE written to show the format; none is real
 * client work, and each page carries a "Sample case" stamp saying so.
 * Replace them with real cases before sending the link to anyone. Results
 * stay as empty slots until there are real figures with a source.
 */
const IMG = '/portfolio/img';

export interface Figure {
  src: string;
  alt: string;
  /** Short label after "Fig. 0n", e.g. "Outdoor". */
  kind: string;
  note?: string;
}

export interface PortfolioCase {
  slug: string;
  n: string;
  sector: string;
  year: string;
  /** May contain <br> and <em>; the <em> part is set in the serif accent. */
  title: string;
  summary: string;
  ledger: [label: string, value: string][];
  hero: Figure;
  beats: [label: string, text: string][];
  fig2: Figure;
  fig3?: Figure;
  /** The "What I was thinking" aside. */
  note: string;
  process?: Figure;
}

export const CASES: PortfolioCase[] = [
  {
    slug: 'calm',
    n: '01',
    sector: 'Fintech',
    year: '2025',
    title: 'Calm, sold to<br><em>the anxious.</em>',
    summary: 'A budgeting app launches by promising a quiet month instead of a fast transfer.',
    ledger: [['Client', 'Budgeting app'], ['Role', 'Strategy lead'], ['Channels', 'Film, outdoor, CRM'], ['Time', 'Six weeks']],
    hero: { src: `${IMG}/ooh.webp`, alt: 'A bus shelter poster at dusk reading: Calm. The month you planned.', kind: 'Outdoor', note: 'Bus shelters, Casablanca' },
    beats: [
      ['Brief', 'Launch in a category where every competitor promises faster transfers.'],
      ['Insight', "People don't fear slowness. They fear the end of the month."],
      ['Idea', 'Sell calm instead of speed. One line carries it: "The month you planned."'],
    ],
    fig2: { src: `${IMG}/phone.webp`, alt: 'A phone showing an app card: Rent is covered. 12 days to go.', kind: 'Product', note: 'The line, inside the app' },
    fig3: { src: `${IMG}/film.webp`, alt: 'Film still: a woman sitting calmly at a kitchen table', kind: 'Film', note: '30 seconds, no voice-over' },
    note: 'The client wanted a feature list. Twelve interviews later, nobody had mentioned a single feature.',
    process: { src: `${IMG}/workshop.webp`, alt: 'A workshop wall covered in sticky notes', kind: 'Process, week three' },
  },
  {
    slug: 'cup',
    n: '02',
    sector: 'Coffee',
    year: '2024',
    title: 'The second<br><em>cup.</em>',
    summary: 'A brand everyone drinks and nobody chooses gets a time of day to own.',
    ledger: [['Client', 'Coffee chain'], ['Role', 'Brand strategy'], ['Channels', 'Pack, social, in-store'], ['Time', 'Ten weeks']],
    hero: { src: `${IMG}/cup.webp`, alt: 'A café poster reading: 2nd Cup. Make the second one count.', kind: 'In-store', note: 'Café posters, afternoon run' },
    beats: [
      ['Brief', 'A brand everyone drinks and nobody chooses.'],
      ['Insight', "It's the first coffee of the day, never the favourite one."],
      ['Idea', 'Own the afternoon. "Make the second one count."'],
    ],
    fig2: { src: `${IMG}/workshop.webp`, alt: 'A workshop wall covered in sticky notes and layouts', kind: 'Process', note: 'Name testing, week three' },
    note: 'We tested 31 names. The one that won was the one the CEO hated in week one.',
  },
  {
    slug: 'stay',
    n: '03',
    sector: 'Telecom',
    year: '2023',
    title: 'Say it before<br><em>they leave.</em>',
    summary: 'An operator cuts churn by speaking first about the bill.',
    ledger: [['Client', 'Telecom operator'], ['Role', 'Lead strategist'], ['Channels', 'SMS, app, call centre'], ['Time', 'Eight weeks']],
    hero: { src: `${IMG}/stay.webp`, alt: 'A blue mural on a Casablanca building reading: Stay. Say it before they leave.', kind: 'Outdoor', note: 'Painted mural, city centre' },
    beats: [
      ['Brief', 'Churn was rising and the exit surveys said "no reason".'],
      ['Insight', 'People decide to leave months before they go, in silence.'],
      ['Idea', 'Speak first. Flag the bill, own the problem, offer the fix.'],
    ],
    fig2: { src: `${IMG}/tram.webp`, alt: 'A hand holding a phone inside a tram at night', kind: 'Message', note: 'Where the SMS actually lands' },
    note: 'Forty churn calls. Not one person said "price" first. They all said "nobody told me".',
  },
];
