// What the hall can draw, read from the hall's own source so the tools cannot drift from it.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
export const APP = join(here, '..', '..', '..', '..', 'recursive-apps', 'xtrata-arcade');

let bays = null;
export function hallBays() {
  if (bays) return bays;
  const sb = { module: { exports: {} }, console, Math, JSON, Object, Array, Number, String, Date, setTimeout, clearTimeout };
  vm.runInNewContext(readFileSync(join(APP, 'src', 'parts', 'bays.js'), 'utf8'), sb);
  bays = sb.module.exports;
  return bays;
}

// The hall's built-in looks by key: { 'curtain-house': { kind: 1 }, ... } plus every door style as 'door-<style>' (kind 0).
export function builtinLooks() {
  const B = hallBays(), out = {};
  Object.keys(B.BUILTIN).forEach((k) => { out[k] = { kind: B.BUILTIN[k].kind }; });
  B.DOOR_STYLES.forEach((s) => { out['door-' + s] = { kind: 0 }; });
  return out;
}

// Poster art keys the hall can draw, and the colour keys it knows (anything else is drawn white / a generic picture).
export function posterArtKeys() {
  const src = readFileSync(join(APP, 'src', 'parts', 'hall.js'), 'utf8');
  const from = src.indexOf('function posterArtMore');
  const main = src.indexOf('function posterArt(');
  const end = src.indexOf('\nfunction ', main + 10);
  const keys = new Set();
  const re = /case '([a-z0-9_]+)'/g; let m;
  const body = from >= 0 && main > from ? src.slice(from, end > 0 ? end : undefined) : src;
  while ((m = re.exec(body))) keys.add(m[1]);
  return [...keys].sort();
}
export const POSTER_COLOURS = ['blue', 'orange', 'audio', 'stacks', 'white', 'fun', 'gold'];

// Kind names used in the tools' files.
export const BASES = { posters: 0, wall: 1, door: 2 };
export const INTERACTIONS = { none: 0, knock: 1, peek: 2, enter: 3 };
export const POSTER_KINDS = { template: 0, image: 1, sheet: 2, live: 3 };
export const POSTER_SETS = { core: 0, community: 1 };
export const ACTIONS = { none: 0, play: 1, path: 2, playlist: 3 };

// The built-in looks to register on a fresh world contract, in a fixed order, so look ids are predictable:
// every non-door look, then the door styles. [{ key, kind, name }]
const NICE = {
  'curtain-house': 'House curtain', 'sign-board': 'Sign board', 'caution-tape': 'Caution tape', 'work-site': 'Work site sounds',
  'door-skin': 'Door skin', 'hum': 'Room hum', 'light-steady': 'Steady light', 'light-pulse': 'Pulsing light', 'light-flicker': 'Flickering light',
};
export function lookRegistry() {
  const B = hallBays(), out = [];
  Object.keys(B.BUILTIN).forEach((k) => out.push({ key: k, kind: B.BUILTIN[k].kind, name: NICE[k] || k }));
  B.DOOR_STYLES.forEach((s) => out.push({ key: 'door-' + s, kind: 0, name: 'Door: ' + s }));
  return out;
}
// The look book a fresh contract has after registering lookRegistry() in order as admin (what the offline tools assume).
export function defaultLookBook() {
  return lookRegistry().map((l, i) => ({ id: i, kind: l.kind, name: l.name, tier: 0, builtin: l.key, hidden: false, approved: true }));
}
