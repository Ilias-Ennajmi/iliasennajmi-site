/**
 * The six effects the Lab runs, each with its own page at /effects/<slug>/.
 * One page per effect pulls together everything the site already has on it:
 * the experiment, the essays that lean on it, the specimen where you meet it
 * at checkout. Studies are the classic, well-replicated ones, with figures
 * as reported in the original papers.
 */
import type { LabId } from './lab';

export type EffectSlug = 'anchoring' | 'decoy-effect' | 'framing' | 'loss-aversion' | 'defaults' | 'zero-price';

export interface Effect {
  slug: EffectSlug;
  lab: LabId;
  name: string;
  /** Also known as, for search and for readers who know it by another name. */
  aka?: string;
  /** One sentence. Used as the page's meta description lead and on cards. */
  short: string;
  /** What it is, in two or three short paragraphs. */
  what: string[];
  study: { text: string; cite: string };
  /** Where a reader runs into it this week. */
  seen: string[];
  profits: string;
  resist: string;
  /** Specimen anchors on /specimens/ where the effect is at work. */
  specimens: Array<{ id: string; name: string }>;
}

export const EFFECTS: Effect[] = [
  {
    slug: 'anchoring',
    lab: 'anchor',
    name: 'Anchoring',
    aka: 'the anchoring effect, anchoring bias',
    short: 'The first number you see becomes the ruler for every number after it, even when it has nothing to do with anything.',
    what: [
      'Anchoring is the pull a first number has on every estimate that follows it. You adjust away from it, but almost never far enough, so the starting point sets the range of what feels reasonable.',
      'It works even when you know the number is arbitrary. You experience the adjusted figure as your own judgment, so you rarely notice the pull.',
    ],
    study: {
      text: 'Amos Tversky and Daniel Kahneman spun a wheel of fortune rigged to stop at 10 or 65, then asked people what percentage of African countries were in the United Nations. People who saw 10 gave a median guess of 25%. People who saw 65 said 45%. A random number on a wheel moved their answer by twenty points.',
      cite: 'Tversky & Kahneman, “Judgment under Uncertainty: Heuristics and Biases,” Science (1974)',
    },
    seen: [
      'The “was €200, now €99” label, whether or not anyone ever paid €200',
      'The expensive dish near the top of a menu, there to make the second one look sensible',
      'The first offer in a salary negotiation, which sets the range for the rest of it',
      'A souk, where the seller’s first price is the whole game',
    ],
    profits: 'Whoever gets to say a number first. Sellers, negotiators, and every menu you’ve ever read.',
    resist: 'Decide what something is worth to you before you see their number. Then their number is just information.',
    specimens: [{ id: 'drip', name: 'Drip pricing' }],
  },
  {
    slug: 'decoy-effect',
    lab: 'decoy',
    name: 'The decoy effect',
    aka: 'asymmetric dominance',
    short: 'Add an option nobody wants, and the option next to it suddenly looks like a bargain.',
    what: [
      'The decoy effect happens when a third option, clearly worse than one of the others, changes which of the first two you pick. Almost nobody picks the decoy. Its job is to make the option beside it look better.',
      'You rarely judge a price on its own. You judge it against whatever sits next to it, and the seller picked what sits there.',
    ],
    study: {
      text: 'Dan Ariely showed 100 MIT students a real magazine subscription ad: web only for $59, print only for $125, print and web for $125. With the print-only decoy on the page, 84 picked the bundle. With the decoy removed, only 32 did. Nobody had chosen the decoy, and it still moved more than half the class.',
      cite: 'Ariely, Predictably Irrational (2008); the effect was first described by Huber, Payne & Puto, Journal of Consumer Research (1982)',
    },
    seen: [
      'The medium popcorn, priced a little under the large',
      'Three-tier pricing pages where the middle plan is marked “most popular”',
      'The phone with slightly less storage for nearly the same money',
    ],
    profits: 'Whoever designed the pricing page. A decoy costs nothing to offer, because nobody takes it.',
    resist: 'Cross out the option you’d never pick, then decide again between what’s left. If your answer changes, the decoy was doing the choosing.',
    specimens: [],
  },
  {
    slug: 'framing',
    lab: 'framing',
    name: 'Framing',
    aka: 'the framing effect',
    short: 'Same facts, different sentence, different decision. How a choice is worded changes what people choose.',
    what: [
      'The framing effect is what happens when two descriptions of the exact same situation lead people to opposite choices. Describe an outcome as a gain and people play it safe. Describe the same outcome as a loss and they take risks to avoid it.',
      'The facts stay the same in both versions. The wording changes, and whoever writes it gets more say over your choice than you’d guess.',
    ],
    study: {
      text: 'Tversky and Kahneman told people a disease was expected to kill 600 and asked them to pick a program. When the safe option was put as “200 people will be saved”, 72% chose it. When the identical option was put as “400 people will die”, 78% chose the risky alternative instead.',
      cite: 'Tversky & Kahneman, “The Framing of Decisions and the Psychology of Choice,” Science (1981)',
    },
    seen: [
      '“95% fat free” on a yoghurt that is also 5% fat',
      'A surgery with a “90% survival rate” instead of a “10% mortality rate”',
      'Buttons that make saying no sound shameful: “No thanks, I don’t like saving money”',
    ],
    profits: 'Whoever writes the sentence. “95% fat free” sells. “5% fat” doesn’t, and it’s the same yoghurt.',
    resist: 'Say it the other way round. If “90% survive” and “10% die” get different answers from you, the wording made the choice.',
    specimens: [{ id: 'shame', name: 'Confirmshaming' }],
  },
  {
    slug: 'loss-aversion',
    lab: 'loss',
    name: 'Loss aversion',
    short: 'Losing something hurts about twice as much as gaining the same thing feels good.',
    what: [
      'Loss aversion is the lopsided way we weigh gains and losses. Losing €100 feels worse than winning €100 feels good, by a wide margin, so we work much harder to avoid a loss than to get an equal gain.',
      'It also explains why things feel more valuable once they’re ours, and why “don’t miss out” is a more effective message than “here’s something nice”.',
    ],
    study: {
      text: 'In the classic coin-flip question, most people turn down a 50/50 bet to lose $100 unless the possible win is around $200. Kahneman and Tversky built prospect theory around this asymmetry. In a related experiment, students given a coffee mug wanted about $7 to sell it, while students without one would only pay about $3.',
      cite: 'Kahneman & Tversky, “Prospect Theory,” Econometrica (1979); Kahneman, Knetsch & Thaler, Journal of Political Economy (1990)',
    },
    seen: [
      'Countdown timers and “only 2 left” banners',
      'Free trials that take features away when they end, instead of offering them',
      'Extended warranties and insurance add-ons at checkout',
    ],
    profits: 'Insurance add-ons, extended warranties, “don’t miss out” emails. Anything sold by making you picture the loss.',
    resist: 'Ask what you’d choose if you didn’t already have it, or if nobody had told you it was about to disappear.',
    specimens: [{ id: 'countdown', name: 'The countdown that starts over' }, { id: 'roach', name: 'The roach motel' }],
  },
  {
    slug: 'defaults',
    lab: 'defaults',
    name: 'Defaults',
    aka: 'the default effect',
    short: 'Whatever is already selected tends to stay selected. Whoever sets the switch makes most of the choices.',
    what: [
      'The default effect is our strong tendency to stick with whatever option is preselected. Changing it takes a moment of effort and a reason, and most of the time we have neither, so the default wins.',
      'A default doesn’t feel like a decision. Nobody asked you anything: the box arrived ticked, and leaving it alone took no effort.',
    ],
    study: {
      text: 'Eric Johnson and Daniel Goldstein compared organ donation across Europe. In countries where you had to opt in, consent rates were as low as 12% (Germany). In neighbouring countries where you had to opt out, they were close to 100% (Austria, 99.98%). Same kind of people, one different box.',
      cite: 'Johnson & Goldstein, “Do Defaults Save Lives?” Science (2003)',
    },
    seen: [
      'The pre-ticked newsletter, insurance or “partners” box',
      'Auto-renewing subscriptions and the shipping option already selected',
      'The search engine your phone came with, a default worth billions a year',
    ],
    profits: 'Whoever sets the switches. Usually that’s the company, and the setting is chosen for them, not for you.',
    resist: 'Once in a while, open a settings page you’ve never touched and ask, for each switch, whether you’d have chosen it.',
    specimens: [{ id: 'preticked', name: 'The pre-ticked extra' }],
  },
  {
    slug: 'zero-price',
    lab: 'free',
    name: 'The zero-price effect',
    aka: 'the power of free',
    short: 'A price of zero changes how you decide. You stop weighing what the thing costs you.',
    what: [
      'The zero-price effect is the outsized pull of anything that costs nothing. Dropping a price from one cent to zero changes behaviour far more than dropping it from two cents to one, because “free” feels like there’s no downside at all.',
      'There usually is one, paid in something other than money, so you don’t count it: your time, your data, your attention, or a subscription that starts later.',
    ],
    study: {
      text: 'Kristina Shampanier, Nina Mazar and Dan Ariely offered people a Lindt truffle for 15 cents or a Hershey’s Kiss for 1 cent, and 73% chose the truffle. Then they cut both prices by exactly one cent. With the Kiss now free, 69% took the Kiss instead.',
      cite: 'Shampanier, Mazar & Ariely, “Zero as a Special Price,” Marketing Science (2007)',
    },
    seen: [
      'Free shipping over €50, and the extra item bought to reach it',
      'Free apps, paid for with attention and data',
      'Free trials that turn into a subscription you forget to cancel',
    ],
    profits: 'Every “free” app you use. The bill arrives somewhere other than the price tag.',
    resist: 'Ask what it costs you in time, data, attention, or a renewal date nobody mentioned.',
    specimens: [],
  },
];

export const effectBySlug = (slug: string) => EFFECTS.find((e) => e.slug === slug);
export const effectByLab = (lab: string) => EFFECTS.find((e) => e.lab === lab);
