/* Proof of Free — recursive collection genome.
 *
 * Source of truth for the BUILDER. The inscribed engine embeds the same tables
 * because it must be self-contained; scripts/build-collection.mjs extracts them
 * back out of the engine artifact and deep-compares, so the two cannot drift.
 */

export const COLLECTION_ID = 'xtrata-proof-of-free-recursive-33';
export const ENGINE_VERSION = 3;
export const RELEASED_SUPPLY = 33;
export const PARENT_INSCRIPTION = 2838;

export const TITLES = ["First Light","Free Passage","No Toll","Clear Threshold","Open Circuit","Zero Barrier","Unlocked Field","Common Key","Public Door","The Bare Minimum","The Way Through","Open Signal","Free Frequency","Unmetered","Clear Channel","No Interference","One Pulse","Public Wave","Silent Charge","Released Current","Zero Noise","Broadcast Free","One Name","Named Light","Public Key","Unbound Mark","Open Signature","Free State","Known Here","No Alias","Single Claim","Proof Held","Proof of Free"];

export const SLUGS = ["first-light","free-passage","no-toll","clear-threshold","open-circuit","zero-barrier","unlocked-field","common-key","public-door","the-bare-minimum","the-way-through","open-signal","free-frequency","unmetered","clear-channel","no-interference","one-pulse","public-wave","silent-charge","released-current","zero-noise","broadcast-free","one-name","named-light","public-key","unbound-mark","open-signature","free-state","known-here","no-alias","single-claim","proof-held","proof-of-free"];

export const PALETTES = [["#0a0a0a","#f2eadf","#ff6a00","#38a0ff","#8b9299"],["#0d1117","#f7f0e6","#ff7a1a","#5bb8ff","#b0b6bc"],["#050505","#fff7eb","#f04d00","#2d8cff","#747b83"],["#111111","#eee6dc","#ff8a2a","#7dc9ff","#9fa6ad"],["#080808","#f5ede2","#ff5c00","#4ca6ff","#6e747b"]];

/* Per-edition motion vector: speed, phaseOffset, rotation, rxBias, ryBias,
 * strokeBias, wobble, bend, ripple, detune. */
export const V = [[0.7237,0.7307,-0.3991,0.0116,-0.0002,0.0009,0.027,-0.3706,0.0281,0.00375],[1.0192,0.5842,0.4077,0.0037,0.0062,-0.0004,0.0226,0.3089,0.024,0.0008],[1.1722,0.7016,0.1389,0.0042,0.0029,-0.001,0.0303,-0.6917,0.0221,-0.00391],[0.8725,0.98,0.3658,0.0058,-0.0028,0.0042,0.0414,0.2463,0.0151,-0.00326],[1.2806,0.9557,-0.3759,0.0139,0.0102,-0.0012,0.0256,0.2078,0.0251,0.00134],[1.2645,0.0424,0.0851,-0.0083,0.0187,0.0032,0.0351,-0.6203,0.0121,-0.00084],[0.942,0.3073,-0.0962,0.0049,-0.0184,0.0035,0.0104,0.2739,0.0263,0.00057],[1.2341,0.4756,-0.1796,-0.003,0.0176,-0.0003,0.0367,0.4726,0.0339,0.00044],[0.9237,0.7843,0.0754,0.0021,-0.0059,-0.0044,0.0394,-0.4197,0.0291,-0.00366],[1.069,0.0792,0.1749,-0.0043,0.0024,0.0007,0.0153,-0.6561,0.0319,-0.00344],[0.7217,0.1713,0.2276,-0.0127,0.0111,-0.0019,0.0384,0.2065,0.0169,-0.00082],[1.0174,0.325,-0.0631,0.0138,-0.0187,-0.0021,0.034,0.108,0.0108,0.00313],[0.7205,0.1667,0.3323,0.0121,0.0046,0.0031,0.0382,0.3664,0.034,0.00078],[0.7577,0.1219,-0.3456,-0.0152,-0.0049,-0.0044,0.0382,-0.4138,0.0249,0.00029],[1.1684,0.4648,0.0236,0.0003,-0.0041,-0.0023,0.0407,-0.2021,0.0111,-0.0],[1.2087,0.0063,-0.2709,0.0097,-0.0026,-0.004,0.0421,-0.1501,0.0217,0.00118],[0.7689,0.0899,0.2847,0.0166,-0.0142,-0.0043,0.0351,0.2979,0.019,-0.00258],[0.7923,0.7693,0.0012,0.0152,-0.0035,-0.0019,0.0407,-0.572,0.0273,0.00396],[1.1495,0.343,0.0853,-0.0023,-0.0183,-0.0035,0.0398,0.5534,0.03,0.00166],[1.2814,0.4334,0.1369,-0.0009,0.0057,0.0007,0.0282,-0.2123,0.0377,0.00022],[0.8743,0.1071,0.1156,-0.0147,0.0192,-0.0028,0.0089,0.1275,0.0361,-0.00091],[0.9194,0.7125,0.0506,0.0164,0.0114,-0.0001,0.033,-0.3885,0.0338,-0.00099],[1.0166,0.4436,0.24,-0.0101,-0.0139,0.0032,0.0231,0.4711,0.0266,0.00211],[1.1975,0.1313,-0.0224,0.0084,-0.0176,-0.0031,0.0394,-0.5986,0.0155,0.00194],[0.7426,0.1444,-0.2729,-0.014,-0.017,-0.0027,0.0219,0.4507,0.0137,-0.00174],[1.0399,0.2432,-0.181,-0.0129,-0.003,0.0007,0.0398,0.6677,0.0105,-0.00264],[0.7996,0.7696,-0.1269,-0.0019,0.0166,-0.0007,0.0368,0.3914,0.0154,0.00362],[0.8206,0.5122,-0.132,-0.0151,0.0155,0.0039,0.0347,0.2238,0.0123,-0.00385],[1.0028,0.9323,-0.0579,0.0056,-0.0186,0.0015,0.0347,-0.1342,0.0379,0.00208],[1.0859,0.9784,0.2028,0.0099,0.0076,-0.0036,0.0116,0.2864,0.0159,-0.00256],[1.2558,0.1919,-0.0227,0.0013,-0.0001,-0.0008,0.0374,-0.4276,0.0152,0.00021],[0.9201,0.6152,-0.2483,-0.0015,0.0093,0.0034,0.0416,-0.5127,0.0265,0.0014],[1.2535,0.9453,-0.1647,-0.0004,-0.0189,-0.0023,0.0092,-0.4406,0.0146,-0.00356]];

