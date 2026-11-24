// The Fair Play Experiment banner ("Free music. Every play pre-paid."): one tile, two layouts (wide on desktop, stacked on
// phones). It appears for everyone at the same instant, 18:00 on Thu 19 Nov 2026 (UK is on GMT, so 18:00 UTC), and
// then stays. Add ?fairplay=1 to the address to preview it before then.
export const FAIR_PLAY_START = '2026-11-19T18:00:00Z';
export const FAIR_PLAY_HREF = '/players';
export const FAIR_PLAY_COPY = Object.freeze({
  badge: 'Free \u00b7 Only 1,000 exist',
  headline: ['Free music.', 'Every play pre-paid.'],
  line: 'Claim a music player that arrives loaded with plays we have already paid for. Every time you press play, the artist gets paid.',
  strong: 'You pay nothing.',
  cta: 'Claim my free player',
  note: ['No app. No account.', 'Opens with your face or fingerprint.'],
  card: { name: 'Xtrata Music Player', tag: 'Free', plays: '500', playsLabel: 'Plays loaded', left: 'Paid for by Xtrata', right: 'Plays go to the artist' },
  chips: ['+1 play paid to the artist', 'You paid: nothing'],
  label: 'Free music with every play pre-paid. Claim one of 1,000 free music players loaded with plays Xtrata has already paid for. Every play pays the artist and you pay nothing.'
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

// buildFairPlayTile(element, actionLink) -> <a> banner. `element` and `actionLink` are the homepage helpers.
export const buildFairPlayTile = (element, actionLink) => {
  const node = actionLink(FAIR_PLAY_HREF, '', 'home-fair__link', 'fairplay:banner', { newTab: false });
  node.classList.add('home-fair__inner');
  node.setAttribute('aria-label', FAIR_PLAY_COPY.label);
  const copy = element('span', 'home-fair__copy');
  const head = element('strong', 'home-fair__head');
  // The last word stays in one piece, so "pre-paid." never splits at its hyphen.
  const second = FAIR_PLAY_COPY.headline[1].split(' ');
  const em = element('em');
  em.append(`${second.slice(0, -1).join(' ')} `, element('span', 'home-fair__nowrap', second[second.length - 1]));
  head.append(FAIR_PLAY_COPY.headline[0], element('br'), em);
  const line = element('span', 'home-fair__line', `${FAIR_PLAY_COPY.line} `);
  line.append(element('b', '', FAIR_PLAY_COPY.strong));
  const note = element('span', 'home-fair__note');
  note.append(FAIR_PLAY_COPY.note[0], element('br'), FAIR_PLAY_COPY.note[1]);
  const foot = element('span', 'home-fair__foot');
  foot.append(element('span', 'home-fair__cta', `${FAIR_PLAY_COPY.cta} \u2192`), note);
  copy.append(element('span', 'home-fair__badge', FAIR_PLAY_COPY.badge), head, line, foot);
  const c = FAIR_PLAY_COPY.card;
  const visual = element('span', 'home-fair__visual');
  visual.setAttribute('aria-hidden', 'true');
  const top = element('span', 'home-fair__cardrow');
  top.append(element('span', '', c.name), element('span', '', c.tag));
  const mid = element('span', 'home-fair__cardmid');
  mid.append(element('span', 'home-fair__plays', c.plays), element('span', 'home-fair__playslabel', c.playsLabel));
  const bottom = element('span', 'home-fair__cardrow home-fair__cardrow--small');
  bottom.append(element('span', '', c.left), element('span', '', c.right));
  const card = element('span', 'home-fair__card');
  card.append(top, mid, bottom);
  visual.append(card, element('span', 'home-fair__chip home-fair__chip--gold', FAIR_PLAY_COPY.chips[0]), element('span', 'home-fair__chip home-fair__chip--cyan', FAIR_PLAY_COPY.chips[1]));
  node.append(copy, visual);
  return node;
};
