/**
 * pipeline-core.mjs — the whole body of work, from three roots to twenty-four
 * listings, minus the terminal.
 *
 * The individual runners already work. `runCollection` mints eight plates and a
 * manifest; `runMarket` lists and buys. What did not exist is the thing that
 * takes the fleet from nothing on chain to a complete, cross-referenced,
 * listed collection without a human deciding the order, and refuses to carry on
 * when a layer underneath it has not been checked.
 *
 * ORDER IS FORCED BY THE GRAPH, NOT CHOSEN.
 *
 * Dependency edges point backwards only. `get-dependencies` names what an
 * inscription cites; the core keeps no reverse index. So nothing can cite
 * something that does not exist yet, and the mint order falls out of the graph
 * with no freedom in it:
 *
 *     personas (3, cite nothing)
 *       -> plates (24, each cites its wizard's persona)
 *       -> manifests (3, each cites its 8 plates and its persona)
 *       -> marks (3, each cites its wizard's persona)
 *       -> arms (1, cites the 3 marks)
 *       -> page (1, cites 24 plates + 3 manifests + 3 marks + the arms)
 *       -> listings (24)
 *
 * 35 inscriptions.
 *
 * THE ONE RULE THAT MAKES THIS SAFE.
 *
 * Verify the previous stage on chain before starting the next. Not from the
 * journal, not from a transaction receipt -- read it back. Every gate below
 * re-reads the chain even when this process minted the thing itself ten seconds
 * earlier, because the failure being defended against is not "the runner lied",
 * it is "the runner was right about a transaction and wrong about what it did".
 *
 * A manifest that cites a plate which cites the wrong persona is permanent and
 * unfixable. The only defence is refusing to build on an unverified layer, and
 * the only cost of that defence is read calls.
 *
 * WHAT THIS FILE DOES NOT DO.
 *
 * It does not reimplement minting. The per-mint rails -- fee quote, spend cap,
 * balance floor, post-condition, duplicate-content probe, pending-nonce probe,
 * the intent-before-broadcast journal write and the nonce asymmetry -- are
 * imported from inscribe.mjs and run-thread-core.mjs, and the plates and
 * manifests are minted by calling `runCollection` rather than by a second copy
 * of its loop. A second implementation of "did this transaction land" is
 * exactly one too many, and this file is the third caller to conclude that.
 *
 * Everything is injected: fetch, submit, the clock, sleep, journal read and
 * write, the kill-switch probe and the presenter. No terminal, no network call
 * and no disk access happens in this file.
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
  groupDigits,
  killSwitchEngaged,
  microStxToStx,
  quoteSingleTxFee
} from './inscribe.mjs';
import {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  POSITION_STATUSES,
  RunHalt,
  archiveIntent,
  assertJournalSecretFree,
  assertRunSpendCap,
  committedSpendUstx,
  formatDuration,
  normaliseTxid,
  optionalValue,
  parseMintResult,
  pollTransaction,
  readEntryFromChain,
  readIntendedNonce,
  resolveIntent
} from './run-thread-core.mjs';
import { PERSONAS, getPersona } from './personas.mjs';
import { COLLECTION_IDS, getCollection } from './collections.mjs';
import { ARMS, MARKS, renderArms, renderMark } from './collection-marks.mjs';
import {
  PERSONA_MIME,
  renderPersonaDoc,
  tokenUriForPersona
} from './collection-personas.mjs';
import {
  PAGE_MIME,
  PAGE_TOKEN_URI,
  assertPageIdsComplete,
  pageDependencies,
  renderCollectionPage
} from './collection-page.mjs';
import { COLLECTION_MIME } from './collection-kit.mjs';
import { runCollection } from './collection-run-core.mjs';

export {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_HIRO_URL,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  RunHalt,
  WizardSafetyError,
  groupDigits,
  microStxToStx
};

const HERE = dirname(fileURLToPath(import.meta.url));

const errorMessage = (error) => (error instanceof Error ? error.message : String(error));
const iso = (ms) => new Date(ms).toISOString();

/** Bumped when the on-disk pipeline journal shape changes incompatibly. */
export const PIPELINE_JOURNAL_VERSION = 1;

/** SVG, like the plates. A mark and the arms are drawings. */
export const MARK_MIME = COLLECTION_MIME;

/* ------------------------------------------------------------------ */
/* the stages                                                          */
/* ------------------------------------------------------------------ */

/**
 * The stages, in the only order the graph permits.
 *
 * `mints` is what each stage adds to the chain and is used for the cost model
 * and for the affordability check; `gate` names the verification that must pass
 * before the next stage may start.
 */
export const STAGES = [
  { id: 'personas', title: 'Personas', mints: 3, gate: 'every persona is on chain and byte-identical' },
  { id: 'plates', title: 'Plates', mints: 24, gate: 'every plate is byte-identical and cites its persona' },
  { id: 'manifests', title: 'Manifests', mints: 3, gate: 'every manifest cites its eight plates and its persona' },
  { id: 'marks', title: 'Marks', mints: 3, gate: 'every mark is byte-identical and cites its persona' },
  { id: 'arms', title: 'Arms', mints: 1, gate: 'the arms cites all three marks' },
  { id: 'page', title: 'The page', mints: 1, gate: 'the page cites all thirty-one members' },
  { id: 'listings', title: 'Listings', mints: 0, gate: 'every listed plate is owned by its maker' }
];

export const STAGE_IDS = STAGES.map((stage) => stage.id);
export const TOTAL_MINTS = STAGES.reduce((sum, stage) => sum + stage.mints, 0);

/** How many plates the fleet lists. Manifests and the page are the index and are not sold. */
export const LISTABLE_PLATES = COLLECTION_IDS.reduce((sum, id) => sum + getCollection(id).length, 0);

export function stageIndex(stageId) {
  const at = STAGE_IDS.indexOf(stageId);
  if (at === -1) throw new WizardSafetyError(`"${stageId}" is not a pipeline stage. Stages: ${STAGE_IDS.join(', ')}`);
  return at;
}

/* ------------------------------------------------------------------ */
/* the journal                                                         */
/* ------------------------------------------------------------------ */