/* Thresholds only: shape, width, height, tilt, perspective, yOffset. */
export const PORTALS = [["ellipse",0.185,0.275,-0.035,0.025,0.0],["arch",0.18,0.29,0.018,-0.018,0.006],["rounded",0.195,0.265,-0.018,0.012,-0.004],["circle",0.205,0.205,0,0.0,0.0],["hex",0.195,0.275,0.025,-0.02,0.005],["tall-arch",0.175,0.305,-0.022,0.028,-0.005],["octagon",0.19,0.275,0.015,-0.012,0.003],["wide-arch",0.205,0.255,-0.012,0.018,0.0],["rect",0.195,0.27,0.008,0.0,0.004],["diamond",0.19,0.27,0.04,-0.018,-0.002],["gateway",0.205,0.285,-0.018,0.022,0.0]];

export const familyOf = n => n <= 11 ? 'Thresholds' : n <= 22 ? 'Signals' : 'Names';
export const modeOf = n => n <= 11 ? 'portal' : n <= 22 ? 'iris' : 'passage';
export const pad = n => String(n).padStart(n <= RELEASED_SUPPLY ? 2 : 4, '0');
export const filenameOf = n => `${pad(n)}-proof-of-free-${SLUGS[n - 1]}.html`;

/* Mirrors the engine's released-edition derivation exactly. */
export function metaFor(n) {
  if (!Number.isInteger(n) || n < 1 || n > RELEASED_SUPPLY) {
    throw new Error(`metaFor covers editions 1-${RELEASED_SUPPLY}, got ${n}`);
  }
  const i = n - 1;
  const [speed, phaseOffset, rotation, rxBias, ryBias, strokeBias, wobble, bend, ripple, detune] = V[i];
  const meta = {
    number: n,
    title: TITLES[i],
    slug: SLUGS[i],
    filename: filenameOf(n),
    family: familyOf(n),
    mode: modeOf(n),
    seed: 330000 + 7919 * n,
    palette: PALETTES[i % 5],
    paletteIndex: i % 5,
    accentIndex: n % 3 === 0 ? 3 : 2,
    particleCount: 28 + (7 * n) % 31,
    spokes: 7 + (5 * n) % 18,
    speed, phaseOffset, rotation,
    direction: n % 2 ? -1 : 1,
    rxBias, ryBias, strokeBias, wobble, bend, ripple, detune,
    lobes: 3 + n % 7,
    blades: 6 + n % 7,
    rings: 11 + n % 12,
    baseHz: +(110 * Math.pow(2, (n % 12) / 12)).toFixed(3),
    interval: [1.25, 1.3333, 1.5, 1.6, 1.75][n % 5]
  };
  if (n <= 11) {
    const keys = ['portalShape', 'portalWidth', 'portalHeight', 'portalTilt', 'portalPerspective', 'portalYOffset'];
    keys.forEach((k, j) => { meta[k] = PORTALS[i][j]; });
  }
  return meta;
}

export const allMeta = () => Array.from({ length: RELEASED_SUPPLY }, (_, i) => metaFor(i + 1));
