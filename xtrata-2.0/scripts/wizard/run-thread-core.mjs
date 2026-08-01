/**
 * run-thread-core.mjs — the autonomous thread runner, minus the terminal.
 *
 * inscribe.mjs mints one entry. A thread is six of them plus a manifest, and
 * each one has to cite the inscription id of the one before it — an id that does
 * not exist until the previous transaction confirms. Driving that by hand means
 * an operator sitting in front of an explorer for an hour, copying ids and
 * claims between commands, at every step able to paste the wrong one.
 *
 * This file drives it instead: broadcast, wait for a terminal transaction
 * status, read the minted id back out of the transaction result, read that
 * inscription's own bytes back off chain, quote its claim in the next entry,
 * repeat, then close with the manifest.
 *
 * It spends real STX with nobody watching, so almost all of it is about what
 * happens when something goes wrong:
 *
 *   - **A journal on disk, written before the broadcast, not after.** The
 *     dangerous crash is the one between signing and recording. A runner that
 *     forgets it broadcast will broadcast again, and the second mint is just as
 *     permanent and just as expensive as the first. So intent is written first,
 *     and a position that already carries a txid is never re-broadcast; it is
 *     polled.
 *
 *   - **Two independent pieces of evidence about an intent with no txid.** The
 *     content hash says whether the mint landed: the bytes are deterministic, so
 *     `get-id-by-hash` finds them if it did. The sender's nonce, recorded next
 *     to the intent, says whether it could have. They are asymmetric, and the
 *     asymmetry is the whole point:
 *
 *       - `last_executed_tx_nonce` **below** the intended nonce is proof of
 *         absence. That nonce has never confirmed, so neither did the mint, and
 *         the position can be re-composed cleanly.
 *       - `last_executed_tx_nonce` **at or above** it proves nothing. Some
 *         transaction spent that nonce, and it may have been an unrelated send
 *         from the same wallet. Only a hash hit proves this mint landed.
 *
 *     Before the nonce was recorded the runner could only halt, and that halt
 *     was permanent: an entry states the block it was written at, so a retry
 *     composes different bytes under a different hash, and the orphaned intent
 *     could never afterwards be matched or cleared.
 *
 *   - **A bounded wait before the halt.** When the wallet has something in the
 *     mempool at or above the intended nonce, the mint may be seconds from
 *     landing, so the runner waits a few minutes with a countdown before giving
 *     up, and names the nonce when it does. It never waits when the nonce has
 *     already proved the mint absent.
 *
 *   - **An operator decision of last resort.** `--resolve <n> landed:<id>` and
 *     `--resolve <n> abandoned` write a human's verdict into the journal with a
 *     timestamp, so a genuinely ambiguous position is closed rather than left
 *     ambiguous forever. Both check the chain first: `landed` refuses an id
 *     whose own front matter is not this thread, this position and this subject,
 *     and `abandoned` refuses a position the chain shows as confirmed.
 *
 *   - **Stop on the first failure. Never retry a broadcast.** Any terminal
 *     status other than success halts the run. There is no backoff, no second
 *     attempt, no "it was probably a fluke". A retry loop with a private key and
 *     a mempool is how you mint six copies of the same entry.
 *
 *   - **A timeout is not a failure.** A transaction that has not confirmed
 *     inside the window may still confirm. Reporting that as a failure invites
 *     the operator to re-send, which is the one thing that must not happen. The
 *     runner says so in as many words, and the journal keeps the txid.
 *
 *   - **A run-level spend cap**, across every remaining broadcast rather than
 *     per entry, checked before each one. A per-entry cap cannot see a loop.
 *
 *   - **The kill switch between every step**, not only at the start. A run takes
 *     an hour; the decision to stop it will not arrive at a convenient moment.
 *
 * Everything is injected: fetch, submit, the clock, sleep, journal read and
 * write, the kill-switch probe and the presenter. There is no terminal in this
 * file, no direct network call and no direct disk access, so the whole loop is
 * unit-testable including the crash cases, which is the only way anyone is ever
 * going to test the crash cases.
 *
 * This module composes nothing itself. Bodies come from compose.mjs and plans
 * from inscribe.mjs, unchanged: the bytes a thread mints must not depend on
 * whether a human or this loop drove the mint.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bufferCV, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';

import {
  CORE_ADDRESS,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  DEFAULT_SPEND_CAP_USTX,
  DEMO_THREAD_ID,
  WizardSafetyError,
  assertBroadcastAllowed,
  buildMintCall,
  callReadOnly,
  checkCorePaused,
  checkDuplicateContent,
  checkPendingNonce,
  checkThreadAffordability,
  expectedWizardAddresses,
  fetchChainTip,
  fetchStxBalance,
  groupDigits,
  killSwitchEngaged,
  microStxToStx,
  planInscription,
  quoteSingleTxFee,
  tokenUriFor,
  verifyParentQuote
} from './inscribe.mjs';
import { THREAD_LENGTH, citationFrom, composeThreadManifest, parseEntry } from './compose.mjs';
import { getPersona, getSubject, personaForPosition } from './personas.mjs';

export { DEFAULT_HIRO_URL, THREAD_LENGTH, WizardSafetyError, groupDigits, microStxToStx };

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Bumped when the on-disk journal shape changes *incompatibly*.
 *
 * Deliberately still 1 after the nonce fields were added. `intendedNonce` is
 * optional: a journal written before it existed loads unchanged and resolves an
 * orphaned intent the old way, by content hash alone. Bumping the version would
 * have halted every one of those journals over a field whose absence the runner
 * already knows how to handle.
 */
export const RUN_JOURNAL_VERSION = 1;

/**
 * The cap that matters for a loop. `DEFAULT_SPEND_CAP_USTX` bounds one mint;
 * this bounds the whole run, so a bug that plans seven affordable entries
 * instead of two still stops. Generous — a full seven-inscription thread at the
 * live schedule is about 287,000 microSTX — and finite, which is the point.
 */
export const DEFAULT_RUN_SPEND_CAP_USTX = 1_000_000n;

/**
 * How long to wait for one transaction. Stacks anchor blocks are roughly ten
 * minutes and a congested mempool is slower, so thirty minutes is patient
 * without being unbounded. Reaching it is not a failure; see `pollTransaction`.
 */
export const DEFAULT_CONFIRM_TIMEOUT_MS = 30 * 60_000;
export const DEFAULT_CONFIRM_POLL_MS = 20_000;

/**
 * How long to wait on an intent whose nonce is sitting in the mempool.
 *
 * Much shorter than the confirmation window, because this is not a transaction
 * being watched — it is a transaction whose id was lost, found again only by
 * hash. A few minutes covers "the node had it all along and the API was a block
 * behind"; past that, waiting adds nothing a later run would not also see, and
 * the run should say what it is waiting for and stop.
 */
export const DEFAULT_MEMPOOL_WAIT_MS = 3 * 60_000;
export const DEFAULT_MEMPOOL_POLL_MS = 15_000;

/** The journal key for the closing manifest. Deliberately not a number. */
export const MANIFEST_KEY = 'manifest';

/**
 * Journal statuses, and what a resumed run is allowed to do with each.
 *
 *   external      minted before this runner ever saw the thread. Read-only.
 *   broadcasting  intent written, outcome unknown. NEVER re-broadcast.
 *   broadcast     txid recorded, not yet terminal. Poll it.
 *   confirmed     success, inscription id known. Skip.
 *   failed        terminal non-success. Halt; a human decides what happens.
 *   timeout       polled past the window. The transaction may still land.
 *   abandoned     settled as never-minted, by the nonce or by an operator.
 *                 Composed again from scratch, which is safe precisely because
 *                 something proved the earlier attempt never landed.
 */
export const POSITION_STATUSES = [
  'external',
  'broadcasting',
  'broadcast',
  'confirmed',
  'failed',
  'timeout',
  'abandoned'
];

/** The two verdicts an operator can record by hand with `--resolve`. */
export const RESOLUTIONS = ['abandoned', 'landed'];

/**
 * Why a run stopped. Every one of these is a stop, never a retry.
 */
export const HALT_REASONS = [
  'kill-switch',
  'spend-cap',
  'safety',
  'tx-failed',
  'timeout',
  'unresolved',
  'predecessor',
  'journal',
  /**
   * A stage of the pipeline was verified against the chain and did not match
   * what the next stage is about to cite. Distinct from 'safety', which is a
   * refusal to broadcast THIS transaction: a gate failure means something
   * already on chain is not what the journal says it is, so the transaction
   * that would have been next is not the problem and retrying it is not the
   * fix.
   */
  'gate',
  /**
   * The generic mint leg failed for a reason the caller reported rather than
   * one this file classified. Kept separate from 'tx-failed' so a delegated
   * runner's own halt is not relabelled as a transaction outcome.
   */
  'failed'
];

/**
 * A halt. Distinct from WizardSafetyError because a halt can happen after money
 * has moved, and the report for it has to say so.
 */
export class RunHalt extends Error {
  constructor(reason, message, detail = {}) {
    super(message);
    this.name = 'RunHalt';
    if (!HALT_REASONS.includes(reason)) {
      throw new WizardSafetyError(`"${reason}" is not a known halt reason. Known: ${HALT_REASONS.join(', ')}`);
    }
    this.reason = reason;
    this.detail = detail;
  }
}

/* ------------------------------------------------------------------ */
/* small shared helpers                                                */
/* ------------------------------------------------------------------ */

const trimSlash = (url) => String(url).replace(/\/+$/, '');
const errorMessage = (error) => (error instanceof Error ? error.message : String(error));
const iso = (ms) => new Date(ms).toISOString();

/**
 * `(optional T)` unwrapped to the inner `{ type, value }`, or null for `none`.
 *
 * `get-chunk` returns a bare `(optional (buff ...))` — it is not wrapped in a
 * response, so there is no `(ok ...)` to peel first. Tolerate a response wrapper
 * anyway, because other reads here do have one and a helper that quietly does
 * the wrong thing on the wrong shape is worse than one that handles both.
 */
export function optionalValue(parsed) {
  const inner = typeof parsed?.type === 'string' && parsed.type.startsWith('(response') ? parsed.value : parsed;
  return inner && inner.value !== null && inner.value !== undefined ? inner.value : null;
}

/** Hiro wants `0x`-prefixed; broadcastTransaction returns bare hex. Normalise. */
export function normaliseTxid(txid) {
  const value = String(txid ?? '').trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(value)) {
    throw new WizardSafetyError(`"${txid}" is not a 32-byte transaction id`);
  }
  return `0x${value.toLowerCase()}`;
}

/**
 * Where the journal for a thread lives.
 *
 * A dry run gets its own file. The ids and txids a dry run invents are fake, and
 * a fake txid written into the real journal would be polled forever by the next
 * real run, or — far worse — would make a position look already-broadcast and be
 * skipped. The thread id comes from argv, so it is also validated here rather
 * than pasted into a path.
 */
