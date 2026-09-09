// Design experiment only: trusted opening fixture, Node keys, no wallet/chain/server.
import { createHash, generateKeyPairSync, sign, verify } from 'node:crypto';

export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  if (typeof value === 'number' && !Number.isSafeInteger(value)) throw Error('integer required');
  if (!['string', 'number', 'boolean'].includes(typeof value) && value !== null) throw Error('unsupported value');
  return JSON.stringify(value);
}
export const hash = value => createHash('sha256').update(canonical(value)).digest('hex');
export const keypair = () => generateKeyPairSync('ed25519');
export const publicText = key => key.export({ type: 'spki', format: 'pem' });
export const signed = (value, key) => ({ value, signature: sign(null, Buffer.from(canonical(value)), key).toString('hex') });
const check = (condition, message) => { if (!condition) throw Error(message); };
function authenticate(envelope, key) {
  check(verify(null, Buffer.from(canonical(envelope.value)), key, Buffer.from(envelope.signature, 'hex')), 'bad signature');
}

export function fixture() {
  const white = keypair(), black = keypair(), referee = keypair();
  return {
    keys: { white, black, referee },
    opening: {
      protocol: 'xchess-fast-proof/0', network: 'simulated', registry: 'local-fixture', game: 1,
      nonce: 'test-match-1', rules: 'existing-engine-draw-policy', baseMs: 60000, incrementMs: 2000,
      white: publicText(white.publicKey), black: publicText(black.publicKey),
      referee: publicText(referee.publicKey)
    }
  };
}

export function start(opening, refereeKey) {
  return signed({ type: 'start', match: hash(opening), at: 0 }, refereeKey);
}

// All times are relative to an agreed referee start. Production must persist its
// authoritative clock and serialize concurrent requests before signing receipts.
export function replay(Position, opening, begun, events) {
  check(opening.protocol === 'xchess-fast-proof/0', 'protocol');
  check(Number.isSafeInteger(opening.baseMs) && opening.baseMs > 0, 'base time');
  check(Number.isSafeInteger(opening.incrementMs) && opening.incrementMs >= 0, 'increment');
  const match = hash(opening);
  authenticate(begun, opening.referee);
  check(canonical(begun.value) === canonical({ type: 'start', match, at: 0 }), 'start');
  const position = new Position();
  let root = hash(begun.value), at = 0;
  const clocks = { white: opening.baseMs, black: opening.baseMs };
  for (let i = 0; i < events.length; i++) {
    const { move, receipt } = events[i];
    const side = i % 2 ? 'black' : 'white';
    authenticate(move, opening[side]);
    check(canonical(move.value) === canonical({ type: 'move', match, seq: i + 1, prev: root, uci: move.value.uci }), 'move context');
    authenticate(receipt, opening.referee);
    const time = receipt.value.at;
    check(Number.isSafeInteger(time) && time >= at, 'clock order');
    const elapsed = time - at;
    check(elapsed < clocks[side], 'move arrived after flag');
    check(position.applyUci(move.value.uci), 'illegal move');
    clocks[side] += opening.incrementMs - elapsed;
    const expected = { type: 'receipt', match, seq: i + 1, prev: root, move: hash(move.value),
      at: time, clocks: { ...clocks }, fen: position.fen() };
    check(canonical(receipt.value) === canonical(expected), 'receipt mismatch');
    root = hash(receipt.value);
    at = time;
  }
  return { match, root, at, clocks, position, seq: events.length };
}

export function propose(state, uci, key) {
  return signed({ type: 'move', match: state.match, seq: state.seq + 1, prev: state.root, uci }, key);
}

export function receive(Position, opening, begun, events, move, time, refereeKey) {
  const state = replay(Position, opening, begun, events);
  const side = events.length % 2 ? 'black' : 'white';
  const clocks = { ...state.clocks, [side]: state.clocks[side] - (time - state.at) + opening.incrementMs };
  check(state.position.applyUci(move.value.uci), 'illegal move');
  const receipt = signed({ type: 'receipt', match: state.match, seq: state.seq + 1, prev: state.root,
    move: hash(move.value), at: time, clocks, fen: state.position.fen() }, refereeKey);
  const next = [...events, { move, receipt }];
  replay(Position, opening, begun, next); // No mutation or acceptance before complete validation.
  return next;
}

export function finish(state, reason, at, refereeKey) {
  return signed({ type: 'finish', match: state.match, seq: state.seq, root: state.root,
    fen: state.position.fen(), reason, at }, refereeKey);
}

export function verifyArchive(Position, trustedOpening, archive) {
  check(hash(archive.opening) === hash(trustedOpening), 'opening mismatch');
  const state = replay(Position, trustedOpening, archive.start, archive.events);
  authenticate(archive.finish, trustedOpening.referee);
  const end = archive.finish.value;
  check(canonical(end) === canonical({ type: 'finish', match: state.match, seq: state.seq,
    root: state.root, fen: state.position.fen(), reason: end.reason, at: end.at }), 'finish mismatch');
  check(Number.isSafeInteger(end.at) && end.at >= state.at, 'finish time');
  if (end.reason === 'checkmate') {
    const outcome = state.position.outcome();
    check(outcome?.termination === 'checkmate', 'not checkmate');
    return outcome;
  }
  check(end.reason === 'flag-fall', 'unsupported ending');
  check(!state.position.isGameOver(), 'already terminal');
  const side = state.seq % 2 ? 'black' : 'white';
  check(end.at - state.at >= state.clocks[side], 'premature flag');
  // A clock-proof experiment, NOT complete timeout adjudication: mating
  // possibility and timeout draw rules must be specified before production.
  return { termination: 'flag-fall', flagged: side, result: null };
}
