/* Proof of Free — Living Synth v5 · deterministic genome module.
 *
 * v5:
 *  - Colour comes from the ACTUAL Xtrata logo, embedded as a 32×32 hex map
 *    (XTRATA_MAP, sampled from the source artwork) — the mosaic reproduces
 *    the real composition pixel-for-pixel. Regenerate from a PNG with
 *    scripts/sample-logo.mjs.
 *  - Five families via colour classification: black / grey / white / blue /
 *    orange. BLACK TILES ARE DRUM NFTS: each is a drum machine with a
 *    deterministic preset step pattern (hats/claps/snares in the upper rows,
 *    kicks/toms/sub toward the bottom) that owners can re-record or
 *    re-sequence and inscribe as a child to change the beat or tone.
 *  - Per-tile loop lengths (1–8 bars, polymetric against the shared
 *    132 BPM / D-dorian transport).
 *  - Themed animations (0 / ZERO / PROOF / FREE / …, bars, scope, orbit).
 *
 * ENGINE_VERSION is baked into every genome. A version-3 genome must sound
 * and render identically under any future engine or be refused.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ProofOfFreeGenome = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ENGINE_VERSION = 3;
  const COLLECTION_ID = "xtrata-living-synth-v5";
  const COLLECTION_SIZE = 1024;
  const GRID = 32;

  /* One global musical framework shared by all 1,024 instruments. */
  const MUSIC = Object.freeze({
    root: "D",
    rootMidi: 50,
    scale: Object.freeze([0, 2, 3, 5, 7, 9, 10]),
    bpm: 132,
    barsPerLoop: 4,
    stepsPerBar: 16,
    ppq: 96,
    tuningHz: 440
  });
  const STEPS_PER_BAR = MUSIC.stepsPerBar;                        // 16
  const TICKS_PER_STEP = (MUSIC.ppq * 4) / MUSIC.stepsPerBar;     // 24
  const TICKS_PER_BAR = STEPS_PER_BAR * TICKS_PER_STEP;           // 384
  const STEPS_PER_LOOP = MUSIC.barsPerLoop * MUSIC.stepsPerBar;   // 64
  const TICKS_PER_LOOP = STEPS_PER_LOOP * TICKS_PER_STEP;         // 1536
  /* Loop-length TRAIT: every NFT (melodic or percussive) loops in exactly
   * 1, 2 or 4 bars. Duplicates weight the draw. */
  const LOOP_BARS = Object.freeze([1, 2, 2, 4, 4]);
  const MAX_LOOP_TICKS = 4 * TICKS_PER_BAR;                       // 1536

  const WAVEFORMS = Object.freeze(["sine", "triangle", "sawtooth", "square"]);
  const WORDS = Object.freeze([
    "0", "ZERO", "PROOF", "FREE", "NOTHING", "OPEN",
    "BLOCK", "CLAIM", "SIGNAL", "WITNESS", "FOREVER", "X"
  ]);
  const ANIM_KINDS = Object.freeze(["glyph", "bars", "scope", "orbit", "zeroRing", "rain", "void", "pulse0", "binary", "radiate"]);
  const ROLES = Object.freeze(["bell", "pluck", "lead", "pad", "bass", "subBass", "pulse", "drone", "atmos", "drum"]);
  const FAMILIES = Object.freeze(["black", "grey", "white", "blue", "orange"]);
  const DRUM_TYPES = Object.freeze(["kick", "snare", "closedHat", "openHat", "tom", "clap", "perc"]);

  /* Brand palette — fixed hues, tiles fade between their colour and black/white.
   * lo/hi = base-lightness band per family. Gold is the mythic overlay. */
  const BRAND = Object.freeze({
    orange: { h: 32,  s: 88, lo: 38, hi: 56 },   // Bitcoin Orange (#F7931A)
    blue:   { h: 240, s: 88, lo: 38, hi: 60 },   // Stacks Blue (#5546FF)
    grey:   { h: 220, s: 6,  lo: 34, hi: 64 },   // neutral
    white:  { h: 220, s: 5,  lo: 70, hi: 90 },   // bright neutral
    black:  { h: 225, s: 14, lo: 4,  hi: 12 }    // near-black ground
  });
  const GOLD = Object.freeze({ h: 45, s: 92 });

  /* The actual Xtrata logo, 32×32, sampled from the source artwork.
   * Each row is 32 × 6-char hex (no '#'). */
  const XTRATA_MAP_ROWS = [
    "090b0b090a0b090a0a090a0a090b0b0a0b0b080a0a0f10110a0b0c090a0a080a0a090a0a090a0a090a0a090a0b0a0b0c080a0a1415160a0b0c090b0b08090a080a0a090a0a08090a090b0b0a0b0c080a0a121314090a0b080a0a08090a090a0b",
    "090a0b080909090a0a08090a0708090d0e0f0a0a0b07080907080908080908090907080908090a08090a07080910111209090a08080907080807080908080907080908090a08090a0708080f10100809090809090708080809090f121315191b",
    "4647475a5b5b5758586364645e5e5e5556565252525556565858595454555555565c5c5c1415151011110a0a0b0809090708080808090708090708095656575b5b5c5858586d6d6e575858525353565656535454565757545455555656595b5d",
    "4444457272732526261011111010111011111011121011111112121111121011125e5f5f595a5a1011120708090809090809090809090809095454555a5a5a1b1c1c1112121011110f10111011121011121011111112131112121415166c6c6d",
    "52535461616257575771684b615e54555556595a5a5959595a5a5a7070715d5e5e5c5c5da9a9a9616162111112080909080909090a0a535454707070606161555556565656595a5a5657575656565353545a5b5b6060609f9f9f5b5c5c5c5c5d",
    "4546465e5f5f1f202011110e1111111010110f10111616171112130f10104e4f4f5a5a5a5d5e5e5859595757581011120708085d5d5e5d5e5e5758585c5c5d5d5d5d1112120f10111010111112120f1011191a1a0f1011121213131314555656",
    "4748496060605657575a5a5b5859596868685b5c5c5152525253535757581b1c1c5455555c5c5d6161615e5e5e6a6a6b5657575d5e5e5c5c5c5e5e5e5858591112125556565b5b5c525253696a6a5a5a5b525253555556515151555555585859",
    "48494a3c495352575b6b6b6b6162625b5b5c5657575c5c5d56565661616159595a1718184e4e4f6b6b6b5757575a5b5b6f633c5a59565e5e5e5b5b5c0f10105051515b5b5c6d6d6d5556566060605757585a5a5a5c5c5d5758592d3e4b595a5a",
    "0e0f102a3b483143522a3c4a1116190f10100f10110f0f101010115252535d5d5d9494941f20205253535758586363635e5d5b5858595d5d5d1516175454556a6b6b5b5b5c0f10100e0f0f0f10100f10100f10102a3c4a2b3d4c233644151617",
    "1f2e39243746223545203343253847233543263847253746243745283d4e4f54575a5a5a5757581415154e4e4f5859595757576060601010115d5e5e6464645f5f5f2437452c3d4c2031401f32412336452538472034433247596c80911d2e3c",
    "090c0e22313c2034440c13190a0c0e090c0e090b0d0f11130a0c0e22323e2437455154575757575a5a5a1718185757585757581f20205353545b5b5c5657572b3d4a243848090c0d090c0e0a0c0e090b0d1214160a0e10243847243645090b0d",
    "080a0a080a0a1a2a37273a4a687c8c354b5c243949595638191811080a0b22323e2538475155585c5d5d1213131112120b0c0d0809095656575a5b5b293b4a1d3141213646090a0b2638462c43552336451f3342233645223544080a0a080809",
    "090a0b080909080a0c243644273b4b1f32422538472437452436440a0e112938442437482133426265675c5c5d1112120708085050505758582c3d4a645c35263947080a0c2b41527488982134451e31411e3242283948080a0b090a0a08090a",
    "08090a0d0e0f0b0c0c080a0b202f3c2538482135450d121621303d2235450b1015273a492437472436465254575455555757575b5c5c2537462538492133411215172235451c3040090a0c2236462437471c2f40090b0c090a0a070809111213",
    "090a0b08080907080908080908090b212f3b2438472537460a10142336462335440a0e1122313e2437462436455457595858592d3d4b6d808f2c4153090b0d1c2e3c273a491d31411a2c3b1a2e3e213342090b0c070809111212070809080909",
    "080a0a080809080809070809080909090a0b182835283e512437471a2d3e1f3242213343090e121c2e3c2337470e11140a0b0c334555213546090c0f192c3b2135451c30411f33431b2f3f1d3244080a0b0e0f10080909070809070808080909",
    "090a0a07080908090a09090a0808090d0e0f090a0b182834213443090e121928351d30400b0f12090a0b1d2e3b263c4e1f3241213443080a0c0808091c2f3e223443090a0c213545203241101112080909070809070808080809070809070809",
    "090a0b08090a0809090f1010090a0b0808091c2b372033431e31412032411a2e3f223646090d102436452336461f32432d3e4d2134451f3140080b0d1f3242223545213343374c5d6f82911f324107080808080908090a070809080909080a0a",
    "080a0a0c0d0e0b0c0c0708090708091f2d3a2033431b2f3f0b101421313f2033431014171f2f3c2134442134444e382354392028354021344421354607090a25394a26394a08090a2133422034441d2f3e07080908090a090a0b080909101112",
    "090a0b070809070809080a0b1525321a2d3c1f32420a0f141626322438480b11161d2d3a1f32412434414d3826563b2351351c563a2126323c2b40501f3242080b0d192b3a203241090b0d192c3c1d303f203242090a0c121313080809080909",
    "08090a0708090809091b28331f3141223444192b3b2236481e3040090d10212f3a1b2d3c1f314094806f553921573b23573d265f3f24563a221e2c381a2c3c24354408090a2233436c7d8c1f32436c6237283b4c1f303e08080907080808090a",
    "08090a08090b1827332032422032412336461f31401e2f3d080d1108090a1a293520313f48342352351d4c311a17151208090a4a3320573d275539221e2d3a182b3a090b0c090a0b2434422438491e303e1e2f3e1e2f3e1e303e080a0b080909",
    "090b0b1b2833182a391c30410b101507090a07080908090a07090a1d2b361c2d3c4c3726533923604228130f0b0909090808080708094c34204e331c52372123313d20324012131408090a08090a07080907090a080b0d2132401d2e3c090a0b",
    "1d2a34263a4a2032411d2e3d1a2b3a2031402232412131401a2c3b5a563919180f5338235238220f0c0a0909094a321f4c3019110d0a0809094e35215237216548302232401c2d3c1e2f3d2c3d4b1e2f3e2536442032416375841d2f3e2f404f",
    "19252f535137323a36202e3b22303d202e3b19293722313d202e3c1417194530204b311c110d0a0b0a0946301e5136215035205337210e0c0a1011114e34204f35200b0a09273643202e3a21303d1e2d3a63727e202e3b2c3d4d20303f24313d",
    "402e1f35373a4231254d311c50331d5337214d311c5e3f2751351e4e331e543b27110e0c09090949311f50351f5236214c321d6241285236200e0c0a0708084f36234f341e987d684a2d1852341c5036225b3d2650341f4a301c212e3a4f3724",
    "3f2d1f8c715c573e2a4a301c4b321e5c422e4f3522472e1b4f37254c3421130e0a0b0a09432c1a533721513927181614090a0b412b1a4e331f5035200e0c0a0708094b321e4f3522452c1a5e412c49311e49301d4a321f452c184d311c4a311f",
    "3f2c1e4b2e1817110c0d0e0e0a0a0b08080907080907080907080907080908090a47301f4d321e745b3115130d070809060708080809462e1d4e321e4d311d0c0b0b0708090e0f100809090809090708080808090708090909094d311d4e3421",
    "3f2d2062422b1d140d0d0b0a0c0a090d0b0a0d0b0a0c0b090d0c0a0d0b0a0d0b0a5439264d34220f0c0907080808090908090908090908090a4831214f33201715120f0d0b0c0b090c0a090d0b0a0c0b090c0b090d0c0a0f0c0a492d185a3d27",
    "382618472d1a49311f472e1b4b32204227154a311e4c3321452c1a583b264d342249301d100c09070809070808070809090a0a090a0a0808090f101149301d482f1d6e5c2b4a301e472f1d492f1c4b321f4d342148301e5e422d4a311e452e1d",
    "08090a08090907080907080908090a0809090708090d0e0f090a0b07080907080808080908090907080908090a080909080809101112090a0b07080907080808080908090907080909090a08090a07080911121307080907080907080808090a",
    "090a0b080909090a0a090a0a08090a0f10100a0b0c08090907080908090908090908090908090a090a0a0809090e1010090a0a08090907080908090908090a080909090a0a090a0b0808090f101108090a08090907080908090a08090a08090a"
  ];
  const XTRATA_MAP = XTRATA_MAP_ROWS.map(row => {
    const cols = [];
    for (let i = 0; i < GRID; i++) cols.push("#" + row.slice(i * 6, i * 6 + 6));
    return cols;
  });
  if (XTRATA_MAP.length !== GRID || XTRATA_MAP.some(r => r.length !== GRID)) {
    throw new Error("XTRATA_MAP must be exactly 32×32.");
  }

  function hexToRgb(hex) {
    const v = parseInt(hex.slice(1), 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
  }
  /* Same classifier as the collection-builder reference. */
  function classifyFamily(r, g, b) {
    const lum = (r + g + b) / 3, sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (lum < 28 && sat < 24) return "black";
    if (lum > 145 && sat < 38) return "white";
    if (b > r * 1.08 && b > g * 1.02) return "blue";
    if (r > b * 1.18 && r > g * 1.05 && lum > 35) return "orange";
    if (lum > 45) return "grey";
    return "black";
  }
  function logoColor(x, y) {
    const hex = XTRATA_MAP[y][x];
    const { r, g, b } = hexToRgb(hex);
    return { hex, r, g, b, family: classifyFamily(r, g, b) };
  }

  /* Deterministic PRNG: splitmix32. No Math.random anywhere. */
  function splitmix32(a) {
    let s = a >>> 0;
    return function () {
      s = (s + 0x9e3779b9) >>> 0;
      let t = s ^ (s >>> 16);
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ (t >>> 15);
      t = Math.imul(t, 0x735a2d97);
      t = t ^ (t >>> 15);
      return (t >>> 0) / 4294967296;
    };
  }
  const q = (v, p) => Number(v.toFixed(p));
  const pick = (rand, arr) => arr[(rand() * arr.length) | 0];
  const lerp = (a, b, t) => a + (b - a) * t;
  const toHex = (r, g, b) => "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const lighten = (hex, f) => { const { r, g, b } = hexToRgb(hex); return toHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f); };
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    return toHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }

  /* Weighted role selection per family; black rows split hats-top / kicks-bottom
   * exactly like the reference builder. */
  function weighted(rand, weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    const total = entries.reduce((n, [, w]) => n + w, 0);
    let v = rand() * total;
    for (const [name, w] of entries) { v -= w; if (v <= 0) return name; }
    return entries[entries.length - 1][0];
  }
  function drumTypeFor(gridY, rand) {
    const v = gridY / (GRID - 1), top = 1 - v, bottom = v;
    return weighted(rand, {
      closedHat: 20 * top + 2, openHat: 10 * top + 1, clap: 12 * top + 2,
      snare: 9 + 3 * top, perc: 12, kick: 3 + 24 * bottom, tom: 3 + 18 * bottom
    });
  }
  /* Orchestration follows the logo as a mix hierarchy:
   *   black  → drums (percussive frame)
   *   orange → basslines, sub-bass weighted toward the bottom rows (low end)
   *   blue   → the main leads (the body of the tune)
   *   grey   → high-frequency, thin/bright presets (plucks + bells)
   *   white  → the brightest highlights (bells / plucks) */
  function roleFor(family, gridY, rand) {
    if (family === "black") return rand() < 0.82 ? "drum" : (rand() < 0.6 ? "drone" : "atmos");
    if (family === "grey") return weighted(rand, { pluck: 28, bell: 22, lead: 8 });
    if (family === "white") return rand() < 0.5 ? "bell" : "pluck";
    if (family === "blue") return weighted(rand, { lead: 32, pad: 9, pluck: 7, bass: 5 });
    // orange: low end. Sub-bass grows the lower the tile sits in the logo.
    const v = gridY / (GRID - 1);
    return weighted(rand, { bass: 28, subBass: 6 + 46 * Math.max(0, (v - 0.5) / 0.5), pulse: 6, lead: 3 });
  }
  const ROLE_SPEC = {
    bell:    { reg: 24,  waves: ["sine", "triangle"],     density: 0.42,  octaves: 2, atk: [0.002, 0.02],  rel: [0.6, 1.8],  cut: [4000, 11000], res: [2, 7],  drive: [0, 0.1],     sub: 0.0 },
    pluck:   { reg: 12,  waves: ["triangle", "sawtooth"], density: 0.5, octaves: 2, atk: [0.001, 0.008], rel: [0.08, 0.4], cut: [2600, 9500], res: [2, 8],  drive: [0, 0.18],    sub: 0.0 },
    lead:    { reg: 12,  waves: ["sawtooth", "triangle"], density: 0.55,  octaves: 2, atk: [0.004, 0.05],  rel: [0.3, 1.3],  cut: [2200, 7000], res: [3, 9],  drive: [0.06, 0.32], sub: 0.12 },
    pad:     { reg: -5,  waves: ["sawtooth", "triangle"], density: 0.24, octaves: 1, atk: [0.15, 0.7],    rel: [1.4, 3.2],  cut: [900, 3600],  res: [1, 5],  drive: [0, 0.1],     sub: 0.15 },
    bass:    { reg: -12, waves: ["sawtooth", "square"],   density: 0.42, octaves: 1, atk: [0.004, 0.03],  rel: [0.18, 0.6], cut: [420, 2000],  res: [3, 8],  drive: [0.1, 0.4],   sub: 0.5 },
    subBass: { reg: -24, waves: ["sine", "triangle"],     density: 0.3, octaves: 1, atk: [0.006, 0.04],  rel: [0.25, 0.8], cut: [70, 340],    res: [1, 4],  drive: [0.04, 0.24], sub: 0.7 },
    pulse:   { reg: 0,   waves: ["square", "sawtooth"],   density: 0.6, octaves: 1, atk: [0.002, 0.015], rel: [0.08, 0.4], cut: [1400, 6000], res: [4, 11], drive: [0.15, 0.55], sub: 0.2 },
    drone:   { reg: -12, waves: ["sine", "sawtooth"],     density: 0.12, octaves: 1, atk: [0.4, 1.2],     rel: [2.5, 5],    cut: [400, 1800],  res: [1, 4],  drive: [0, 0.08],    sub: 0.4 },
    atmos:   { reg: 0,   waves: ["triangle", "sine"],     density: 0.16,  octaves: 2, atk: [0.2, 0.9],     rel: [1.6, 4],    cut: [800, 4200],  res: [1, 6],  drive: [0, 0.12],    sub: 0.1 },
    drum:    { reg: 0,   waves: ["sine", "triangle"],     density: 0.5,  octaves: 1, atk: [0.001, 0.01],  rel: [0.05, 0.3], cut: [800, 8000],  res: [1, 6],  drive: [0.1, 0.4],   sub: 0.0 }
  };

  function animationFor(family, role, rand) {
    const r = rand();
    let kind, word = null;
    if (role === "drum") {
      /* drum tiles render their animated LETTER; kind只 seeds the surround style */
      kind = pick(rand, ["bars", "zeroRing", "radiate", "orbit"]);
      word = null;
    } else if (family === "black") {
      // sparse, atmospheric ground — lots of 0 / void references
      kind = r < 0.22 ? "void" : r < 0.4 ? "radiate" : r < 0.56 ? "binary" : r < 0.7 ? "orbit" : r < 0.85 ? "pulse0" : "glyph";
      if (kind === "glyph") word = rand() < 0.7 ? "0" : pick(rand, ["ZERO", "NOTHING", "FOREVER", "X"]);
    } else {
      // bright families — heavy on 0 motifs with variety
      if (r < 0.13) { kind = "glyph"; word = "0"; }
      else if (r < 0.22) { kind = "glyph"; word = pick(rand, WORDS.slice(1)); }
      else if (r < 0.37) kind = "pulse0";
      else if (r < 0.5) kind = "zeroRing";
      else if (r < 0.62) kind = "binary";
      else if (r < 0.73) kind = "radiate";
      else if (r < 0.82) kind = "bars";
      else if (r < 0.9) kind = "scope";
      else if (r < 0.96) kind = "rain";
      else kind = "orbit";
    }
    /* Living colour: every tile drifts inside its family range. Some tiles
     * are calm, some vibrant — vibrancy also scales the motif energy. */
    const vibrancy = q(rand() * rand(), 3); // biased toward calm, few very alive
    return {
      kind, word,
      speed: q(lerp(0.5, 1.8, rand()), 3),
      seed: (rand() * 0xffffffff) >>> 0,
      drift: {
        hue: q(lerp(4, family === "black" ? 14 : 22, rand()) * (0.5 + vibrancy), 2),   // ± degrees
        light: q(lerp(0.04, 0.18, rand()) * (0.5 + vibrancy), 3),                       // ± lightness
        sat: q(lerp(0.02, 0.14, rand()) * (0.5 + vibrancy), 3),
        rate: q(lerp(0.05, 0.5, rand()), 3),                                            // Hz
        vibrancy
      }
    };
  }

  /* Distinct synth architectures (voice cores) so tiles in a family sound
   * like different instruments, not one synth with effect tweaks. */
  const ARCHS = Object.freeze(["dualosc", "supersaw", "fm", "pwm", "ring", "reese", "pluck", "wavetable"]);
  const ARCH_BY_ROLE = {
    lead:    ["supersaw", "fm", "pwm", "wavetable", "dualosc"],
    pluck:   ["pluck", "fm", "wavetable", "pwm"],
    bell:    ["fm", "wavetable", "pluck", "ring"],
    bass:    ["reese", "fm", "supersaw", "dualosc"],
    subBass: ["dualosc", "fm", "reese"],
    pad:     ["supersaw", "wavetable", "pwm", "dualosc"],
    pulse:   ["pwm", "ring", "supersaw", "fm"],
    drone:   ["wavetable", "fm", "dualosc", "ring"],
    atmos:   ["wavetable", "ring", "fm", "pwm"],
    drum:    ["dualosc"]
  };
  function synthFor(role, rand) {
    const arch = pick(rand, ARCH_BY_ROLE[role] || ["dualosc"]);
    return {
      arch,
      fmRatio: pick(rand, [1, 2, 2, 3, 3.5, 4, 5, 7]),
      fmIndex: q(lerp(0.4, role === "bell" ? 6 : 3.5, rand() * rand()), 2),
      voices: 3 + ((rand() * 4) | 0),                // super/reese unison count
      detuneSpread: q(lerp(6, role === "pad" ? 40 : 26, rand()), 1),
      pwmDepth: q(lerp(0.2, 0.9, rand()), 2),
      ringRatio: q(lerp(1.4, 3.3, rand()), 3),
      waveSeed: (rand() * 0xffffffff) >>> 0
    };
  }

  function deriveGenome(edition) {
    if (!Number.isInteger(edition) || edition < 1 || edition > COLLECTION_SIZE) {
      throw new Error(`Edition must be 1–${COLLECTION_SIZE}.`);
    }
    const rand = splitmix32(0x50f0f3ee ^ Math.imul(edition, 2654435761));
    const gridX = (edition - 1) % GRID;
    const gridY = ((edition - 1) / GRID) | 0;
    const col = logoColor(gridX, gridY);
    const family = col.family;
    const role = roleFor(family, gridY, rand);
    const spec = ROLE_SPEC[role];
    const lum = (col.r + col.g + col.b) / (3 * 255);

    const loopBars = pick(rand, LOOP_BARS);
    const loopSteps = loopBars * STEPS_PER_BAR;
    const rootNote = MUSIC.rootMidi + spec.reg + (rand() < 0.3 ? 12 : 0);
    const patternSeed = (Math.imul(edition, 0x85ebca6b) ^ Math.imul(gridX * 32 + gridY + 1, 0xc2b2ae35)) >>> 0;

    /* Brand palette: fixed hues (Bitcoin Orange / Stacks Blue / neutral greys),
     * every tile fades between ITS colour and black or white — no rainbow.
     * A rare gold tile is a MYTHIC: brighter, more alive, better in every way. */
    const mythic = rand() < 0.012;                          // ~12 of 1,024
    const band = BRAND[family];
    const baseLight = q(lerp(band.lo, band.hi, rand()), 2);
    const hue = mythic ? GOLD.h : band.h;
    const sat = mythic ? GOLD.s : band.s;
    const light = mythic ? q(lerp(52, 66, rand()), 2) : baseLight;
    const fade = mythic ? "white" : (family === "white" ? "black" : rand() < 0.5 ? "white" : "black");
    const fadeAmp = q((mythic ? 0.7 : 0.35) + rand() * (mythic ? 0.3 : 0.5), 3);

    const genome = {
      collectionId: COLLECTION_ID,
      engineVersion: ENGINE_VERSION,
      edition,
      tokenId: edition,
      mosaic: {
        gridX, gridY, family, role, mythic,
        hue, sat, light, fade, fadeAmp,
        color: hslToHex(hue, sat, light),
        accent: hslToHex(hue, Math.min(100, sat + (band.s < 20 ? 0 : 8)), Math.min(94, light + (mythic ? 24 : 30))),
        brightness: q(Math.max(0.04, light / 100), 4)
      },
      animation: animationFor(family, role, rand),
      rootNote,
      loopBars,
      oscillator: {
        typeA: spec.waves[0],
        typeB: pick(rand, spec.waves),
        detune: q(lerp(3, 14, rand()), 2),
        mix: q(lerp(0.3, 0.62, rand()), 3),
        sub: q(spec.sub * lerp(0.6, 1.1, rand()), 3)
      },
      synth: synthFor(role, rand),
      lfo: { rate: q(lerp(0.05, 6, rand() * rand()), 3), depth: q(lerp(0, 0.5, rand()), 3), target: pick(rand, ["cutoff", "pitch", "amp"]) },
      filter: {
        type: role === "bass" || role === "drone" ? "lowpass" : pick(rand, ["lowpass", "lowpass", "bandpass"]),
        cutoff: Math.round(lerp(spec.cut[0], spec.cut[1], rand())),
        resonance: q(lerp(spec.res[0], spec.res[1], rand()), 2)
      },
      envelope: {
        attack: q(lerp(spec.atk[0], spec.atk[1], rand()), 4),
        decay: q(lerp(0.05, 0.5, rand()), 4),
        sustain: q(lerp(0.25, 0.75, rand()), 3),
        release: q(lerp(spec.rel[0], spec.rel[1], rand()), 4)
      },
      effects: {
        delaySteps: pick(rand, [2, 3, 4, 6, 8]),
        feedback: q(lerp(0.15, 0.5, rand()), 3),
        delayWet: q(lerp(0.08, 0.36, rand()), 3),
        reverb: q(lerp(0.08, 0.5, rand()), 3),
        distortion: q(lerp(spec.drive[0], spec.drive[1], rand()), 3),
        pan: q(lerp(-0.6, 0.6, rand()), 3)
      },
      melody: {
        patternSeed,
        loopBars,
        length: loopSteps,
        density: q(Math.min(0.85, spec.density + (rand() - 0.5) * 0.18), 3),
        octaveRange: spec.octaves,
        swing: q(lerp(0, 0.18, rand()), 3)
      },
      padBehaviour: role === "drum"
        ? { xAxis: "toneOrPitch", yAxis: "decay", pressureAxis: "drive" }
        : { xAxis: "scaleDegree", yAxis: "filterCutoff", pressureAxis: "distortion" }
    };

    /* Drum NFT: dedicated drum machine genome. */
    if (role === "drum") {
      genome.drum = {
        type: drumTypeFor(gridY, rand),
        pitch: q(gridY > 20 ? lerp(30, 90, rand()) : lerp(60, 160, rand()), 2),
        decay: q(lerp(0.06, 0.6, rand()), 3),
        tone: q(rand(), 3),
        snap: q(rand(), 3),
        metal: q(rand(), 3),
        gain: q(lerp(0.6, 0.95, rand()), 3)
      };
    }
    return genome;
  }

  /* Deterministic melody (melodic tiles): same genome → same notes forever. */
  /* Metric weight per 16th step: notes land on strong beats and leave space,
   * so the genesis loops stay minimal and many tiles layer without turning to
   * mush. Downbeat > half > quarter > eighth > sixteenth. */
  function metricWeight(step) {
    const b = step % 16;
    if (b === 0) return 1;
    if (b === 8) return 0.85;
    if (b % 4 === 0) return 0.6;
    if (b % 2 === 0) return 0.3;
    return 0.12;
  }
  function deriveMelody(genome) {
    const rand = splitmix32(genome.melody.patternSeed);
    const degrees = MUSIC.scale.length;
    const span = degrees * genome.melody.octaveRange;
    const swingTicks = Math.round(genome.melody.swing * TICKS_PER_STEP);
    const steps = [];
    let degree = (rand() * span) | 0;
    for (let i = 0; i < genome.melody.length; i++) {
      const offbeat = i % 2 === 1;
      if (rand() < genome.melody.density * metricWeight(i)) {
        degree = Math.min(span - 1, Math.max(0, degree + (((rand() * 5) | 0) - 2)));
        const midi = genome.rootNote + 12 * ((degree / degrees) | 0) + MUSIC.scale[degree % degrees];
        steps.push({
          step: i,
          tick: i * TICKS_PER_STEP + (offbeat ? swingTicks : 0),
          midi,
          velocity: q(0.5 + rand() * 0.4 + (i % 16 === 0 ? 0.1 : 0), 3),
          gateSteps: 1 + ((rand() * 3) | 0)
        });
      }
    }
    /* Guarantee a downbeat anchor so every tile has a clear pulse to lock to. */
    if (steps.length === 0 || steps[0].step !== 0) {
      steps.unshift({ step: 0, tick: 0, midi: genome.rootNote, velocity: 0.72, gateSteps: 2 });
    }
    return steps;
  }

  /* Deterministic preset drum pattern for a drum NFT (per drum type, over the
   * tile's own loop length, with bar-to-bar variation). Steps are
   * null | {vel, prob, pitch, accent} — same shape owners edit and inscribe. */
  function deriveDrumPattern(genome) {
    if (!genome.drum) return [];
    const rand = splitmix32(genome.melody.patternSeed ^ 0x5eed);
    const type = genome.drum.type;
    const barOf = () => {
      const a = Array.from({ length: 16 }, () => null);
      const hit = (i, v = 0.75, p = 1, pitch = 0) => { a[i] = { vel: q(v, 3), prob: q(p, 3), pitch, accent: v > 0.88 }; };
      if (type === "kick") { [0, 8].forEach(i => hit(i, 0.95)); if (rand() > 0.35) hit(10, 0.62, 0.85); if (rand() > 0.5) hit(14, 0.7, 0.8); }
      else if (type === "snare" || type === "clap") { [4, 12].forEach(i => hit(i, 0.9)); if (rand() > 0.55) hit(15, 0.45, 0.65); }
      else if (type === "closedHat") { for (let i = 0; i < 16; i += 2) hit(i, 0.45 + rand() * 0.25, 0.9); if (rand() > 0.5) for (let i = 1; i < 16; i += 4) hit(i, 0.35, 0.65); }
      else if (type === "openHat") { [6, 14].forEach(i => hit(i, 0.55, 0.8)); }
      else if (type === "tom") { [3, 7, 11, 15].forEach((i, n) => { if (rand() > 0.35) hit(i, 0.55 + rand() * 0.35, 0.85, n - 1); }); }
      else { for (let i = 0; i < 16; i++) if (rand() < 0.2) hit(i, 0.35 + rand() * 0.5, 0.55 + rand() * 0.4, ((rand() * 5) | 0) - 2); }
      return a;
    };
    const pattern = [];
    for (let bar = 0; bar < genome.loopBars; bar++) {
      const barPattern = barOf();
      if (bar > 0) for (let i = 0; i < 16; i++) if (rand() < 0.12) {
        barPattern[i] = barPattern[i] ? null : { vel: q(0.35 + rand() * 0.55, 3), prob: q(0.65 + rand() * 0.35, 3), pitch: ((rand() * 5) | 0) - 2, accent: rand() > 0.75 };
      }
      pattern.push(...barPattern);
    }
    if (!pattern.some(Boolean)) pattern[0] = { vel: 0.8, prob: 1, pitch: 0, accent: false };
    return pattern;
  }

  const midiToHz = midi => MUSIC.tuningHz * 2 ** ((midi - 69) / 12);
  function quantiseX(genome, x, octaves) {
    const span = MUSIC.scale.length * (octaves || 2);
    const degree = Math.min(span - 1, (Math.max(0, Math.min(1, x)) * span) | 0);
    return genome.rootNote + 12 * ((degree / MUSIC.scale.length) | 0) + MUSIC.scale[degree % MUSIC.scale.length];
  }

  function stableStringify(value) {
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (value && typeof value === "object") {
      return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
    }
    return JSON.stringify(value);
  }
  function genomeHash(genome) {
    const text = stableStringify(genome);
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return "0x" + (h >>> 0).toString(16).padStart(8, "0");
  }

  return Object.freeze({
    ENGINE_VERSION, COLLECTION_ID, COLLECTION_SIZE, GRID,
    MUSIC, WAVEFORMS, WORDS, ANIM_KINDS, ROLES, FAMILIES, DRUM_TYPES, LOOP_BARS,
    XTRATA_MAP, classifyFamily, logoColor, hexToRgb,
    TICKS_PER_STEP, TICKS_PER_BAR, STEPS_PER_BAR, STEPS_PER_LOOP, TICKS_PER_LOOP, MAX_LOOP_TICKS,
    splitmix32, deriveGenome, deriveMelody, deriveDrumPattern, midiToHz, quantiseX,
    stableStringify, genomeHash
  });
});