export function journalPathFor({ dir = HERE, threadId, mode = 'broadcast' } = {}) {
  const id = String(threadId ?? '').trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    throw new WizardSafetyError(
      `"${id}" is not a usable thread id for a journal file name. Use letters, digits, dot, dash and ` +
        'underscore, starting with a letter or digit.'
    );
  }
  return join(dir, `.run-${id}${mode === 'dry' ? '.dry' : ''}.json`);
}

export function emptyJournal({ threadId, subject, threadLength = THREAD_LENGTH, mode = 'broadcast', startedAt }) {
  return {
    version: RUN_JOURNAL_VERSION,
    threadId,
    subject,
    threadLength,
    mode,
    startedAt,
    updatedAt: startedAt,
    positions: {}
  };
}

/**
 * A journal is written next to the scripts and read back by a later run. It must
 * never contain key material: it is not gitignored by accident but by one line,
 * and a leaked run journal should cost nothing.
 */
export function assertJournalSecretFree(journal, keys = []) {
  const text = JSON.stringify(journal ?? {});
  for (const key of keys) {
    const value = String(key ?? '').trim();
    if (value.length >= 32 && text.includes(value)) {
      throw new WizardSafetyError('refusing to write the run journal: it contains something that looks like a private key');
    }
  }
  return journal;
}

/* ------------------------------------------------------------------ */
/* transactions                                                        */
/* ------------------------------------------------------------------ */

/**
 * 'pending' means keep waiting; 'success' means it landed; everything else is
 * terminal and is a failure.
 *
 * The open-ended branch is deliberate. Hiro documents abort_by_response,
 * abort_by_post_condition, dropped_replace_by_fee, dropped_stale_garbage_collect
 * and several other dropped_* values, and the list has grown before. Treating an
 * unrecognised status as a failure stops the run and asks a human to look, which
 * is right. Treating it as pending would poll until the timeout and then say the
 * transaction might still land, which for a dropped transaction is false.
 */
export function classifyTxStatus(status) {
  const value = String(status ?? '').trim();
  if (value === 'pending' || value === '') return 'pending';
  if (value === 'success') return 'success';
  return 'failed';
}

/** One transaction lookup. A read. */
export async function fetchTransaction({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL, txid } = {}) {
  const id = normaliseTxid(txid);
  const response = await fetchImpl(`${trimSlash(hiroUrl)}/extended/v1/tx/${id}`);
  if (response.status === 404) {
    // Not an error. A transaction that has just been accepted into the mempool
    // is routinely not visible to the API for a few seconds.
    return { txid: id, known: false, txStatus: 'pending', result: null, blockHeight: null, feeRate: null };
  }
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`transaction lookup returned non-JSON content (HTTP ${response.status})`);
  }
  if (!response.ok) throw new Error(`transaction lookup returned HTTP ${response.status}`);
  return {
    txid: id,
    known: true,
    txStatus: String(body?.tx_status ?? ''),
    result: body?.tx_result ?? null,
    blockHeight: body?.block_height ?? null,
    feeRate: body?.fee_rate ?? null,
    raw: body
  };
}

/**
 * Poll one transaction until it reaches a terminal status or the window closes.
 *
 * A read failure is treated as pending, not as a verdict. The point of this
 * function is to decide whether a mint happened, and a broken lookup is not
 * evidence either way; reporting a network blip as a failure would halt a run
 * whose transaction was about to confirm.
 *
 * Returns `{ outcome: 'success' | 'failed' | 'timeout' }`. `timeout` is not a
 * failure and the caller must not present it as one.
 */
export async function pollTransaction({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  txid,
  now = () => Date.now(),
  sleep = async () => {},
  timeoutMs = DEFAULT_CONFIRM_TIMEOUT_MS,
  intervalMs = DEFAULT_CONFIRM_POLL_MS,
  onPoll = () => {},
  guard = () => {}
} = {}) {
  const id = normaliseTxid(txid);
  const started = now();
  let polls = 0;
  let lastError = null;
  let seen = null;

  for (;;) {
    // Between every poll, not only before the first: a run waiting on a
    // transaction is exactly when someone reaches for the kill switch.
    guard('poll');
    polls += 1;
    try {
      seen = await fetchTransaction({ fetchImpl, hiroUrl, txid: id });
      lastError = null;
    } catch (error) {
      lastError = errorMessage(error);
      seen = { txid: id, known: false, txStatus: 'pending', result: null, blockHeight: null, feeRate: null };
    }
    const verdict = classifyTxStatus(seen.txStatus);
    const elapsedMs = now() - started;
    onPoll({ poll: polls, elapsedMs, txStatus: seen.txStatus, known: seen.known, error: lastError });

    if (verdict !== 'pending') {
      return {
        outcome: verdict,
        txid: id,
        txStatus: seen.txStatus,
        result: seen.result,
        blockHeight: seen.blockHeight,
        feeRate: seen.feeRate,
        polls,
        elapsedMs,
        lastError
      };
    }
    if (elapsedMs >= timeoutMs) {
      return {
        outcome: 'timeout',
        txid: id,
        txStatus: seen.txStatus,
        result: null,
        blockHeight: null,
        feeRate: null,
        polls,
        elapsedMs,
        lastError
      };
    }
    await sleep(intervalMs);
  }
}

/**
 * The inscription id, out of a confirmed mint's own result.
 *
 * A successful mint returns `(ok (tuple (existed bool) (token-id uint)))`.
 * `existed` distinguishes a fresh mint from the core recognising bytes it
 * already holds, which matters because a duplicate means something re-ran and
 * the id being returned belongs to the earlier mint.
 *
 * Decodes the Clarity hex when the API supplies it, which is the authoritative
 * form, and falls back to the printed repr when it does not.
 */
export function parseMintResult(txResult) {
  const hex = typeof txResult?.hex === 'string' ? txResult.hex : null;
  const repr = typeof txResult?.repr === 'string' ? txResult.repr : null;

  if (hex) {
    const parsed = cvToJSON(hexToCV(hex));
    if (parsed?.success === false) {
      throw new WizardSafetyError(`the mint returned an error response: ${repr ?? JSON.stringify(parsed.value)}`);
    }
    const tuple = (parsed?.success === true ? parsed.value : parsed)?.value;
    const tokenId = tuple?.['token-id']?.value;
    const existed = tuple?.existed?.value;
    if (tokenId === undefined || tokenId === null) {
      throw new WizardSafetyError(`could not find token-id in the mint result: ${repr ?? hex}`);
    }
    return { inscriptionId: String(tokenId), existed: existed === true };
  }

  if (repr) {
    const tokenId = /\(token-id\s+u(\d+)\)/.exec(repr)?.[1];
    if (!tokenId) throw new WizardSafetyError(`could not find token-id in the mint result: ${repr}`);
    return { inscriptionId: String(tokenId), existed: /\(existed\s+true\)/.test(repr) };
  }

  throw new WizardSafetyError('the transaction reported success but carried no result to read the token-id from');
}

/* ------------------------------------------------------------------ */
/* reading the corpus back off chain                                   */
/* ------------------------------------------------------------------ */

/**
 * One inscription's body, from its own on-chain bytes.
 *
 * Wizard entries are always exactly one chunk, so chunk u0 is the whole thing.
 */
export async function readEntryFromChain({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  id
} = {}) {
  const parsed = await callReadOnly({
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-chunk',
    functionArgs: [uintCV(BigInt(id)), uintCV(0n)]
  });
  const chunk = optionalValue(parsed);
  if (chunk === null) return { id: String(id), found: false, body: null, entry: null };
  const body = Buffer.from(String(chunk.value).replace(/^0x/, ''), 'hex').toString('utf8');
  let entry = null;
  try {
    entry = parseEntry(body);
  } catch {
    // On chain but not a corpus entry. The caller decides what that means.
  }
  return { id: String(id), found: true, body, entry };
}

/** Has anything with these exact bytes been inscribed? Throws if it cannot tell. */
export async function lookupIdByHash({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  finalHashHex
} = {}) {
  const bytes = Buffer.from(String(finalHashHex).replace(/^0x/, ''), 'hex');
  const parsed = await callReadOnly({
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-id-by-hash',
    functionArgs: [bufferCV(new Uint8Array(bytes))]
  });
  const existing = optionalValue(parsed);
  return existing ? String(existing.value) : null;
}

/**
 * Load a thread member from chain and check it is the member it claims to be.
 *
 * Everything the manifest says about an entry — its block, its cost, its claim,
 * which wizard wrote it — is taken from the entry's own bytes rather than from
 * the journal, so a journal that has drifted cannot put a wrong number into a
 * permanent record. The thread and position assertions turn a mistyped id into a
 * refusal instead of a citation of the wrong inscription.
 */
export async function hydrateMember({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  id,
  position,
  threadId,
  subject = null,
  txid = null
} = {}) {
  const read = await readEntryFromChain({ fetchImpl, hiroUrl, senderAddress, id });
  if (!read.found) {
    throw new WizardSafetyError(
      `position ${position} of thread ${threadId} is recorded as inscription #${id}, but #${id} has no chunk u0 ` +
        'on chain. Nothing can cite an entry that is not there.'
    );
  }
  if (!read.entry?.claim) {
    throw new WizardSafetyError(
      `#${id} is on chain but is not a wizard corpus entry with a Claim section, so it cannot be position ` +
        `${position} of thread ${threadId}.`
    );
  }
  if (read.entry.thread !== threadId) {
    throw new WizardSafetyError(
      `#${id} belongs to thread "${read.entry.thread}", not "${threadId}". Check the id before anything cites it.`
    );
  }
  if (Number(read.entry.position) !== Number(position)) {
    throw new WizardSafetyError(
      `#${id} is position ${read.entry.position} of its thread, but it is recorded here as position ${position}.`
    );
  }
  if (subject && read.entry.subject && read.entry.subject !== getSubject(subject).id) {
    // A thread argues about one subject. Resuming with a different --subject
    // would compose entries answering a question the earlier ones never asked,
    // and the manifest can only name one subject for all of them.
    throw new WizardSafetyError(
      `#${id} is on subject "${read.entry.subject}", but this run is composing "${getSubject(subject).id}". ` +
        'A thread argues about one subject; check --subject before anything else is minted.'
    );
  }
  return {
    id: String(id),
    position: Number(position),
    wizard: read.entry.wizard,
    wizardName: read.entry.wizardName ?? read.entry.wizard,
    claim: read.entry.claim,
    block: read.entry.block,
    costMicroStx: read.entry.costUstx,
    txid,
    body: read.body,
    // What the next entry quotes. Taken from the parent's own bytes, never from
    // the copy this process composed: those are the same string only if
    // everything worked, and this is the check that they did.
    citation: citationFrom(read.body, id)
  };
}