export function pipelineJournalPathFor({ dir = HERE, runId = 'fleet', mode = 'broadcast' } = {}) {
  const id = String(runId ?? '').trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    throw new WizardSafetyError(
      `"${id}" is not a usable run id for a journal file name. Use letters, digits, dot, dash and underscore, ` +
        'starting with a letter or digit.'
    );
  }
  return join(dir, `.pipeline-${id}${mode === 'dry' ? '.dry' : ''}.json`);
}

export function emptyPipelineJournal({ runId = 'fleet', mode = 'broadcast', startedAt }) {
  return {
    version: PIPELINE_JOURNAL_VERSION,
    runId,
    mode,
    startedAt,
    updatedAt: startedAt,
    /**
     * Keyed `stage:item`, shaped exactly like a thread position so the imported
     * spend accounting and secret check read it without translation.
     */
    items: {},
    /**
     * The resolved id map. Written as ids become known and BEFORE the page is
     * composed, because the page embeds them and is otherwise not reproducible
     * after a crash. See the header of collection-page.mjs.
     */
    ids: { personas: {}, plates: {}, manifests: {}, marks: {}, arms: null, page: null },
    /** Which gates have passed, so a resumed run can say what it is skipping. */
    gates: {}
  };
}

export const committedPipelineSpendUstx = (journal) => committedSpendUstx({ positions: journal?.items ?? {} });

export const itemKey = (stage, item) => `${stage}:${item}`;

/* ------------------------------------------------------------------ */
/* what each stage is made of                                          */
/* ------------------------------------------------------------------ */

/**
 * One inscription the generic leg can mint.
 *
 * Plates and manifests are deliberately absent: they are minted by
 * `runCollection`, which already owns their journal, their ordering and their
 * byte-equality rail.
 */
export function itemsForStage(stageId, ids = {}) {
  if (stageId === 'personas') {
    return PERSONAS.map((persona) => ({
      stage: 'personas',
      item: persona.id,
      wizard: persona.id,
      label: `the ${persona.shortName.replace(/^the /, '')}'s persona`,
      mime: PERSONA_MIME,
      tokenUri: tokenUriForPersona(persona.id),
      body: renderPersonaDoc(persona.id),
      dependencies: []
    }));
  }

  if (stageId === 'marks') {
    return MARKS.map((mark) => {
      const personaId = ids?.personas?.[mark.wizard];
      if (!personaId) {
        throw new WizardSafetyError(
          `the ${mark.wizard} mark cites its persona, and no persona id is known for ${mark.wizard}. The personas ` +
            'stage has to be complete and gated before a mark can be composed.'
        );
      }
      return {
        stage: 'marks',
        item: mark.wizard,
        wizard: mark.wizard,
        label: mark.caption,
        mime: MARK_MIME,
        tokenUri: `xtrata:wizard/mark/${mark.wizard}`,
        body: renderMark(mark.wizard),
        dependencies: [String(personaId)]
      };
    });
  }

  if (stageId === 'arms') {
    const markIds = MARKS.map((mark) => ids?.marks?.[mark.wizard]);
    const missing = MARKS.filter((mark, at) => !markIds[at]).map((mark) => mark.wizard);
    if (missing.length > 0) {
      throw new WizardSafetyError(
        `the arms cites all three marks and ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not minted ` +
          'yet. The marks stage has to be complete and gated first.'
      );
    }
    return [
      {
        stage: 'arms',
        item: 'arms',
        // The arms belongs to all three. It is minted from the Archivist's
        // wallet because custody is that wizard's stated concern and somebody
        // has to hold it; the ownership is recorded rather than argued.
        wizard: 'archivist',
        label: ARMS.caption,
        mime: MARK_MIME,
        tokenUri: 'xtrata:wizard/arms',
        body: renderArms(),
        dependencies: markIds.map(String)
      }
    ];
  }

  if (stageId === 'page') {
    assertPageIdsComplete(ids);
    return [
      {
        stage: 'page',
        item: 'page',
        // Same reasoning as the arms, and the same wallet, so the two shared
        // artefacts are held together rather than split for no reason.
        wizard: 'archivist',
        label: 'the collection page',
        mime: PAGE_MIME,
        tokenUri: PAGE_TOKEN_URI,
        body: renderCollectionPage(ids),
        dependencies: pageDependencies(ids).map(String)
      }
    ];
  }

  throw new WizardSafetyError(`stage "${stageId}" is not minted by the generic leg`);
}

/* ------------------------------------------------------------------ */
/* reading the chain back                                              */
/* ------------------------------------------------------------------ */

/** What an inscription cites, straight from the core. */
export async function readDependencies({ fetchImpl, hiroUrl = DEFAULT_HIRO_URL, id, senderAddress = CORE_ADDRESS }) {
  const parsed = await callReadOnly({
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-dependencies',
    functionArgs: [uintCV(BigInt(id))]
  });
  const list = Array.isArray(parsed?.value) ? parsed.value : Array.isArray(parsed) ? parsed : [];
  return list.map((entry) => String(entry?.value ?? entry));
}

/** Who the core says made it. Null when the core knows of no creator. */
export async function readCreator({ fetchImpl, hiroUrl = DEFAULT_HIRO_URL, id, senderAddress = CORE_ADDRESS }) {
  const parsed = await callReadOnly({
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-inscription-creator',
    functionArgs: [uintCV(BigInt(id))]
  });
  const creator = optionalValue(parsed);
  return creator ? String(creator.value) : null;
}

/**
 * The gate's unit of work: read one inscription back and check everything about
 * it that can be checked.
 *
 * Bytes are compared whole rather than sampled, because every body in this
 * pipeline is one chunk and regenerable. Dependencies are compared as a SET,
 * not a sequence: the core stores what it was given, and asserting an order the
 * core does not promise would fail a correct inscription.
 *
 * Returns a result rather than throwing. A gate wants to report all thirty-five
 * findings, not the first one.
 */
