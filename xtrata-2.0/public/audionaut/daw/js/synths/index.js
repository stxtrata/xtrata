// synths/index.js — registry of the folder-organised synth modules.
//
// Layout: synths/<folder>/<synth>.js, where <folder> is a category id from
// ../synth-categories.js (bass, lead, pad, keys, organ, fm, pluck, mallet, reed, voice, chip,
// wave, drums, fx, glass). See synths/README.md for the folder list and which are still empty.
// The folder a module sits in IS its category (stamped below), so moving a file between
// folders re-files it in the picker. Each module is self-contained (no imports) and exports `<ID>_SYNTHS`; list it here and
// synths.js spreads EXTRA_SYNTHS into SYNTH_BANK, so it shows up in every channel's picker.

import { JIBASS_SYNTHS } from "./bass/jibass.js";
import { KILN_SYNTHS } from "./glass/kiln.js";
import { ANNEAL_SYNTHS } from "./glass/anneal.js";
import { PALINODE_SYNTHS } from "./glass/palinode.js";
import { FAULTGLASS_SYNTHS } from "./glass/faultglass.js";
import { MORROWGLASS_SYNTHS } from "./glass/morrowglass.js";
import { VITREOUS_SYNTHS } from "./glass/vitreous.js";
import { LANTERN_SYNTHS } from "./glass/lantern.js";
import { PRISM_SYNTHS } from "./glass/prism.js";
import { TIDALGLASS_SYNTHS } from "./glass/tidalglass.js";
import { TIDELACE_SYNTHS } from "./glass/tidelace.js";

// stamp every synth in a module with the category of the folder it lives in
const inFolder = (category, mods) =>
  Object.fromEntries(Object.entries(mods).map(([id, def]) => [id, { ...def, category }]));

export const EXTRA_SYNTHS = {
  ...inFolder("bass", JIBASS_SYNTHS),
  ...inFolder("glass", KILN_SYNTHS),
  ...inFolder("glass", ANNEAL_SYNTHS),
  ...inFolder("glass", PALINODE_SYNTHS),
  ...inFolder("glass", FAULTGLASS_SYNTHS),
  ...inFolder("glass", MORROWGLASS_SYNTHS),
  ...inFolder("glass", VITREOUS_SYNTHS),
  ...inFolder("glass", LANTERN_SYNTHS),
  ...inFolder("glass", PRISM_SYNTHS),
  ...inFolder("glass", TIDALGLASS_SYNTHS),
  ...inFolder("glass", TIDELACE_SYNTHS),
};