/* ------------------------------------------------------------------ */
/* the crash window: what the nonce knows                              */
/* ------------------------------------------------------------------ */

/** "2m 45s", for a countdown a human is reading while they wait. */
export function formatDuration(ms) {
  const seconds = Math.max(0, Math.round(Number(ms) / 1000));
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${String(seconds % 60).padStart(2, '0')}s` : `${seconds}s`;
}

/**
 * The wallet's nonce state, including what it has in the mempool.
 *
 *   last_executed_tx_nonce   the highest nonce that has CONFIRMED
 *   possible_next_nonce      what the next transaction will be signed with
 *   last_mempool_tx_nonce    the highest nonce in flight, or null for nothing
 *   detected_mempool_nonces  every nonce in flight
 *   detected_missing_nonces  gaps: a nonce nothing has ever used
 *
 * `checkPendingNonce` in inscribe.mjs reads the same endpoint as an advisory
 * warning before a mint. This reads it as evidence after one, so it needs the
 * mempool arrays that check does not surface, and it must not throw: an
 * unreadable nonce is not evidence either way, and every caller treats "could
 * not read" as "the nonce says nothing", which is the behaviour that existed
 * before the nonce was recorded at all.
 */
export async function fetchSenderNonces({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL, address } = {}) {
  const base = {
    address: address ?? null,
    available: false,
    lastExecutedNonce: null,
    nextNonce: null,
    lastMempoolNonce: null,
    mempoolNonces: [],
    missingNonces: [],
    error: null
  };
  if (!address) return { ...base, error: 'no wallet address was recorded with the intent' };
  try {
    const response = await fetchImpl(`${trimSlash(hiroUrl)}/extended/v1/address/${address}/nonces`);
    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(`nonce lookup returned non-JSON content (HTTP ${response.status})`);
    }
    if (!response.ok) throw new Error(`nonce lookup returned HTTP ${response.status}`);
    const number = (value) => (value === null || value === undefined ? null : Number(value));
    const list = (value) =>
      Array.isArray(value) ? value.map(Number).filter((entry) => Number.isFinite(entry)) : [];
    return {
      ...base,
      available: true,
      lastExecutedNonce: number(body?.last_executed_tx_nonce),
      nextNonce: number(body?.possible_next_nonce),
      lastMempoolNonce: number(body?.last_mempool_tx_nonce),
      mempoolNonces: list(body?.detected_mempool_nonces),
      missingNonces: list(body?.detected_missing_nonces)
    };
  } catch (error) {
    return { ...base, error: errorMessage(error) };
  }
}

/**
 * The nonce the next transaction from this wallet will carry, or null.
 *
 * Null is a legitimate answer and never a refusal. A run that cannot read the
 * nonce is exactly as safe as every run before this field existed; it just
 * cannot be told later that its transaction never landed.
 */
export async function readIntendedNonce({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  address = null,
  fallback = null
} = {}) {
  if (!address) return fallback === null || fallback === undefined ? null : Number(fallback);
  const nonces = await fetchSenderNonces({ fetchImpl, hiroUrl, address });
  if (nonces.available && nonces.nextNonce !== null && Number.isFinite(nonces.nextNonce)) return nonces.nextNonce;
  return fallback === null || fallback === undefined || !Number.isFinite(Number(fallback)) ? null : Number(fallback);
}

/**
 * The parts of a stranded intent worth keeping once it has been closed.
 *
 * Kept as history on the position rather than deleted, so a journal can still
 * answer "what was composed here, at what nonce, and who decided it never
 * landed" long after the position has been minted by a later attempt.
 */
export function archiveIntent(stranded, { reason = null, note = null } = {}) {
  return {
    reason,
    note,
    status: stranded?.status ?? null,
    finalHashHex: stranded?.finalHashHex ?? null,
    intendedNonce: stranded?.intendedNonce ?? null,
    senderAddress: stranded?.senderAddress ?? null,
    txid: stranded?.txid ?? null,
    txStatus: stranded?.txStatus ?? null,
    blockHeight: stranded?.blockHeight ?? null,
    protocolFeeUstx: stranded?.protocolFeeUstx ?? null,
    minerFeeUstx: stranded?.minerFeeUstx ?? null,
    actualMinerFeeUstx: stranded?.actualMinerFeeUstx ?? null,
    broadcastAt: stranded?.broadcastAt ?? null
  };
}

/**
 * What the wallet's nonces say about an intent that has no transaction id.
 *
 * THE ASYMMETRY, which is the entire reason any of this is recorded:
 *
 *   A last-executed nonce BELOW the intended one proves ABSENCE. The mint was
 *   signed at that nonce; a nonce cannot confirm out of order; so if it has
 *   never confirmed, neither did the mint. Nothing landed and nothing can.
 *
 *   A last-executed nonce AT OR ABOVE the intended one proves NOTHING. It says
 *   some transaction consumed that nonce, and that transaction could just as
 *   easily have been an operator moving funds out of the same wallet, or a mint
 *   done by hand. Only the content hash can say this mint landed.
 *
 * So this function can return `absent` as a verdict but never `landed`, and the
 * caller must not read `consumed` as anything but "ask the chain".
 */
export function classifyIntentNonce({ intendedNonce = null, nonces = null } = {}) {
  const intended =
    intendedNonce === null || intendedNonce === undefined || !Number.isFinite(Number(intendedNonce))
      ? null
      : Number(intendedNonce);
  const detail = {
    intendedNonce: intended,
    lastExecutedNonce: nonces?.available ? nonces.lastExecutedNonce : null,
    pendingNonces: [],
    address: nonces?.address ?? null
  };

  if (intended === null) {
    return { ...detail, verdict: 'unknown', why: 'the intent was written before this runner recorded nonces' };
  }
  if (!nonces?.available) {
    return {
      ...detail,
      verdict: 'unknown',
      why: `the wallet's nonces could not be read${nonces?.error ? ` (${nonces.error})` : ''}`
    };
  }

  // Anything in flight at or above our nonce could still be our transaction, so
  // it is checked first: a mint in the mempool has not landed *yet*, which is
  // not the same as never, and must never be mistaken for proof of absence.
  const pendingNonces = [
    ...nonces.mempoolNonces,
    ...(nonces.lastMempoolNonce === null ? [] : [nonces.lastMempoolNonce])
  ]
    .filter((nonce) => nonce >= intended)
    .sort((left, right) => left - right)
    .filter((nonce, index, all) => all.indexOf(nonce) === index);
  if (pendingNonces.length > 0) {
    return {
      ...detail,
      pendingNonces,
      verdict: 'pending',
      why: `this wallet has nonce ${pendingNonces.join(', ')} in the mempool, at or above the ${intended} this entry was signed with`
    };
  }

  // A wallet that has executed nothing reads as -1, so nonce 0 is still unspent.
  const executed = nonces.lastExecutedNonce === null ? -1 : nonces.lastExecutedNonce;
  if (executed < intended) {
    return {
      ...detail,
      verdict: 'absent',
      why: `nonce ${intended} has never confirmed on this wallet (last executed ${executed < 0 ? 'none' : executed}), so this transaction did not land and cannot`
    };
  }
  return {
    ...detail,
    verdict: 'consumed',
    why: `nonce ${intended} has been consumed (last executed ${executed}), but by what is not knowable from the nonce alone`
  };
}

/**
 * A position whose intent was written but whose txid was not, resolved against
 * the chain: first by content hash, then by nonce, then by waiting.
 *
 * Returns one of
 *   { outcome: 'landed',    id, member }  the bytes are on chain. Adopt them.
 *   { outcome: 'absent',    nonce }       proved never minted. Compose again.
 *   { outcome: 'pending',   nonce }       still in the mempool after the wait.
 *   { outcome: 'ambiguous', nonce }       nothing proves anything. Halt.
 *
 * The hash is asked first and asked again throughout, because it is the only
 * positive proof available. The nonce only ever decides what a *missing* hash
 * means.
 */
export async function resolveIntent({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  record,
  position = null,
  threadId,
  subject = null,
  now = () => Date.now(),
  sleep = async () => {},
  say = () => {},
  guard = () => {},
  mempoolWaitMs = DEFAULT_MEMPOOL_WAIT_MS,
  mempoolPollMs = DEFAULT_MEMPOOL_POLL_MS
} = {}) {
  const landed = async () => {
    if (!record?.finalHashHex) return null;
    const id = await lookupIdByHash({ fetchImpl, hiroUrl, finalHashHex: record.finalHashHex });
    if (!id) return null;
    const member =
      position === null ? null : await hydrateMember({ fetchImpl, hiroUrl, id, position, threadId, subject });
    return { outcome: 'landed', id, member };
  };

  const first = await landed();
  if (first) return { ...first, nonce: null, waitedMs: 0 };

  const nonces = await fetchSenderNonces({ fetchImpl, hiroUrl, address: record?.senderAddress ?? null });
  const nonce = classifyIntentNonce({ intendedNonce: record?.intendedNonce ?? null, nonces });

  if (nonce.verdict === 'absent') return { outcome: 'absent', id: null, member: null, nonce, waitedMs: 0 };
  if (nonce.verdict !== 'pending') return { outcome: 'ambiguous', id: null, member: null, nonce, waitedMs: 0 };

  // Pending: the transaction may be a block away. Wait, out loud, for a bounded
  // time. Nothing is broadcast in here and nothing is written; the only thing
  // that ends the wait early is the bytes appearing on chain.
  const started = now();
  const waitMs = Math.max(0, Number(mempoolWaitMs));
  const intervalMs = Math.max(0, Number(mempoolPollMs));
  if (waitMs > 0) {
    say(
      `    ${nonce.why}. Waiting up to ${formatDuration(waitMs)} for it to confirm before giving up. Nothing is being re-sent.`
    );
  }
  for (;;) {
    const remaining = waitMs - (now() - started);
    if (remaining <= 0) break;
    say(`    still pending at nonce ${nonce.intendedNonce}: ${formatDuration(remaining)} left`);
    await sleep(Math.min(intervalMs, remaining));
    // Between every look, not only before the first: a run standing still is
    // exactly when someone reaches for the kill switch.
    guard('waiting for the mempool');
    const seen = await landed();
    if (seen) return { ...seen, nonce, waitedMs: waitMs - remaining };
  }
  return { outcome: 'pending', id: null, member: null, nonce, waitedMs: waitMs };
}

/* ------------------------------------------------------------------ */
/* the spend cap for a whole run                                       */
/* ------------------------------------------------------------------ */

