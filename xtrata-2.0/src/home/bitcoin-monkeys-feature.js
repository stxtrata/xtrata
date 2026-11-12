// Bitcoin Monkeys announcement: a fixed campaign tile that takes the first big slot of the homepage
// Living Wall for one shared week. It outranks the "Today on Xtrata" card while it runs, then the wall
// goes back to the daily feature and normal rotation by itself. EVERYTHING you would edit is here.
//
// To move the week: change BITCOIN_MONKEYS_START and BITCOIN_MONKEYS_END (UTC instants, so every visitor
// in every timezone sees the same window). To end it early, set END to a time in the past.
// Preview outside the window: add ?monkeys=1 to the homepage address. ?today=N still previews a daily day.
//
// The tile is rendered as a daily-kind tile (so wall-rotation.js keeps it in big-a and never swaps it),
// drawn as a poster by buildPosterTile in today-card.js.

export const BITCOIN_MONKEYS_START = '2026-11-12T11:00:00Z';
export const BITCOIN_MONKEYS_END = '2026-11-19T11:00:00Z';

export const BITCOIN_MONKEYS_ANNOUNCEMENT = 'https://x.com/BTCMonkeys/status/2120035589747581199';

export const BITCOIN_MONKEYS_FEATURE = Object.freeze({
  id: 'bitcoin-monkeys-forever',
  kind: 'daily',
  variant: 'poster',
  tone: 'violet',
  image: '/home/wall/bitcoin-monkeys-forever.webp',
  alt: 'Bitcoin Monkeys, Going Forever, on-chain with Xtrata, Forever Twins. A rainbow-fur monkey in a purple cap, gold monocle, black tuxedo and red bow tie stands in front of a glowing infinity sign and a gallery of monkey portraits.',
  kicker: 'Coming on-chain',
  statement: 'Bitcoin Monkeys are bringing their entire OG collection on-chain with Forever Twins on Xtrata.',
  cta: Object.freeze({ label: 'Read the announcement ↗', href: BITCOIN_MONKEYS_ANNOUNCEMENT }),
  // The twins tile shows Bitcoin Monkeys too, so it sits out this week: the same news is never on the wall twice.
  avoid: Object.freeze(['forever-twins'])
});

const at = (iso) => Date.parse(iso);

/** True from START (inclusive) up to END (exclusive). */
export const monkeysActive = (now = Date.now(), { start = BITCOIN_MONKEYS_START, end = BITCOIN_MONKEYS_END } = {}) =>
  Number.isFinite(now) && now >= at(start) && now < at(end);

/** The campaign tile while the window is open, otherwise null. */
export const monkeysFeature = (now = Date.now(), options = {}) =>
  monkeysActive(now, options) ? (options.feature || BITCOIN_MONKEYS_FEATURE) : null;

/** Milliseconds until the window next opens or closes, or null once it has closed for good. */
export const msUntilMonkeysBoundary = (now = Date.now(), { start = BITCOIN_MONKEYS_START, end = BITCOIN_MONKEYS_END } = {}) => {
  const s = at(start);
  const e = at(end);
  if (now < s) return s - now;
  if (now < e) return e - now;
  return null;
};

/** Team preview: ?monkeys=1 shows the tile whatever the date. */
export const previewMonkeys = (search = '') => new URLSearchParams(search).get('monkeys') === '1';

/** Everything wrong with the campaign settings, as messages (empty when sound). */
export const validateMonkeysFeature = (feature = BITCOIN_MONKEYS_FEATURE, start = BITCOIN_MONKEYS_START, end = BITCOIN_MONKEYS_END) => {
  const errors = [];
  if (!Number.isFinite(at(start)) || !Number.isFinite(at(end))) errors.push('Campaign start and end must be valid dates.');
  else if (at(end) <= at(start)) errors.push('Campaign must end after it starts.');
  if (!feature.image || !feature.alt) errors.push('Campaign tile needs an image and alt text.');
  if (!/^https:\/\/x\.com\//.test(feature.cta?.href || '')) errors.push('Campaign link must be an https x.com address.');
  if (/[—]/.test(`${feature.statement} ${feature.kicker} ${feature.alt}`)) errors.push('No em dashes in campaign copy.');
  return errors;
};
