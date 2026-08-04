/**
 * The pipeline harness, tested against a chain that lives in memory.
 *
 * The suite is organised around one claim: a gate that has only ever seen
 * correct input has not been tested, it has been watched. So most of what is
 * below corrupts the fake chain in a specific, realistic way after a stage has
 * minted, and asserts the pipeline HALTS rather than building on it. Those are
 * negative controls -- if the corresponding gate were deleted, each of these
 * would fail, which is the only property that makes them worth running.
 *
 * The happy path is here too, once, because "all thirty-five, all verified" is
 * the thing the negative controls are negatives OF.
 */
import { describe, expect, it } from 'vitest';

import {
  LISTABLE_PLATES,
  STAGE_IDS,
  TOTAL_MINTS,
  assertGate,
  costModel,
  gateFor,
  itemsForStage,
  pipelineStatusReport,
  runPipeline,
  verifyInscription
} from '../pipeline-core.mjs';
import {
  REHEARSAL_WALLETS,
  makeFakeChain,
  makeFastClock,
  makeMemoryJournal
} from '../pipeline-rehearse.mjs';
import { renderPersonaDoc, tokenUriForPersona } from '../collection-personas.mjs';
import { assertPageIdsComplete, pageDependencies, renderCollectionPage } from '../collection-page.mjs';
import { COLLECTION_IDS, getCollection } from '../collections.mjs';
import { MARKS } from '../collection-marks.mjs';
import { PERSONAS } from '../personas.mjs';

/**
 * A key-shaped string that is not a key.
 *
 * `assertBroadcastAllowed` refuses to broadcast without one, which is a rail
 * worth having and a rail the rehearsal has to satisfy. All ones, so a value
 * that ever escaped into a log is unmistakably synthetic.
 */
const FAKE_KEY = `${'11'.repeat(32)}01`;
const WALLETS = Object.fromEntries(
  Object.entries(REHEARSAL_WALLETS).map(([wizard, wallet]) => [wizard, { ...wallet, key: FAKE_KEY }])
);

type RunOptions = {
  to?: string;
  runSpendCapUstx?: bigint;
  killSwitch?: () => string | null;
  balances?: Record<string, bigint>;
};

const rehearse = async ({ to, runSpendCapUstx = 50_000_000n, killSwitch = () => null, balances }: RunOptions = {}) => {
  const chain = makeFakeChain(balances ? { balances } : {});
  const journal = makeMemoryJournal();
  const clock = makeFastClock();
  const lines: string[] = [];

  const run = (extra: Record<string, unknown> = {}) =>
    runPipeline({
      ports: {
        fetchImpl: chain.fetchImpl,
        submit: chain.submit,
        readJournal: journal.readJournal,
        writeJournal: journal.writeJournal,
        killSwitch,
        now: clock.now,
        sleep: clock.sleep,
        say: (line: string) => lines.push(line)
      },
      options: { runId: 'rehearsal', broadcast: true, wallets: WALLETS, runSpendCapUstx, to, ...extra }
    });

  return { chain, journal, clock, lines, run };
};