export async function verifyInscription({
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  id,
  label,
  expectedBody = null,
  expectedDependencies = null,
  expectedCreator = null
}) {
  const at = { id: String(id ?? ''), label };
  if (!at.id) return { ...at, status: 'no-id', ok: false, message: `${label} has no inscription id` };

  let read;
  try {
    read = await readEntryFromChain({ fetchImpl, hiroUrl, id: at.id });
  } catch (error) {
    return { ...at, status: 'unavailable', ok: false, message: `could not read #${at.id}: ${errorMessage(error)}` };
  }
  if (!read.found) {
    return { ...at, status: 'no-chunk', ok: false, message: `#${at.id} has no chunk u0 on chain` };
  }
  if (expectedBody !== null && read.body !== expectedBody) {
    return {
      ...at,
      status: 'bytes-differ',
      ok: false,
      message:
        `#${at.id} is on chain but its bytes are not ${label}. Every body in this pipeline is a pure function ` +
        'of its inputs, so this is an exact comparison and not a judgement: the id is wrong, or something other ' +
        'than this generator wrote it.'
    };
  }

  if (expectedDependencies !== null) {
    let found;
    try {
      found = await readDependencies({ fetchImpl, hiroUrl, id: at.id, senderAddress });
    } catch (error) {
      return { ...at, status: 'unavailable', ok: false, message: `could not read the dependencies of #${at.id}: ${errorMessage(error)}` };
    }
    const want = new Set(expectedDependencies.map(String));
    const have = new Set(found.map(String));
    const absent = [...want].filter((entry) => !have.has(entry));
    const extra = [...have].filter((entry) => !want.has(entry));
    if (absent.length > 0 || extra.length > 0) {
      return {
        ...at,
        status: 'wrong-dependencies',
        ok: false,
        expectedDependencies: [...want],
        foundDependencies: [...have],
        message:
          `#${at.id} (${label}) cites the wrong set: ` +
          (absent.length > 0 ? `missing ${absent.map((entry) => `#${entry}`).join(', ')}` : '') +
          (absent.length > 0 && extra.length > 0 ? '; ' : '') +
          (extra.length > 0 ? `unexpected ${extra.map((entry) => `#${entry}`).join(', ')}` : '') +
          '. Dependency edges are permanent, so nothing may be built on top of this.'
      };
    }
  }

  if (expectedCreator) {
    let creator;
    try {
      creator = await readCreator({ fetchImpl, hiroUrl, id: at.id, senderAddress });
    } catch (error) {
      return { ...at, status: 'unavailable', ok: false, message: `could not read the creator of #${at.id}: ${errorMessage(error)}` };
    }
    if (creator !== expectedCreator) {
      return {
        ...at,
        status: 'wrong-creator',
        ok: false,
        expectedCreator,
        foundCreator: creator,
        message: `#${at.id} (${label}) was created by ${creator ?? '(no creator on chain)'}, not ${expectedCreator}`
      };
    }
  }

  return { ...at, status: 'ok', ok: true };
}

/* ------------------------------------------------------------------ */
/* the gates                                                           */
/* ------------------------------------------------------------------ */

/**
 * What every stage must satisfy before the next one starts.
 *
 * Each gate returns `{ stage, ok, results, failures }` and never throws for a
 * condition it expects, so the caller can print the whole picture. `assertGate`
 * is what turns a failed gate into a halt.
 */
export async function gateFor({
  stage,
  ids,
  fetchImpl,
  hiroUrl = DEFAULT_HIRO_URL,
  senderAddress = CORE_ADDRESS,
  addresses = {}
}) {
  const results = [];
  const creatorFor = (wizard) => addresses?.[wizard] ?? null;

  if (stage === 'personas') {
    for (const persona of PERSONAS) {
      results.push(
        await verifyInscription({
          fetchImpl,
          hiroUrl,
          senderAddress,
          id: ids?.personas?.[persona.id],
          label: `the ${persona.id} persona`,
          expectedBody: renderPersonaDoc(persona.id),
          // A root cites nothing, and that is checkable: an empty set is a set.
          expectedDependencies: [],
          expectedCreator: creatorFor(persona.id)
        })
      );
    }
  } else if (stage === 'plates') {
    for (const collectionId of COLLECTION_IDS) {
      const art = getCollection(collectionId);
      const personaId = ids?.personas?.[art.wizard];
      for (let index = 1; index <= art.length; index += 1) {
        results.push(
          await verifyInscription({
            fetchImpl,
            hiroUrl,
            senderAddress,
            id: ids?.plates?.[collectionId]?.[index],
            label: `plate ${index} of ${collectionId}`,
            expectedBody: art.renderPiece(index),
            // Plates carry no persona edge today: runCollection mints them with
            // no dependencies, and changing that would change their bytes and
            // orphan every plate already on chain. The edge to the persona is
            // carried by the manifest, which is why this asserts the empty set
            // rather than [personaId] -- asserting an edge the minter does not
            // create would fail every correct plate.
            expectedDependencies: [],
            expectedCreator: creatorFor(art.wizard)
          })
        );
      }
      if (!personaId) {
        results.push({
          id: '',
          label: `the ${art.wizard} persona id`,
          status: 'no-id',
          ok: false,
          message: `no persona id is recorded for ${art.wizard}, so the manifest stage cannot cite it`
        });
      }
    }
  } else if (stage === 'manifests') {
    for (const collectionId of COLLECTION_IDS) {
      const art = getCollection(collectionId);
      const plates = [];
      for (let index = 1; index <= art.length; index += 1) plates.push(ids?.plates?.[collectionId]?.[index]);
      const personaId = ids?.personas?.[art.wizard];
      results.push(
        await verifyInscription({
          fetchImpl,
          hiroUrl,
          senderAddress,
          id: ids?.manifests?.[collectionId],
          label: `the ${collectionId} manifest`,
          // The manifest quotes its own members' ids in its prose, so its bytes
          // are chain-derived and are not regenerable here. Its edges are the
          // check that matters and they are checked exactly.
          expectedBody: null,
          expectedDependencies: [...plates, personaId].filter(Boolean).map(String),
          expectedCreator: creatorFor(art.wizard)
        })
      );
    }
  } else if (stage === 'marks') {
    for (const mark of MARKS) {
      results.push(
        await verifyInscription({
          fetchImpl,
          hiroUrl,
          senderAddress,
          id: ids?.marks?.[mark.wizard],
          label: `the ${mark.wizard} mark`,
          expectedBody: renderMark(mark.wizard),
          expectedDependencies: [String(ids?.personas?.[mark.wizard] ?? '')].filter(Boolean),
          expectedCreator: creatorFor(mark.wizard)
        })
      );
    }
  } else if (stage === 'arms') {
    results.push(
      await verifyInscription({
        fetchImpl,
        hiroUrl,
        senderAddress,
        id: ids?.arms,
        label: 'the arms',
        expectedBody: renderArms(),
        expectedDependencies: MARKS.map((mark) => ids?.marks?.[mark.wizard]).filter(Boolean).map(String),
        expectedCreator: creatorFor('archivist')
      })
    );
  } else if (stage === 'page') {
    results.push(
      await verifyInscription({
        fetchImpl,
        hiroUrl,
        senderAddress,
        id: ids?.page,
        label: 'the page',
        expectedBody: renderCollectionPage(ids),
        expectedDependencies: pageDependencies(ids).map(String),
        expectedCreator: creatorFor('archivist')
      })
    );
  } else if (stage === 'listings') {
    // Ownership is what a listing turns on, and it is the one fact the market
    // runner cannot recover from if it is wrong: `list-token` escrows the NFT.
    for (const collectionId of COLLECTION_IDS) {
      const art = getCollection(collectionId);
      const owner = creatorFor(art.wizard);
      for (let index = 1; index <= art.length; index += 1) {
        const id = ids?.plates?.[collectionId]?.[index];
        results.push(
          await verifyInscription({
            fetchImpl,
            hiroUrl,
            senderAddress,
            id,
            label: `plate ${index} of ${collectionId}`,
            expectedBody: art.renderPiece(index),
            expectedDependencies: null,
            expectedCreator: owner
          })
        );
      }
    }
  } else {
    throw new WizardSafetyError(`"${stage}" is not a gated stage`);
  }

  const failures = results.filter((result) => !result.ok);
  const unavailable = failures.some((result) => result.status === 'unavailable');
  return {
    stage,
    ok: failures.length === 0,
    // "unavailable" is a distinct outcome from "failed" on purpose. A node that
    // would not answer is not evidence that anything is wrong, and treating it
    // as a failure would teach an operator to override real ones.
    status: failures.length === 0 ? 'verified' : unavailable ? 'unavailable' : 'failed',
    checked: results.length,
    results,
    failures
  };
}

/** Turns a failed gate into the halt that stops the pipeline. */
export function assertGate(gate) {
  if (gate?.ok) return gate;
  const detail = (gate?.failures ?? []).map((result) => `  - ${result.message}`).join('\n');
  throw new RunHalt(
    'gate',
    `the ${gate?.stage} gate did not pass, so the pipeline stops here rather than building on it.\n${detail}\n` +
      'Every edge above this point is permanent. Fix what is wrong before anything else cites it.',
    { stage: gate?.stage, failures: gate?.failures ?? [] }
  );
}

/* ------------------------------------------------------------------ */
/* the generic mint leg                                                */
/* ------------------------------------------------------------------ */

/** The plan for one inscription the generic leg owns. */
export async function planInscription({
  item,
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
  const persona = getPersona(item.wizard);
  const block =
    blockHeight !== null && blockHeight !== undefined
      ? BigInt(blockHeight)
      : await fetchChainTip({ fetchImpl, hiroUrl });

  const call = buildMintCall({
    body: item.body,
    mime: item.mime,
    tokenUri: item.tokenUri,
    parentIds: item.dependencies
  });

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
    record: item.stage,
    stage: item.stage,
    item: item.item,
    label: item.label,
    index: null,
    wizard: persona,
    parentIds: item.dependencies.map(String),
    block,
    body: item.body,
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
      corePaused: await checkCorePaused({ fetchImpl, hiroUrl, senderAddress: senderAddress ?? CORE_ADDRESS }),
      affordability: checkThreadAffordability({
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
}

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
  presentPlan: () => {},
  /**
   * How plates and manifests get minted. Defaults to the real runner and is
   * overridable so a rehearsal can drive a fake one without this file knowing
   * which it has.
   */
  runCollection
};

/* ------------------------------------------------------------------ */
/* the run                                                             */
/* ------------------------------------------------------------------ */

/**
 * Take the fleet through every stage.
 *
 * Never throws for a condition it expects. A refusal, a gate failure, a
 * timeout, a cap and a kill are all returned as
 * `{ ok: false, halted: { reason, message } }`, because by the time any of them
 * happens there is state worth reporting and an exception thrown out of the
 * middle of the loop loses it.
 */
export async function runPipeline({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    runId = 'fleet',
    broadcast = false,
    from = STAGE_IDS[0],
    to = STAGE_IDS[STAGE_IDS.length - 1],
    hiroUrl = DEFAULT_HIRO_URL,
    env = {},
    wallets = {},
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
  const firstStage = stageIndex(from);
  const lastStage = stageIndex(to);
  if (lastStage < firstStage) {
    throw new WizardSafetyError(`--to ${to} comes before --from ${from} in the pipeline`);
  }

  const addresses = Object.fromEntries(
    Object.entries(wallets).map(([wizard, wallet]) => [wizard, wallet?.address ?? null])
  );

  const journalPath = pipelineJournalPathFor({ dir: journalDir, runId, mode });
  const startedAt = iso(io.now());
  const journal = io.readJournal(journalPath) ?? emptyPipelineJournal({ runId, mode, startedAt });

  const guard = (step) => {
    const reason = io.killSwitch(env);
    if (reason) {
      throw new RunHalt('kill-switch', `kill switch engaged (${reason}) before ${step}. The pipeline stops here.`, { step });
    }
  };

  const save = () => {
    journal.updatedAt = iso(io.now());
    assertJournalSecretFree(
      journal,
      Object.values(wallets).map((wallet) => wallet?.key)
    );
    io.writeJournal(journalPath, journal);
  };

  const record = (key, patch) => {
    if (patch.status && !POSITION_STATUSES.includes(patch.status)) {
      throw new WizardSafetyError(`"${patch.status}" is not a known item status`);
    }
    journal.items[key] = { ...(journal.items[key] ?? {}), ...patch, updatedAt: iso(io.now()) };
    save();
    return journal.items[key];
  };

  /**
   * Write an id into the map the moment it is known.
   *
   * Ordering matters here and is the reason this is a function rather than an
   * assignment at the call site: the page embeds these ids in its own bytes, so
   * a crash after composing but before confirming is only recoverable if the
   * map was already on disk. Recording late would make the page the one
   * inscription this pipeline could not resolve after a crash.
   */
  const recordId = (path, id) => {
    const value = String(id);
    if (path.length === 2) {
      journal.ids[path[0]][path[1]] = value;
    } else if (path.length === 3) {
      journal.ids[path[0]][path[1]] = journal.ids[path[0]][path[1]] ?? {};
      journal.ids[path[0]][path[1]][path[2]] = value;
    } else {
      journal.ids[path[0]] = value;
    }
    save();
    return value;
  };

  const say = io.say;
  const stagesRun = [];
  const gates = {};
  let halted = null;

  /** Wait for one recorded txid and turn its outcome into journal state. */
  const settle = async ({ key, label, txid }) => {
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
          say(`    poll ${poll} (${Math.round(elapsedMs / 1000)}s): ${known ? txStatus : 'not visible yet'}`)
      });
    } catch (error) {
      if (error instanceof RunHalt && error.reason === 'kill-switch') {
        record(key, { status: 'broadcast', note: 'kill switch engaged while waiting; the transaction is still live' });
      }
      throw error;
    }

    if (outcome.outcome === 'timeout') {
      record(key, { status: 'broadcast', note: `still unconfirmed after ${formatDuration(outcome.waitedMs)}` });
      throw new RunHalt(
        'timeout',
        `${label} was broadcast as ${txid} and has not confirmed after ${formatDuration(outcome.waitedMs)}. ` +
          'That is not a failure and nothing is lost. Wait for it and run --status; this pipeline will not send ' +
          'it a second time.',
        { key, txid }
      );
    }

    if (outcome.outcome !== 'success') {
      record(key, { status: 'failed', txid, txStatus: outcome.txStatus, note: outcome.reason ?? null });
      throw new RunHalt(
        'failed',
        `${label} did not succeed: ${txid} is ${outcome.txStatus}. ` +
          (outcome.txStatus?.startsWith('abort')
            ? 'An abort still pays the miner fee. Read the transaction in the explorer before doing anything else.'
            : 'A dropped transaction spent nothing, but something replaced or evicted it. Find out what.'),
        { key, txid, txStatus: outcome.txStatus }
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
    say(
      `    confirmed in block ${outcome.blockHeight ?? '?'} as inscription #${inscriptionId}` +
        (existed ? '  (existed already: these exact bytes were on chain before this mint)' : '')
    );
    return { id: inscriptionId, existed };
  };

  /** Mint one item the generic leg owns, or adopt it if it is already there. */
  const mintItem = async (item, { remainingMints }) => {
    const key = itemKey(item.stage, item.item);
    const persona = getPersona(item.wizard);
    const wallet = wallets[persona.id] ?? {};
    let existing = journal.items[key] ?? null;

    guard(`${item.stage}:${item.item}`);

    if (existing && existing.status === 'confirmed' && existing.inscriptionId) {
      say(`  ${item.stage}:${item.item}: already #${existing.inscriptionId}, nothing to broadcast`);
      return { id: String(existing.inscriptionId), adopted: true };
    }

    // The crash window. Never re-broadcast on a guess: ask the chain whether
    // those exact bytes are already there, and if they are not, let the nonce
    // say what the silence means. Every body here is regenerable, so unlike a
    // corpus entry this probe stays decisive forever -- including the page,
    // whose ids were written to the journal before it was composed.
    if (existing && existing.status === 'broadcasting' && !existing.txid) {
      const resolved = await resolveIntent({
        fetchImpl,
        hiroUrl,
        record: existing,
        position: null,
        threadId: `pipeline/${item.stage}`,
        now: io.now,
        sleep: io.sleep,
        say,
        guard,
        mempoolWaitMs,
        mempoolPollMs
      });

      if (resolved.outcome === 'landed') {
        record(key, { status: 'confirmed', inscriptionId: resolved.id, recovered: true });
        say(`  ${item.stage}:${item.item}: recovered as #${resolved.id} by content hash; no second broadcast`);
        return { id: String(resolved.id), adopted: true };
      }
      if (resolved.outcome !== 'absent') {
        throw new RunHalt(
          'unresolved',
          `${item.stage}:${item.item} has an intent record from an earlier run but no transaction id, and no ` +
            `inscription with those exact bytes is on chain yet. ${resolved.nonce?.why ?? 'The wallet nonce says nothing about it either.'} ` +
            'This pipeline will not broadcast it again: a second mint would be just as permanent as the first. ' +
            `Watch ${existing.senderAddress ?? 'the wizard wallet'} in the explorer and run --status, which can ` +
            'settle it definitively at any point in the future because these bytes never change.',
          { key, finalHashHex: existing.finalHashHex, intendedNonce: existing.intendedNonce ?? null, nonce: resolved.nonce }
        );
      }
      record(key, {
        status: 'abandoned',
        txid: null,
        inscriptionId: null,
        finalHashHex: null,
        intendedNonce: null,
        resolution: 'nonce-proved-absent',
        resolvedBy: 'runner',
        resolvedAt: iso(io.now()),
        note: resolved.nonce?.why ?? 'the intended nonce had never confirmed, so nothing was minted',
        previousIntents: [
          ...(existing.previousIntents ?? []),
          archiveIntent(existing, { reason: 'nonce-proved-absent', note: resolved.nonce?.why ?? null })
        ]
      });
      say(`  ${item.stage}:${item.item}: ${resolved.nonce.why}`);
      existing = null;
    }

    const plan = await planInscription({
      item,
      fetchImpl,
      hiroUrl,
      senderAddress: wallet.address ?? null,
      spendCapUstx,
      balanceFloorUstx,
      minerFeeUstx,
      env,
      remainingMints
    });
    io.presentPlan(plan, { broadcast });

    // The duplicate-content probe is not a nuisance here, it is the resume
    // path: an item minted by a previous run that never got to write its
    // journal is found by hash and adopted rather than paid for twice.
    const duplicate = plan.checks.duplicateContent;
    if (duplicate?.existingId) {
      record(key, {
        stage: item.stage,
        item: item.item,
        wizard: persona.id,
        status: 'external',
        inscriptionId: String(duplicate.existingId),
        source: 'content-hash',
        note: 'these exact bytes were already on chain; adopted rather than minted again'
      });
      say(`  ${item.stage}:${item.item}: already on chain as #${duplicate.existingId}; adopted, nothing spent`);
      return { id: String(duplicate.existingId), adopted: true };
    }

    assertRunSpendCap({
      committedUstx: committedPipelineSpendUstx(journal),
      plannedSpendUstx: plan.plannedSpendUstx,
      runSpendCapUstx: BigInt(runSpendCapUstx),
      label: `${item.stage}:${item.item}`
    });

    if (!broadcast) {
      say(`  ${item.stage}:${item.item}: dry run, nothing signed and nothing sent`);
      return { id: null, adopted: false, dry: true, plan };
    }

    guard(`broadcasting ${item.stage}:${item.item}`);

    // The per-mint rails, in the same place runCollection puts them: after the
    // plan and the run-level cap, immediately before the intent is written.
    // This leg started life without them and the rehearsal caught it -- a
    // persona would have broadcast with no key check, no balance floor, no
    // paused check and no single-tx eligibility check, all of which
    // runCollection was applying to the plates minted two stages later.
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
      // A drawing and a persona quote nothing, so the corpus's parent-quote
      // rail has nothing to check. Stated as not-applicable rather than left
      // out, so the rail can tell "checked and fine" from "never ran".
      parentQuoteCheck: {
        name: 'parent quote',
        status: 'not-applicable',
        ok: true,
        results: [],
        note: 'nothing in this pipeline quotes a parent; edges are checked by the gates instead'
      },
      pausedCheck: plan.checks.corePaused
    });

    const intendedNonce = await readIntendedNonce({
      fetchImpl,
      hiroUrl,
      address: plan.senderAddress,
      fallback: plan.checks?.pendingNonce?.nextNonce ?? null
    });

    // Intent, before anything is signed. Deliberately no kill-switch check
    // between this write and the submit: the guard above is immediately prior,
    // and a check here could leave an intent standing for a transaction that
    // was provably never sent.
    record(key, {
      stage: item.stage,
      item: item.item,
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
        `broadcasting ${item.stage}:${item.item} failed: ${errorMessage(error)}. Whether the node accepted it ` +
          'before the error is not knowable from here, so this pipeline will not send it again. Run --status, ' +
          'which resolves it against the chain by content hash.',
        { key }
      );
    }

    record(key, { status: 'broadcast', txid });
    say(`    txid ${txid}`);
    say(`    watch https://explorer.hiro.so/txid/${txid}?chain=mainnet`);
    const settled = await settle({ key, label: `${item.stage}:${item.item}`, txid });
    return { id: String(settled.id), adopted: false };
  };

  try {
    guard('the first stage');

    if (journal.version !== PIPELINE_JOURNAL_VERSION) {
      throw new RunHalt(
        'journal',
        `the pipeline journal at ${journalPath} is version ${journal.version}, but this runner writes version ` +
          `${PIPELINE_JOURNAL_VERSION}. Move it aside and check what it says before starting again.`
      );
    }
    if (journal.runId !== runId || journal.mode !== mode) {
      throw new RunHalt(
        'journal',
        `the pipeline journal at ${journalPath} is for run ${journal.runId} in ${journal.mode} mode, not ${runId} ` +
          `in ${mode} mode.`
      );
    }

    let remaining = TOTAL_MINTS;

    for (let at = firstStage; at <= lastStage; at += 1) {
      const stage = STAGES[at];
      guard(`stage ${stage.id}`);
      say('');
      say(`== ${stage.title} ==`);

      if (stage.id === 'personas' || stage.id === 'marks' || stage.id === 'arms' || stage.id === 'page') {
        const items = itemsForStage(stage.id, journal.ids);
        for (const item of items) {
          const result = await mintItem(item, { remainingMints: remaining });
          remaining = Math.max(0, remaining - 1);
          if (result.dry) continue;
          if (stage.id === 'personas') recordId(['personas', item.item], result.id);
          else if (stage.id === 'marks') recordId(['marks', item.item], result.id);
          else if (stage.id === 'arms') recordId(['arms'], result.id);
          else recordId(['page'], result.id);
        }
      } else if (stage.id === 'plates' || stage.id === 'manifests') {
        // Delegated. runCollection owns the plates' journal, their ordering and
        // their byte-equality rail; running a second copy of that loop here
        // would be a second thing to keep correct.
        for (const collectionId of COLLECTION_IDS) {
          const art = getCollection(collectionId);
          say(`  ${collectionId} (${art.wizard})`);

          /**
           * The fleet cap, expressed in the units runCollection understands.
           *
           * runCollection compares its OWN journal total plus the next planned
           * spend against whatever cap it is handed. Handing it the fleet cap
           * unchanged gives each of the three collections its own full cap, so
           * a "1 STX run" could spend three -- plus whatever the generic leg
           * spends on top. Handing it the remaining budget instead would
           * double-count, because its own total is already inside the
           * pipeline's.
           *
           * So: everything the fleet has committed EXCEPT this collection, then
           * subtracted from the cap and added back to this collection's own
           * total by runCollection itself. The two halves sum to the fleet cap
           * exactly.
           */
          const mine = BigInt(journal.items[itemKey('delegated', collectionId)]?.protocolFeeUstx ?? 0);
          const elsewhere = committedPipelineSpendUstx(journal) - mine;
          const budget = BigInt(runSpendCapUstx) - elsewhere;
          if (budget <= 0n) {
            throw new RunHalt(
              'spend-cap',
              `refusing to start ${collectionId}: the fleet has already committed ` +
                `${groupDigits(elsewhere)} microSTX against a run cap of ${groupDigits(runSpendCapUstx)}. ` +
                'Raise --run-spend-cap-ustx deliberately, or run fewer stages.',
              { stage: stage.id, collectionId }
            );
          }

          const outcome = await io.runCollection({
            ports: {
              fetchImpl: io.fetchImpl,
              submit: io.submit,
              readJournal: io.readJournal,
              writeJournal: io.writeJournal,
              killSwitch: io.killSwitch,
              now: io.now,
              sleep: io.sleep,
              say: (line) => say(`    ${line}`),
              presentPlan: io.presentPlan
            },
            options: {
              collectionId,
              broadcast,
              // The two stages are the two legs of the same runner: plates
              // without the manifest, then the manifest over verified plates.
              //
              // Both legs walk the WHOLE collection. runCollection only mints
              // the manifest once it has a member for every index --
              // `last === art.length && members.length === art.length` -- so a
              // manifest leg narrowed to `to: 1` walks one plate, fails that
              // condition and silently mints nothing. It costs nothing to walk
              // all eight on the second pass: each is already confirmed, so
              // every one is adopted by a read rather than paid for again.
              manifest: stage.id === 'manifests',
              from: 1,
              to: art.length,
              // The edge that makes the personas worth minting. Without it a
              // collection points at its own plates and at nothing else, and
              // the wizard's account of itself is cited only by its mark.
              citeIds:
                stage.id === 'manifests' && journal.ids.personas?.[art.wizard]
                  ? [journal.ids.personas[art.wizard]]
                  : [],
              hiroUrl,
              env,
              wallets,
              journalDir,
              runSpendCapUstx: budget,
              spendCapUstx,
              balanceFloorUstx,
              minerFeeUstx,
              confirmTimeoutMs,
              confirmPollMs,
              mempoolWaitMs,
              mempoolPollMs
            }
          });

          if (!outcome?.ok) {
            throw new RunHalt(
              outcome?.halted?.reason ?? 'failed',
              `${collectionId} stopped during ${stage.id}: ${outcome?.halted?.message ?? 'no reason was reported'}`,
              { stage: stage.id, collectionId }
            );
          }

          // Harvest what it minted into the shared id map, so the later stages
          // and the page can cite it.
          for (const member of outcome.members ?? []) {
            recordId(['plates', collectionId, String(member.index)], member.id);
          }
          if (outcome.manifestId) recordId(['manifests', collectionId], outcome.manifestId);

          // Fold the delegated spend into this run's accounting.
          //
          // Without this the pipeline's run cap sees only the eight mints the
          // generic leg owns and is blind to the twenty-seven runCollection
          // minted -- so a fleet cap of, say, 1 STX would be reported as barely
          // touched while 3 STX had actually gone. runCollection applies its own
          // cap per collection, but a per-collection cap is not a fleet cap, and
          // the fleet cap is the one an operator sets to bound the whole run.
          //
          // Recorded as a synthetic item rather than a running total so the
          // number survives a resume: the journal is the accounting, and a
          // variable in this process is not.
          //
          // Keyed by COLLECTION and not by stage, because runCollection's
          // `committedUstx` is the running total of its whole journal. The
          // manifest leg re-walks all eight plates to adopt them, so its total
          // already includes the plates leg -- keying by stage would add the
          // plates a second time and report 4.19 STX for a 2.49 STX run, which
          // is a cap that trips early and an operator who stops trusting it.
          record(itemKey('delegated', collectionId), {
            stage: 'delegated',
            item: collectionId,
            wizard: art.wizard,
            status: 'confirmed',
            protocolFeeUstx: String(outcome.committedUstx ?? 0n),
            minerFeeUstx: '0',
            note: `running total spent by runCollection on ${collectionId}, through ${stage.id}`
          });
          remaining = Math.max(0, remaining - (stage.id === 'manifests' ? 1 : art.length));
        }
      } else if (stage.id === 'listings') {
        say('  listings are driven by the market runner; this stage gates ownership only');
      }

      // The gate. Read it all back, even the parts this process minted a moment
      // ago, and stop rather than let the next stage cite an unverified layer.
      guard(`the ${stage.id} gate`);
      say(`  gate: ${stage.gate}`);
      if (!broadcast) {
        // A dry run has no ids to read, so a gate over synthetic state would be
        // theatre. Say so rather than print a pass.
        gates[stage.id] = { stage: stage.id, ok: true, status: 'skipped-dry', checked: 0, results: [], failures: [] };
        say('    dry run: nothing was minted, so there is nothing to read back');
      } else {
        const gate = await gateFor({ stage: stage.id, ids: journal.ids, fetchImpl, hiroUrl, addresses });
        gates[stage.id] = gate;
        journal.gates[stage.id] = { status: gate.status, checked: gate.checked, at: iso(io.now()) };
        save();
        assertGate(gate);
        say(`    ${gate.checked} checked, all verified on chain`);
      }
      stagesRun.push(stage.id);
    }
  } catch (error) {
    if (error instanceof RunHalt) {
      halted = { reason: error.reason, message: error.message, detail: error.detail ?? null };
    } else if (error instanceof WizardSafetyError) {
      halted = { reason: 'refused', message: error.message, detail: null };
    } else {
      halted = { reason: 'error', message: errorMessage(error), detail: null };
    }
  }

  return {
    ok: halted === null,
    mode,
    runId,
    journalPath,
    stages: stagesRun,
    gates,
    ids: journal.ids,
    spentUstx: committedPipelineSpendUstx(journal),
    halted
  };
}

/* ------------------------------------------------------------------ */
/* status                                                              */
/* ------------------------------------------------------------------ */

/**
 * The whole pipeline reconciled against the chain, usable standalone.
 *
 * Reads the journal for the ids and the chain for everything else. A journal
 * that says something is confirmed and a chain that does not agree is reported
 * as a discrepancy rather than resolved in the journal's favour.
 */
export async function pipelineStatusReport({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    runId = 'fleet',
    mode = 'broadcast',
    hiroUrl = DEFAULT_HIRO_URL,
    journalDir = HERE,
    wallets = {}
  } = options;

  const journalPath = pipelineJournalPathFor({ dir: journalDir, runId, mode });
  const journal = io.readJournal(journalPath);
  const addresses = Object.fromEntries(
    Object.entries(wallets).map(([wizard, wallet]) => [wizard, wallet?.address ?? null])
  );

  if (!journal) {
    return {
      runId,
      journalPath,
      found: false,
      stages: STAGES.map((stage) => ({ stage: stage.id, title: stage.title, status: 'not-started', checked: 0 })),
      ids: null,
      spentUstx: 0n
    };
  }

  const stages = [];
  for (const stage of STAGES) {
    let gate;
    try {
      gate = await gateFor({ stage: stage.id, ids: journal.ids, fetchImpl: io.fetchImpl, hiroUrl, addresses });
    } catch (error) {
      // A stage whose inputs are not known yet cannot be gated, and that is
      // "not started", not "failed".
      gate = { stage: stage.id, ok: false, status: 'not-started', checked: 0, results: [], failures: [], note: errorMessage(error) };
    }
    stages.push({ stage: stage.id, title: stage.title, status: gate.status, checked: gate.checked, failures: gate.failures });
  }

  return {
    runId,
    journalPath,
    found: true,
    mode: journal.mode,
    stages,
    ids: journal.ids,
    spentUstx: committedPipelineSpendUstx(journal)
  };
}

/* ------------------------------------------------------------------ */
/* the cost model                                                      */
/* ------------------------------------------------------------------ */

/**
 * What the whole pipeline commits, per wallet.
 *
 * Per wallet and not just as a fleet total, because the load is uneven -- the
 * arms and the page both come out of one wallet -- and a fleet that can afford
 * the run in aggregate can still have one wizard unable to pay for its share.
 */
export function costModel({
  mintFeeUstx = 41_000n,
  minerFeeUstx = BigInt(DEFAULT_MAX_TX_FEE_USTX),
  listingBudgetUstx = 50_000n,
  listingMinerUstx = 30_000n,
  listings = LISTABLE_PLATES
} = {}) {
  const perWizard = {};
  const bump = (wizard, field, amount) => {
    perWizard[wizard] = perWizard[wizard] ?? { mints: 0, listings: 0, spentUstx: 0n, escrowUstx: 0n };
    perWizard[wizard][field] += amount;
  };

  for (const persona of PERSONAS) bump(persona.id, 'mints', 1); // persona
  for (const collectionId of COLLECTION_IDS) {
    const art = getCollection(collectionId);
    bump(art.wizard, 'mints', art.length); // plates
    bump(art.wizard, 'mints', 1); // manifest
    bump(art.wizard, 'listings', art.length);
  }
  for (const mark of MARKS) bump(mark.wizard, 'mints', 1);
  bump('archivist', 'mints', 2); // the arms and the page

  const perMint = mintFeeUstx + minerFeeUstx;
  let totalSpentUstx = 0n;
  let totalMintSpentUstx = 0n;
  let totalEscrowUstx = 0n;
  for (const [wizard, entry] of Object.entries(perWizard)) {
    entry.mintSpentUstx = BigInt(entry.mints) * perMint;
    entry.spentUstx = entry.mintSpentUstx + BigInt(entry.listings) * listingMinerUstx;
    entry.escrowUstx = BigInt(entry.listings) * listingBudgetUstx;
    entry.committedUstx = entry.spentUstx + entry.escrowUstx;
    totalSpentUstx += entry.spentUstx;
    totalMintSpentUstx += entry.mintSpentUstx;
    totalEscrowUstx += entry.escrowUstx;
    void wizard;
  }

  const mints = Object.values(perWizard).reduce((sum, entry) => sum + entry.mints, 0);
  return {
    mints,
    listings,
    perWizard,
    // Spent is gone; escrowed comes back when a listing sells or is cancelled.
    totalSpentUstx,
    /**
     * The mint half only.
     *
     * This is what runPipeline's own accounting can ever reach, because the
     * listings stage gates ownership and broadcasts nothing -- the market
     * runner does the listing. Sizing the run cap against `totalSpentUstx`
     * would refuse a run that fits, by 0.72 STX of fees this pipeline never
     * pays.
     */
    totalMintSpentUstx,
    totalEscrowUstx,
    totalCommittedUstx: totalSpentUstx + totalEscrowUstx
  };
}

/* ------------------------------------------------------------------ */
/* formatting                                                          */
/* ------------------------------------------------------------------ */

const stx = (ustx) => `${microStxToStx(ustx)} STX`;

export function formatCostModel(model) {
  const lines = [
    `${model.mints} inscriptions, ${model.listings} listings`,
    '',
    'wizard      mints  listings        spent      escrowed     committed',
    '---------------------------------------------------------------------'
  ];
  for (const [wizard, entry] of Object.entries(model.perWizard)) {
    lines.push(
      `${wizard.padEnd(11)} ${String(entry.mints).padStart(5)}  ${String(entry.listings).padStart(8)}  ` +
        `${stx(entry.spentUstx).padStart(11)}  ${stx(entry.escrowUstx).padStart(12)}  ${stx(entry.committedUstx).padStart(12)}`
    );
  }
  lines.push('---------------------------------------------------------------------');
  lines.push(
    `${'total'.padEnd(11)} ${String(model.mints).padStart(5)}  ${String(model.listings).padStart(8)}  ` +
      `${stx(model.totalSpentUstx).padStart(11)}  ${stx(model.totalEscrowUstx).padStart(12)}  ${stx(model.totalCommittedUstx).padStart(12)}`
  );
  lines.push('');
  lines.push(`Spent is unrecoverable. Escrowed returns when a listing sells or is cancelled.`);
  return lines.join('\n');
}

export function formatPipelineStatus(report) {
  if (!report.found) {
    return `No pipeline journal at ${report.journalPath}. Nothing has been started.`;
  }
  const lines = [`Pipeline ${report.runId} (${report.mode})`, ''];
  for (const stage of report.stages) {
    const mark = stage.status === 'verified' ? 'ok  ' : stage.status === 'not-started' ? '--  ' : '!!  ';
    lines.push(`${mark}${stage.title.padEnd(12)} ${stage.status.padEnd(14)} ${stage.checked} checked`);
    for (const failure of stage.failures ?? []) lines.push(`      ${failure.message}`);
  }
  lines.push('');
  lines.push(`committed so far: ${stx(report.spentUstx)}`);
  return lines.join('\n');
}

export function formatPipelineReport(result) {
  const lines = [
    result.ok ? 'Pipeline completed.' : `Pipeline halted: ${result.halted?.reason}`,
    '',
    `mode:    ${result.mode}`,
    `stages:  ${result.stages.length > 0 ? result.stages.join(' -> ') : '(none completed)'}`,
    `spent:   ${stx(result.spentUstx)}`,
    `journal: ${result.journalPath}`
  ];
  if (!result.ok) {
    lines.push('');
    lines.push(result.halted?.message ?? '');
  }
  return lines.join('\n');
}