/**
 * What this run has committed so far, in microSTX.
 *
 * Deliberately conservative: a reverted mint pays no protocol fee but this
 * counts it anyway, because the number exists to stop a loop rather than to
 * balance the books, and over-counting stops it sooner. Where the confirmed
 * miner fee is known it is used in place of the bid, which is the one direction
 * the estimate can safely move.
 *
 * Cleared intents are counted too, out of the `previousIntents` they leave
 * behind. Almost none of them spent anything — that is what "cleared" means —
 * but a position that keeps being cleared and re-composed is exactly the loop
 * this cap exists to stop, and a total that forgot the earlier attempts would
 * never reach it.
 */
export function committedSpendUstx(journal) {
  const spend = (record) =>
    BigInt(record?.protocolFeeUstx ?? 0) + BigInt(record?.actualMinerFeeUstx ?? record?.minerFeeUstx ?? 0);
  let total = 0n;
  for (const record of Object.values(journal?.positions ?? {})) {
    if (!record || record.status === 'external') continue;
    for (const cleared of record.previousIntents ?? []) total += spend(cleared);
    if (!['broadcasting', 'broadcast', 'confirmed', 'failed', 'timeout', 'abandoned'].includes(record.status)) continue;
    total += spend(record);
  }
  return total;
}

/** Throws before the broadcast that would cross the run cap. */
export function assertRunSpendCap({ committedUstx, plannedSpendUstx, runSpendCapUstx, label = 'this entry' } = {}) {
  const committed = BigInt(committedUstx ?? 0);
  const planned = BigInt(plannedSpendUstx ?? 0);
  const cap = BigInt(runSpendCapUstx ?? DEFAULT_RUN_SPEND_CAP_USTX);
  if (committed + planned > cap) {
    throw new RunHalt(
      'spend-cap',
      `refusing to broadcast ${label}: this run has committed ${groupDigits(committed)} microSTX and this ` +
        `broadcast would add ${groupDigits(planned)}, for ${groupDigits(committed + planned)} against a run cap ` +
        `of ${groupDigits(cap)}. Nothing was sent. Raise --run-spend-cap-ustx only if that total is one you ` +
        'meant to spend.',
      { committedUstx: committed, plannedSpendUstx: planned, runSpendCapUstx: cap }
    );
  }
  return { committedUstx: committed, plannedSpendUstx: planned, runSpendCapUstx: cap };
}

/* ------------------------------------------------------------------ */
/* planning                                                            */
/* ------------------------------------------------------------------ */

/**
 * The closing manifest's plan, in the same shape `planInscription` returns, so
 * `formatPlan` and `assertBroadcastAllowed` work on it unchanged.
 *
 * The manifest quotes every member's claim, so the parent-quote rail applies to
 * it exactly as it applies to a reply: each quoted claim has to be present in
 * that member's own on-chain bytes, and the credited wizard has to be the one
 * who created it. Since the claims were read off chain a moment earlier, this
 * check is really asking whether the ids in the manifest are the ids those
 * claims came from — which is the mistake worth catching in a list of six.
 */
export async function planManifest({
  threadId,
  subject,
  members = [],
  threadLength = THREAD_LENGTH,
  wizard = null,
  blockHeight = null,
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = null,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  env = {},
  expectedAddresses = expectedWizardAddresses(env)
} = {}) {
  const persona = getPersona(wizard ?? personaForPosition(Number(threadLength) + 1));
  const resolvedSubject = getSubject(subject);
  const parentIds = members.map((member) => String(member.id));

  const block =
    blockHeight !== null && blockHeight !== undefined
      ? BigInt(blockHeight)
      : await fetchChainTip({ fetchImpl, hiroUrl });

  const body = composeThreadManifest({ threadId, entries: members, subject: resolvedSubject, threadLength });
  const call = buildMintCall({ body, tokenUri: tokenUriFor({ threadId, manifest: true }), parentIds });

  const quote = await quoteSingleTxFee({
    fetchImpl,
    hiroUrl,
    totalSize: call.totalSize,
    totalChunks: call.totalChunks,
    senderAddress: senderAddress ?? CORE_ADDRESS
  });

  let balanceUstx = null;
  let balanceError = null;
  if (senderAddress) {
    try {
      balanceUstx = await fetchStxBalance({ fetchImpl, hiroUrl, address: senderAddress });
    } catch (error) {
      balanceError = errorMessage(error);
    }
  }

  const protocolFeeUstx = quote.totalFeeUstx;
  const plannedSpendUstx = protocolFeeUstx + BigInt(minerFeeUstx);
  const answering = members.map((member) => ({ id: String(member.id), wizard: member.wizardName, quote: member.claim }));

  const checks = {
    parentQuote: await verifyParentQuote({
      fetchImpl,
      hiroUrl,
      parentIds,
      answering,
      expectedAddresses,
      senderAddress: senderAddress ?? CORE_ADDRESS
    }),
    corePaused: await checkCorePaused({ fetchImpl, hiroUrl, senderAddress: senderAddress ?? CORE_ADDRESS }),
    // One mint, not a thread: the remaining work at this point is the manifest
    // and nothing else, so sizing the wallet against six more entries would be
    // a warning about work that does not exist.
    threadAffordability: checkThreadAffordability({ threadLength: 1, plannedSpendUstx, balanceUstx, balanceFloorUstx }),
    duplicateContent: await checkDuplicateContent({
      fetchImpl,
      hiroUrl,
      senderAddress: senderAddress ?? CORE_ADDRESS,
      finalHash: call.finalHash
    }),
    pendingNonce: await checkPendingNonce({ fetchImpl, hiroUrl, address: senderAddress })
  };

  return {
    record: 'manifest',
    wizard: persona,
    subject: resolvedSubject,
    threadId,
    position: Number(threadLength) + 1,
    threadLength: Number(threadLength),
    parentIds,
    block,
    body,
    call,
    quote,
    feeSource: quote.source,
    protocolFeeUstx,
    minerFeeUstx: BigInt(minerFeeUstx),
    plannedSpendUstx,
    spendCapUstx: BigInt(spendCapUstx),
    balanceFloorUstx: BigInt(balanceFloorUstx),
    senderAddress,
    balanceUstx,
    balanceError,
    killReason: killSwitchEngaged(env),
    offline: false,
    postCondition: {
      mode: 'deny',
      asset: 'STX',
      principal: senderAddress,
      condition: 'LessEqual',
      capUstx: protocolFeeUstx
    },
    checks,
    skippedChecks: []
  };
}

/* ------------------------------------------------------------------ */
/* ports                                                               */
/* ------------------------------------------------------------------ */

/**
 * Everything from outside. The defaults do nothing and refuse to broadcast, so a
 * caller that supplies no ports gets a run that reads nothing and spends
 * nothing rather than one that quietly uses the real network.
 */
export const NULL_PORTS = {
  fetchImpl: async () => {
    throw new WizardSafetyError('no fetch port supplied');
  },
  submit: async () => {
    throw new WizardSafetyError('no submit port supplied: nothing was signed and nothing was sent');
  },
  readJournal: () => null,
  writeJournal: () => {},
  killSwitch: () => null,
  now: () => Date.now(),
  sleep: async () => {},
  say: () => {},
  presentPlan: () => {}
};

/* ------------------------------------------------------------------ */
/* the run                                                             */
/* ------------------------------------------------------------------ */

const positionKey = (position) => String(position);

/**
 * Drive the remaining entries of a thread to completion.
 *
 * Never throws for a condition it expects: a refusal, a failure, a timeout and a
 * kill are all returned as `{ ok: false, halted: { reason, message } }`, because
 * by the time any of them happens there is state worth reporting — a txid, a
 * journal, an inscription that already exists — and an exception thrown out of
 * the middle of that loses it.
 */
