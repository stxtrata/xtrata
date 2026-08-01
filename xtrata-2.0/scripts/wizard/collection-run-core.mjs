/**
 * collection-run-core.mjs — mint "The Machinery", minus the terminal.
 *
 * run-thread-core.mjs drives a six-entry argument whose every reply has to
 * quote an id that does not exist until the previous transaction confirms. This
 * drives something simpler and stranger: eight drawings that depend on nothing,
 * followed by one manifest that depends on all of them.
 *
 * The safety machinery is imported, not restated. The journal shape, the nonce
 * asymmetry, the run-level spend cap, the poll-to-terminal, the halt type and
 * the secret check all come from run-thread-core.mjs, and the per-mint rails
 * come from inscribe.mjs, because a second implementation of "did this
 * transaction land" is exactly one too many. market-run-core.mjs does the same
 * thing for the same reason.
 *
 * What is different here, and it is the only interesting difference:
 *
 *   **A plate is byte-reproducible from its index.** It names no block and no
 *   fee, so composing it again after a crash produces the same bytes and the
 *   same final hash. `get-id-by-hash` is therefore a permanently decisive probe
 *   for a piece: a run that lost a transaction id can ask the chain today,
 *   tomorrow or next year and get the same answer. A corpus entry cannot do
 *   that — it quotes the block it was written at, so a retry hashes to
 *   something else and the orphaned intent can never afterwards be matched,
 *   which is why the thread runner needs `--resolve` and a human. This runner
 *   does not, and does not pretend to offer one.
 *
 *   The nonce still earns its place. It is what turns "not on chain yet" into
 *   "never sent" quickly, instead of leaving a run to wait for a mempool it
 *   cannot see the end of. The asymmetry is unchanged and is imported whole: a
 *   last-executed nonce BELOW the intended one proves absence; at or above it
 *   proves nothing.
 *
 *   **Membership is verified by byte equality, not by quotation.** The corpus
 *   guards its manifest with `verifyParentQuote`, because the only handle it
 *   has on a member is a fragment of that member's prose. Here the whole file
 *   is regenerable, so the manifest refuses to name an id whose chunk u0 is not
 *   byte-identical to the plate it claims to be. That is a strictly stronger
 *   check than the corpus can make and it is the one rail in this file that is
 *   genuinely new.
 *
 * Everything is injected: fetch, submit, the clock, sleep, journal read and
 * write, the kill-switch probe and the presenter. There is no terminal in this
 * file, no direct network call and no direct disk access.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { uintCV } from '@stacks/transactions';

import {
  CORE_ADDRESS,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  DEFAULT_SPEND_CAP_USTX,
  WizardSafetyError,
  assertBroadcastAllowed,
  buildMintCall,
  callReadOnly,
  checkCorePaused,
  checkDuplicateContent,
  checkPendingNonce,
  checkThreadAffordability,
  fetchChainTip,
  fetchStxBalance,
  formatPostCondition,
  groupDigits,
  killSwitchEngaged,
  microStxToStx,
  quoteSingleTxFee,
  truncate
} from './inscribe.mjs';
import {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  MANIFEST_KEY,
  POSITION_STATUSES,
  RunHalt,
  archiveIntent,
  assertJournalSecretFree,
  assertRunSpendCap,
  classifyTxStatus,
  committedSpendUstx,
  fetchTransaction,
  formatDuration,
  normaliseTxid,
  optionalValue,
  parseMintResult,
  pollTransaction,
  readEntryFromChain,
  readIntendedNonce,
  resolveIntent
} from './run-thread-core.mjs';
import { getPersona } from './personas.mjs';
import {
  COLLECTION_ID,
  COLLECTION_LENGTH,
  COLLECTION_MIME,
  COLLECTION_TITLE,
  COLLECTION_WIZARD
} from './collection-art.mjs';
import { COLLECTION_IDS, DEFAULT_COLLECTION_ID, getCollection } from './collections.mjs';

export {
  COLLECTION_ID,
  COLLECTION_IDS,
  COLLECTION_LENGTH,
  COLLECTION_MIME,
  COLLECTION_TITLE,
  COLLECTION_WIZARD,
  DEFAULT_COLLECTION_ID,
  getCollection,
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_HIRO_URL,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  MANIFEST_KEY,
  POSITION_STATUSES,
  RunHalt,
  WizardSafetyError,
  groupDigits,
  microStxToStx
};

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Which collection a call is about.
 *
 * Every entry point below takes a `collectionId` and resolves it here, and the
 * default is the Builder's, so a caller that names nothing gets exactly the
 * behaviour this file had when there was only one collection to have. Passing
 * an id that is not one of the three throws rather than quietly rendering
 * somebody else's plates under it, which would put the wrong drawing on chain
 * under the right name.
 */
const artFor = (collectionId) => getCollection(collectionId ?? DEFAULT_COLLECTION_ID);

const errorMessage = (error) => (error instanceof Error ? error.message : String(error));
const iso = (ms) => new Date(ms).toISOString();
const pieceKey = (index) => String(index);

/**
 * Bumped when the on-disk journal shape changes incompatibly. A collection
 * journal keys its records by piece index and the thread journal keys them by
 * thread position, so they are the same shape and read the same way; the
 * version is tracked separately because the two files can move apart later.
 */
export const COLLECTION_JOURNAL_VERSION = 1;

/**
 * Where a collection run's journal lives.
 *
 * A different prefix from `.run-<id>.json` and `.market-<id>.json` on purpose.
 * A file loaded by the wrong runner would be read as a set of records with no
 * ids and treated as work still to do, which for a runner holding a key is the
 * expensive kind of misunderstanding.
 */
export function collectionJournalPathFor({ dir = HERE, collectionId = COLLECTION_ID, mode = 'broadcast' } = {}) {
  const id = String(collectionId ?? '').trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    throw new WizardSafetyError(
      `"${id}" is not a usable collection id for a journal file name. Use letters, digits, dot, dash and ` +
        'underscore, starting with a letter or digit.'
    );
  }
  return join(dir, `.collection-${id}${mode === 'dry' ? '.dry' : ''}.json`);
}

