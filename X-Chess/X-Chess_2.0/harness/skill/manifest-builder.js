// X-CHESS-SKILL/1  tournament-manifest-builder
//
// Derives which games form a tournament, and who played them, from the chain.
//
// A manifest is worth exactly as much as whatever produced it. Produced on one
// machine, a tournament's identity rests on trusting that machine. Produced by
// this, anybody can run it against the same public chain and get the same
// answer — and a manifest that disagrees with what this produces is wrong.
//
// EVERY INPUT IS PUBLIC. Entrants are names and wallet addresses, and an address
// is already on chain as the sender of every move it signed. Nothing secret goes
// in, so nobody's answer should differ from anybody else's.
//
// FROM THE RULES HASH, NEVER FROM A SCHEDULE. A game commits a hash of its
// rules and those rules name both players, so a pairing is recoverable exactly.
// Schedule order is not id order — three games open at once and whichever
// transaction lands first takes the lower id — and reading a tournament by
// schedule once put two games the wrong way round, losing two real results from
// a table that looked complete.
//
// deriveManifest({ name, format, contract, engine, entrants, source }) where
// source supplies gameCount() and rulesHashOf(id). Returns the tournament;
// asManifest() renders the bytes to inscribe.
var RULES_PROTOCOL = "rules-v1";
var REPLAY_PROTOCOL = "replay-v1";
var REPLAY_PROTOCOL_V2 = "replay-v2";
var EVENTS_PROTOCOL = "events-v1";

// packages/protocol/sha256.ts
var K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var rotr = (x, n) => x >>> n | x << 32 - n;
function sha256(input) {
  const h = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const bitLength = input.length * 8;
  const padded = new Uint8Array(input.length + 9 + 63 >> 6 << 6);
  padded.set(input);
  padded[input.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296), false);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
      w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = e & f ^ ~e & g;
      const temp1 = hh + S1 + ch + K[i] + w[i] >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const temp2 = S0 + maj >>> 0;
      hh = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    h[0] = h[0] + a >>> 0;
    h[1] = h[1] + b >>> 0;
    h[2] = h[2] + c >>> 0;
    h[3] = h[3] + d >>> 0;
    h[4] = h[4] + e >>> 0;
    h[5] = h[5] + f >>> 0;
    h[6] = h[6] + g >>> 0;
    h[7] = h[7] + hh >>> 0;
  }
  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) outView.setUint32(i * 4, h[i], false);
  return out;
}
function bytesToHex(bytes) {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

// packages/protocol/canonical.ts
var PRINCIPAL_PATTERN = /^S[0-9A-HJKMNP-TV-Z]{5,}$/;
var ANYONE = "anyone";
var ANYONE_ELSE = "anyone-else";
var FIRST_MOVER = "first-mover";
var FEN_PATTERN = /^[a-zA-Z0-9/ -]+$/;
var PROTOCOL_PATTERN = /^[a-z0-9-]+$/;
var CanonicalError = class extends Error {
  field;
  constructor(field, message) {
    super(`${field}: ${message}`);
    this.field = field;
    this.name = "CanonicalError";
  }
};
function checkSide(field, value) {
  if (value === ANYONE || value === ANYONE_ELSE || value === FIRST_MOVER) return value;
  if (PRINCIPAL_PATTERN.test(value)) return value;
  throw new CanonicalError(
    field,
    `"${value}" is not a Stacks principal, nor "${ANYONE}", "${ANYONE_ELSE}" or "${FIRST_MOVER}". A BNS name must be resolved to an address before it is hashed.`
  );
}
function checkProtocol(field, value) {
  if (!PROTOCOL_PATTERN.test(value)) {
    throw new CanonicalError(field, `"${value}" is not a protocol identifier`);
  }
  return value;
}
function checkCount(field, value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CanonicalError(field, `${value} is not a whole number of moves`);
  }
  return String(value);
}
var flag = (value) => value ? "1" : "0";
function canonicalRules(rules) {
  const fields = [
    RULES_PROTOCOL,
    checkProtocol("replayProtocol", rules.replayProtocol ?? REPLAY_PROTOCOL),
    checkProtocol("eventsProtocol", rules.eventsProtocol ?? EVENTS_PROTOCOL),
    checkSide("white", rules.white),
    checkSide("black", rules.black)
  ];
  const allow = [...rules.allow];
  for (const entry of allow) {
    if (!PRINCIPAL_PATTERN.test(entry)) {
      throw new CanonicalError("allow", `"${entry}" is not a Stacks principal`);
    }
  }
  const sorted = [...new Set(allow)].sort();
  if (sorted.length !== allow.length) {
    throw new CanonicalError("allow", "contains a duplicate");
  }
  fields.push(sorted.join(","));
  fields.push(checkCount("cooldown", rules.cooldown));
  fields.push(flag(rules.noConsecutive));
  fields.push(flag(rules.ranked));
  if (!FEN_PATTERN.test(rules.startFen)) {
    throw new CanonicalError("startFen", "contains a character that is not part of FEN");
  }
  fields.push(rules.startFen);
  return fields.join("\n");
}
function canonicalBytes(rules) {
  return new TextEncoder().encode(canonicalRules(rules));
}
function rulesHash(rules) {
  return bytesToHex(sha256(canonicalBytes(rules)));
}

