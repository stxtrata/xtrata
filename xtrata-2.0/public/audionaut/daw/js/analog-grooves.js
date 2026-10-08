// New drum grooves for the Analog Kit collection (not shown in the Studio or L1 sets).
// Authored in four batches; see analog-grooves-a.js … analog-grooves-d.js.
import { GROOVES_A } from "./analog-grooves-a.js";
import { GROOVES_B } from "./analog-grooves-b.js";
import { GROOVES_C } from "./analog-grooves-c.js";
import { GROOVES_D } from "./analog-grooves-d.js";

export const ANALOG_GROOVES = [...GROOVES_A, ...GROOVES_B, ...GROOVES_C, ...GROOVES_D];

// Genres that only exist in the Analog collection, in display order after the shared genres.
export const ANALOG_GENRES_NEW = [
  "Country & Americana",
  "Soul, Motown & Gospel",
  "R&B & Neo-Soul",
  "Ska & Rocksteady",
  "Surf, Garage & Rockabilly",
  "New Orleans & Second Line",
  "Orchestral & Cinematic",
  "Celtic",
  "Krautrock & Post-Rock",
  "Live Electronic",
];

// Extra "Start here" essentials for the Analog collection (listed after the shared 18).
export const ANALOG_START_IDS = [];