export function emptyCollectionJournal({ collectionId, collectionLength = COLLECTION_LENGTH, mode = 'broadcast', startedAt }) {
  return {
    version: COLLECTION_JOURNAL_VERSION,
    collectionId,
    collectionLength,
    mode,
    startedAt,
    updatedAt: startedAt,
    /** keyed by piece index, plus `manifest`; shaped like a thread position. */
    pieces: {}
  };
}

/**
 * What this run has committed, in microSTX.
 *
 * Hands the thread runner's accounting the records under the key it expects,
 * exactly as the market runner does. The number exists to stop a loop, and two
 * ways of adding it up is two ways of getting it wrong.
 */
export const committedCollectionSpendUstx = (journal) => committedSpendUstx({ positions: journal?.pieces ?? {} });

/** Token uris. Short, ascii, inside the 256 bound the core enforces. */
export const tokenUriForPiece = ({ collectionId = COLLECTION_ID, index }) =>
  `xtrata:wizard/collection/${collectionId}/${index}`;
export const tokenUriForCollectionManifest = ({ collectionId = COLLECTION_ID }) =>
  `xtrata:wizard/collection/${collectionId}/manifest`;

/* ------------------------------------------------------------------ */
/* reading a plate back off chain                                      */
/* ------------------------------------------------------------------ */

/**
 * One inscription's body. Plates are always exactly one chunk, so chunk u0 is
 * the whole file. `readEntryFromChain` tries to parse it as a corpus entry and
 * hands back `entry: null` when it is not one, which an SVG never is.
 */
export const readPieceFromChain = async ({ fetchImpl, hiroUrl = DEFAULT_HIRO_URL, id }) =>
  readEntryFromChain({ fetchImpl, hiroUrl, id });

/**
 * Load a member and check it really is the plate it is recorded as, by
 * comparing every byte to the plate this process can regenerate.
 *
 * The corpus can only check that a quoted fragment appears somewhere in a
 * parent's bytes, because it cannot reproduce the parent. Here the comparison
 * is total: equal, or the id is wrong and nothing may cite it.
 */
export async function hydratePiece({
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  id,
  index,
  txid = null,
  collectionId = DEFAULT_COLLECTION_ID
} = {}) {
  const art = artFor(collectionId);
  const piece = art.getPiece(index);
  const read = await readPieceFromChain({ fetchImpl, hiroUrl, id });
  if (!read.found) {
    throw new WizardSafetyError(
      `piece ${piece.index} of ${art.id} is recorded as inscription #${id}, but #${id} has no chunk u0 on ` +
        'chain. Nothing can list a piece that is not there.'
    );
  }
  const expected = art.renderPiece(piece.index);
  if (read.body !== expected) {
    throw new WizardSafetyError(
      `#${id} is on chain but its bytes are not piece ${piece.index} (${piece.id}) of ${art.id}. A plate is ` +
        'a pure function of its index, so this comparison is exact and there is nothing to interpret: the id is ' +
        'wrong, or something other than this generator wrote it.'
    );
  }
  return { index: piece.index, id: String(id), pieceId: piece.id, caption: piece.caption, txid, body: read.body };
}

/**
 * CHECK 1, and the analogue of the corpus's parent-quote rail.
 *
 * The manifest names eight ids and says each one holds a particular drawing.
 * That claim is signed, minted and permanent, so it is checked against the
 * chain first: chunk u0 of each id must equal the plate for that index byte for
 * byte, and where an expected creator address is configured the core must agree
 * that wizard made it.
 *
 * Fails closed. An id that could not be read is not an id that passed.
 */
export async function verifyCollectionMembers({
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  members = [],
  expectedAddress = null,
  senderAddress = CORE_ADDRESS,
  collectionId = DEFAULT_COLLECTION_ID
} = {}) {
  const art = artFor(collectionId);
  if (members.length === 0) {
    return { name: 'members', status: 'not-applicable', ok: true, results: [], failures: [], note: 'nothing is listed' };
  }

  const results = [];
  for (const member of members) {
    const id = String(member?.id ?? '').trim();
    const index = Number(member?.index);
    if (!id) {
      results.push({ index, id, status: 'no-id', message: `piece ${index} has no inscription id to check` });
      continue;
    }
    try {
      const read = await readPieceFromChain({ fetchImpl, hiroUrl, id });
      if (!read.found) {
        results.push({ index, id, status: 'no-chunk', message: `#${id} has no chunk u0 on chain` });
        continue;
      }
      if (read.body !== art.renderPiece(index)) {
        results.push({
          index,
          id,
          status: 'bytes-differ',
          found: truncate(read.body, 120),
          message: `#${id} is not byte-identical to piece ${index}`
        });
        continue;
      }
      if (!expectedAddress) {
        results.push({ index, id, status: 'ok', authorChecked: false, note: 'no expected creator address configured' });
        continue;
      }
      const parsed = await callReadOnly({
        fetchImpl,
        hiroUrl,
        senderAddress,
        functionName: 'get-inscription-creator',
        functionArgs: [uintCV(BigInt(id))]
      });
      const creator = optionalValue(parsed);
      const foundAuthor = creator ? String(creator.value) : null;
      if (foundAuthor !== expectedAddress) {
        results.push({
          index,
          id,
          status: 'wrong-author',
          expectedAuthor: expectedAddress,
          foundAuthor,
          message: `#${id} was created by ${foundAuthor ?? '(no creator on chain)'}, not ${expectedAddress}`
        });
        continue;
      }
      results.push({ index, id, status: 'ok', authorChecked: true, expectedAuthor: expectedAddress, foundAuthor });
    } catch (error) {
      results.push({ index, id, status: 'unavailable', message: `could not read #${id}: ${errorMessage(error)}` });
    }
  }

  const failures = results.filter((result) => result.status !== 'ok');
  const unavailable = results.some((result) => result.status === 'unavailable');
  return {
    name: 'members',
    status: failures.length === 0 ? 'verified' : unavailable ? 'unavailable' : 'failed',
    ok: failures.length === 0,
    results,
    failures
  };
}