export async function runThread({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    threadId,
    subject,
    threadLength = THREAD_LENGTH,
    from = 1,
    to = threadLength,
    broadcast = false,
    manifest = true,
    manifestWizard = null,
    hiroUrl = DEFAULT_HIRO_URL,
    env = {},
    wallets = {},
    knownIds = {},
    journalDir = HERE,
    runSpendCapUstx = DEFAULT_RUN_SPEND_CAP_USTX,
    spendCapUstx = DEFAULT_SPEND_CAP_USTX,
    balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
    minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
    confirmTimeoutMs = DEFAULT_CONFIRM_TIMEOUT_MS,
    confirmPollMs = DEFAULT_CONFIRM_POLL_MS,
    mempoolWaitMs = DEFAULT_MEMPOOL_WAIT_MS,
    mempoolPollMs = DEFAULT_MEMPOOL_POLL_MS
  } = options;

  const mode = broadcast ? 'broadcast' : 'dry';
  const fetchImpl = io.fetchImpl;
  const expectedAddresses = expectedWizardAddresses(env);
  const guard = (step) => {
    const reason = io.killSwitch(env);
    if (reason) {
      throw new RunHalt('kill-switch', `kill switch engaged (${reason}) before ${step}. The run stops here.`, { step });
    }
  };

  if (!threadId || typeof threadId !== 'string') {
    throw new WizardSafetyError('runThread needs a thread id');
  }
  if (broadcast && threadId === DEMO_THREAD_ID) {
    throw new WizardSafetyError(
      `refusing to broadcast with the placeholder thread id "${DEMO_THREAD_ID}". It is written into every entry ` +
        'and quoted by the manifest, and it cannot be changed later.'
    );
  }
  const first = Number(from);
  const last = Number(to);
  if (!Number.isInteger(first) || first < 1 || first > Number(threadLength)) {
    throw new WizardSafetyError(`--from ${from} is not a position in a thread of ${threadLength}`);
  }
  if (!Number.isInteger(last) || last < first || last > Number(threadLength)) {
    throw new WizardSafetyError(`--to ${to} is not a position at or after ${first} in a thread of ${threadLength}`);
  }

  const journalPath = journalPathFor({ dir: journalDir, threadId, mode });
  const startedAt = iso(io.now());
  let journal = io.readJournal(journalPath) ?? emptyJournal({ threadId, subject, threadLength, mode, startedAt });

  const members = [];
  const halt = (error) => ({
    reason: error instanceof RunHalt ? error.reason : 'safety',
    message: error.message,
    detail: error instanceof RunHalt ? error.detail : {}
  });

  const save = () => {
    journal.updatedAt = iso(io.now());
    assertJournalSecretFree(
      journal,
      Object.values(wallets).map((wallet) => wallet?.key)
    );
    io.writeJournal(journalPath, journal);
  };

  const record = (key, patch) => {
    // A typo in a status string would be silent and would change what a resumed
    // run is willing to do with the position, which is the last place to want a
    // silent typo.
    if (patch.status && !POSITION_STATUSES.includes(patch.status)) {
      throw new WizardSafetyError(`"${patch.status}" is not a known position status`);
    }
    journal.positions[key] = { ...(journal.positions[key] ?? {}), ...patch, updatedAt: iso(io.now()) };
    save();
    return journal.positions[key];
  };

  /**
   * Clear an intent the nonce has proved was never mined, keeping what it said.
   *
   * The record is not deleted. The bytes it was going to mint, the nonce it was
   * signed at and the wallet it came from are the evidence for the decision, and
   * a journal that quietly forgot an attempt would be a worse record than one
   * that never made it.
   */
  const clearIntent = (key, stranded, nonce) =>
    record(key, {
      status: 'abandoned',
      txid: null,
      inscriptionId: null,
      finalHashHex: null,
      intendedNonce: null,
      // What it would have cost moves into the archive with everything else, so
      // the run total counts this attempt once rather than twice.
      protocolFeeUstx: null,
      minerFeeUstx: null,
      actualMinerFeeUstx: null,
      resolution: 'nonce-proved-absent',
      resolvedBy: 'runner',
      resolvedAt: iso(io.now()),
      note: nonce?.why ?? 'the intended nonce had never confirmed, so nothing was minted',
      previousIntents: [
        ...(stranded.previousIntents ?? []),
        archiveIntent(stranded, { reason: 'nonce-proved-absent', note: nonce?.why ?? null })
      ]
    });

  /** What a run says when it will not decide for itself. */
  const unresolvedMessage = (key, stranded, resolved) => {
    const label = key === MANIFEST_KEY ? 'the manifest' : `position ${key}`;
    const where = stranded.senderAddress ?? 'the wizard wallet';
    const settle =
      `Once you know what happened, close it with --resolve ${key} landed:<id> or --resolve ${key} abandoned, ` +
      'either of which is recorded in the journal as a human decision.';
    if (resolved.outcome === 'pending') {
      return (
        `${label} has an intent record from an earlier run but no transaction id, and after ` +
        `${formatDuration(resolved.waitedMs)} of waiting this wallet STILL HAS NONCE ${resolved.nonce.intendedNonce} ` +
        'IN THE MEMPOOL. That is not a failure and it is not a loss: the transaction may confirm at any time. ' +
        'This runner will not broadcast it again, because a second mint would be just as permanent as the first. ' +
        `Watch ${where} in the explorer and run --status once nonce ${resolved.nonce.intendedNonce} clears. ${settle}`
      );
    }
    return (
      `${label} has an intent record from an earlier run but no transaction id, and no inscription with those ` +
      `exact bytes is on chain yet. ${resolved.nonce?.why ?? 'The wallet nonce says nothing about it either.'} ` +
      'That transaction may still be in the mempool. This runner will not broadcast it again: a second mint ' +
      `would be just as permanent as the first. Check ${where} in the explorer, wait for the mempool to clear, ` +
      `and run --status again. ${settle}`
    );
  };

  let halted = null;

  try {
    guard('the first step');

    if (journal.version !== RUN_JOURNAL_VERSION) {
      throw new RunHalt(
        'journal',
        `the run journal at ${journalPath} is version ${journal.version}, but this runner writes version ` +
          `${RUN_JOURNAL_VERSION}. Move it aside and check what it says before starting again.`
      );
    }
    if (journal.threadId !== threadId || journal.mode !== mode) {
      throw new RunHalt(
        'journal',
        `the run journal at ${journalPath} is for thread ${journal.threadId} in ${journal.mode} mode, not ` +
          `${threadId} in ${mode} mode.`
      );
    }
    journal.subject ??= subject;

    // Ids supplied by the operator for entries minted before this runner
    // existed. Recorded as external so nothing later mistakes them for
    // something this run broadcast and might have to resolve.
    for (const [position, id] of Object.entries(knownIds)) {
      const key = positionKey(position);
      const existing = journal.positions[key];
      if (existing?.inscriptionId && String(existing.inscriptionId) !== String(id)) {
        throw new RunHalt(
          'journal',
          `--ids says position ${position} is #${id}, but the journal already records it as ` +
            `#${existing.inscriptionId}. One of them is wrong and this run will not guess which.`
        );
      }
      if (!existing) {
        journal.positions[key] = {
          position: Number(position),
          status: 'external',
          inscriptionId: String(id),
          txid: null,
          source: 'operator',
          updatedAt: iso(io.now())
        };
      }
    }
    save();

    const idFor = (position) => journal.positions[positionKey(position)]?.inscriptionId ?? null;

    // Everything before --from has to already exist on chain. The immediate
    // predecessor because the next entry quotes it; the rest because the
    // manifest lists them, and finding out that one is missing after paying for
    // two more entries is the expensive way to learn it.
    const priorIds = {};
    for (let position = 1; position < first; position += 1) {
      priorIds[position] = idFor(position);
    }
    guard('reading the entries already on chain');
    for (let position = 1; position < first; position += 1) {
      const id = priorIds[position];
      if (!id) {
        throw new RunHalt(
          'predecessor',
          `refusing to start at position ${first}: no inscription id is known for position ${position} of ` +
            `thread ${threadId}. Pass every earlier id with --ids <id1,id2,...> in position order.`
        );
      }
      let member;
      try {
        member = await hydrateMember({
          fetchImpl,
          hiroUrl,
          senderAddress: CORE_ADDRESS,
          id,
          position,
          threadId,
          subject,
          txid: journal.positions[positionKey(position)]?.txid ?? null
        });
      } catch (error) {
        // Everything before --from has to be real, on chain, and the entry it
        // says it is. Anything else and the next entry would cite a fiction.
        throw new RunHalt(
          'predecessor',
          `refusing to start at position ${first}: ${errorMessage(error)}`,
          { position, id }
        );
      }
      members.push(member);
      io.say(`  position ${position}: #${id} confirmed on chain, ${member.wizardName}`);
    }

    for (let position = first; position <= last; position += 1) {
      const key = positionKey(position);
      const persona = personaForPosition(position);
      const previous = members.at(-1) ?? null;
      // Not const: an intent the nonce proves was never mined is cleared here,
      // and the rest of the loop has to see the position as untouched.
      let existing = journal.positions[key] ?? null;

      guard(`position ${position}`);

      // Already done, by this run or an earlier one. Read it back rather than
      // trusting the journal, so a citation always comes off the chain.
      if (existing && (existing.status === 'confirmed' || existing.status === 'external') && existing.inscriptionId) {
        const member = await hydrateMember({
          fetchImpl,
          hiroUrl,
          senderAddress: CORE_ADDRESS,
          id: existing.inscriptionId,
          position,
          threadId,
          subject,
          txid: existing.txid ?? null
        });
        members.push(member);
        io.say(`  position ${position}: already #${member.id}, nothing to broadcast`);
        continue;
      }

      // Intent written, txid never was. The crash window. Never re-broadcast on
      // a guess: ask the chain whether those exact bytes are already there, and
      // if they are not, let the nonce recorded with the intent say what that
      // silence means.
      if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveIntent({
          fetchImpl,
          hiroUrl,
          record: existing,
          position,
          threadId,
          subject,
          now: io.now,
          sleep: io.sleep,
          say: io.say,
          guard,
          mempoolWaitMs,
          mempoolPollMs
        });

        if (resolved.outcome === 'landed') {
          record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
          members.push(resolved.member);
          io.say(`  position ${position}: recovered as #${resolved.id} by content hash; no second broadcast`);
          continue;
        }

        if (resolved.outcome !== 'absent') {
          throw new RunHalt('unresolved', unresolvedMessage(key, existing, resolved), {
            position,
            finalHashHex: existing.finalHashHex,
            intendedNonce: existing.intendedNonce ?? null,
            nonce: resolved.nonce
          });
        }

        // The one branch that may compose the entry again, and the whole reason
        // the nonce is written down. It is safe here and nowhere else: a nonce
        // below the intended one is proof the transaction never confirmed, so
        // there is nothing on chain for a second mint to duplicate. The mirror
        // case — a nonce at or above the intended one — proves only that some
        // transaction used it, which may have been an unrelated send from the
        // same wallet, and is handled above as a halt.
        clearIntent(key, existing, resolved.nonce);
        io.say(`  position ${position}: ${resolved.nonce.why}`);
        io.say('    the orphaned intent is cleared and this entry is composed again from scratch');
        existing = null;
      }

      // A txid exists. Poll it. Under no circumstances send another.
      if (existing && existing.txid && existing.status !== 'failed') {
        const outcome = await settle({
          io,
          fetchImpl,
          hiroUrl,
          key,
          position,
          threadId,
          txid: existing.txid,
          record,
          guard,
          confirmTimeoutMs,
          confirmPollMs
        });
        members.push(outcome);
        continue;
      }

      if (existing && existing.status === 'failed') {
        throw new RunHalt(
          'tx-failed',
          `position ${position} is recorded as failed (${existing.txStatus ?? 'unknown status'}, tx ` +
            `${existing.txid ?? 'none'}). This runner does not retry a broadcast. Decide what happened, clear ` +
            `that entry out of ${journalPath}, and start again deliberately.`,
          { position }
        );
      }

      const wallet = wallets[persona.id] ?? {};
      io.say(`\n  position ${position} of ${threadLength}: ${persona.name}`);

      const plan = await planInscription({
        wizard: persona,
        threadId,
        position,
        subject,
        parentIds: previous ? [previous.id] : [],
        answering: previous ? [previous.citation] : [],
        threadLength,
        fetchImpl,
        hiroUrl,
        senderAddress: wallet.address ?? null,
        spendCapUstx,
        balanceFloorUstx,
        minerFeeUstx,
        env,
        expectedAddresses
      });
      io.presentPlan(plan, { broadcast });

      guard(`broadcasting position ${position}`);
      assertRunSpendCap({
        committedUstx: committedSpendUstx(journal),
        plannedSpendUstx: plan.plannedSpendUstx,
        runSpendCapUstx,
        label: `position ${position}`
      });
      assertBroadcastAllowed({
        senderKey: wallet.key,
        wizardId: persona.id,
        totalChunks: plan.call.totalChunks,
        singleTxEligible: plan.quote.singleTxEligible,
        feeSource: plan.feeSource,
        balanceUstx: plan.balanceUstx,
        protocolFeeUstx: plan.protocolFeeUstx,
        minerFeeUstx: plan.minerFeeUstx,
        spendCapUstx: plan.spendCapUstx,
        balanceFloorUstx: plan.balanceFloorUstx,
        killReason: plan.killReason,
        parentQuoteCheck: plan.checks.parentQuote,
        pausedCheck: plan.checks.corePaused
      });

      const member = await broadcastAndSettle({
        io,
        fetchImpl,
        hiroUrl,
        key,
        position,
        threadId,
        plan,
        persona,
        wallet,
        broadcast,
        record,
        guard,
        confirmTimeoutMs,
        confirmPollMs
      });
      members.push(member);
    }

    if (manifest && last === Number(threadLength) && members.length === Number(threadLength)) {
      const key = MANIFEST_KEY;
      // Not const, for the same reason as a position: a cleared intent has to
      // leave the manifest looking unwritten.
      let existing = journal.positions[key] ?? null;
      guard('the manifest');

      if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveIntent({
          fetchImpl,
          hiroUrl,
          record: existing,
          threadId,
          now: io.now,
          sleep: io.sleep,
          say: io.say,
          guard,
          mempoolWaitMs,
          mempoolPollMs
        });
        if (resolved.outcome === 'landed') {
          record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
          existing = journal.positions[key];
        } else if (resolved.outcome === 'absent') {
          clearIntent(key, existing, resolved.nonce);
          io.say(`  manifest: ${resolved.nonce.why}`);
          io.say('    the orphaned intent is cleared and the manifest is composed again from scratch');
          existing = null;
        } else {
          throw new RunHalt('unresolved', unresolvedMessage(key, existing, resolved), {
            finalHashHex: existing.finalHashHex,
            intendedNonce: existing.intendedNonce ?? null,
            nonce: resolved.nonce
          });
        }
      }

      if (existing && existing.status === 'confirmed' && existing.inscriptionId) {
        io.say(`  manifest: already #${existing.inscriptionId}, nothing to broadcast`);
      } else if (existing && existing.txid && existing.status !== 'failed') {
        await settle({
          io,
          fetchImpl,
          hiroUrl,
          key,
          threadId,
          txid: existing.txid,
          record,
          guard,
          confirmTimeoutMs,
          confirmPollMs,
          hydrate: false
        });
      } else if (existing && existing.status === 'failed') {
        throw new RunHalt(
          'tx-failed',
          `the manifest is recorded as failed (${existing.txStatus ?? 'unknown status'}). This runner does not ` +
            'retry a broadcast.'
        );
      } else {
        const persona = getPersona(manifestWizard ?? personaForPosition(Number(threadLength) + 1));
        const wallet = wallets[persona.id] ?? {};
        io.say(`\n  closing manifest: ${persona.name}, citing ${members.length} members`);

        const plan = await planManifest({
          threadId,
          subject,
          members,
          threadLength,
          wizard: persona,
          fetchImpl,
          hiroUrl,
          senderAddress: wallet.address ?? null,
          spendCapUstx,
          balanceFloorUstx,
          minerFeeUstx,
          env,
          expectedAddresses
        });
        io.presentPlan(plan, { broadcast });

        guard('broadcasting the manifest');
        assertRunSpendCap({
          committedUstx: committedSpendUstx(journal),
          plannedSpendUstx: plan.plannedSpendUstx,
          runSpendCapUstx,
          label: 'the manifest'
        });
        assertBroadcastAllowed({
          senderKey: wallet.key,
          wizardId: persona.id,
          totalChunks: plan.call.totalChunks,
          singleTxEligible: plan.quote.singleTxEligible,
          feeSource: plan.feeSource,
          balanceUstx: plan.balanceUstx,
          protocolFeeUstx: plan.protocolFeeUstx,
          minerFeeUstx: plan.minerFeeUstx,
          spendCapUstx: plan.spendCapUstx,
          balanceFloorUstx: plan.balanceFloorUstx,
          killReason: plan.killReason,
          parentQuoteCheck: plan.checks.parentQuote,
          pausedCheck: plan.checks.corePaused
        });

        await broadcastAndSettle({
          io,
          fetchImpl,
          hiroUrl,
          key,
          threadId,
          plan,
          persona,
          wallet,
          broadcast,
          record,
          guard,
          confirmTimeoutMs,
          confirmPollMs,
          hydrate: false
        });
      }
    }
  } catch (error) {
    if (error instanceof RunHalt || error instanceof WizardSafetyError || error?.name === 'WizardComposeError') {
      halted = halt(error);
    } else {
      throw error;
    }
  }

  return {
    ok: halted === null,
    halted,
    threadId,
    subject,
    threadLength: Number(threadLength),
    mode,
    broadcast,
    journalPath,
    journal,
    members,
    committedUstx: committedSpendUstx(journal),
    runSpendCapUstx: BigInt(runSpendCapUstx)
  };
}

