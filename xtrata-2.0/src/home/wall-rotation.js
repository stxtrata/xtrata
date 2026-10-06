// Which tile goes where on the homepage Living Wall, and what changes while the visitor is there.
// Pure functions with an injectable random source, so they are easy to test. No DOM in here.
//
// The wall has seven slots that always add up to a 4 x 4 grid (16 cells):
//   big-a, big-b   2x2 each. The arcade is pinned to one of them; the other is drawn from the pool.
//   chess          1x2, fixed.
//   song-1, song-2 1x1 each, songs.
//   wide           2x1, drawn from the pool.
//   tall           1x2, drawn from the pool.

export const WALL_SLOT_ORDER = Object.freeze(['big-a', 'big-b', 'chess', 'song-1', 'song-2', 'wide', 'tall']);

const SIZE_OF_SLOT = Object.freeze({
  'big-a': 'big', 'big-b': 'big', chess: 'tall', 'song-1': 'one', 'song-2': 'one', wide: 'wide', tall: 'tall'
});

// Pool weights are keyed by the kind of slot a tile can take.
const POOL_KIND_OF_SLOT = Object.freeze({ 'big-a': 'big', 'big-b': 'big', wide: 'wide', tall: 'tall' });

/** Pick one item with probability proportional to its weight. Returns null for an empty list. */
export const weightedPick = (items, weightOf, rng = Math.random) => {
  const list = items.filter((item) => weightOf(item) > 0);
  if (!list.length) return null;
  const total = list.reduce((sum, item) => sum + weightOf(item), 0);
  let roll = rng() * total;
  for (const item of list) {
    roll -= weightOf(item);
    if (roll < 0) return item;
  }
  return list[list.length - 1];
};

const songTile = (song, slot) => ({
  id: `song-${song.id}`, kind: 'song', tokenId: song.id, title: song.title, subtitle: song.artist || '', size: 'one', slot
});

const poolTile = (entry, slot) => ({ ...entry.tile, size: SIZE_OF_SLOT[slot], slot });

const idsOnWall = (slots) => new Set(Object.values(slots).map((tile) => tile.id));

/**
 * Choose every tile for a fresh page load.
 * `songs` is [{ id, title, artist }]. `recent` is what the last visit showed (all optional):
 * { big: id, tall: id, wide: id, songs: [tokenIds] }, used so a returning visitor sees something new.
 * Returns { slots, order } where `slots` maps slot name to a tile (with size and slot set) and
 * `order` is the same tiles in DOM order.
 */
export const pickWall = ({ rotation, songs, rng = Math.random, recent = {} }) => {
  const used = new Set([rotation.pinned.id, rotation.chess.id]);
  const slots = {};
  const forced = {};

  const entriesFor = (kind) => rotation.pool.filter((entry) => entry.weights[kind] > 0);
  const available = (kind, recentId) => {
    const open = entriesFor(kind).filter((entry) => !used.has(entry.tile.id));
    const fresh = open.filter((entry) => entry.tile.id !== recentId);
    return fresh.length ? fresh : open;
  };

  // Campaign tiles are guaranteed one slot. Which slot is itself random, by weight.
  for (const id of rotation.campaign) {
    const entry = rotation.pool.find((candidate) => candidate.tile.id === id);
    if (!entry) continue;
    const options = rotation.campaignSlots.filter((option) => entry.weights[option.slot] > 0 && !forced[option.slot]);
    const chosen = weightedPick(options, (option) => option.weight, rng);
    if (chosen) {
      forced[chosen.slot] = entry;
      used.add(id);
    }
  }

  const draw = (kind, recentId) => forced[kind] || weightedPick(available(kind, recentId), (entry) => entry.weights[kind], rng);
  const other = draw('big', recent.big);
  if (other) used.add(other.tile.id);
  const tall = draw('tall', recent.tall);
  if (tall) used.add(tall.tile.id);
  const wide = draw('wide', recent.wide);
  if (wide) used.add(wide.tile.id);

  const arcadeFirst = rng() < 0.5;
  slots[arcadeFirst ? 'big-a' : 'big-b'] = { ...rotation.pinned, size: 'big', slot: arcadeFirst ? 'big-a' : 'big-b' };
  const otherSlot = arcadeFirst ? 'big-b' : 'big-a';
  if (other) slots[otherSlot] = poolTile(other, otherSlot);
  slots.chess = { ...rotation.chess, slot: 'chess' };
  if (tall) slots.tall = poolTile(tall, 'tall');
  if (wide) slots.wide = poolTile(wide, 'wide');

  // Two distinct songs, avoiding the ones shown last time when there are enough others.
  const seen = new Set(recent.songs || []);
  const fresh = songs.filter((song) => !seen.has(song.id));
  const pool = fresh.length >= 2 ? fresh : songs;
  const first = weightedPick(pool, () => 1, rng);
  const second = weightedPick(pool.filter((song) => song !== first), () => 1, rng) || first;
  if (first) slots['song-1'] = songTile(first, 'song-1');
  if (second) slots['song-2'] = songTile(second, 'song-2');

  const order = WALL_SLOT_ORDER.map((name) => slots[name]).filter(Boolean);
  return { slots, order };
};

/**
 * Choose one swap while the visitor is on the page: { slot, tile } or null if nothing sensible.
 * The arcade and chess never swap. A campaign tile is never swapped out if it is the last one left.
 * `blocked` lists slots that must not change right now (hovered, focused, playing).
 */
export const pickSwap = ({ rotation, slots, songs, rng = Math.random, lastSlot = null, blocked = [] }) => {
  const onWall = idsOnWall(slots);
  const campaignLeft = (without) =>
    rotation.campaign.filter((id) => onWall.has(id) && id !== without).length;

  const candidatesFor = (slot) => {
    const tile = slots[slot];
    if (!tile || tile.id === rotation.pinned.id || tile.id === rotation.chess.id) return [];
    if (blocked.includes(slot) || slot === lastSlot) return [];
    if (slot.startsWith('song-')) {
      const shownSongs = new Set(Object.values(slots).filter((t) => t.kind === 'song').map((t) => t.tokenId));
      return songs.filter((song) => !shownSongs.has(song.id)).map((song) => ({ tile: songTile(song, slot), weight: 1 }));
    }
    const kind = POOL_KIND_OF_SLOT[slot];
    const keepsCampaign = !rotation.campaign.includes(tile.id) || campaignLeft(tile.id) > 0;
    if (!keepsCampaign) return [];
    return rotation.pool
      .filter((entry) => entry.weights[kind] > 0 && !onWall.has(entry.tile.id))
      .map((entry) => ({ tile: poolTile(entry, slot), weight: entry.weights[kind] }));
  };

  // Songs change a little more often than the big picture.
  const swappable = WALL_SLOT_ORDER
    .map((slot) => ({ slot, options: candidatesFor(slot) }))
    .filter((entry) => entry.options.length)
    .map((entry) => ({ ...entry, weight: entry.slot.startsWith('song-') ? 2 : 1 }));
  const chosen = weightedPick(swappable, (entry) => entry.weight, rng);
  if (!chosen) return null;
  const next = weightedPick(chosen.options, (option) => option.weight, rng);
  return next ? { slot: chosen.slot, tile: next.tile } : null;
};
