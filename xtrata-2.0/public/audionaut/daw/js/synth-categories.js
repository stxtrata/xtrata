// synth-categories.js — the synth "folders". Every synth lives in exactly one category; the
// instrument-channel picker and the MIDI-roll dropdown show the bank grouped by these folders.
// Empty folders are listed too (disabled placeholder) so the gaps in the bank stay visible.
//
// A synth is filed by `category` on its definition if it has one, otherwise by SYNTH_CATEGORY
// below (so existing modules did not need editing). Anything unfiled lands in "other".

export const CATEGORIES = [
  { id: "bass", label: "Bass", blurb: "sub, acid, analog and growl bass" },
  { id: "lead", label: "Leads", blurb: "mono and poly lead voices, supersaws" },
  { id: "pad", label: "Pads & String Machines", blurb: "warm sustained pads, ensembles, string machines" },
  { id: "keys", label: "Pianos & Electric Pianos", blurb: "piano, Rhodes/Wurli-style, clav" },
  { id: "organ", label: "Organs", blurb: "drawbar / tonewheel / combo / church" },
  { id: "fm", label: "FM Keys & Bells", blurb: "DX-style FM keys, bells and basses" },
  { id: "pluck", label: "Plucked & Struck Strings", blurb: "Karplus-Strong strings: nylon, harp, koto" },
  { id: "mallet", label: "Mallets & Modal Percussion", blurb: "marimba, kalimba, vibes, bowls, gongs" },
  { id: "reed", label: "Brass, Winds & Bowed", blurb: "brass stabs, flute/reed, bowed strings" },
  { id: "voice", label: "Voice & Choir", blurb: "formant vowels, choirs, vocoder-style" },
  { id: "chip", label: "Chip & Retro", blurb: "PWM, NES/Game Boy-style, 8-bit" },
  { id: "wave", label: "Wavetable, Phase & West-Coast", blurb: "wavetable morph, CZ phase distortion, wavefolder" },
  { id: "drums", label: "Drum Voices", blurb: "synthesised kick, snare, hat, clap, tom voices played as notes" },
  { id: "fx", label: "Noise, Textures & FX", blurb: "granular, risers, drones, sci-fi, noise" },
  { id: "glass", label: "Glass & Crystal", blurb: "inharmonic partials that settle into pitch: bells, shards, bloom" },
  { id: "other", label: "Other", blurb: "synths not filed yet" },
];

// existing synths → folder (new synths can simply declare `category: "<id>"` instead)
export const SYNTH_CATEGORY = {
  jibass: "bass", acidals: "bass", subzero: "bass",
  jims10: "lead", stacker: "lead",
  fm4: "fm", fmonad: "fm",
  pluck: "pluck",
  vox: "voice",
  chip8: "chip",
  kiln: "glass", anneal: "glass", palinode: "glass", faultglass: "glass", morrowglass: "glass",
  vitreous: "glass", lantern: "glass", prism: "glass", tidalglass: "glass", tidelace: "glass",
};

export function categoryOf(id, def) {
  const c = def?.category || SYNTH_CATEGORY[id];
  return CATEGORIES.some((x) => x.id === c) ? c : "other";
}

// bank → [{ ...category, ids: [...] }] in folder order; "other" only appears if something is in it
export function groupBank(bank) {
  const groups = CATEGORIES.map((c) => ({ ...c, ids: [] }));
  const by = Object.fromEntries(groups.map((g) => [g.id, g]));
  for (const [id, def] of Object.entries(bank)) by[categoryOf(id, def)].ids.push(id);
  return groups.filter((g) => g.id !== "other" || g.ids.length);
}

// (re)fill a <select> with the bank grouped into folders; empty folders get a disabled placeholder
export function fillSynthSelect(select, bank) {
  select.textContent = "";
  for (const g of groupBank(bank)) {
    const og = document.createElement("optgroup");
    og.label = g.ids.length ? `${g.label} (${g.ids.length})` : `${g.label} — empty`;
    if (g.ids.length) {
      for (const id of g.ids) {
        const o = document.createElement("option");
        o.value = id;
        o.textContent = bank[id].name;
        og.appendChild(o);
      }
    } else {
      const o = document.createElement("option");
      o.disabled = true;
      o.textContent = "(no synths yet)";
      og.appendChild(o);
    }
    select.appendChild(og);
  }
}