/** Throws before a manifest can be signed over ids that did not check out. */
export function assertMembersMatch(check) {
  if (!check || check.ok === true) return check;
  const detail = (check.failures ?? check.results ?? [])
    .filter((result) => result.status !== 'ok')
    .map((result) => `  - ${result.message ?? `piece ${result.index} failed verification`}`)
    .join('\n');
  throw new WizardSafetyError(
    'refusing to broadcast the manifest: at least one listed id is not the piece it is listed as.\n' +
      `${detail || `  - ${check.note ?? check.status}`}\n` +
      'Every plate is a pure function of its index, so this is a byte comparison and not a judgement call. Fix ' +
      'the ids before anything permanent names them.'
  );
}

/* ------------------------------------------------------------------ */
/* planning                                                            */
/* ------------------------------------------------------------------ */

const planFor = async ({
  record,
  index,
  body,
  tokenUri,
  parentIds,
  art,
  collectionId,
  persona,
  blockHeight,
  fetchImpl,
  hiroUrl,
  senderAddress,
  spendCapUstx,
  balanceFloorUstx,
  minerFeeUstx,
  env,
  remainingMints,
  memberCheck
}) => {
  const block =
    blockHeight !== null && blockHeight !== undefined
      ? BigInt(blockHeight)
      : await fetchChainTip({ fetchImpl, hiroUrl });

  const call = buildMintCall({ body, mime: record === 'manifest' ? 'text/markdown' : art.mime, tokenUri, parentIds });

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

  return {
    record,
    collectionId,
    collectionTitle: art.title,
    index,
    pieceId: index === null ? null : art.getPiece(index).id,
    askUstx: record === 'manifest' ? art.price.manifestUstx : art.price.pieceUstx,
    collectionLength: art.length,
    wizard: persona,
    parentIds: parentIds.map(String),
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
    checks: {
      // The corpus's rail does not apply: a drawing quotes nothing. Membership
      // is checked by byte equality instead, which is why this is stated as
      // not-applicable rather than quietly left out of the report.
      parentQuote: {
        name: 'parent quote',
        status: 'not-applicable',
        ok: true,
        results: [],
        note: 'a plate quotes nothing; membership is checked by byte equality'
      },
      members: memberCheck ?? {
        name: 'members',
        status: 'not-applicable',
        ok: true,
        results: [],
        failures: [],
        note: 'a plate lists no members'
      },
      corePaused: await checkCorePaused({ fetchImpl, hiroUrl, senderAddress: senderAddress ?? CORE_ADDRESS }),
      collectionAffordability: checkThreadAffordability({
        threadLength: remainingMints,
        plannedSpendUstx,
        balanceUstx,
        balanceFloorUstx
      }),
      duplicateContent: await checkDuplicateContent({
        fetchImpl,
        hiroUrl,
        senderAddress: senderAddress ?? CORE_ADDRESS,
        finalHash: call.finalHash
      }),
      pendingNonce: await checkPendingNonce({ fetchImpl, hiroUrl, address: senderAddress })
    },
    skippedChecks: []
  };
};

/** The plan for one plate. Same shape the thread runner's plans have. */
export async function planPiece({
  index,
  collectionId = DEFAULT_COLLECTION_ID,
  wizard = null,
  blockHeight = null,
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = null,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  env = {},
  remainingMints = 1
} = {}) {
  const art = artFor(collectionId);
  const piece = art.getPiece(index);
  return planFor({
    record: 'piece',
    index: piece.index,
    body: art.renderPiece(piece.index),
    tokenUri: tokenUriForPiece({ collectionId: art.id, index: piece.index }),
    // No dependency between plates. There is no relationship between them to
    // record: a collection is a set, and the only edge worth minting is the
    // one from the manifest to each member.
    parentIds: [],
    art,
    collectionId: art.id,
    persona: getPersona(wizard ?? art.wizard),
    blockHeight,
    fetchImpl,
    hiroUrl,
    senderAddress,
    spendCapUstx,
    balanceFloorUstx,
    minerFeeUstx,
    env,
    remainingMints
  });
}

/** The plan for the closing manifest, with every member as a dependency. */
export async function planCollectionManifest({
  members = [],
  collectionId = DEFAULT_COLLECTION_ID,
  wizard = null,
  blockHeight = null,
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = null,
  expectedAddress = null,
  spendCapUstx = DEFAULT_SPEND_CAP_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  env = {}
} = {}) {
  const art = artFor(collectionId);
  const memberCheck = await verifyCollectionMembers({
    fetchImpl,
    hiroUrl,
    members,
    expectedAddress,
    senderAddress: senderAddress ?? CORE_ADDRESS,
    collectionId: art.id
  });

  return planFor({
    record: 'manifest',
    index: null,
    body: art.composeManifest({ collectionId: art.id, members }),
    tokenUri: tokenUriForCollectionManifest({ collectionId: art.id }),
    parentIds: members.map((member) => String(member.id)),
    art,
    collectionId: art.id,
    persona: getPersona(wizard ?? art.wizard),
    blockHeight,
    fetchImpl,
    hiroUrl,
    senderAddress,
    spendCapUstx,
    balanceFloorUstx,
    minerFeeUstx,
    env,
    // One mint, not a collection: the remaining work at this point is the
    // manifest and nothing else.
    remainingMints: 1,
    memberCheck
  });
}

/* ------------------------------------------------------------------ */
/* ports                                                               */
/* ------------------------------------------------------------------ */

/**
 * Everything from outside. The defaults read nothing and refuse to broadcast,
 * so a caller that supplies no ports gets a run that spends nothing rather than
 * one that quietly uses the real network.
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

/**
 * Mint the collection: every remaining plate, then the manifest.
 *
 * Never throws for a condition it expects. A refusal, a failure, a timeout and
 * a kill are all returned as `{ ok: false, halted: { reason, message } }`,
 * because by the time any of them happens there is state worth reporting and an
 * exception thrown out of the middle of the loop loses it.
 */