// packages/chess/board.ts
var KNIGHT = 2;
var BISHOP = 3;
var ROOK = 4;
var QUEEN = 5;
var KING = 6;
var CASTLE_WK = 1;
var CASTLE_WQ = 2;
var CASTLE_BK = 4;
var CASTLE_BQ = 8;
var KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33];
var BISHOP_OFFSETS = [-17, -15, 15, 17];
var ROOK_OFFSETS = [-16, -1, 1, 16];
var KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17];
var OFFSETS = {
  [KNIGHT]: KNIGHT_OFFSETS,
  [BISHOP]: BISHOP_OFFSETS,
  [ROOK]: ROOK_OFFSETS,
  [QUEEN]: KING_OFFSETS,
  [KING]: KING_OFFSETS
};
var SLIDING = {
  [BISHOP]: true,
  [ROOK]: true,
  [QUEEN]: true
};
var CASTLE_MASK = (() => {
  const mask = new Uint8Array(128).fill(15);
  mask[112] &= ~CASTLE_WQ;
  mask[116] &= ~(CASTLE_WK | CASTLE_WQ);
  mask[119] &= ~CASTLE_WK;
  mask[0] &= ~CASTLE_BQ;
  mask[4] &= ~(CASTLE_BK | CASTLE_BQ);
  mask[7] &= ~CASTLE_BK;
  return mask;
})();

// packages/chess/fen.ts
var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// packages/protocol/rules.ts
var DEFAULT_RULES = {
  replayProtocol: REPLAY_PROTOCOL,
  eventsProtocol: EVENTS_PROTOCOL,
  white: ANYONE,
  black: ANYONE,
  allow: [],
  cooldown: 0,
  noConsecutive: false,
  ranked: false,
  startFen: START_FEN
};
function normaliseRules(input) {
  const source = input && typeof input === "object" ? input : {};
  const side = (value) => {
    if (typeof value !== "string") return ANYONE;
    const trimmed = value.trim();
    if (trimmed === "") return ANYONE;
    const lowered = trimmed.toLowerCase();
    if (lowered === ANYONE) return ANYONE;
    if (lowered === ANYONE_ELSE) return ANYONE_ELSE;
    if (lowered === FIRST_MOVER) return FIRST_MOVER;
    return trimmed.toUpperCase();
  };
  const allow = Array.isArray(source.allow) ? [...new Set(source.allow.map((v) => String(v).trim().toUpperCase()).filter(Boolean))].sort() : [];
  const rawCooldown = Number(source.cooldown);
  const cooldown = Number.isFinite(rawCooldown) ? Math.max(0, Math.floor(rawCooldown)) : 0;
  const text = (value, fallback) => typeof value === "string" && value.trim() ? value.trim() : fallback;
  const white = side(source.white);
  const black = side(source.black);
  return {
    // DERIVED FROM THE SIDES, not taken from the source.
    //
    // A game that uses `first-mover` is played under replay-v2 whatever it was
    // handed, because the keyword IS the difference between the two protocols.
    // Letting a caller pass v1 alongside it would produce a rule set that hashes
    // to a commitment no board could honour: v1 boards would read the keyword as
    // a principal nobody holds and skip every move.
    replayProtocol: white === FIRST_MOVER || black === FIRST_MOVER ? REPLAY_PROTOCOL_V2 : text(source.replayProtocol, REPLAY_PROTOCOL),
    eventsProtocol: text(source.eventsProtocol, EVENTS_PROTOCOL),
    white,
    black,
    allow,
    cooldown,
    noConsecutive: source.noConsecutive === true,
    ranked: source.ranked === true,
    startFen: text(source.startFen, START_FEN)
  };
}

// packages/protocol/manifest-builder.ts
async function deriveManifest(request) {
  const { entrants, source, perRound = 3 } = request;
  if (entrants.length < 2) throw new Error("a tournament needs at least two entrants");
  for (const entrant of entrants) {
    if (!entrant?.name || !entrant?.address) {
      throw new Error("every entrant needs a name and an address");
    }
  }
  const byHash = /* @__PURE__ */ new Map();
  for (const white of entrants) {
    for (const black of entrants) {
      if (white.name === black.name) continue;
      const rules = normaliseRules({
        ...DEFAULT_RULES,
        white: white.address,
        black: black.address,
        ranked: true
      });
      byHash.set(rulesHash(rules), { white: white.name, black: black.name });
    }
  }
  const count = await source.gameCount();
  const games = [];
  for (let id = 1; id <= count; id++) {
    const hash = await source.rulesHashOf(id);
    const pairing = hash ? byHash.get(hash) : null;
    if (pairing) games.push({ id, ...pairing, round: 0 });
  }
  games.sort((a, b) => a.id - b.id);
  for (const [at, game] of games.entries()) game.round = Math.floor(at / perRound) + 1;
  return {
    name: request.name,
    format: request.format,
    contract: request.contract,
    ...request.engine === void 0 ? {} : { engine: request.engine },
    entrants,
    games
  };
}
function asManifest(tournament, header = "X-CHESS-TOURNAMENT/1") {
  return `${header}
${JSON.stringify(tournament, null, 2)}
`;
}
export {
  asManifest,
  deriveManifest
};