describe('the pipeline runs end to end against a chain in memory', () => {
  it('mints all thirty-five and passes every gate', async () => {
    const { chain, run } = await rehearse();
    const result = await run();

    expect(result.halted, result.halted?.message).toBeNull();
    expect(result.ok).toBe(true);
    expect(result.stages).toEqual(STAGE_IDS);
    expect(chain.state.broadcasts).toBe(TOTAL_MINTS);
    expect(chain.state.inscriptions.size).toBe(TOTAL_MINTS);

    // Every gate verified, and none of them skipped or vacuous.
    for (const stage of STAGE_IDS) {
      expect(result.gates[stage]?.status, stage).toBe('verified');
      expect(result.gates[stage]?.checked, stage).toBeGreaterThan(0);
    }
  });

  it('never reaches a URL the fake chain does not recognise', async () => {
    // The fake throws on any unrecognised URL, so completing the run at all is
    // the proof. This asserts the stronger form: every call was a read or a
    // known endpoint, and none was a broadcast endpoint.
    const { chain, run } = await rehearse();
    await run();
    for (const url of chain.state.calls) {
      expect(url).not.toMatch(/\/v2\/transactions/);
    }
    expect(chain.state.calls.length).toBeGreaterThan(TOTAL_MINTS);
  });

  it('spends what the cost model says it will', async () => {
    const { run } = await rehearse();
    const result = await run();
    // The model counts the listing miner fees too, which this run does not
    // reach, so compare the mint half only.
    const model = costModel();
    const mintsOnly = model.totalSpentUstx - BigInt(model.listings) * 30_000n;
    expect(result.spentUstx).toBe(mintsOnly);
  });

  it('counts the mints runCollection made, not only its own eight', async () => {
    // The delegated-spend record exists because without it a fleet-level cap is
    // blind to twenty-seven of the thirty-five mints.
    const { run } = await rehearse();
    const result = await run();
    expect(result.spentUstx).toBeGreaterThan(8n * 41_000n);
  });

  it('writes every id into the map, including the ones runCollection minted', async () => {
    const { run } = await rehearse();
    const result = await run();
    for (const persona of PERSONAS) expect(result.ids.personas[persona.id]).toBeTruthy();
    for (const collectionId of COLLECTION_IDS) {
      const art = getCollection(collectionId);
      for (let index = 1; index <= art.length; index += 1) {
        expect(result.ids.plates[collectionId][String(index)], `${collectionId}/${index}`).toBeTruthy();
      }
      expect(result.ids.manifests[collectionId]).toBeTruthy();
    }
    for (const mark of MARKS) expect(result.ids.marks[mark.wizard]).toBeTruthy();
    expect(result.ids.arms).toBeTruthy();
    expect(result.ids.page).toBeTruthy();
  });
});

