// Draws the "Today on Xtrata" card. It is an article (not one big link) so the card can hold one
// primary action plus an optional quiet link and album chips. The DOM helpers come from homepage.js.
import { championCopy, fetchChampion } from './today-on-xtrata.js';

export const buildTodayCard = (item, helpers, { total = 14, eager = true } = {}) => {
  const { element, image, songButton, actionLink, playBadge } = helpers;
  const card = element('article', `home-tile home-tile--daily home-tile--big home-tone--${item.tone || 'plain'}`);
  card.dataset.daily = 'card';
  card.dataset.dailyDay = String(item.day);
  card.dataset.wallSlot = item.slot || '';
  card.dataset.wallId = item.id;

  const art = element('span', 'home-tile__art');
  art.setAttribute('aria-hidden', 'true');
  if (item.image) {
    const img = image(item.image, '', 'home-tile__img', { eager, position: item.position });
    if (item.pixelated) img.classList.add('is-pixelated');
    art.append(img);
  } else {
    art.classList.add('home-tile__art--motif');
  }

  const body = element('div', 'home-tile__daily-body');
  body.append(
    element('span', 'home-tile__eyebrow', `Today on Xtrata · Day ${item.day} of ${total}`),
    element('span', 'home-tile__feature', item.feature),
    element('strong', 'home-tile__title', item.title)
  );
  const copy = element('span', 'home-tile__sub', item.copy);
  copy.dataset.daily = 'copy';
  body.append(copy);
  if (item.credit) body.append(element('span', 'home-tile__credit', item.credit));

  const action = item.action || {};
  const actions = element('div', 'home-tile__daily-actions');
  let primary;
  if (action.type === 'song') {
    const song = { id: action.tokenId, title: action.title, artist: action.artist };
    primary = songButton(song, 'home-btn home-btn--solid home-tile__daily-cta', [playBadge(), element('span', '', action.label)]);
    primary.setAttribute('aria-label', `${action.label}: ${action.title}${action.artist ? ` by ${action.artist}` : ''}`);
  } else {
    primary = actionLink(action.href, `${action.label} →`, 'home-btn home-btn--solid home-tile__daily-cta', `today:${item.id}`, { newTab: action.newTab });
  }
  primary.dataset.daily = 'primary';
  actions.append(primary);
  if (item.also) {
    actions.append(actionLink(item.also.href, item.also.label, 'home-tile__daily-also', `today:${item.id}:also`, { newTab: item.also.newTab }));
  }

  if (Array.isArray(item.tracks) && item.tracks.length > 1) {
    const list = element('ol', 'home-tile__chips');
    list.setAttribute('aria-label', 'Tracks on this album');
    item.tracks.forEach((track) => {
      const li = element('li', 'home-tile__chip-item');
      li.append(songButton({ id: track.tokenId, title: track.title, artist: track.artist }, 'home-tile__chip', [element('span', '', track.title)]));
      list.append(li);
    });
    body.append(list);
  }
  body.append(actions);
  card.append(art, body);

  if (action.type === 'champion') {
    // Day 14: fill in the live champion; the schedule's own copy stays if the leaderboard cannot be read.
    void fetchChampion().then((champion) => {
      if (champion && copy.isConnected !== false) copy.textContent = championCopy(champion, action.fallbackCopy || item.copy);
    });
    if (action.fallbackCopy) copy.textContent = action.fallbackCopy;
  }
  return card;
};

// The Bitcoin Monkeys announcement (bitcoin-monkeys-feature.js): the whole square poster, never cropped, with the
// plain-text statement and the one link in a separate band underneath so both stay readable on any screen.
export const buildPosterTile = (item, helpers, { eager = true } = {}) => {
  const { element, image, actionLink } = helpers;
  const card = element('article', `home-tile home-tile--big home-tile--poster home-tone--${item.tone || 'violet'}`);
  card.dataset.daily = 'poster';
  card.dataset.wallSlot = item.slot || '';
  card.dataset.wallId = item.id;
  card.setAttribute('aria-label', item.statement);

  const art = element('div', 'home-tile__poster');
  art.append(image(item.image, item.alt, 'home-tile__poster-img', { eager }));

  const band = element('div', 'home-tile__poster-band');
  const words = element('div', 'home-tile__poster-words');
  words.append(element('span', 'home-tile__eyebrow', item.kicker), element('p', 'home-tile__poster-copy', item.statement));
  band.append(
    words,
    actionLink(item.cta.href, item.cta.label, 'home-btn home-btn--solid home-tile__poster-cta', `feature:${item.id}`, { newTab: true })
  );
  card.append(art, band);
  return card;
};