/**
 * The hash half of `resolveIntent`, on its own: did these exact bytes land?
 *
 * The hash is what makes any of this possible. An entry states the block it was
 * written at, so re-composing it later produces different bytes; the hash
 * recorded before the broadcast is the only stable handle on what was signed.
 * It is also the only positive proof in the system — a hit means the mint
 * landed, and nothing else does — so it is asked first everywhere and asked
 * again while waiting.
 */
export async function resolveUnrecordedBroadcast({ fetchImpl, hiroUrl, record, position = null, threadId } = {}) {
  if (!record?.finalHashHex) return null;
  const id = await lookupIdByHash({ fetchImpl, hiroUrl, finalHashHex: record.finalHashHex });
  if (!id) return null;
  if (position === null) return { id, member: null };
  const member = await hydrateMember({ fetchImpl, hiroUrl, id, position, threadId });
  return { id, member };
}

/** Broadcast one plan, record the txid, then wait for it. */
async function broadcastAndSettle({
  io,
  fetchImpl,
  hiroUrl,
  key,
  position = null,
  threadId,
  plan,
  persona,
  wallet,
  broadcast,
  record,
  guard,
  confirmTimeoutMs,
  confirmPollMs,
  hydrate = true
}) {
  // The nonce this transaction is about to be signed with, read before the
  // intent is written so the write itself stays adjacent to the submit below.
  //
  // `possible_next_nonce` is what the signer will pick a moment from now, and
  // recording it turns the crash window from a permanent halt into a decidable
  // question: a wallet whose last executed nonce is still below this one cannot
  // have mined this transaction. An unreadable nonce is not a reason to refuse
  // to broadcast — it only costs a later run the cheap answer, leaving it the
  // hash and the halt it always had.
  const intendedNonce = await readIntendedNonce({
    fetchImpl,
    hiroUrl,
    address: plan.senderAddress,
    fallback: plan.checks?.pendingNonce?.nextNonce ?? null
  });

  // Intent, before anything is signed. Everything a later run needs to work out
  // what happened to this position without re-sending it.
  //
  // There is deliberately no kill-switch check between this write and the
  // submit below. The caller checks immediately before calling, with only pure
  // synchronous code in between, and a check here could leave an intent record
  // standing for a transaction that was provably never sent — which a later run
  // would then be unable to resolve and would refuse to move past. Halting
  // before the intent is written costs nothing; halting after it costs a manual
  // repair.
  record(key, {
    position,
    wizard: persona.id,
    wizardName: persona.name,
    status: 'broadcasting',
    txid: null,
    inscriptionId: null,
    finalHashHex: plan.call.finalHashHex,
    blockHeight: String(plan.block),
    tokenUri: plan.call.tokenUri,
    parentIds: plan.parentIds,
    protocolFeeUstx: String(plan.protocolFeeUstx),
    minerFeeUstx: String(plan.minerFeeUstx),
    senderAddress: plan.senderAddress,
    intendedNonce,
    broadcastAt: iso(io.now()),
    // A position composed again after an earlier attempt was cleared keeps the
    // history in previousIntents, but must not keep the verdict that closed it.
    resolution: null,
    resolvedBy: null,
    resolvedAt: null,
    note: null
  });

  let txid;
  try {
    const submitted = await io.submit({
      plan,
      broadcast,
      wizardId: persona.id,
      senderKey: wallet.key,
      senderAddress: plan.senderAddress,
      protocolFeeUstx: plan.protocolFeeUstx,
      minerFeeUstx: plan.minerFeeUstx
    });
    txid = normaliseTxid(submitted?.txid);
  } catch (error) {
    // A throw here is not proof that nothing was sent: the failure could have
    // happened after the node accepted it. Leave the intent record standing so
    // the next run resolves it by hash instead of re-broadcasting.
    record(key, { status: 'broadcasting', error: errorMessage(error) });
    throw new RunHalt(
      'unresolved',
      `broadcasting ${position === null ? 'the manifest' : `position ${position}`} failed: ${errorMessage(error)}. ` +
        'Whether the node accepted it before the error is not knowable from here, so this runner will not send ' +
        'it again. Run --status, which resolves it against the chain by content hash.',
      { position }
    );
  }

  record(key, { status: 'broadcast', txid });
  io.say(`    txid ${txid}`);
  io.say(`    watch https://explorer.hiro.so/txid/${txid}?chain=mainnet`);

  return settle({
    io,
    fetchImpl,
    hiroUrl,
    key,
    position,
    threadId,
    txid,
    record,
    guard,
    confirmTimeoutMs,
    confirmPollMs,
    hydrate
  });
}

/** Wait for one recorded txid and turn its outcome into journal state. */
async function settle({
  io,
  fetchImpl,
  hiroUrl,
  key,
  position = null,
  threadId,
  txid,
  record,
  guard,
  confirmTimeoutMs,
  confirmPollMs,
  hydrate = true
}) {
  const label = position === null ? 'the manifest' : `position ${position}`;
  let outcome;
  try {
    outcome = await pollTransaction({
      fetchImpl,
      hiroUrl,
      txid,
      now: io.now,
      sleep: io.sleep,
      timeoutMs: confirmTimeoutMs,
      intervalMs: confirmPollMs,
      guard,
      onPoll: ({ poll, elapsedMs, txStatus, known }) =>
        io.say(`    poll ${poll} (${Math.round(elapsedMs / 1000)}s): ${known ? txStatus : 'not visible yet'}`)
    });
  } catch (error) {
    if (error instanceof RunHalt && error.reason === 'kill-switch') {
      record(key, { status: 'broadcast', note: 'kill switch engaged while waiting' });
      throw new RunHalt(
        'kill-switch',
        `${error.message} ${label} was already broadcast as ${txid} and may still confirm. The journal holds ` +
          'the transaction id; nothing here was undone and nothing was re-sent.',
        { position, txid }
      );
    }
    throw error;
  }

  if (outcome.outcome === 'timeout') {
    record(key, { status: 'timeout', txid, txStatus: outcome.txStatus ?? 'pending' });
    throw new RunHalt(
      'timeout',
      `${label} did not reach a terminal status within ${Math.round(outcome.elapsedMs / 60000)} minutes. ` +
        'THIS IS NOT A FAILURE. Transaction ' +
        `${txid} may still confirm, and the run journal holds its id. Do not broadcast this entry again. ` +
        'Re-run with the same --from once it lands, or use --status to watch it.',
      { position, txid }
    );
  }

  if (outcome.outcome === 'failed') {
    record(key, {
      status: 'failed',
      txid,
      txStatus: outcome.txStatus,
      actualMinerFeeUstx: outcome.feeRate === null || outcome.feeRate === undefined ? null : String(outcome.feeRate)
    });
    throw new RunHalt(
      'tx-failed',
      `${label} ended as ${outcome.txStatus} (${txid}). The run stops here and nothing is retried. ` +
        (outcome.txStatus.startsWith('abort')
          ? 'An abort still pays the miner fee. Read the transaction in the explorer before doing anything else.'
          : 'A dropped transaction spent nothing, but something replaced or evicted it. Find out what.'),
      { position, txid, txStatus: outcome.txStatus }
    );
  }

  const { inscriptionId, existed } = parseMintResult(outcome.result);
  record(key, {
    status: 'confirmed',
    txid,
    txStatus: outcome.txStatus,
    inscriptionId,
    existed,
    confirmedBlock: outcome.blockHeight === null || outcome.blockHeight === undefined ? null : String(outcome.blockHeight),
    actualMinerFeeUstx: outcome.feeRate === null || outcome.feeRate === undefined ? null : String(outcome.feeRate),
    confirmedAt: iso(io.now())
  });
  io.say(
    `    confirmed in block ${outcome.blockHeight ?? '?'} as inscription #${inscriptionId}` +
      (existed ? '  (existed already: these exact bytes were on chain before this mint)' : '')
  );

  if (!hydrate) return { id: inscriptionId, existed };

  guard(`reading #${inscriptionId} back`);
  const member = await hydrateMember({
    fetchImpl,
    hiroUrl,
    id: inscriptionId,
    position,
    threadId,
    txid
  });
  return member;
}

