// The Fair Play Experiment banner: "Pick a disc. Press play." One tile, two layouts (wide on desktop, stacked on
// phones). It appears for everyone at the same instant, 18:00 on Thu 19 Nov 2026 (UK is on GMT, so 18:00 UTC), and
// then stays. Add ?fairplay=1 to the address to preview it before then.
export const FAIR_PLAY_START = '2026-11-19T18:00:00Z';
export const FAIR_PLAY_HREF = '/players';
export const FAIR_PLAY_COPY = Object.freeze({
  kicker: 'New · The Fair Play Experiment',
  headline: ['Pick a disc.', 'Press play.'],
  line: '1,000 free music players. One each. Every play pays the artist.',
  cta: 'Pick a disc',
  note: '5 Diamonds hidden',
  label: 'The Fair Play Experiment: 1,000 free music players. Pick a disc and press play. Five Diamonds are hidden.'
});

const MAX_TIMEOUT_MS = 2147483000;

export const fairPlayLive = (now, start = FAIR_PLAY_START) => {
  const t = Date.parse(start);
  return Number.isFinite(now) && Number.isFinite(t) && now >= t;
};

// Milliseconds until the banner appears, or null once it is showing.
export const msUntilFairPlay = (now, start = FAIR_PLAY_START) => {
  const t = Date.parse(start);
  if (!Number.isFinite(now) || !Number.isFinite(t) || now >= t) return null;
  return Math.min(t - now + 250, MAX_TIMEOUT_MS);
};

export const previewFairPlay = (search) => new URLSearchParams(search || '').get('fairplay') === '1';

export const validateFairPlay = () => {
  const errors = [];
  if (!Number.isFinite(Date.parse(FAIR_PLAY_START))) errors.push('Fair Play start time is not a date.');
  if (!FAIR_PLAY_HREF.startsWith('/')) errors.push('Fair Play link must be a path on this site.');
  return errors;
};

// Decorative disc field: dim rings, claimed discs (cyan), Gold and the odd Diamond. A fixed pattern, so it never shifts.
export const discPattern = (count = 200, seed = 7) => {
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  return Array.from({ length: count }, () => {
    const r = rng();
    if (r < 0.025) return 'diamond';
    if (r < 0.075) return 'gold';
    if (r < 0.22) return 'claimed';
    return 'open';
  });
};

// buildFairPlayTile(element, actionLink) -> <a> banner. `element` and `actionLink` are the homepage helpers.
export const buildFairPlayTile = (element, actionLink) => {
  const node = actionLink(FAIR_PLAY_HREF, '', 'home-fair__link', 'fairplay:banner', { newTab: false });
  node.classList.add('home-fair__inner');
  node.setAttribute('aria-label', FAIR_PLAY_COPY.label);
  const copy = element('span', 'home-fair__copy');
  const kicker = element('span', 'home-fair__kicker');
  kicker.append(element('i', 'home-fair__dot'), FAIR_PLAY_COPY.kicker);
  const head = element('strong', 'home-fair__head');
  head.append(FAIR_PLAY_COPY.headline[0], element('br'), element('em', '', FAIR_PLAY_COPY.headline[1]));
  const foot = element('span', 'home-fair__foot');
  foot.append(element('span', 'home-fair__cta', `${FAIR_PLAY_COPY.cta} →`), element('span', 'home-fair__note', FAIR_PLAY_COPY.note));
  copy.append(kicker, head, element('span', 'home-fair__line', FAIR_PLAY_COPY.line), foot);
  const field = element('span', 'home-fair__field');
  field.setAttribute('aria-hidden', 'true');
  field.append(...discPattern().map((kind) => element('i', `home-fair__disc home-fair__disc--${kind}`)));
  node.append(copy, field);
  return node;
};