describe('the graph is what the pipeline says it is', () => {
  it('personas are roots and cite nothing', async () => {
    const { chain, run } = await rehearse();
    const result = await run();
    for (const persona of PERSONAS) {
      const record = chain.state.inscriptions.get(String(result.ids.personas[persona.id]));
      expect(record.dependencies, persona.id).toEqual([]);
    }
  });

  it('each manifest cites its eight plates AND its persona', async () => {
    const { chain, run } = await rehearse();
    const result = await run();
    for (const collectionId of COLLECTION_IDS) {
      const art = getCollection(collectionId);
      const record = chain.state.inscriptions.get(String(result.ids.manifests[collectionId]));
      const plates = Object.values(result.ids.plates[collectionId]).map(String);
      expect(record.dependencies.length, collectionId).toBe(art.length + 1);
      for (const plate of plates) expect(record.dependencies, collectionId).toContain(plate);
      // The edge that makes minting the personas worth doing.
      expect(record.dependencies, collectionId).toContain(String(result.ids.personas[art.wizard]));
    }
  });

  it('each mark cites its own persona and no other', async () => {
    const { chain, run } = await rehearse();
    const result = await run();
    for (const mark of MARKS) {
      const record = chain.state.inscriptions.get(String(result.ids.marks[mark.wizard]));
      expect(record.dependencies, mark.wizard).toEqual([String(result.ids.personas[mark.wizard])]);
    }
  });

  it('the arms cites all three marks', async () => {
    const { chain, run } = await rehearse();
    const result = await run();
    const record = chain.state.inscriptions.get(String(result.ids.arms));
    expect(record.dependencies.sort()).toEqual(MARKS.map((mark) => String(result.ids.marks[mark.wizard])).sort());
  });

  it('the page cites thirty-one, inside the core bound of fifty', async () => {
    const { chain, run } = await rehearse();
    const result = await run();
    const record = chain.state.inscriptions.get(String(result.ids.page));
    expect(record.dependencies).toHaveLength(31);
    expect(record.dependencies.length).toBeLessThanOrEqual(50);
    expect(new Set(record.dependencies).size).toBe(31);
  });

  it('nothing cites an id minted after it', async () => {
    // The whole reason mint order is forced. Ids are assigned in mint order by
    // the fake exactly as the core assigns them, so a citation of a larger id
    // would be a citation of the future.
    const { chain, run } = await rehearse();
    await run();
    for (const [id, record] of chain.state.inscriptions) {
      for (const dependency of record.dependencies) {
        expect(Number(dependency), `#${id} cites #${dependency}`).toBeLessThan(Number(id));
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/* the negative controls                                               */
/* ------------------------------------------------------------------ */

describe('injected failures: each gate refuses to build on a broken layer', () => {
  /**
   * Run to the end of `stopAfter`, corrupt the chain, then run the next stage
   * and expect a halt. Splitting the run in two is what makes the corruption
   * land between a mint and the gate that would otherwise wave it through.
   */
  const corruptThenContinue = async (
    stopAfter: string,
    nextStage: string,
    corrupt: (chain: ReturnType<typeof makeFakeChain>, ids: any) => void
  ) => {
    const { chain, run } = await rehearse({ to: stopAfter });
    const first = await run();
    expect(first.halted, `setup run to ${stopAfter} should succeed`).toBeNull();

    corrupt(chain, first.ids);

    return run({ from: stopAfter, to: nextStage });
  };

  it('a persona whose bytes changed by one byte stops the plates stage', async () => {
    const result = await corruptThenContinue('personas', 'plates', (chain, ids) =>
      chain.inject('flip-byte', ids.personas.builder)
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/bytes are not the builder persona/i);
  });

  it('a persona that vanished stops the plates stage', async () => {
    const result = await corruptThenContinue('personas', 'plates', (chain, ids) =>
      chain.inject('vanish', ids.personas.skeptic)
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/no chunk u0 on chain/);
  });

  it('a persona created by the wrong wallet stops the plates stage', async () => {
    const result = await corruptThenContinue('personas', 'plates', (chain, ids) =>
      chain.inject('wrong-creator', ids.personas.archivist)
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/was created by/);
  });

  it('a manifest missing one plate edge stops the marks stage', async () => {
    const result = await corruptThenContinue('manifests', 'marks', (chain, ids) =>
      chain.inject('drop-dependency', ids.manifests[COLLECTION_IDS[0]])
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/cites the wrong set: missing/);
  });

  it('a manifest citing an id nobody asked for stops the marks stage', async () => {
    const result = await corruptThenContinue('manifests', 'marks', (chain, ids) =>
      chain.inject('extra-dependency', ids.manifests[COLLECTION_IDS[1]])
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/unexpected #999999/);
  });

  it('a mark pointing at the wrong persona stops the arms stage', async () => {
    const result = await corruptThenContinue('marks', 'arms', (chain, ids) =>
      chain.inject('wrong-dependency', ids.marks.skeptic)
    );
    expect(result.halted?.reason).toBe('gate');
    expect(result.halted?.message).toMatch(/cites the wrong set/);
  });

  it('a corrupted plate stops the manifests stage before anything signs over it', async () => {
    const { chain, run } = await rehearse({ to: 'plates' });
    const first = await run();
    expect(first.halted).toBeNull();
    // The FIRST collection, deliberately. Corrupting a later one lets the
    // earlier collections mint their own perfectly good manifests first, which
    // is correct behaviour but makes the broadcast count an ambiguous control.
    const collectionId = COLLECTION_IDS[0];
    chain.inject('flip-byte', first.ids.plates[collectionId]['3']);

    const before = chain.state.broadcasts;
    const result = await run({ from: 'manifests', to: 'manifests' });
    expect(result.ok).toBe(false);
    // The important half: it stopped, and no manifest was signed over the
    // corrupted plate. runCollection's own byte rail catches it first, which is
    // the correct place -- it is the thing about to cite it.
    expect(chain.state.broadcasts).toBe(before);
    expect(result.ids.manifests[collectionId]).toBeFalsy();
  });

  it('a corrupted plate is caught at the listings gate too, so ownership is not the only check', async () => {
    const { chain, run } = await rehearse();
    const complete = await run();
    expect(complete.halted).toBeNull();

    chain.inject('flip-byte', complete.ids.plates[COLLECTION_IDS[0]]['5']);
    const gate = await gateFor({
      stage: 'listings',
      ids: complete.ids,
      fetchImpl: chain.fetchImpl,
      addresses: Object.fromEntries(Object.entries(WALLETS).map(([w, v]) => [w, v.address]))
    });
    expect(gate.ok).toBe(false);
    expect(() => assertGate(gate)).toThrow(/listings gate did not pass/);
  });
});

/* ------------------------------------------------------------------ */
/* the rails                                                           */
/* ------------------------------------------------------------------ */

describe('the rails stop the run rather than the run stopping itself', () => {
  it('the kill switch halts before the first broadcast', async () => {
    const { chain, run } = await rehearse({ killSwitch: () => 'KILL file present' });
    const result = await run();
    expect(result.halted?.reason).toBe('kill-switch');
    expect(chain.state.broadcasts).toBe(0);
  });

  it('the run spend cap halts partway rather than at the end', async () => {
    // Four mints' worth. The cap has to bite during the personas stage.
    const { chain, run } = await rehearse({ runSpendCapUstx: 200_000n });
    const result = await run();
    expect(result.halted?.reason).toBe('spend-cap');
    expect(chain.state.broadcasts).toBeGreaterThan(0);
    expect(chain.state.broadcasts).toBeLessThan(TOTAL_MINTS);
  });

  it('a wallet below its floor is refused before it signs', async () => {
    const { chain, run } = await rehearse({
      balances: { [REHEARSAL_WALLETS.archivist.address]: 1_000n }
    });
    const result = await run();
    expect(result.ok).toBe(false);
    expect(chain.state.broadcasts).toBeLessThan(TOTAL_MINTS);
  });

  it('the generic leg applies the key rail, not only runCollection', async () => {
    // This leg shipped without assertBroadcastAllowed and the rehearsal caught
    // it: personas would have broadcast with no key check, no balance floor and
    // no paused check while the plates two stages later had all three.
    const chain = makeFakeChain();
    const journal = makeMemoryJournal();
    const clock = makeFastClock();
    const result = await runPipeline({
      ports: {
        fetchImpl: chain.fetchImpl,
        submit: chain.submit,
        readJournal: journal.readJournal,
        writeJournal: journal.writeJournal,
        killSwitch: () => null,
        now: clock.now,
        sleep: clock.sleep,
        say: () => {}
      },
      // Keys absent. Nothing may be signed.
      options: { runId: 'nokey', broadcast: true, wallets: REHEARSAL_WALLETS, to: 'personas' }
    });
    expect(result.ok).toBe(false);
    expect(result.halted?.message).toMatch(/no key/i);
    expect(chain.state.broadcasts).toBe(0);
  });

  it('a paused core is refused', async () => {
    const chain = makeFakeChain({ paused: true });
    const journal = makeMemoryJournal();
    const clock = makeFastClock();
    const result = await runPipeline({
      ports: {
        fetchImpl: chain.fetchImpl,
        submit: chain.submit,
        readJournal: journal.readJournal,
        writeJournal: journal.writeJournal,
        killSwitch: () => null,
        now: clock.now,
        sleep: clock.sleep,
        say: () => {}
      },
      options: { runId: 'paused', broadcast: true, wallets: WALLETS, to: 'personas' }
    });
    expect(result.ok).toBe(false);
    expect(chain.state.broadcasts).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* resume                                                              */
/* ------------------------------------------------------------------ */

describe('resume: a second run re-mints nothing', () => {
  it('running the whole pipeline twice broadcasts thirty-five times, not seventy', async () => {
    const { chain, run } = await rehearse();
    const first = await run();
    expect(first.halted).toBeNull();
    expect(chain.state.broadcasts).toBe(TOTAL_MINTS);

    const second = await run();
    expect(second.halted, second.halted?.message).toBeNull();
    expect(chain.state.broadcasts).toBe(TOTAL_MINTS);
  });

  it('a run that lost its journal adopts by content hash rather than paying twice', async () => {
    // The machine died and took the journal with it. Every body in this
    // pipeline is a pure function of its inputs, so the duplicate-content probe
    // finds what was already minted. The page is included, because its ids were
    // written to the journal before it was composed -- but a wiped journal has
    // no ids, so the page legitimately cannot resume, and the test asserts what
    // is actually recoverable rather than pretending everything is.
    const { chain, journal, run } = await rehearse({ to: 'personas' });
    const first = await run();
    expect(first.halted).toBeNull();
    expect(chain.state.broadcasts).toBe(3);

    journal.wipe();
    const second = await run();
    expect(second.halted, second.halted?.message).toBeNull();
    expect(chain.state.broadcasts, 'nothing should have been minted twice').toBe(3);
    // Adopted, and the ids are the same ones.
    expect(second.ids.personas.builder).toBe(first.ids.personas.builder);
  });

  it('stops at the stage it was told to and reports only the stages it ran', async () => {
    const { chain, run } = await rehearse({ to: 'personas' });
    const result = await run();
    expect(result.stages).toEqual(['personas']);
    expect(chain.state.broadcasts).toBe(3);
  });

  it('--status reconciles against the chain and does not trust the journal', async () => {
    const { chain, journal, run } = await rehearse();
    await run();

    const report = await pipelineStatusReport({
      ports: { fetchImpl: chain.fetchImpl, readJournal: journal.readJournal },
      options: { runId: 'rehearsal', wallets: WALLETS }
    });
    expect(report.found).toBe(true);
    for (const stage of report.stages) expect(stage.status, stage.stage).toBe('verified');

    // Corrupt the chain, leave the journal alone. Status must follow the chain.
    chain.inject('vanish', report.ids.arms);
    const after = await pipelineStatusReport({
      ports: { fetchImpl: chain.fetchImpl, readJournal: journal.readJournal },
      options: { runId: 'rehearsal', wallets: WALLETS }
    });
    expect(after.stages.find((stage) => stage.stage === 'arms')?.status).toBe('failed');
  });

  it('--status on a run that never started says so instead of throwing', async () => {
    const { chain } = await rehearse();
    const report = await pipelineStatusReport({
      ports: { fetchImpl: chain.fetchImpl, readJournal: () => null },
      options: { runId: 'never', wallets: WALLETS }
    });
    expect(report.found).toBe(false);
    expect(report.stages.every((stage) => stage.status === 'not-started')).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* composing over gaps                                                 */
/* ------------------------------------------------------------------ */

describe('nothing composes over a gap', () => {
  it('a mark refuses to compose before its persona exists', () => {
    expect(() => itemsForStage('marks', { personas: {} })).toThrow(/persona/i);
  });

  it('the arms refuses to compose before all three marks exist', () => {
    expect(() => itemsForStage('arms', { marks: { builder: '1' } })).toThrow(/marks stage/i);
  });

  it('the page names every missing id at once rather than the first', () => {
    let message = '';
    try {
      assertPageIdsComplete({ plates: {}, manifests: {}, marks: {}, arms: null });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/31 inscription id\(s\) are not known yet/);
    expect(message).toMatch(/plate c-machinery-001\/1/);
    expect(message).toMatch(/- arms/);
  });

  it('the page refuses a duplicate id rather than citing it twice', () => {
    const ids: any = { plates: {}, manifests: {}, marks: {}, arms: '500' };
    for (const collectionId of COLLECTION_IDS) {
      ids.plates[collectionId] = {};
      for (let index = 1; index <= getCollection(collectionId).length; index += 1) {
        ids.plates[collectionId][index] = '500';
      }
      ids.manifests[collectionId] = '500';
    }
    for (const mark of MARKS) ids.marks[mark.wizard] = '500';
    expect(() => assertPageIdsComplete(ids)).toThrow(/twice/);
  });
});

/* ------------------------------------------------------------------ */
/* the bodies                                                          */
/* ------------------------------------------------------------------ */

describe('the bodies are pure functions of their inputs', () => {
  it('a persona renders identically twice', () => {
    for (const persona of PERSONAS) {
      expect(renderPersonaDoc(persona.id)).toBe(renderPersonaDoc(persona.id));
    }
  });

  it('a persona embeds no date, block, fee or run id', () => {
    // Any of these would trade a decidable crash window for an undecidable one:
    // a body that cannot be regenerated cannot be probed for by content hash.
    for (const persona of PERSONAS) {
      const doc = renderPersonaDoc(persona.id);
      expect(doc, persona.id).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
      expect(doc, persona.id).not.toMatch(/\bblock\s+\d/i);
      expect(doc, persona.id).not.toMatch(/\d+\s*(µSTX|microSTX)/i);
    }
  });

  it('a persona says it is not a person', () => {
    for (const persona of PERSONAS) {
      expect(renderPersonaDoc(persona.id)).toContain('it is not sentient');
    }
  });

  it('a persona declares the accent its mark and plates actually use', () => {
    // The one fact a reader can check by looking rather than by trusting.
    for (const mark of MARKS) {
      const accent = mark.palette['*'];
      expect(renderPersonaDoc(mark.wizard), mark.wizard).toContain(accent);
    }
  });

  it('token uris are short, ascii and inside the core bound of 256', () => {
    for (const persona of PERSONAS) {
      const uri = tokenUriForPersona(persona.id);
      expect(uri.length).toBeLessThanOrEqual(256);
      expect(uri).toMatch(/^[\x20-\x7e]+$/);
    }
  });

  it('the page loads nothing from outside the chain', () => {
    const ids: any = { plates: {}, manifests: {}, marks: {}, arms: '900' };
    let next = 100;
    for (const collectionId of COLLECTION_IDS) {
      ids.plates[collectionId] = {};
      for (let index = 1; index <= getCollection(collectionId).length; index += 1) {
        ids.plates[collectionId][index] = String(next++);
      }
      ids.manifests[collectionId] = String(next++);
    }
    for (const mark of MARKS) ids.marks[mark.wizard] = String(next++);
    const html = renderCollectionPage(ids);

    // No absolute URL of any kind. Every reference is a recursive /i/<id>.
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).not.toMatch(/<script/i);
    expect(html.match(/data="\/i\/\d+"/g) ?? []).toHaveLength(28); // 24 plates + 3 marks + arms
  });

  it('the page cites exactly what it renders', () => {
    const ids: any = { plates: {}, manifests: {}, marks: {}, arms: '900' };
    let next = 100;
    for (const collectionId of COLLECTION_IDS) {
      ids.plates[collectionId] = {};
      for (let index = 1; index <= getCollection(collectionId).length; index += 1) {
        ids.plates[collectionId][index] = String(next++);
      }
      ids.manifests[collectionId] = String(next++);
    }
    for (const mark of MARKS) ids.marks[mark.wizard] = String(next++);

    const deps = pageDependencies(ids).map(String);
    const html = renderCollectionPage(ids);
    for (const id of deps) {
      expect(html, `#${id} is cited but never appears in the page`).toContain(`/i/${id}`);
    }
  });
});

/* ------------------------------------------------------------------ */
/* the shape of the run                                                */
/* ------------------------------------------------------------------ */

describe('constants and cost', () => {
  it('the stage list totals thirty-five mints and twenty-four listable plates', () => {
    expect(TOTAL_MINTS).toBe(35);
    expect(LISTABLE_PLATES).toBe(24);
  });

  it('the cost model splits what is spent from what is escrowed', () => {
    const model = costModel();
    expect(model.mints).toBe(TOTAL_MINTS);
    expect(model.listings).toBe(LISTABLE_PLATES);
    // Escrow comes back; spend does not. Reporting one number would let an
    // operator size the fleet against a total that overstates the loss by half.
    expect(model.totalEscrowUstx).toBe(BigInt(LISTABLE_PLATES) * 50_000n);
    expect(model.totalCommittedUstx).toBe(model.totalSpentUstx + model.totalEscrowUstx);
  });

  it('the load is uneven, and the model says so per wallet', () => {
    // The arms and the page both come out of one wallet. A fleet that can
    // afford the run in aggregate can still have one wizard unable to pay.
    const model = costModel();
    expect(model.perWizard.archivist.mints).toBeGreaterThan(model.perWizard.builder.mints);
  });

  it('verifyInscription reports a missing id rather than throwing', async () => {
    const chain = makeFakeChain();
    const result = await verifyInscription({
      fetchImpl: chain.fetchImpl,
      id: '',
      label: 'nothing'
    });
    expect(result.ok).toBe(false);
    expect(result.status).toBe('no-id');
  });

  it('an unreadable node is "unavailable", not "failed"', async () => {
    // Treating a node that would not answer as a failure teaches an operator to
    // override real ones.
    const gate = await gateFor({
      stage: 'arms',
      ids: { marks: { builder: '1', archivist: '2', skeptic: '3' }, arms: '4' },
      fetchImpl: async () => {
        throw new Error('node down');
      }
    });
    expect(gate.status).toBe('unavailable');
    expect(gate.ok).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* regressions                                                         */
/* ------------------------------------------------------------------ */

describe('regressions found by building this harness', () => {
  it('a resumed non-default collection compares against its OWN plates', async () => {
    // collection-run-core called hydratePiece without collectionId on the adopt
    // path, so a resumed Archivist or Skeptic run compared their plates against
    // the Builder's and halted blaming the id. It fails closed, so nothing was
    // ever minted wrongly -- but it blocked resume for two collections in three,
    // which is exactly the path a crash leads to.
    const { chain, run } = await rehearse({ to: 'plates' });
    const first = await run();
    expect(first.halted).toBeNull();

    // Second pass adopts all twenty-four rather than re-minting, and must not
    // mistake one collection's plate for another's.
    const second = await run({ from: 'plates', to: 'plates' });
    expect(second.halted, second.halted?.message).toBeNull();
    expect(chain.state.broadcasts).toBe(3 + 24);
  });

  it('the manifest leg walks the whole collection, or it silently mints nothing', async () => {
    // runCollection only mints the manifest once it has a member for every
    // index. A manifest leg narrowed to `to: 1` walks one plate, fails that
    // condition, and returns ok having minted nothing at all.
    const { run } = await rehearse({ to: 'manifests' });
    const result = await run();
    expect(result.halted, result.halted?.message).toBeNull();
    for (const collectionId of COLLECTION_IDS) {
      expect(result.ids.manifests[collectionId], collectionId).toBeTruthy();
    }
  });

  it('delegated spend is counted once, not once per stage that touches it', async () => {
    // Keyed by stage, the manifest leg's cumulative total re-added the plates
    // and reported nearly double the real spend.
    //
    // 41,000 per mint: the 11,000 protocol fee measured live against v3-2-3 on
    // 2026-08-01, plus the 30,000 miner bid. The fake chain quotes the same
    // 11,000 so the rehearsal rehearses the real economics rather than an
    // invented number that happens to look plausible.
    const { run } = await rehearse();
    const result = await run();
    expect(result.spentUstx).toBe(BigInt(TOTAL_MINTS) * 41_000n);
  });
});
