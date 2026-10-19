// Poster files: read, validate (mirroring the poster contract and the hall), compile to contract calls.
//
//   {
//     "format": "arcade-poster-file/1",
//     "defaults": { "set": "community", "weight": 5, "foot": "XTRATA", "colour": "gold", "art": "bits" },
//     "posters": [
//       { "head": "TOURNAMENT FRIDAY", "sub": "Brick Breaker, 8pm", "art": "trophy", "colour": "orange",
//         "from": "+1d", "days": 3, "action": { "kind": "path", "path": "/arcade" } }
//     ]
//   }
//
// kind: template (default) | image | sheet | live.  image/sheet need "image": { id, hash (64 hex), size } and sheet "sheet": { cols, frames, fps }.
// from: a Bitcoin day number, or "+N" days from today (today = block height / 144). days: how long it runs; or "until": a day number.
import { Findings, isAscii, DAY_BLOCKS } from './util.mjs';
import { POSTER_KINDS, POSTER_SETS, ACTIONS, POSTER_COLOURS, posterArtKeys } from './catalogue.mjs';

export const POSTER_FORMAT = 'arcade-poster-file/1';
export const PLIMITS = { head: 48, sub: 140, foot: 32, colour: 12, art: 24, actText: 64, scope: 8, scopeItem: 24, batch: 10, maxSpanDays: 3650, image: 131072, sheet: 307200, weightCore: 100, weightCommunity: 20 };
const SAFE_PATH = /^\/[A-Za-z0-9._~\-][A-Za-z0-9._~\-\/?=&%#]*$/;     // the hall's own rule for a poster that opens a path

export const todayOf = (height) => Math.floor(height / DAY_BLOCKS);

function parseDay(v, today, label) {
  if (Number.isInteger(v) && v >= 0) return v;
  if (typeof v === 'string') {
    const m = /^\+(\d+)d?$/.exec(v.trim());
    if (m && today != null) return today + Number(m[1]);
    if (m) throw new Error(`${label}: "${v}" is relative; give today's Bitcoin day (--height N) or read it from a network`);
    if (/^\d+$/.test(v.trim())) return Number(v);
  }
  throw new Error(`${label}: expected a Bitcoin day number or "+N" days from today (got ${JSON.stringify(v)})`);
}

export function parsePosterFile(text) {
  try { return JSON.parse(text); } catch (e) { throw new Error('poster file is not valid JSON: ' + e.message); }
}

const hexBytes = (h) => Uint8Array.from(h.match(/../g).map((x) => parseInt(x, 16)));

// ctx: { today (Bitcoin day), role: 'admin'|'publisher', config?: { reviewLane, capPerDay, capLivePerPublisher, minGap },
//        usedToday?: n (this sender's posters added today), liveOwned?: n, liveTotal?: n, communityLive?: n }
export function compilePosters(doc, ctx) {
  const f = new Findings(), out = [];
  if (!doc || typeof doc !== 'object') { f.error('file', 'not a poster file'); return { findings: f, posters: out }; }
  if (doc.format !== POSTER_FORMAT) f.error('format', `expected "${POSTER_FORMAT}"`);
  if (!Array.isArray(doc.posters) || !doc.posters.length) { f.error('posters', 'needs a non-empty "posters" list'); return { findings: f, posters: out }; }
  const d = doc.defaults || {};
  const arts = new Set(posterArtKeys());
  const admin = ctx.role === 'admin';
  const cfg = ctx.config || {};

  doc.posters.forEach((raw, i) => {
    const w = `poster ${i + 1}`, n0 = f.errors.length;
    const p0 = { ...d, ...raw };
    const kindName = p0.kind == null ? 'template' : p0.kind;
    const setName = p0.set == null ? (admin ? 'core' : 'community') : p0.set;
    const p = {
      set: POSTER_SETS[setName], kind: POSTER_KINDS[kindName], head: p0.head, sub: p0.sub == null ? '' : p0.sub, foot: p0.foot == null ? 'XTRATA' : p0.foot,
      colour: p0.colour == null ? 'white' : p0.colour, art: p0.art == null ? '' : p0.art,
      imageId: 0, imageHash: new Uint8Array(0), imageSize: 0, cols: 0, frames: 0, fps: 0,
      actKind: 0, actId: 0, actText: '', weight: p0.weight == null ? 5 : p0.weight, startDay: 0, endDay: 0,
      scope: p0.scope || [], evergreen: p0.evergreen === true, payout: p0.payout || null,
    };
    if (p.set === undefined) f.error(w, `"set" must be one of ${Object.keys(POSTER_SETS).join(', ')}`);
    if (p.kind === undefined) f.error(w, `"kind" must be one of ${Object.keys(POSTER_KINDS).join(', ')}`);
    for (const [k, max] of [['head', PLIMITS.head], ['sub', PLIMITS.sub], ['foot', PLIMITS.foot], ['colour', PLIMITS.colour], ['art', PLIMITS.art]]) {
      if (typeof p[k] !== 'string' || !isAscii(p[k]) || p[k].length > max) f.error(w, `"${k}" must be printable ASCII text of at most ${max} characters`);
    }
    if (typeof p.head === 'string' && p.head.length < 1) f.error(w, '"head" cannot be empty (u103)');
    if (typeof p.colour === 'string' && !POSTER_COLOURS.includes(p.colour)) f.warn(w, `colour "${p.colour}" is not one the hall knows (${POSTER_COLOURS.join(', ')}); it is drawn white`);

    // art
    if (p.kind === POSTER_KINDS.live && !p.art) f.error(w, 'a live poster needs "art" (its binding key) (u103)');
    if ((p.kind === POSTER_KINDS.template || p.kind === POSTER_KINDS.live) && p.art && !arts.has(p.art)) f.warn(w, `art "${p.art}" is not one of the hall's pictures; it is drawn with the generic one`);
    if (p.kind === POSTER_KINDS.live && p.art !== 'blocks') f.warn(w, 'the only live binding the hall knows is "blocks" (the Bitcoin day board)');

    // image / sheet
    if (p.kind === POSTER_KINDS.image || p.kind === POSTER_KINDS.sheet) {
      const im = p0.image;
      if (!im || !Number.isInteger(im.id) || im.id < 1 || typeof im.hash !== 'string' || !/^[0-9a-fA-F]{64}$/.test(im.hash) || !Number.isInteger(im.size) || im.size < 1) f.error(w, '"image" needs { id (inscription id), hash (64 hex characters), size (bytes) } (u106)');
      else {
        const cap = p.kind === POSTER_KINDS.image ? PLIMITS.image : PLIMITS.sheet;
        if (im.size > cap) f.error(w, `image is ${im.size} bytes; the limit is ${cap} (u106)`);
        p.imageId = im.id; p.imageHash = hexBytes(im.hash); p.imageSize = im.size;
        f.warn(w, 'the inscription (sealed, same creator, matching hash and size) is checked by the contract only, not offline');
      }
      if (p.kind === POSTER_KINDS.sheet) {
        const sh = p0.sheet;
        if (!sh || !(sh.cols > 0) || !(sh.frames > 0 && sh.frames <= 64) || !(sh.fps > 0 && sh.fps <= 30)) f.error(w, '"sheet" needs { cols > 0, frames 1..64, fps 1..30 } (u103)');
        else { p.cols = sh.cols; p.frames = sh.frames; p.fps = sh.fps; }
      }
    }

    // action
    const a = p0.action;
    if (a) {
      const kind = ACTIONS[a.kind];
      if (kind === undefined) f.error(w, `action.kind must be one of ${Object.keys(ACTIONS).join(', ')}`);
      else {
        p.actKind = kind;
        if (kind === 1 || kind === 3) { if (!Number.isInteger(a.id) || a.id < 1) f.warn(w, 'play actions need an inscription id; the hall ignores the action without one'); else p.actId = a.id; }
        if (kind === 2) {
          const pt = a.path;
          if (typeof pt !== 'string' || !isAscii(pt) || pt.length > PLIMITS.actText) f.error(w, 'action.path must be ASCII, at most 64 characters');
          else { p.actText = pt; if (!SAFE_PATH.test(pt)) f.warn(w, `path ${JSON.stringify(pt)} is not a path the hall opens (must start with "/" and use plain URL characters); the poster would do nothing when clicked`); }
        }
      }
    }

    // weight
    const wmax = p.set === POSTER_SETS.core ? PLIMITS.weightCore : PLIMITS.weightCommunity;
    if (!Number.isInteger(p.weight) || p.weight < 1 || p.weight > wmax) f.error(w, `weight must be 1 to ${wmax} for ${p.set === POSTER_SETS.core ? 'core' : 'community'} posters (u105)`);

    // scope
    if (!Array.isArray(p.scope) || p.scope.length > PLIMITS.scope || p.scope.some((s) => typeof s !== 'string' || !isAscii(s) || !s.length || s.length > PLIMITS.scopeItem)) f.error(w, `"scope" is a list of up to ${PLIMITS.scope} room ids (ASCII, at most ${PLIMITS.scopeItem} characters)`);
    if (p.payout && !/^S[PT][0-9A-Z]{38,}(\.[A-Za-z][A-Za-z0-9-]*)?$/.test(p.payout)) f.error(w, 'payout must be a Stacks address');

    // role
    if (!admin && p.set !== POSTER_SETS.community) f.error(w, 'publishers can only add community posters (u100)');
    if (!admin && p.evergreen) f.error(w, 'only the admin can add evergreen posters (u100)');

    // window
    try {
      p.startDay = parseDay(p0.from, ctx.today, `${w} from`);
      if (p0.until != null) p.endDay = parseDay(p0.until, ctx.today, `${w} until`);
      else if (Number.isInteger(p0.days) && p0.days >= 1) p.endDay = p.startDay + p0.days;
      else f.error(w, 'give "days" (how long it runs) or "until" (a day number)');
      if (ctx.today != null && p.startDay <= ctx.today) f.error(w, `start day ${p.startDay} is not after today (day ${ctx.today}); posters always start in the future (u104)`);
      if (p.endDay <= p.startDay) f.error(w, 'it must end after it starts (u104)');
      if (p.endDay - p.startDay > PLIMITS.maxSpanDays) f.error(w, `a poster can run at most ${PLIMITS.maxSpanDays} days (u104)`);
    } catch (e) { f.error(w, e.message); }

    if (f.errors.length === n0) out.push(p);
  });

  // publisher budgets
  if (!admin && out.length) {
    if (cfg.capPerDay != null) {
      const left = cfg.capPerDay - (ctx.usedToday || 0);
      if (out.length > left) f.error('caps', `${out.length} posters but only ${Math.max(0, left)} left of today's ${cfg.capPerDay} per-day cap (u107); split the file across days`);
    }
    if (cfg.capLivePerPublisher != null && !cfg.reviewLane) {
      const left = cfg.capLivePerPublisher - (ctx.liveOwned || 0);
      if (out.length > left) f.error('caps', `${out.length} posters but only ${Math.max(0, left)} live slots left (cap ${cfg.capLivePerPublisher}) (u108)`);
    }
  }
  if (ctx.liveTotal != null && !cfg.reviewLane || (ctx.liveTotal != null && admin)) {
    if (ctx.liveTotal + out.length > 64) f.warn('live set', `the live set holds ${ctx.liveTotal} of 64; adding ${out.length} may be refused (u110) until expired or hidden posters are pruned`);
  }
  if (cfg.reviewLane && !admin) f.warn('review lane', 'the review lane is on: these posters start hidden until the admin releases them');
  if (cfg.minGap != null && Math.ceil(out.length / PLIMITS.batch) > 1) f.warn('gap', `${Math.ceil(out.length / PLIMITS.batch)} batches: the contract needs at least ${cfg.minGap} burn block(s) between a publisher's writes`);
  return { findings: f, posters: out };
}

export function posterBatches(posters, size = PLIMITS.batch) {
  const out = [];
  for (let i = 0; i < posters.length; i += size) out.push(posters.slice(i, i + size));
  return out;
}

// A stable key for "is this the same poster?" used for idempotency (content and window, not ids).
export function posterKey(p) {
  return [p.set, p.kind, p.head, p.sub, p.foot, p.colour, p.art, p.imageId, p.actKind, p.actId, p.actText, p.weight, p.startDay, p.endDay, p.evergreen ? 1 : 0].join('|');
}
export function chainPosterKey(r) {
  return [r.set, r.kind, r.head, r.sub, r.foot, r.colour, r.art, r.imageId, r.actKind, r.actId, r.actText, r.weight, r.startDay, r.endDay, r.evergreen ? 1 : 0].join('|');
}

// For the local preview: every poster as the hall's reader shapes it, shown as if all were live at once.
export function hallEntries(posters, startId = 1000) {
  return posters.map((p, i) => ({
    id: startId + i, set: p.set, kind: p.kind, head: p.head, sub: p.sub, foot: p.foot, c: POSTER_COLOURS.includes(p.colour) ? p.colour : 'white', art: p.art,
    imageId: p.imageId, imageHash: '', imageSize: p.imageSize, cols: p.cols, frames: p.frames, fps: p.fps,
    actKind: p.actKind, actId: p.actId, actText: p.actText, weight: p.weight, start: 0, end: 0, evergreen: true, scope: p.scope, hidden: false,
  }));
}

export function describePosters(posters, today = null) {
  return posters.map((p, i) => {
    const when = `day ${p.startDay} to ${p.endDay}${today != null ? ` (starts in ${p.startDay - today} day${p.startDay - today === 1 ? '' : 's'}, runs ${p.endDay - p.startDay})` : ''}`;
    return `  ${i + 1}. [${p.set === 0 ? 'core' : 'community'} ${['template', 'image', 'sheet', 'live'][p.kind]}] ${p.head} / ${p.sub} - ${when}, weight ${p.weight}${p.evergreen ? ', evergreen' : ''}`;
  }).join('\n');
}