/* ------------------------------------------------------------------ */
/* status                                                              */
/* ------------------------------------------------------------------ */

/**
 * What is confirmed, what is pending, what is missing — from the journal and
 * from the chain, without running anything.
 *
 * Usable on its own: it needs no key, broadcasts nothing, and works on a thread
 * this runner never touched as long as the ids are supplied.
 */
export async function statusReport({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    threadId,
    threadLength = THREAD_LENGTH,
    hiroUrl = DEFAULT_HIRO_URL,
    journalDir = HERE,
    mode = 'broadcast',
    knownIds = {}
  } = options;

  const journalPath = journalPathFor({ dir: journalDir, threadId, mode });
  const journal = io.readJournal(journalPath);
  const rows = [];

  const keys = [...Array.from({ length: Number(threadLength) }, (_, index) => positionKey(index + 1)), MANIFEST_KEY];
  for (const key of keys) {
    const position = key === MANIFEST_KEY ? null : Number(key);
    const stored = journal?.positions?.[key] ?? null;
    const id = stored?.inscriptionId ?? knownIds[key] ?? null;
    const row = {
      key,
      position,
      wizard:
        stored?.wizardName ??
        (position === null ? getPersona(personaForPosition(Number(threadLength) + 1)).name : personaForPosition(position).name),
      journalStatus: stored?.status ?? 'not recorded',
      txid: stored?.txid ?? null,
      inscriptionId: id,
      chain: 'missing',
      block: null,
      costUstx: null,
      note: null
    };

    try {
      if (id) {
        const read = await readEntryFromChain({ fetchImpl: io.fetchImpl, hiroUrl, id });
        if (read.found) {
          row.chain = 'confirmed';
          row.block = read.entry?.block ?? null;
          row.costUstx = read.entry?.costUstx ?? null;
          if (position !== null && read.entry && Number(read.entry.position) !== position) {
            row.note = `on chain this is position ${read.entry.position}, not ${position}`;
            row.chain = 'mismatch';
          }
          if (read.entry && journal && read.entry.thread !== journal.threadId && read.entry.thread !== threadId) {
            row.note = `on chain this belongs to thread ${read.entry.thread}`;
            row.chain = 'mismatch';
          }
        } else {
          row.chain = 'missing';
          row.note = `#${id} has no chunk u0 on chain`;
        }
      } else if (stored?.txid) {
        const seen = await fetchTransaction({ fetchImpl: io.fetchImpl, hiroUrl, txid: stored.txid });
        const verdict = classifyTxStatus(seen.txStatus);
        row.chain = verdict === 'success' ? 'confirmed' : verdict === 'pending' ? 'pending' : 'failed';
        row.block = seen.blockHeight === null ? null : String(seen.blockHeight);
        row.note = seen.known ? `tx ${seen.txStatus}` : 'transaction not visible to the API yet';
        if (verdict === 'success' && seen.result) {
          try {
            row.inscriptionId = parseMintResult(seen.result).inscriptionId;
          } catch (error) {
            row.note = `confirmed, but the result did not parse: ${errorMessage(error)}`;
          }
        }
      } else if (stored?.status === 'broadcasting') {
        // The ambiguous state. Resolve it the way a resumed run would, but
        // never wait: --status is a read that reports, not a run that blocks.
        const resolved = await resolveIntent({
          fetchImpl: io.fetchImpl,
          hiroUrl,
          record: stored,
          threadId,
          mempoolWaitMs: 0
        });
        if (resolved.outcome === 'landed') {
          row.inscriptionId = resolved.id;
          row.chain = 'confirmed';
          row.note = 'recovered by content hash: the mint landed but its txid was never recorded';
        } else if (resolved.outcome === 'absent') {
          row.chain = 'never-sent';
          row.note = `${resolved.nonce.why}. The next run clears this intent and composes the entry again.`;
        } else if (resolved.outcome === 'pending') {
          row.chain = 'pending';
          row.note = `${resolved.nonce.why}. Do not broadcast it again; wait for that nonce to clear.`;
        } else {
          row.chain = 'unresolved';
          row.note =
            `intent recorded, no txid, and nothing with those bytes on chain. ${resolved.nonce?.why ?? ''} ` +
            'It may still be in the mempool. Do not broadcast it again.';
        }
      } else if (stored?.status === 'abandoned') {
        row.chain = 'abandoned';
        row.note =
          `settled as never minted by ${stored.resolvedBy === 'operator' ? 'a human' : 'the wallet nonce'}` +
          `${stored.resolvedAt ? ` at ${stored.resolvedAt}` : ''}: ${stored.note ?? 'no reason recorded'}`;
      }
    } catch (error) {
      row.chain = 'unknown';
      row.note = `could not read: ${errorMessage(error)}`;
    }
    rows.push(row);
  }

  return {
    threadId,
    threadLength: Number(threadLength),
    mode,
    journalPath,
    journalFound: Boolean(journal),
    committedUstx: journal ? committedSpendUstx(journal) : 0n,
    rows
  };
}

/* ------------------------------------------------------------------ */
/* the operator's decision                                             */
/* ------------------------------------------------------------------ */

/**
 * A closing manifest, read back and checked to be the manifest of this thread.
 *
 * `hydrateMember` cannot do this: a manifest has no `## Claim` and no position,
 * so every assertion that makes hydrateMember safe for an entry would reject it.
 */
export async function hydrateManifest({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  id,
  threadId,
  subject = null
} = {}) {
  const read = await readEntryFromChain({ fetchImpl, hiroUrl, senderAddress, id });
  if (!read.found) {
    throw new WizardSafetyError(`#${id} has no chunk u0 on chain, so it cannot be the manifest of ${threadId}.`);
  }
  const meta = read.entry?.meta ?? {};
  if (meta.record !== 'thread-manifest') {
    throw new WizardSafetyError(`#${id} is on chain but its front matter does not say "record: thread-manifest".`);
  }
  if (read.entry.thread !== threadId) {
    throw new WizardSafetyError(`#${id} is the manifest of thread "${read.entry.thread}", not "${threadId}".`);
  }
  if (subject && read.entry.subject && read.entry.subject !== '(mixed)' && read.entry.subject !== getSubject(subject).id) {
    throw new WizardSafetyError(
      `#${id} is a manifest for subject "${read.entry.subject}", but this thread is composing ` +
        `"${getSubject(subject).id}".`
    );
  }
  return { id: String(id), position: null, body: read.body, members: meta['member-ids'] ?? null };
}

/**
 * Record a human's verdict on one position, into the journal, with a timestamp.
 *
 * The runner decides everything it can decide from the chain. This is for what
 * is left: an intent whose nonce was consumed by something unidentifiable, or a
 * transaction that sat in the mempool until it was garbage collected and can no
 * longer be distinguished from one that was never sent. Without this the
 * position stays ambiguous permanently — the entry names the block it was
 * written at, so it can never be re-composed to the same bytes and the orphaned
 * hash can never be matched again.
 *
 * It is deliberately not a way to skip a check. Both verdicts are refused
 * unless the chain agrees they are possible:
 *
 *   landed:<id>  the id's own front matter has to be this thread, this position
 *                and this subject. An operator pasting the id of a neighbouring
 *                entry would otherwise write a permanent citation of the wrong
 *                inscription into the manifest.
 *   abandoned    refused outright if the chain shows the position confirmed, by
 *                recorded id, by content hash or by a successful transaction.
 *                You cannot abandon something that landed.
 *
 * Broadcasts nothing, signs nothing, needs no key.
 */
