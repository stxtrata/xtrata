import fs from "node:fs";
import { BEAT_PRESETS } from "../js/beats.js";
import {
  COMBINED_BEAT_PRESETS,
  EXPANDED_COMBINED_BEAT_PRESETS,
} from "../js/combined-beats.js";
import { ONBOARD_SOUNDS, FAMILY_LABELS } from "../js/onboard-catalog.js";
import { onboardVariant } from "../js/onboard-library.js";
function audit(presets) {
  const counts = Object.fromEntries(ONBOARD_SOUNDS.map((s) => [s.key, 0])),
    assets = new Set(),
    families = {};
  for (const p of presets)
    for (const c of p.channels)
      if (c.source.type === "synth") {
        counts[c.source.value]++;
        assets.add(onboardVariant(c.source).id);
      }
  for (const [family, label] of Object.entries(FAMILY_LABELS)) {
    const keys = ONBOARD_SOUNDS.filter((s) => s.family === family).map(
      (s) => s.key,
    );
    families[family] = {
      label,
      patches: keys.length,
      used: keys.filter((k) => counts[k] > 0).length,
      channelUses: keys.reduce((n, k) => n + counts[k], 0),
      minUses: Math.min(...keys.map((k) => counts[k])),
      maxUses: Math.max(...keys.map((k) => counts[k])),
    };
  }
  return {
    presets: presets.length,
    namedSoundsUsed: Object.values(counts).filter((n) => n > 0).length,
    recordedAssetsUsed: assets.size,
    distinctRhythms: new Set(
      presets.map((p) => p.channels.map((c) => c.pattern).join("|")),
    ).size,
    missingSounds: ONBOARD_SOUNDS.filter((s) => !counts[s.key]).map(
      (s) => s.label,
    ),
    families,
    sounds: ONBOARD_SOUNDS.map((s) => ({
      soundId: s.soundId,
      label: s.label,
      family: s.family,
      uses: counts[s.key],
    })),
  };
}
const report = {
  generatedAt: new Date().toISOString(),
  original: audit(BEAT_PRESETS),
  combinedCore: audit(COMBINED_BEAT_PRESETS),
  combinedFull: audit(EXPANDED_COMBINED_BEAT_PRESETS),
};
for (const key of ["original", "combinedCore"]) {
  const r = report[key];
  if (
    r.presets !== 96 ||
    r.namedSoundsUsed !== 144 ||
    r.recordedAssetsUsed !== 184 ||
    r.distinctRhythms !== 96 ||
    r.missingSounds.length
  )
    throw Error(`Incomplete beat coverage: ${key}`);
}
fs.writeFileSync(
  new URL("../reports/beat-library-coverage.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
for (const name of ["original", "combinedCore", "combinedFull"])
  console.log(
    name,
    `${report[name].presets} presets · ${report[name].namedSoundsUsed} sounds · ${report[name].recordedAssetsUsed} recordings · ${report[name].distinctRhythms} rhythms`,
  );
