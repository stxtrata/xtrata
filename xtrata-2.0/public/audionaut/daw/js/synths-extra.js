// synths-extra.js — the "new synths" collection (eleven instruments ported from standalone
// single-file synths): the crystal / glass / bloom family plus jiBASS.
// Each module is self-contained (no imports) and registered here by id; synths.js spreads
// EXTRA_SYNTHS into SYNTH_BANK, so they appear in every instrument channel's synth picker.

import { KILN_SYNTHS } from "./synths-kiln.js";
import { ANNEAL_SYNTHS } from "./synths-anneal.js";
import { PALINODE_SYNTHS } from "./synths-palinode.js";
import { FAULTGLASS_SYNTHS } from "./synths-faultglass.js";
import { MORROWGLASS_SYNTHS } from "./synths-morrowglass.js";
import { VITREOUS_SYNTHS } from "./synths-vitreous.js";
import { LANTERN_SYNTHS } from "./synths-lantern.js";
import { PRISM_SYNTHS } from "./synths-prism.js";
import { TIDALGLASS_SYNTHS } from "./synths-tidalglass.js";
import { TIDELACE_SYNTHS } from "./synths-tidelace.js";
import { JIBASS_SYNTHS } from "./synths-jibass.js";

export const EXTRA_SYNTHS = {
  ...JIBASS_SYNTHS,
  ...KILN_SYNTHS,
  ...ANNEAL_SYNTHS,
  ...PALINODE_SYNTHS,
  ...FAULTGLASS_SYNTHS,
  ...MORROWGLASS_SYNTHS,
  ...VITREOUS_SYNTHS,
  ...LANTERN_SYNTHS,
  ...PRISM_SYNTHS,
  ...TIDALGLASS_SYNTHS,
  ...TIDELACE_SYNTHS,
};
