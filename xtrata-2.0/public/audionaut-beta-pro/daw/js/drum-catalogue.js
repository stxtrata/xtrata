// The ordered drum-beat catalogue: every genre has several percussion-only beats, and the
// "Start here" essentials (generic, widely useful styles) come first. Data only — it is
// voiced by percussion-kits.js, so this module imports no beat collections.
import { RECIPES } from "./percussion-recipes.js";
import { GROOVES } from "./drum-grooves.js";

// Generic, widely useful styles that open the list (in this order).
export const START_HERE_IDS = [
  "rock-basic",
  "pop-four-square",
  "classic-house",
  "warehouse-techno",
  "disco-four",
  "funk-break",
  "boom-bap",
  "lofi-head-nod",
  "trap-halftime",
  "dnb-two-step",
  "uk-garage-2step",
  "dembow",
  "reggae-one-drop",
  "afrobeat",
  "bossa-nova-clave",
  "samba-batucada",
  "jazz-swing-ride",
  "blues-shuffle",
];

export const GENRE_ORDER = [
  "Rock", "Pop", "Funk", "Hip-Hop", "Lo-Fi", "House", "Techno", "Disco", "Electro",
  "Trap & Drill", "UK Garage", "Drum & Bass", "Jungle", "Breakbeat", "Dubstep",
  "Footwork & Jersey", "Reggae & Dub", "Dancehall & Reggaeton", "Afrobeat & African",
  "Latin", "Brazilian", "Middle Eastern", "Indian", "East Asian & Pacific",
  "Folk & Marching", "Jazz", "Blues & Shuffle", "Punk", "Metal", "Indie & Post-Punk",
  "Industrial", "Minimal & Glitch",
];

// Which drum kit (see KITS in percussion-kits.js) voices each genre by default.
const GENRE_KIT = {
  Rock: "rock", Pop: "pop", Funk: "funk", "Hip-Hop": "hiphop", "Lo-Fi": "lofi",
  House: "house", Techno: "techno", Disco: "disco", Electro: "electro",
  "Trap & Drill": "trap", "UK Garage": "garage", "Drum & Bass": "dnb", Jungle: "jungle",
  Breakbeat: "breaks", Dubstep: "dubstep", "Footwork & Jersey": "footwork",
  "Reggae & Dub": "reggae", "Dancehall & Reggaeton": "dancehall",
  "Afrobeat & African": "world", Latin: "world", Brazilian: "world",
  "Middle Eastern": "world", Indian: "world", "East Asian & Pacific": "world",
  "Folk & Marching": "marching", Jazz: "jazz", "Blues & Shuffle": "blues",
  Punk: "punk", Metal: "metal", "Indie & Post-Punk": "indie", Industrial: "industrial",
  "Minimal & Glitch": "minimal",
};
// Electronic dance cousins that sit in a world genre but want a machine kit.
const KIT_OVERRIDE = {
  "amapiano-log-shaker": "afrodance",
  "gqom-dark-pulse": "afrodance",
  "kuduro-rush": "afrodance",
  "baile-funk-tamborzao": "afrodance",
  "dub-steppers": "dubkit",
  "grime-sparse": "garage",
  "uk-funky-toms": "garage",
};

export const kitFor = (recipe) => KIT_OVERRIDE[recipe.id] || GENRE_KIT[recipe.genre] || "pop";

const all = [...RECIPES, ...GROOVES];
const ids = new Set();
for (const r of all) {
  if (ids.has(r.id)) throw new Error(`Duplicate drum recipe id: ${r.id}`);
  ids.add(r.id);
  if (!GENRE_ORDER.includes(r.genre)) throw new Error(`Unlisted drum genre: ${r.genre}`);
}
for (const id of START_HERE_IDS)
  if (!ids.has(id)) throw new Error(`Unknown Start-here recipe: ${id}`);

const genreRank = (g) => GENRE_ORDER.indexOf(g);
const startRank = (r) => START_HERE_IDS.indexOf(r.id);

// Within a genre, beats with a bass hit (tonal by style) always follow the pure drum beats.
const byGenre = [...all].sort(
  (a, b) =>
    genreRank(a.genre) - genreRank(b.genre) ||
    (a.tonal ? 1 : 0) - (b.tonal ? 1 : 0) ||
    all.indexOf(a) - all.indexOf(b),
);

// Essentials first (in curated order), then every other beat grouped by genre.
export const DRUM_RECIPES = [
  ...START_HERE_IDS.map((id) => all.find((r) => r.id === id)),
  ...byGenre.filter((r) => startRank(r) < 0),
];
export const GENRE_RECIPES = (genre) => byGenre.filter((r) => r.genre === genre);