export async function runCollection({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    collectionId = DEFAULT_COLLECTION_ID,
    from = 1,
    to = null,
    broadcast = false,
    manifest = true,
    wizard = null,
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
  // The collection decides the wizard, not the caller. A run that minted the
  // Skeptic's plates out of the Archivist's wallet would put the wrong creator
  // on chain, permanently, against the one claim these files make about who
  // paid for them. `wizard` stays overridable only because the runner passes
  // the resolved persona object back in on the manifest leg.
  const art = artFor(collectionId);
  const persona = getPersona(wizard ?? art.wizard);
  const wallet = wallets[persona.id] ?? {};
  const guard = (step) => {
    const reason = io.killSwitch(env);
    if (reason) {
      throw new RunHalt('kill-switch', `kill switch engaged (${reason}) before ${step}. The run stops here.`, { step });
    }
  };

  const first = Number(from);
  const last = to === null || to === undefined ? art.length : Number(to);
  if (!Number.isInteger(first) || first < 1 || first > art.length) {
    throw new WizardSafetyError(`--from ${from} is not a piece in a collection of ${art.length}`);
  }
  if (!Number.isInteger(last) || last < first || last > art.length) {
    throw new WizardSafetyError(
      `--to ${to} is not a piece at or after ${first} in a collection of ${art.length}`
    );
  }

  const journalPath = collectionJournalPathFor({ dir: journalDir, collectionId: art.id, mode });
  const startedAt = iso(io.now());
  const journal =
    io.readJournal(journalPath) ??
    emptyCollectionJournal({ collectionId: art.id, collectionLength: art.length, mode, startedAt });

  const members = [];
  let halted = null;

  const save = () => {
    journal.updatedAt = iso(io.now());
    assertJournalSecretFree(
      journal,
      Object.values(wallets).map((entry) => entry?.key)
    );
    io.writeJournal(journalPath, journal);
  };

  const record = (key, patch) => {
    // A typo in a status string would be silent and would change what a
    // resumed run is willing to do with the piece.
    if (patch.status && !POSITION_STATUSES.includes(patch.status)) {
      throw new WizardSafetyError(`"${patch.status}" is not a known piece status`);
    }
    journal.pieces[key] = { ...(journal.pieces[key] ?? {}), ...patch, updatedAt: iso(io.now()) };
    save();
    return journal.pieces[key];
  };

  /**
   * Clear an intent the nonce has proved was never mined, keeping what it said.
   *
   * Safe here and nowhere else: a nonce below the intended one is proof the
   * transaction never confirmed, so there is nothing on chain for a second mint
   * to duplicate.
   */
  const clearIntent = (key, stranded, nonce) =>
    record(key, {
      status: 'abandoned',
      txid: null,
      inscriptionId: null,
      finalHashHex: null,
      intendedNonce: null,
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

  /**
   * What a run says when it will not decide for itself.
   *
   * Shorter than the thread runner's equivalent and deliberately so: it ends
   * with "run --status again" rather than with an operator verdict, because a
   * plate's bytes never change and the content-hash probe therefore stays
   * decisive forever. There is nothing here for a human to adjudicate, only
   * something to wait for.
   */
  const unresolvedMessage = (key, stranded, resolved) => {
    const label = key === MANIFEST_KEY ? 'the manifest' : `piece ${key}`;
    const where = stranded.senderAddress ?? 'the wizard wallet';
    return (
      `${label} has an intent record from an earlier run but no transaction id, and no inscription with those ` +
      `exact bytes is on chain yet. ${resolved.nonce?.why ?? 'The wallet nonce says nothing about it either.'} ` +
      (resolved.outcome === 'pending'
        ? `After ${formatDuration(resolved.waitedMs)} of waiting it is still in the mempool, which is not a failure ` +
          'and not a loss. '
        : '') +
      'This runner will not broadcast it again: a second mint would be just as permanent as the first. ' +
      `Watch ${where} in the explorer and run --status. Unlike a corpus entry, this file names no block and no ` +
      'fee, so its content hash never changes and --status can settle it definitively at any point in the future.'
    );
  };

  /** Wait for one recorded txid and turn its outcome into journal state. */
  const settle = async ({ key, index, txid }) => {
    const label = index === null ? 'the manifest' : `piece ${index}`;
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
          { index, txid }
        );
      }
      throw error;
    }

    if (outcome.outcome === 'timeout') {
      record(key, { status: 'timeout', txid, txStatus: outcome.txStatus ?? 'pending' });
      throw new RunHalt(
        'timeout',
        `${label} did not reach a terminal status within ${Math.round(outcome.elapsedMs / 60000)} minutes. ` +
          `THIS IS NOT A FAILURE. Transaction ${txid} may still confirm, and the run journal holds its id. Do not ` +
          'broadcast this piece again. Re-run with the same --from once it lands, or use --status to watch it.',
        { index, txid }
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
          (String(outcome.txStatus).startsWith('abort')
            ? 'An abort still pays the miner fee. Read the transaction in the explorer before doing anything else.'
            : 'A dropped transaction spent nothing, but something replaced or evicted it. Find out what.'),
        { index, txid, txStatus: outcome.txStatus }
      );
    }

    const { inscriptionId, existed } = parseMintResult(outcome.result);
    record(key, {
      status: 'confirmed',
      txid,
      txStatus: outcome.txStatus,
      inscriptionId,
      existed,
      confirmedBlock:
        outcome.blockHeight === null || outcome.blockHeight === undefined ? null : String(outcome.blockHeight),
      actualMinerFeeUstx: outcome.feeRate === null || outcome.feeRate === undefined ? null : String(outcome.feeRate),
      confirmedAt: iso(io.now())
    });
    io.say(
      `    confirmed in block ${outcome.blockHeight ?? '?'} as inscription #${inscriptionId}` +
        (existed ? '  (existed already: these exact bytes were on chain before this mint)' : '')
    );

    if (index === null) return { id: inscriptionId, existed };
    guard(`reading #${inscriptionId} back`);
    return hydratePiece({ fetchImpl, hiroUrl, id: inscriptionId, index, txid, collectionId: art.id });
  };

  /** Broadcast one plan, record the txid, then wait for it. */
  const broadcastAndSettle = async ({ key, index, plan }) => {
    // The nonce this transaction is about to be signed with, read before the
    // intent is written so the write stays adjacent to the submit below.
    const intendedNonce = await readIntendedNonce({
      fetchImpl,
      hiroUrl,
      address: plan.senderAddress,
      fallback: plan.checks?.pendingNonce?.nextNonce ?? null
    });

    // Intent, before anything is signed. There is deliberately no kill-switch
    // check between this write and the submit: the caller checks immediately
    // before calling, and a check here could leave an intent standing for a
    // transaction that was provably never sent.
    record(key, {
      index,
      wizard: persona.id,
      wizardName: persona.name,
      status: 'broadcasting',
      txid: null,
      inscriptionId: null,
      finalHashHex: plan.call.finalHashHex,
      blockHeight: String(plan.block),
      tokenUri: plan.call.tokenUri,
      mime: plan.call.mime,
      parentIds: plan.parentIds,
      protocolFeeUstx: String(plan.protocolFeeUstx),
      minerFeeUstx: String(plan.minerFeeUstx),
      senderAddress: plan.senderAddress,
      intendedNonce,
      broadcastAt: iso(io.now()),
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
      // happened after the node accepted it. Leave the intent standing so the
      // next run resolves it by hash instead of re-broadcasting.
      record(key, { status: 'broadcasting', error: errorMessage(error) });
      throw new RunHalt(
        'unresolved',
        `broadcasting ${index === null ? 'the manifest' : `piece ${index}`} failed: ${errorMessage(error)}. ` +
          'Whether the node accepted it before the error is not knowable from here, so this runner will not send ' +
          'it again. Run --status, which resolves it against the chain by content hash.',
        { index }
      );
    }

    record(key, { status: 'broadcast', txid });
    io.say(`    txid ${txid}`);
    io.say(`    watch https://explorer.hiro.so/txid/${txid}?chain=mainnet`);
    return settle({ key, index, txid });
  };

  try {
    guard('the first step');

    if (journal.version !== COLLECTION_JOURNAL_VERSION) {
      throw new RunHalt(
        'journal',
        `the run journal at ${journalPath} is version ${journal.version}, but this runner writes version ` +
          `${COLLECTION_JOURNAL_VERSION}. Move it aside and check what it says before starting again.`
      );
    }
    if (journal.collectionId !== art.id || journal.mode !== mode) {
      throw new RunHalt(
        'journal',
        `the run journal at ${journalPath} is for collection ${journal.collectionId} in ${journal.mode} mode, not ` +
          `${art.id} in ${mode} mode.`
      );
    }

    // Ids supplied by the operator for plates minted before this runner saw
    // them. Recorded as external so nothing later mistakes them for something
    // this run broadcast and might have to resolve.
    for (const [index, id] of Object.entries(knownIds)) {
      const key = pieceKey(index);
      const existing = journal.pieces[key];
      if (existing?.inscriptionId && String(existing.inscriptionId) !== String(id)) {
        throw new RunHalt(
          'journal',
          `--ids says piece ${index} is #${id}, but the journal already records it as #${existing.inscriptionId}. ` +
            'One of them is wrong and this run will not guess which.'
        );
      }
      if (!existing) {
        journal.pieces[key] = {
          index: Number(index),
          status: 'external',
          inscriptionId: String(id),
          txid: null,
          source: 'operator',
          updatedAt: iso(io.now())
        };
      }
    }
    save();

    // Everything before --from has to already exist on chain, because the
    // manifest lists it. Finding out that one is missing after paying for two
    // more plates is the expensive way to learn it.
    guard('reading the plates already on chain');
    for (let index = 1; index < first; index += 1) {
      const stored = journal.pieces[pieceKey(index)] ?? null;
      const id = stored?.inscriptionId ?? null;
      if (!id) {
        throw new RunHalt(
          'predecessor',
          `refusing to start at piece ${first}: no inscription id is known for piece ${index} of ${art.id}. ` +
            'Pass every earlier id with --ids <id1,id2,...> in piece order.',
          { index }
        );
      }
      let member;
      try {
        member = await hydratePiece({ fetchImpl, hiroUrl, id, index, txid: stored?.txid ?? null, collectionId: art.id });
      } catch (error) {
        throw new RunHalt('predecessor', `refusing to start at piece ${first}: ${errorMessage(error)}`, { index, id });
      }
      members.push(member);
      io.say(`  piece ${index}: #${id} confirmed on chain, byte-identical to the plate`);
    }

    for (let index = first; index <= last; index += 1) {
      const key = pieceKey(index);
      const piece = art.getPiece(index);
      let existing = journal.pieces[key] ?? null;

      guard(`piece ${index}`);

      // Already done, by this run or an earlier one. Read it back rather than
      // trusting the journal.
      if (existing && (existing.status === 'confirmed' || existing.status === 'external') && existing.inscriptionId) {
        const member = await hydratePiece({
          fetchImpl,
          hiroUrl,
          id: existing.inscriptionId,
          index,
          txid: existing.txid ?? null
        });
        members.push(member);
        io.say(`  piece ${index}: already #${member.id}, nothing to broadcast`);
        continue;
      }

      // Intent written, txid never was. The crash window. Never re-broadcast on
      // a guess: ask the chain whether those exact bytes are already there, and
      // if they are not, let the nonce say what the silence means. `position` is
      // null because the thread runner's hydrate is shaped around a corpus
      // entry; the plate is hydrated below with the byte comparison instead.
      if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveIntent({
          fetchImpl,
          hiroUrl,
          record: existing,
          position: null,
          threadId: art.id,
          now: io.now,
          sleep: io.sleep,
          say: io.say,
          guard,
          mempoolWaitMs,
          mempoolPollMs
        });

        if (resolved.outcome === 'landed') {
          const member = await hydratePiece({ fetchImpl, hiroUrl, id: resolved.id, index, collectionId: art.id });
          record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
          members.push(member);
          io.say(`  piece ${index}: recovered as #${resolved.id} by content hash; no second broadcast`);
          continue;
        }
        if (resolved.outcome !== 'absent') {
          throw new RunHalt('unresolved', unresolvedMessage(key, existing, resolved), {
            index,
            finalHashHex: existing.finalHashHex,
            intendedNonce: existing.intendedNonce ?? null,
            nonce: resolved.nonce
          });
        }
        clearIntent(key, existing, resolved.nonce);
        io.say(`  piece ${index}: ${resolved.nonce.why}`);
        io.say('    the orphaned intent is cleared and this plate is generated again from its index');
        existing = null;
      }

      // A txid exists. Poll it. Under no circumstances send another.
      if (existing && existing.txid && existing.status !== 'failed') {
        members.push(await settle({ key, index, txid: existing.txid }));
        continue;
      }

      if (existing && existing.status === 'failed') {
        throw new RunHalt(
          'tx-failed',
          `piece ${index} is recorded as failed (${existing.txStatus ?? 'unknown status'}, tx ` +
            `${existing.txid ?? 'none'}). This runner does not retry a broadcast. Decide what happened, clear that ` +
            `record out of ${journalPath}, and start again deliberately.`,
          { index }
        );
      }

      io.say(`\n  piece ${index} of ${art.length}: ${piece.id} — ${persona.name}`);
      const plan = await planPiece({
        index,
        collectionId,
        wizard: persona,
        fetchImpl,
        hiroUrl,
        senderAddress: wallet.address ?? null,
        spendCapUstx,
        balanceFloorUstx,
        minerFeeUstx,
        env,
        remainingMints: last - index + 1 + (manifest ? 1 : 0)
      });
      io.presentPlan(plan, { broadcast });

      guard(`broadcasting piece ${index}`);
      assertRunSpendCap({
        committedUstx: committedCollectionSpendUstx(journal),
        plannedSpendUstx: plan.plannedSpendUstx,
        runSpendCapUstx,
        label: `piece ${index}`
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

      members.push(await broadcastAndSettle({ key, index, plan }));
    }

    if (manifest && last === art.length && members.length === art.length) {
      const key = MANIFEST_KEY;
      let existing = journal.pieces[key] ?? null;
      guard('the manifest');

      if (existing && existing.status === 'broadcasting' && !existing.txid) {
        const resolved = await resolveIntent({
          fetchImpl,
          hiroUrl,
          record: existing,
          position: null,
          threadId: art.id,
          now: io.now,
          sleep: io.sleep,
          say: io.say,
          guard,
          mempoolWaitMs,
          mempoolPollMs
        });
        if (resolved.outcome === 'landed') {
          record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
          existing = journal.pieces[key];
        } else if (resolved.outcome === 'absent') {
          clearIntent(key, existing, resolved.nonce);
          io.say(`  manifest: ${resolved.nonce.why}`);
          io.say('    the orphaned intent is cleared and the manifest is composed again from the member ids');
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
        await settle({ key, index: null, txid: existing.txid });
      } else if (existing && existing.status === 'failed') {
        throw new RunHalt(
          'tx-failed',
          `the manifest is recorded as failed (${existing.txStatus ?? 'unknown status'}). This runner does not ` +
            'retry a broadcast.'
        );
      } else {
        io.say(`\n  closing manifest: ${persona.name}, listing ${members.length} members`);
        const plan = await planCollectionManifest({
          members,
          collectionId,
          wizard: persona,
          fetchImpl,
          hiroUrl,
          senderAddress: wallet.address ?? null,
          expectedAddress: wallet.address ?? null,
          spendCapUstx,
          balanceFloorUstx,
          minerFeeUstx,
          env
        });
        io.presentPlan(plan, { broadcast });

        guard('broadcasting the manifest');
        assertRunSpendCap({
          committedUstx: committedCollectionSpendUstx(journal),
          plannedSpendUstx: plan.plannedSpendUstx,
          runSpendCapUstx,
          label: 'the manifest'
        });
        // The rail that has no corpus equivalent, checked before the generic
        // ones so its message is the one an operator sees first.
        assertMembersMatch(plan.checks.members);
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

        await broadcastAndSettle({ key, index: null, plan });
      }
    }
  } catch (error) {
    if (error instanceof RunHalt || error instanceof WizardSafetyError || error?.name === 'WizardComposeError') {
      halted = {
        reason: error instanceof RunHalt ? error.reason : 'safety',
        message: error.message,
        detail: error instanceof RunHalt ? error.detail : {}
      };
    } else {
      throw error;
    }
  }

  return {
    ok: halted === null,
    halted,
    collectionId: art.id,
    collectionTitle: art.title,
    collectionLength: art.length,
    mode,
    broadcast,
    journalPath,
    journal,
    members,
    committedUstx: committedCollectionSpendUstx(journal),
    runSpendCapUstx: BigInt(runSpendCapUstx)
  };
}

/* ------------------------------------------------------------------ */
/* status                                                              */
/* ------------------------------------------------------------------ */

/**
 * What is confirmed, what is pending, what is missing — from the journal and
 * from the chain, without running anything.
 *
 * Needs no key, broadcasts nothing, and works on a collection this runner never
 * touched as long as the ids are supplied. Where a piece is on chain it is
 * compared to the plate byte for byte, so `--status` answers "is this the right
 * drawing" and not only "is something there".
 */
export async function collectionStatusReport({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    collectionId = DEFAULT_COLLECTION_ID,
    hiroUrl = DEFAULT_HIRO_URL,
    journalDir = HERE,
    mode = 'broadcast',
    knownIds = {}
  } = options;

  const art = artFor(collectionId);
  const journalPath = collectionJournalPathFor({ dir: journalDir, collectionId: art.id, mode });
  const journal = io.readJournal(journalPath);
  const rows = [];

  for (const key of [...art.pieces.map((piece) => pieceKey(piece.index)), MANIFEST_KEY]) {
    const index = key === MANIFEST_KEY ? null : Number(key);
    const stored = journal?.pieces?.[key] ?? null;
    const id = stored?.inscriptionId ?? knownIds[key] ?? null;
    const row = {
      key,
      index,
      piece: index === null ? 'manifest' : art.getPiece(index).id,
      journalStatus: stored?.status ?? 'not recorded',
      txid: stored?.txid ?? null,
      inscriptionId: id,
      chain: 'missing',
      note: null
    };

    try {
      if (id) {
        const read = await readPieceFromChain({ fetchImpl: io.fetchImpl, hiroUrl, id });
        if (!read.found) {
          row.chain = 'missing';
          row.note = `#${id} has no chunk u0 on chain`;
        } else if (index === null) {
          row.chain = read.entry?.meta?.record === 'collection-manifest' ? 'confirmed' : 'mismatch';
          if (row.chain === 'mismatch') row.note = `#${id} is on chain but is not a collection manifest`;
        } else if (read.body === art.renderPiece(index)) {
          row.chain = 'confirmed';
          row.note = 'byte-identical to the plate';
        } else {
          row.chain = 'mismatch';
          row.note = `#${id} is on chain but its bytes are not piece ${index}`;
        }
      } else if (stored?.txid) {
        const seen = await fetchTransaction({ fetchImpl: io.fetchImpl, hiroUrl, txid: stored.txid });
        const verdict = classifyTxStatus(seen.txStatus);
        row.chain = verdict === 'success' ? 'confirmed' : verdict === 'pending' ? 'pending' : 'failed';
        row.note = seen.known ? `tx ${seen.txStatus}` : 'transaction not visible to the API yet';
        if (verdict === 'success' && seen.result) {
          try {
            row.inscriptionId = parseMintResult(seen.result).inscriptionId;
          } catch (error) {
            row.note = `confirmed, but the result did not parse: ${errorMessage(error)}`;
          }
        }
      } else if (stored?.status === 'broadcasting') {
        // The ambiguous state, resolved the way a resumed run would but without
        // ever waiting: --status is a read that reports, not a run that blocks.
        const resolved = await resolveIntent({
          fetchImpl: io.fetchImpl,
          hiroUrl,
          record: stored,
          position: null,
          threadId: art.id,
          mempoolWaitMs: 0
        });
        if (resolved.outcome === 'landed') {
          row.inscriptionId = resolved.id;
          row.chain = 'confirmed';
          row.note = 'recovered by content hash: the mint landed but its txid was never recorded';
        } else if (resolved.outcome === 'absent') {
          row.chain = 'never-sent';
          row.note = `${resolved.nonce.why}. The next run clears this intent and generates the plate again.`;
        } else {
          row.chain = resolved.outcome === 'pending' ? 'pending' : 'unresolved';
          row.note =
            `${resolved.nonce?.why ?? 'nothing on chain and nothing from the nonce'}. Do not broadcast it again; ` +
            'these bytes never change, so this exact question can be asked again later and answered.';
        }
      } else if (stored?.status === 'abandoned') {
        row.chain = 'abandoned';
        row.note = `settled as never minted: ${stored.note ?? 'no reason recorded'}`;
      }
    } catch (error) {
      row.chain = 'unknown';
      row.note = `could not read: ${errorMessage(error)}`;
    }
    rows.push(row);
  }

  return {
    collectionId: art.id,
    collectionTitle: art.title,
    collectionLength: art.length,
    mode,
    journalPath,
    journalFound: Boolean(journal),
    committedUstx: journal ? committedCollectionSpendUstx(journal) : 0n,
    rows
  };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

const pad = (value, width) => String(value ?? '').padEnd(width);
const shortTxid = (txid) => (txid ? `${String(txid).slice(0, 10)}…${String(txid).slice(-6)}` : '—');
const ustx = (value) => `${groupDigits(value)} microSTX (${microStxToStx(value)} STX)`;

/** One plan, for a terminal. Pure string building. */
export function formatCollectionPlan(plan, { broadcast = false } = {}) {
  const lines = [];
  lines.push(
    broadcast
      ? '--- collection mint plan (BROADCAST — this will spend STX and cannot be undone) ---'
      : '--- collection mint plan (DRY RUN) ---'
  );
  lines.push(`collection  : ${plan.collectionId}  (${plan.collectionTitle ?? COLLECTION_TITLE})`);
  lines.push(
    plan.record === 'manifest'
      ? `record      : closing manifest, listing ${plan.parentIds.length} members`
      : `piece       : ${plan.index} of ${plan.collectionLength}  (${plan.pieceId})`
  );
  lines.push(`wizard      : ${plan.wizard.name}`);
  lines.push(
    `depends on  : ${plan.parentIds.length ? plan.parentIds.map((id) => `#${id}`).join(', ') : '(nothing: a plate is a set member, not an argument)'}`
  );
  lines.push(`block       : ${groupDigits(plan.block)}`);
  lines.push(
    `body        : ${groupDigits(plan.call.totalSize)} bytes / ${plan.call.totalChunks} chunk(s), mime ${plan.call.mime}`
  );
  lines.push(`headroom    : ${groupDigits(16_384 - plan.call.totalSize)} bytes under the single-chunk limit`);
  lines.push(`finalHash   : ${plan.call.finalHashHex}`);
  lines.push(`function    : ${plan.call.functionName}`);
  lines.push(`token-uri   : ${plan.call.tokenUri}`);
  lines.push('');
  lines.push(
    `protocol fee: ${ustx(plan.protocolFeeUstx)}  [${plan.feeSource === 'live-quote' ? 'live quote-inscription-fee, mode u2' : plan.feeSource}]`
  );
  lines.push(`miner fee   : up to ${ustx(plan.minerFeeUstx)}  [a bid, set by the network, not refundable]`);
  lines.push(`planned spend: ${ustx(plan.plannedSpendUstx)}   cap ${ustx(plan.spendCapUstx)}`);
  lines.push(`single-tx eligible: ${plan.quote.singleTxEligible === true ? 'yes' : 'NO'}`);
  lines.push(formatPostCondition(plan.postCondition));
  lines.push(
    plan.senderAddress
      ? `wallet      : ${plan.senderAddress} balance ${plan.balanceUstx === null ? `unknown (${plan.balanceError ?? 'not checked'})` : ustx(plan.balanceUstx)}  floor ${ustx(plan.balanceFloorUstx)}`
      : 'wallet      : not supplied (dry run needs no wallet)'
  );
  lines.push('');
  lines.push('preflight (all reads; nothing in this section can broadcast):');

  const members = plan.checks?.members;
  if (members && members.status !== 'not-applicable') {
    const verified = members.results.filter((result) => result.status === 'ok').length;
    lines.push(
      members.ok
        ? `  members: ${verified} of ${members.results.length} read back off chain and byte-identical to their plates`
        : `  members: FAIL — ${members.results.length - verified} of ${members.results.length} did not match. A broadcast is refused.`
    );
    for (const result of members.results) {
      lines.push(
        result.status === 'ok'
          ? `    piece ${result.index} #${result.id} ok   bytes match; ${result.authorChecked ? `creator ${result.foundAuthor}` : `creator not checked (${result.note})`}`
          : `    piece ${result.index} #${result.id} FAIL ${result.message}`
      );
    }
  } else {
    lines.push('  members: not applicable (a plate lists none)');
  }

  const paused = plan.checks?.corePaused;
  lines.push(
    `  core paused: ${
      paused?.status === 'paused'
        ? 'YES — the mint would revert and the miner fee would still be spent. A broadcast is refused.'
        : paused?.status === 'running'
          ? 'no'
          : `unavailable (${paused?.error ?? paused?.status}). A broadcast is refused: this fails closed.`
    }`
  );

  const affordability = plan.checks?.collectionAffordability;
  if (affordability) {
    lines.push(
      `  remaining cost: ${affordability.threadLength} x ${groupDigits(affordability.perEntryUstx)} = ` +
        `${ustx(affordability.threadCostUstx)}; affordable: ${
          affordability.status === 'unknown'
            ? 'unknown (no balance read)'
            : affordability.affordable
              ? 'yes'
              : `NO, short by ${ustx(affordability.shortfallUstx)}`
        }`
    );
  }

  const duplicate = plan.checks?.duplicateContent;
  lines.push(
    `  duplicate: ${
      duplicate?.status === 'duplicate'
        ? `already inscribed as #${duplicate.existingId} — for a plate this is not a warning but the answer: the ` +
          'bytes are a function of the index, so a hit means this piece is already on chain'
        : duplicate?.status === 'new'
          ? 'no prior inscription with these bytes'
          : `unavailable (${duplicate?.error ?? duplicate?.status})`
    }`
  );

  const nonce = plan.checks?.pendingNonce;
  if (nonce) {
    lines.push(
      `  nonce: ${
        nonce.status === 'skipped'
          ? `skipped (${nonce.note})`
          : nonce.status === 'unavailable'
            ? `unavailable (${nonce.error})`
            : `next ${nonce.nextNonce}, last executed ${nonce.lastExecutedNonce ?? 'none'}`
      }`
    );
    if (nonce.warning) lines.push(`    warning: ${nonce.warning}`);
  }

  if (plan.killReason) lines.push(`KILL SWITCH : ENGAGED (${plan.killReason})`);
  return lines.join('\n');
}

/** The status table. Pure string building. */
export function formatCollectionStatusTable(report) {
  const lines = [];
  lines.push(`--- collection ${report.collectionId} (${report.mode}) ---`);
  lines.push(report.journalFound ? `journal: ${report.journalPath}` : `journal: none at ${report.journalPath}`);
  lines.push('');
  lines.push(`  ${pad('#', 5)}${pad('piece', 18)}${pad('journal', 14)}${pad('chain', 12)}${pad('id', 9)}txid`);
  for (const row of report.rows) {
    lines.push(
      `  ${pad(row.index ?? 'man', 5)}${pad(row.piece, 18)}${pad(row.journalStatus, 14)}${pad(row.chain, 12)}` +
        `${pad(row.inscriptionId ? `#${row.inscriptionId}` : '—', 9)}${shortTxid(row.txid)}`
    );
    if (row.note) lines.push(`         ${row.note}`);
  }
  lines.push('');
  lines.push(`committed so far, by this runner: ${groupDigits(report.committedUstx)} microSTX`);
  return lines.join('\n');
}

/** The run report. Pure string building. */
export function formatCollectionRunReport(result) {
  const lines = [''];
  lines.push(
    result.broadcast
      ? `--- collection ${result.collectionId} (BROADCAST) ---`
      : `--- collection ${result.collectionId} (DRY RUN — injected fakes, nothing signed, nothing sent) ---`
  );
  for (const member of result.members) {
    lines.push(`  ${pad(member.index, 4)}${pad(`#${member.id}`, 9)}${pad(member.pieceId, 18)}${member.caption}`);
  }
  const manifestRecord = result.journal?.pieces?.[MANIFEST_KEY] ?? null;
  if (manifestRecord) {
    lines.push(
      `  ${pad('man', 4)}${pad(manifestRecord.inscriptionId ? `#${manifestRecord.inscriptionId}` : '—', 9)}` +
        `${pad('manifest', 18)}${manifestRecord.status}`
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
    lines.push(
      result.broadcast ? 'Collection complete.' : 'Dry run complete. Nothing was signed and nothing was sent.'
    );
  }
  return lines.join('\n');
}

