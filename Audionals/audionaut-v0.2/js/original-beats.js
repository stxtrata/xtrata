import { LEGACY_BEAT_PRESETS } from "./legacy-beats.js";
import {
  embeddedArrangement,
  ORIGINAL_VARIANTS,
} from "./embedded-beat-arranger.js";
export const ORIGINAL_BEAT_PRESETS = LEGACY_BEAT_PRESETS.flatMap(
  (base, index) =>
    ORIGINAL_VARIANTS.map((variant, v) => {
      const arrangement = embeddedArrangement(base, index, v);
      return {
        ...base,
        ...arrangement,
        id: `original-${index}-${v}`,
        collection: "original",
        baseBeat: base.name,
        variant,
        name: `${base.name} · ${variant}`,
        bars: 4,
        description: `${variant}: ${v === 0 ? "the original groove with rooted bass and sparse melodic colour" : v === 1 ? "syncopated bass, melodic movement and extra ghost notes" : "sustained textures or chord stabs, spacious melodies and a fourth-bar fill"}. Embedded sounds · ${arrangement.mode} · local today / planned L2.`,
      };
    }),
);
