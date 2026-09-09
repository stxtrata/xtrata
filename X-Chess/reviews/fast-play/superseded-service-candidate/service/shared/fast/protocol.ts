// Fast Play is a separate, versioned protocol. Existing chain replay is untouched.
import { Position, WHITE, KING } from '../chess/engine.js';
import type { Result } from '../chess/engine.js';
import { sha256Hex, bytesToHex, hexToBytes } from '../protocol/sha256.js';

export const FAST_PROTOCOL = 'xchess-fast-v1';
export const FAST_RULES = 'engine-v1+flag-bare-king-draw-v1';
export const MAX_EVENTS = 2048;
export const MAX_ARCHIVE_BYTES = 2_000_000;
export type Side = 'white' | 'black';
export const other = (side: Side): Side => side === 'white' ? 'black' : 'white';
export function insist(ok: unknown, message: string): asserts ok { if (!ok) throw Error(message); }
export function integer(value: unknown, min: number, max: number): value is number {
  return Number.isSafeInteger(value) && Number(value) >= min && Number(value) <= max;
}
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') {
    insist(Object.getPrototypeOf(value) === Object.prototype, 'Expected plain record');
    const row = value as Record<string, unknown>;
    return '{' + Object.keys(row).sort().map(k => JSON.stringify(k) + ':' + canonical(row[k])).join(',') + '}';
  }
  insist(value === null || ['string', 'boolean', 'number'].includes(typeof value), 'Invalid canonical value');
  if (typeof value === 'number') insist(Number.isSafeInteger(value), 'Expected integer');
  return JSON.stringify(value);
}
export const digest = (value: unknown): string => sha256Hex(canonical(value));
export function exact(actual: unknown, expected: unknown, message: string): void {
  insist(canonical(actual) === canonical(expected), message);
}
const bytes = (hex: string): Uint8Array<ArrayBuffer> => new Uint8Array(hexToBytes(hex));
const encoded = (value: unknown): Uint8Array<ArrayBuffer> => new TextEncoder().encode(canonical(value));
export function publicKeyValid(key: unknown): key is string {
  return typeof key === 'string' && /^04[0-9a-f]{128}$/.test(key);
}
export interface Key { public: string; secret: CryptoKey }
export async function generateKey(): Promise<Key> {
  insist(globalThis.crypto?.subtle, 'Quick Play needs browser cryptography (HTTPS or a trusted local file).');
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  return { public: bytesToHex(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))), secret: pair.privateKey };
}
export interface Signed<T> { payload: T; signature: string }
export async function sign<T>(payload: T, key: CryptoKey): Promise<Signed<T>> {
  return { payload, signature: bytesToHex(new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, encoded(payload)))) };
}
export async function verify<T>(envelope: Signed<T>, publicKey: string): Promise<void> {
  insist(publicKeyValid(publicKey), 'Invalid game public key');
  insist(envelope && typeof envelope.signature === 'string' && /^[0-9a-f]{128}$/.test(envelope.signature), 'Invalid signature encoding');
  exact(Object.keys(envelope).sort(), ['payload', 'signature'], 'Unknown signed fields');
  const key = await crypto.subtle.importKey('raw', bytes(publicKey), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
  insist(await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, bytes(envelope.signature), encoded(envelope.payload)), 'Signature verification failed');
}
export interface Opening {
  protocol: typeof FAST_PROTOCOL; rules: typeof FAST_RULES;
  network: 'mainnet' | 'testnet' | 'devnet'; registry: string; game: number;
  white: string; black: string; whiteKey: string; blackKey: string; referee: string;
  baseMs: number; incrementMs: number; joinedHeight: number;
}
export function checkOpening(o: Opening): void {
  insist(o && o.protocol === FAST_PROTOCOL && o.rules === FAST_RULES, 'Unknown Fast Play rules');
  insist(['mainnet', 'testnet', 'devnet'].includes(o.network), 'Unknown network');
  insist(/^S[0-9A-Z]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(o.registry), 'Invalid registry');
  insist(integer(o.game, 1, Number.MAX_SAFE_INTEGER) && integer(o.joinedHeight, 1, Number.MAX_SAFE_INTEGER), 'Invalid game identity');
  insist(/^S[0-9A-Z]{20,41}$/.test(o.white) && /^S[0-9A-Z]{20,41}$/.test(o.black) && o.white !== o.black, 'Distinct wallet opponents required');
  insist(publicKeyValid(o.whiteKey) && publicKeyValid(o.blackKey) && publicKeyValid(o.referee), 'Invalid game keys');
  insist(o.whiteKey !== o.blackKey && o.whiteKey !== o.referee && o.blackKey !== o.referee, 'Distinct signing keys required');
  insist(integer(o.baseMs, 0, 86_400_000) && (o.baseMs === 0 || o.baseMs >= 60_000), 'Invalid base time');
  insist(integer(o.incrementMs, 0, 60_000) && (o.baseMs !== 0 || o.incrementMs === 0), 'Invalid increment');
  exact(Object.keys(o).sort(), ['protocol','rules','network','registry','game','white','black','whiteKey','blackKey','referee','baseMs','incrementMs','joinedHeight'].sort(), 'Unknown opening fields');
}
export interface Ready { type: 'ready'; match: string; side: Side }
export interface Start { type: 'start'; match: string; ready: [Signed<Ready>, Signed<Ready>]; at: 0 }
export type ActionKind = 'move' | 'resign' | 'offer-draw' | 'accept-draw';
export interface Intent { type: 'action'; match: string; seq: number; prev: string; side: Side; kind: ActionKind; move: string }
export interface Receipt { type: 'receipt'; match: string; seq: number; prev: string; intent: string; at: number; whiteMs: number; blackMs: number; fen: string }
export interface Event { intent: Signed<Intent>; receipt: Signed<Receipt> }
export interface Ending { type: 'end'; match: string; seq: number; root: string; fen: string; at: number; result: Result | '*'; reason: string }
export interface Archive { format: 'xchess-fast-archive-v1'; opening: Opening; start: Signed<Start>; events: Event[]; end: Signed<Ending> | null }
export interface State { opening: Opening; match: string; root: string; seq: number; position: Position; at: number; whiteMs: number; blackMs: number; offer: Side | null; result: Result | null; reason: string | null }
export const turn = (s: State): Side => s.position.turn === WHITE ? 'white' : 'black';
export const playerKey = (o: Opening, side: Side): string => o[side === 'white' ? 'whiteKey' : 'blackKey'];
export async function startState(opening: Opening, started: Signed<Start>): Promise<State> {
  checkOpening(opening);
  const match = digest(opening);
  insist(Array.isArray(started?.payload?.ready) && started.payload.ready.length === 2, 'Both players must be ready');
  for (const [i, side] of (['white', 'black'] as Side[]).entries()) {
    const ready = started.payload.ready[i];
    exact(ready.payload, { type: 'ready', match, side }, 'Wrong readiness commitment');
    await verify(ready, playerKey(opening, side));
  }
  exact(started.payload, { type: 'start', match, ready: started.payload.ready, at: 0 }, 'Invalid start');
  await verify(started, opening.referee);
  return { opening, match, root: digest(started.payload), seq: 0, position: new Position(), at: 0,
    whiteMs: opening.baseMs, blackMs: opening.baseMs, offer: null, result: null, reason: null };
}
export function intentFor(s: State, side: Side, kind: ActionKind, move = ''): Intent {
  return { type: 'action', match: s.match, seq: s.seq + 1, prev: s.root, side, kind, move };
}
export function flagged(s: State, at: number): boolean {
  return s.opening.baseMs > 0 && at - s.at >= s[turn(s) === 'white' ? 'whiteMs' : 'blackMs'];
}
export function flagResult(s: State): Result {
  // Explicit X Chess clock rule, not a claim to reproduce FIDE timeout rulings.
  const winner = other(turn(s));
  const hasPiece = s.position.squares().some(sq => sq.piece && sq.piece.type !== KING && (sq.piece.color === WHITE ? 'white' : 'black') === winner);
  return !hasPiece ? '1/2-1/2' : winner === 'white' ? '1-0' : '0-1';
}
// Mutates only after the intent is authenticated and all action checks pass.
// Call on a freshly replayed state when handling untrusted requests.
export async function acceptIntent(s: State, intent: Signed<Intent>, at: number): Promise<Receipt> {
  insist(s.seq < MAX_EVENTS && !s.result, 'Game has ended');
  insist(integer(at, s.at, Number.MAX_SAFE_INTEGER) && !flagged(s, at), 'Clock expired or invalid time');
  const p = intent?.payload;
  insist(p && ['white','black'].includes(p.side) && ['move','resign','offer-draw','accept-draw'].includes(p.kind), 'Invalid action');
  exact(p, intentFor(s, p.side, p.kind, p.move), 'Stale or wrong-game action');
  insist(typeof p.move === 'string' && (p.kind === 'move' ? /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(p.move) : p.move === ''), 'Invalid move encoding');
  await verify(intent, playerKey(s.opening, p.side));
  const running = turn(s);
  if (p.kind === 'move') {
    insist(p.side === running, 'It is the other player’s turn');
    insist(s.position.applyUci(p.move), 'Illegal move');
    s.offer = null;
    const outcome = s.position.outcome();
    if (outcome) { s.result = outcome.result; s.reason = outcome.termination; }
  } else if (p.kind === 'resign') {
    s.result = p.side === 'white' ? '0-1' : '1-0'; s.reason = 'resignation';
  } else if (p.kind === 'offer-draw') {
    insist(p.side === running && s.offer === null, 'Draw offer unavailable'); s.offer = p.side;
  } else {
    insist(s.offer === other(p.side), 'No opponent draw offer'); s.result = '1/2-1/2'; s.reason = 'agreed-draw';
  }
  if (s.opening.baseMs) {
    const key = running === 'white' ? 'whiteMs' : 'blackMs';
    s[key] -= at - s.at;
    if (p.kind === 'move') s[key] += s.opening.incrementMs;
  }
  return { type: 'receipt', match: s.match, seq: s.seq + 1, prev: s.root, intent: digest(p), at,
    whiteMs: s.whiteMs, blackMs: s.blackMs, fen: s.position.fen() };
}
export async function applyEvent(s: State, event: Event): Promise<void> {
  await verify(event.receipt, s.opening.referee);
  const receipt = await acceptIntent(s, event.intent, event.receipt.payload.at);
  exact(event.receipt.payload, receipt, 'Receipt does not match legal history or clock');
  s.root = digest(receipt); s.seq = receipt.seq; s.at = receipt.at;
}
export function endingFor(s: State, at: number, interruption = false): Ending {
  insist(integer(at, s.at, Number.MAX_SAFE_INTEGER), 'Invalid ending time');
  let result: Result | '*' = s.result ?? '*';
  let reason = s.reason ?? '';
  if (!s.result) {
    if (interruption) { result = '*'; reason = 'service-interrupted'; }
    else if (flagged(s, at)) { result = flagResult(s); reason = 'timeout'; }
    else if (s.seq === MAX_EVENTS) { result = '1/2-1/2'; reason = 'event-limit-draw'; }
    else throw Error('Game has not ended');
  }
  return { type: 'end', match: s.match, seq: s.seq, root: s.root, fen: s.position.fen(), at, result, reason };
}
export async function verifyArchive(archive: Archive, trustedOpening?: Opening): Promise<State> {
  insist(archive?.format === 'xchess-fast-archive-v1' && Array.isArray(archive.events) && archive.events.length <= MAX_EVENTS, 'Invalid archive');
  exact(Object.keys(archive).sort(), ['format','opening','start','events','end'].sort(), 'Unknown archive fields');
  if (trustedOpening) exact(archive.opening, trustedOpening, 'Archive does not match confirmed registry');
  const state = await startState(archive.opening, archive.start);
  for (const event of archive.events) {
    exact(Object.keys(event).sort(), ['intent','receipt'], 'Unknown event fields');
    await applyEvent(state, event);
  }
  if (archive.end) {
    await verify(archive.end, archive.opening.referee);
    exact(archive.end.payload, endingFor(state, archive.end.payload.at, archive.end.payload.reason === 'service-interrupted'), 'Invalid game ending');
  }
  return state;
}
export function parseArchive(text: string): Archive {
  insist(new TextEncoder().encode(text).length <= MAX_ARCHIVE_BYTES, 'Archive too large');
  // Depth limit before canonical recursion prevents stack exhaustion on malicious files.
  let depth = 0, string = false, escaped = false;
  for (const c of text) {
    if (string) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') string = false; }
    else if (c === '"') string = true;
    else if (c === '{' || c === '[') { insist(++depth <= 20, 'Archive nesting too deep'); }
    else if (c === '}' || c === ']') depth--;
  }
  return JSON.parse(text) as Archive;
}
