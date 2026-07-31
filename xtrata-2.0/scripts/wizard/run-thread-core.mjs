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
 *     polled. A position whose intent was written but whose txid never was is
 *     resolved against the chain by content hash — the bytes are deterministic,
 *     so if the mint landed, `get-id-by-hash` finds it — and if that comes back
 *     empty the run halts rather than guessing, because "not indexed yet" and
 *     "never sent" look identical from here and only one of them is safe.
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

/** Bumped when the on-disk journal shape changes incompatibly. */
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
 */
export const POSITION_STATUSES = ['external', 'broadcasting', 'broadcast', 'confirmed', 'failed', 'timeout'];

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
  'journal'
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
 */
export function committedSpendUstx(journal) {
  let total = 0n;
  for (const record of Object.values(journal?.positions ?? {})) {
    if (!record || record.status === 'external') continue;
    if (!['broadcasting', 'broadcast', 'confirmed', 'failed', 'timeout'].includes(record.status)) continue;
    const protocolFee = BigInt(record.protocolFeeUstx ?? 0);
    const minerFee = BigInt(record.actualMinerFeeUstx ?? record.minerFeeUstx ?? 0);
    total += protocolFee + minerFee;
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
    confirmPollMs = DEFAULT_CONFIRM_POLL_MS
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
      const existing = journal.positions[key] ?? null;

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

      // Intent written, txid never was. The crash window. Never re-broadcast:
      // the bytes are deterministic, so ask the chain whether they are already
      // there, and if the answer is no, stop — "not yet indexed" and "never
      // sent" are the same answer from here and only one is safe to act on.
      if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveUnrecordedBroadcast({
          fetchImpl,
          hiroUrl,
          record: existing,
          position,
          threadId
        });
        if (!resolved) {
          throw new RunHalt(
            'unresolved',
            `position ${position} has an intent record from an earlier run but no transaction id, and no ` +
              'inscription with those exact bytes is on chain yet. That transaction may still be in the ' +
              'mempool. This runner will not broadcast it again: a second mint would be just as permanent as ' +
              `the first. Check ${existing.senderAddress ?? 'the wizard wallet'} in the explorer, wait for the ` +
              'mempool to clear, and run --status again.',
            { position, finalHashHex: existing.finalHashHex }
          );
        }
        record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
        members.push(resolved.member);
        io.say(`  position ${position}: recovered as #${resolved.id} by content hash; no second broadcast`);
        continue;
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
      const existing = journal.positions[key] ?? null;
      guard('the manifest');

      if (existing && existing.status === 'confirmed' && existing.inscriptionId) {
        io.say(`  manifest: already #${existing.inscriptionId}, nothing to broadcast`);
      } else if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveUnrecordedBroadcast({ fetchImpl, hiroUrl, record: existing, threadId });
        if (!resolved) {
          throw new RunHalt(
            'unresolved',
            'the manifest has an intent record from an earlier run but no transaction id, and no inscription ' +
              'with those exact bytes is on chain yet. It may still be in the mempool. This runner will not ' +
              'broadcast it again. Run --status once the mempool has cleared.'
          );
        }
        record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
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
 * A position whose intent was written but whose txid was not, resolved against
 * the chain by the content hash recorded at intent time.
 *
 * The hash is what makes this possible. An entry states the block it was written
 * at, so re-composing it later produces different bytes; the hash recorded
 * before the broadcast is the only stable handle on what was actually signed.
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
    broadcastAt: iso(io.now())
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
        // The ambiguous state. Resolve it the same way a resumed run would.
        const resolved = await resolveUnrecordedBroadcast({ fetchImpl: io.fetchImpl, hiroUrl, record: stored, threadId });
        if (resolved) {
          row.inscriptionId = resolved.id;
          row.chain = 'confirmed';
          row.note = 'recovered by content hash: the mint landed but its txid was never recorded';
        } else {
          row.chain = 'unresolved';
          row.note =
            'intent recorded, no txid, and nothing with those bytes on chain. It may still be in the mempool. ' +
            'Do not broadcast it again.';
        }
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