export async function resolvePosition({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    threadId,
    threadLength = THREAD_LENGTH,
    subject = null,
    position,
    resolution,
    inscriptionId = null,
    note = null,
    hiroUrl = DEFAULT_HIRO_URL,
    journalDir = HERE,
    mode = 'broadcast'
  } = options;

  if (!RESOLUTIONS.includes(resolution)) {
    throw new WizardSafetyError(
      `"${resolution}" is not a resolution. Use "abandoned" or "landed:<id>", and only when you have checked ` +
        'the explorer yourself.'
    );
  }

  const raw = String(position ?? '').trim();
  const key = raw.toLowerCase() === MANIFEST_KEY ? MANIFEST_KEY : raw;
  if (key !== MANIFEST_KEY) {
    const numeric = Number(key);
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > Number(threadLength)) {
      throw new WizardSafetyError(
        `"${position}" is not a position in a thread of ${threadLength}, and not "${MANIFEST_KEY}".`
      );
    }
  }
  const label = key === MANIFEST_KEY ? 'the manifest' : `position ${key}`;

  const journalPath = journalPathFor({ dir: journalDir, threadId, mode });
  const journal = io.readJournal(journalPath);
  if (!journal) {
    throw new WizardSafetyError(`there is no run journal at ${journalPath}, so there is nothing to resolve.`);
  }
  if (journal.threadId !== threadId || journal.mode !== mode) {
    throw new WizardSafetyError(
      `the run journal at ${journalPath} is for thread ${journal.threadId} in ${journal.mode} mode, not ` +
        `${threadId} in ${mode} mode.`
    );
  }

  // The journal knows what this thread argues about. Trusting it over a CLI
  // default means an operator who forgets --subject gets the right check rather
  // than a refusal about a subject they never chose.
  const checkSubject = subject ?? journal.subject ?? null;

  const stored = journal.positions?.[key] ?? null;
  if (!stored) {
    throw new WizardSafetyError(
      `${label} of thread ${threadId} has no record in ${journalPath}. --resolve closes a record this runner ` +
        'left behind; an entry minted outside it is supplied with --ids instead.'
    );
  }
  // Already settled by the chain itself. A human verdict cannot improve on a
  // confirmed inscription and must not be able to overwrite one.
  if ((stored.status === 'confirmed' || stored.status === 'external') && stored.inscriptionId) {
    throw new WizardSafetyError(
      `${label} is already resolved as #${stored.inscriptionId} (${stored.status}). There is nothing ambiguous ` +
        'here to settle.'
    );
  }

  const resolvedAt = iso(io.now());
  const checks = {};
  let patch;
  let message;

  if (resolution === 'landed') {
    if (!/^\d+$/.test(String(inscriptionId ?? ''))) {
      throw new WizardSafetyError(`"landed:${inscriptionId ?? ''}" needs an inscription id: --resolve ${key} landed:2926`);
    }
    if (stored.inscriptionId && String(stored.inscriptionId) !== String(inscriptionId)) {
      throw new WizardSafetyError(
        `${label} is already recorded as #${stored.inscriptionId}, not #${inscriptionId}. One of them is wrong ` +
          'and this will not guess which.'
      );
    }
    try {
      checks.onChain =
        key === MANIFEST_KEY
          ? await hydrateManifest({
              fetchImpl: io.fetchImpl,
              hiroUrl,
              id: inscriptionId,
              threadId,
              subject: checkSubject
            })
          : await hydrateMember({
              fetchImpl: io.fetchImpl,
              hiroUrl,
              id: inscriptionId,
              position: Number(key),
              threadId,
              subject: checkSubject
            });
    } catch (error) {
      throw new WizardSafetyError(
        `refusing to record ${label} as landed at #${inscriptionId}: ${errorMessage(error)} Nothing was written.`
      );
    }

    // Advisory only. The bytes an entry mints carry the block it was written at,
    // so a mint that was re-composed after the crash legitimately hashes to
    // something else; that is a fact worth recording, not a reason to refuse.
    checks.matchesIntent = null;
    if (stored.finalHashHex) {
      const byHash = await lookupIdByHash({ fetchImpl: io.fetchImpl, hiroUrl, finalHashHex: stored.finalHashHex });
      checks.matchesIntent = byHash === null ? null : String(byHash) === String(inscriptionId);
    }

    patch = {
      status: 'confirmed',
      inscriptionId: String(inscriptionId),
      recovered: true,
      resolution: 'landed',
      resolvedBy: 'operator',
      resolvedAt,
      note:
        note ??
        `settled by hand: a human verified #${inscriptionId} is ${label} of thread ${threadId}` +
          `${checks.matchesIntent === true ? ' and that it is the intent recorded here' : ''}` +
          `${checks.matchesIntent === false ? ', composed differently from the intent recorded here' : ''}.`
    };
    message =
      `${label} is now recorded as #${inscriptionId}, verified against its own front matter and settled by hand ` +
      `at ${resolvedAt}.`;
  } else {
    // You cannot abandon something that landed. Three independent ways of asking.
    if (stored.inscriptionId) {
      const read = await readEntryFromChain({ fetchImpl: io.fetchImpl, hiroUrl, id: stored.inscriptionId });
      checks.recordedId = read.found;
      if (read.found) {
        throw new WizardSafetyError(
          `refusing to abandon ${label}: it is recorded as #${stored.inscriptionId} and #${stored.inscriptionId} ` +
            'is on chain. It landed. Nothing was written.'
        );
      }
    }
    if (stored.finalHashHex) {
      const byHash = await lookupIdByHash({ fetchImpl: io.fetchImpl, hiroUrl, finalHashHex: stored.finalHashHex });
      checks.contentHash = byHash;
      if (byHash) {
        throw new WizardSafetyError(
          `refusing to abandon ${label}: the exact bytes it was going to mint are on chain as #${byHash}. It ` +
            `landed. Record it with --resolve ${key} landed:${byHash} instead. Nothing was written.`
        );
      }
    }
    if (stored.txid) {
      const seen = await fetchTransaction({ fetchImpl: io.fetchImpl, hiroUrl, txid: stored.txid });
      checks.txStatus = seen.txStatus;
      const verdict = classifyTxStatus(seen.txStatus);
      if (verdict === 'success') {
        throw new WizardSafetyError(
          `refusing to abandon ${label}: transaction ${stored.txid} succeeded. It landed. Re-run to let the ` +
            'runner read the id out of it. Nothing was written.'
        );
      }
      if (verdict === 'pending') {
        throw new WizardSafetyError(
          `refusing to abandon ${label}: transaction ${stored.txid} has not reached a terminal status and may ` +
            'still confirm. Watch it, and abandon it only once the chain says it will not. Nothing was written.'
        );
      }
    }
    if (stored.status === 'abandoned') {
      throw new WizardSafetyError(`${label} is already abandoned (${stored.note ?? 'no reason recorded'}).`);
    }

    checks.nonce = classifyIntentNonce({
      intendedNonce: stored.intendedNonce ?? null,
      nonces: await fetchSenderNonces({ fetchImpl: io.fetchImpl, hiroUrl, address: stored.senderAddress ?? null })
    });

    patch = {
      status: 'abandoned',
      txid: null,
      inscriptionId: null,
      finalHashHex: null,
      intendedNonce: null,
      protocolFeeUstx: null,
      minerFeeUstx: null,
      actualMinerFeeUstx: null,
      resolution: 'abandoned',
      resolvedBy: 'operator',
      resolvedAt,
      note:
        note ??
        `settled by hand: a human established this was never minted. At the time of the decision, ${checks.nonce.why}.`,
      previousIntents: [
        ...(stored.previousIntents ?? []),
        archiveIntent(stored, { reason: 'operator-abandoned', note: checks.nonce.why })
      ]
    };
    message =
      `${label} is now recorded as abandoned, settled by hand at ${resolvedAt}. The next run composes it again ` +
      'from scratch.';
  }

  journal.positions[key] = { ...stored, ...patch, updatedAt: resolvedAt };
  journal.updatedAt = resolvedAt;
  assertJournalSecretFree(journal);
  io.writeJournal(journalPath, journal);

  return {
    ok: true,
    threadId,
    key,
    label,
    resolution,
    inscriptionId: patch.inscriptionId ?? null,
    resolvedAt,
    journalPath,
    journal,
    record: journal.positions[key],
    checks,
    message
  };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

const pad = (value, width) => String(value ?? '').padEnd(width);
const shortTxid = (txid) => (txid ? `${String(txid).slice(0, 10)}…${String(txid).slice(-6)}` : '—');

/** The status table. Pure string building. */
export function formatStatusTable(report) {
  const lines = [];
  lines.push(`--- thread ${report.threadId} (${report.mode}) ---`);
  lines.push(report.journalFound ? `journal: ${report.journalPath}` : `journal: none at ${report.journalPath}`);
  lines.push('');
  lines.push(`  ${pad('pos', 5)}${pad('wizard', 26)}${pad('journal', 14)}${pad('chain', 12)}${pad('id', 9)}${pad('block', 11)}txid`);
  for (const row of report.rows) {
    lines.push(
      `  ${pad(row.position ?? 'man', 5)}${pad(row.wizard, 26)}${pad(row.journalStatus, 14)}${pad(row.chain, 12)}` +
        `${pad(row.inscriptionId ? `#${row.inscriptionId}` : '—', 9)}${pad(row.block ? groupDigits(row.block) : '—', 11)}` +
        shortTxid(row.txid)
    );
    if (row.note) lines.push(`         ${row.note}`);
  }
  lines.push('');
  lines.push(`committed so far, by this runner: ${groupDigits(report.committedUstx)} microSTX`);
  return lines.join('\n');
}

/** What an operator decision changed. Pure string building. */
export function formatResolution(result) {
  const lines = [''];
  lines.push(`--- thread ${result.threadId}: ${result.label} resolved as ${result.resolution} ---`);
  lines.push('');
  lines.push(`  ${result.message}`);
  if (result.checks?.nonce?.why) lines.push(`  nonce   : ${result.checks.nonce.why}`);
  if (result.checks?.matchesIntent === false) {
    lines.push('  note    : the inscription does not hash to the intent recorded here, which is expected when the');
    lines.push('            entry was composed again at a later block.');
  }
  lines.push(`  journal : ${result.journalPath}`);
  lines.push('');
  lines.push('Nothing was signed and nothing was sent. This wrote one decision to the journal.');
  return lines.join('\n');
}

/** The run report. Pure string building. */
export function formatRunReport(result) {
  const lines = [];
  lines.push('');
  lines.push(
    result.broadcast
      ? `--- thread ${result.threadId} (BROADCAST) ---`
      : `--- thread ${result.threadId} (DRY RUN — injected fakes, nothing signed, nothing sent) ---`
  );
  for (const member of result.members) {
    lines.push(
      `  ${pad(member.position, 4)}${pad(`#${member.id}`, 9)}${pad(member.wizardName, 26)}` +
        `block ${pad(member.block ? groupDigits(member.block) : '?', 11)}` +
        `${member.costMicroStx ? `${groupDigits(member.costMicroStx)} microSTX` : ''}`
    );
  }
  const manifestRecord = result.journal?.positions?.[MANIFEST_KEY] ?? null;
  if (manifestRecord) {
    lines.push(
      `  ${pad('man', 4)}${pad(manifestRecord.inscriptionId ? `#${manifestRecord.inscriptionId}` : '—', 9)}` +
        `${pad(manifestRecord.wizardName ?? '', 26)}${manifestRecord.status}`
    );
  }
  lines.push('');
  lines.push(
    `committed: ${groupDigits(result.committedUstx)} microSTX (${microStxToStx(result.committedUstx)} STX) ` +
      `of a run cap of ${groupDigits(result.runSpendCapUstx)}`
  );
  lines.push(
    `journal  : ${result.journalPath}${result.broadcast ? '' : '  (a dry run keeps this in memory; the ids and txids above are invented)'}`
  );
  if (result.halted) {
    lines.push('');
    lines.push(`HALTED (${result.halted.reason})`);
    for (const line of String(result.halted.message).split('\n')) lines.push(`  ${line}`);
    if (result.halted.reason === 'timeout') {
      lines.push('');
      lines.push('  A timeout is not a failed transaction. Nothing here should be re-broadcast.');
    }
  } else {
    lines.push('');
    lines.push(result.broadcast ? 'Thread complete.' : 'Dry run complete. Nothing was signed and nothing was sent.');
  }
  return lines.join('\n');
}
