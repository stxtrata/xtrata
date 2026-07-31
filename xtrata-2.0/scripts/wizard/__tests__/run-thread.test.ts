import { describe, expect, it, vi } from 'vitest';
import {
  TransactionVersion,
  boolCV,
  cvToHex,
  getAddressFromPrivateKey,
  responseErrorCV,
  responseOkCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';

import { composeThread, parseEntry } from '../compose.mjs';
import { PERSONA_IDS } from '../personas.mjs';
import { dryPorts, fakeFetch, liveSubmit, makeFakeChain, parseResolution } from '../run-thread.mjs';
import {
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  MANIFEST_KEY,
  RUN_JOURNAL_VERSION,
  RunHalt,
  assertJournalSecretFree,
  assertRunSpendCap,
  classifyIntentNonce,
  classifyTxStatus,
  committedSpendUstx,
  fetchSenderNonces,
  formatResolution,
  formatRunReport,
  formatStatusTable,
  journalPathFor,
  normaliseTxid,
  parseMintResult,
  pollTransaction,
  resolvePosition,
  runThread,
  statusReport
} from '../run-thread-core.mjs';

const THREAD = 't-permanence-001';
const SUBJECT = 'cost-of-permanence';
const TIP = 8_700_000;
const FEE = 11_000n;
const MINER_FEE = 30_000n;
const JOURNAL_DIR = '/tmp/wizard-run-thread-tests';

/**
 * Synthetic wizard wallets, derived from fixed dummy keys so they are valid c32
 * and belong to nobody. Never funded, never used to sign: the submit port in
 * every test below is a fake, and the core never signs anything itself.
 */
const dummyKey = (index: number) => String(index + 1).padStart(64, '0');
const ADDRESSES = Object.fromEntries(
  PERSONA_IDS.map((id: string, index: number) => [id, getAddressFromPrivateKey(dummyKey(index), TransactionVersion.Mainnet)])
) as Record<string, string>;

const WALLETS = Object.fromEntries(
  PERSONA_IDS.map((id: string, index: number) => [id, { address: ADDRESSES[id], key: dummyKey(index) }])
) as Record<string, { address: string; key: string }>;

const ENV = Object.fromEntries(
  PERSONA_IDS.map((id: string) => [`WIZARD_ADDRESS_${id.toUpperCase()}`, ADDRESSES[id]])
) as NodeJS.ProcessEnv;

/** The four entries already on chain, at the ids the live thread really used. */
const LIVE_IDS = ['2922', '2923', '2924', '2925'];

const okMint = (id: string | number, existed = false) => ({
  hex: cvToHex(responseOkCV(tupleCV({ existed: boolCV(existed), 'token-id': uintCV(BigInt(id)) }))),
  repr: `(ok (tuple (existed ${existed}) (token-id u${id})))`
});

type HarnessOptions = {
  /** Positions already minted, in order. Defaults to the four live ids. */
  priorIds?: string[];
  /** Override the status the minted transaction ends up with. */
  txStatus?: string;
  /** Throw out of submit *after* the mint reached the chain: the crash window. */
  crashAfterMint?: boolean;
  /** Rewrite the body the chain serves back, to prove citations come off chain. */
  tamperStoredBody?: (body: string) => string;
  killSwitch?: (env: NodeJS.ProcessEnv) => string | null;
  /** Seed the journal as if an earlier run had written it. */
  journal?: unknown;
  clockStepMs?: number;
  /** The wallet nonce state the fake `/nonces` endpoint serves. */
  nonces?: Partial<Nonces>;
};

/** The five fields the live Hiro nonces endpoint returns. */
type Nonces = {
  last_executed_tx_nonce: number | null;
  possible_next_nonce: number | null;
  last_mempool_tx_nonce: number | null;
  detected_missing_nonces: number[];
  detected_mempool_nonces: number[];
};

/**
 * A whole runnable world: a fake chain seeded with the entries already minted, a
 * fetch that answers from it and refuses anything else, a submit that mints into
 * it, and a journal that round-trips through JSON exactly as a file would.
 *
 * The fake chain and the fake fetch are the ones `--dry` itself uses, imported
 * rather than re-implemented, so a fake that drifts from the real encoders shows
 * up in these tests instead of on mainnet.
 */
const harness = (options: HarnessOptions = {}) => {
  const priorIds = options.priorIds ?? LIVE_IDS;
  const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
  if (options.nonces) Object.assign(chain.nonces, options.nonces);

  if (priorIds.length > 0) {
    const seeded = composeThread({
      threadId: THREAD,
      subject: SUBJECT,
      blockHeight: TIP,
      feeMicroStx: FEE,
      ids: priorIds,
      threadLength: 6
    }) as { entries: Array<{ id: string; body: string; wizard: string }> };
    for (const entry of seeded.entries.slice(0, priorIds.length)) {
      chain.add(entry.id, entry.body, ADDRESSES[entry.wizard]);
    }
  }

  const urls: string[] = [];
  const answer = fakeFetch(chain);
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    urls.push(String(input));
    return answer(input, init);
  });

  const submitted: Array<{ position: number | null; body: string; wizardId: string }> = [];
  let txStatus = options.txStatus ?? 'success';
  const submit = vi.fn(async ({ plan, wizardId }: { plan: any; wizardId: string }) => {
    submitted.push({ position: plan.position, body: plan.body, wizardId });
    const minted = chain.mint(plan.body, ADDRESSES[wizardId], MINER_FEE);
    if (options.tamperStoredBody) {
      chain.inscriptions.set(minted.id, {
        body: options.tamperStoredBody(plan.body),
        creator: ADDRESSES[wizardId]
      });
    }
    if (txStatus !== 'success') {
      chain.transactions.set(minted.txid.toLowerCase(), {
        tx_status: txStatus,
        tx_result: { hex: cvToHex(responseErrorCV(uintCV(103n))), repr: '(err u103)' },
        block_height: null,
        fee_rate: String(MINER_FEE)
      });
    }
    if (options.crashAfterMint) {
      // The node took it; the process died before the txid was written down.
      throw new Error('socket hang up');
    }
    return { txid: minted.txid };
  });

  let disk: string | null = options.journal ? JSON.stringify(options.journal) : null;
  let clock = Date.UTC(2026, 6, 31, 12, 0, 0);
  const said: string[] = [];

  const ports = {
    fetchImpl: fetchImpl as unknown as typeof fetch,
    submit,
    // Round-tripped through JSON, like a file: nothing may depend on the runner
    // handing itself back the same object it wrote.
    readJournal: () => (disk === null ? null : JSON.parse(disk)),
    writeJournal: (_path: string, journal: unknown) => {
      disk = JSON.stringify(journal);
    },
    killSwitch: options.killSwitch ?? (() => null),
    now: () => (clock += options.clockStepMs ?? 1_000),
    sleep: async () => {},
    say: (line: string) => said.push(String(line)),
    presentPlan: () => {}
  };

  const run = (overrides: Record<string, unknown> = {}) =>
    runThread({
      ports,
      options: {
        threadId: THREAD,
        subject: SUBJECT,
        threadLength: 6,
        from: 5,
        to: 6,
        broadcast: true,
        env: ENV,
        wallets: WALLETS,
        journalDir: JOURNAL_DIR,
        knownIds: Object.fromEntries(priorIds.map((id, index) => [String(index + 1), id])),
        confirmTimeoutMs: 120_000,
        confirmPollMs: 1_000,
        ...overrides
      }
    });

  return {
    chain,
    ports,
    submit,
    submitted,
    fetchImpl,
    urls,
    said,
    run,
    journal: () => (disk === null ? null : JSON.parse(disk)),
    setJournal: (value: unknown) => {
      disk = JSON.stringify(value);
    },
    setTxStatus: (value: string) => {
      txStatus = value;
    },
    setNonces: (value: Partial<Nonces>) => Object.assign(chain.nonces, value)
  };
};

/**
 * The journal an interrupted run leaves behind: intent written for position 5,
 * the mint accepted by the node, the process dead before the txid was recorded.
 *
 * Returned with the world that produced it, because the inscription those bytes
 * became lives in that world's chain and the resumed world may or may not be
 * given it.
 */
const crashedAtFive = async () => {
  const world = harness({ crashAfterMint: true });
  const crashed = await world.run();
  return { world, crashed, journal: world.journal() as any };
};

/* ------------------------------------------------------------------ */

describe('reading a mint result', () => {
  it('parses the token-id and existed out of a real encoded (ok (tuple ...))', () => {
    expect(parseMintResult(okMint(2925))).toEqual({ inscriptionId: '2925', existed: false });
  });

  it('reports a duplicate mint, which returns the id of the earlier one', () => {
    expect(parseMintResult(okMint(2925, true))).toEqual({ inscriptionId: '2925', existed: true });
  });

  it('falls back to the printed repr when the API supplies no hex', () => {
    expect(parseMintResult({ repr: '(ok (tuple (existed false) (token-id u2926)))' })).toEqual({
      inscriptionId: '2926',
      existed: false
    });
  });

  it('refuses an error response rather than inventing an id', () => {
    expect(() => parseMintResult({ hex: cvToHex(responseErrorCV(uintCV(103n))), repr: '(err u103)' })).toThrow(
      /error response/
    );
  });

  it('refuses a result with no token-id in it', () => {
    expect(() => parseMintResult({ hex: cvToHex(responseOkCV(boolCV(true))) })).toThrow(/token-id/);
    expect(() => parseMintResult(null)).toThrow(/no result/);
  });
});

describe('transaction status', () => {
  it('waits only on pending, and treats every other terminal status as a failure', () => {
    expect(classifyTxStatus('pending')).toBe('pending');
    expect(classifyTxStatus('success')).toBe('success');
    for (const status of [
      'abort_by_response',
      'abort_by_post_condition',
      'dropped_replace_by_fee',
      'dropped_stale_garbage_collect',
      'dropped_too_expensive',
      'a_status_that_did_not_exist_when_this_was_written'
    ]) {
      expect(classifyTxStatus(status)).toBe('failed');
    }
  });

  it('normalises a txid the way Hiro wants it, and refuses anything else', () => {
    const bare = 'A'.repeat(64);
    expect(normaliseTxid(bare)).toBe(`0x${'a'.repeat(64)}`);
    expect(normaliseTxid(`0x${bare}`)).toBe(`0x${'a'.repeat(64)}`);
    expect(() => normaliseTxid('0xdeadbeef')).toThrow(/not a 32-byte transaction id/);
    expect(() => normaliseTxid(null)).toThrow();
  });
});

describe('the journal file', () => {
  it('names one file per thread and keeps dry runs out of the real one', () => {
    expect(journalPathFor({ dir: '/tmp', threadId: THREAD })).toBe(`/tmp/.run-${THREAD}.json`);
    expect(journalPathFor({ dir: '/tmp', threadId: THREAD, mode: 'dry' })).toBe(`/tmp/.run-${THREAD}.dry.json`);
  });

  it('refuses a thread id that would write outside the directory', () => {
    expect(() => journalPathFor({ dir: '/tmp', threadId: '../../etc/passwd' })).toThrow(/not a usable thread id/);
    expect(() => journalPathFor({ dir: '/tmp', threadId: '' })).toThrow(/not a usable thread id/);
  });

  it('refuses to write a journal that has picked up key material', () => {
    const key = 'a'.repeat(64);
    expect(() => assertJournalSecretFree({ positions: { 5: { senderKey: key } } }, [key])).toThrow(/private key/);
    expect(assertJournalSecretFree({ positions: { 5: { txid: '0x1' } } }, [key])).toBeTruthy();
  });
});

describe('the run-level spend cap', () => {
  const journal = {
    positions: {
      1: { status: 'external', protocolFeeUstx: '11000', minerFeeUstx: '30000' },
      5: { status: 'confirmed', protocolFeeUstx: '11000', minerFeeUstx: '30000', actualMinerFeeUstx: '7000' },
      6: { status: 'broadcast', protocolFeeUstx: '11000', minerFeeUstx: '30000' }
    }
  };

  it('counts what this run committed, ignores what it did not, and prefers the real miner fee', () => {
    // 5: 11,000 + 7,000 actual. 6: 11,000 + 30,000 bid. 1 is external: not ours.
    expect(committedSpendUstx(journal)).toBe(59_000n);
    expect(committedSpendUstx({ positions: {} })).toBe(0n);
  });

  it('keeps counting attempts that were cleared, so a re-composing loop still hits the cap', () => {
    // A position cleared twice and then minted is three attempts against the
    // cap, not one. Almost none of them spent anything; the number is there to
    // stop a loop, and a total that forgot them could never reach it.
    const cleared = {
      positions: {
        5: {
          status: 'broadcasting',
          protocolFeeUstx: '11000',
          minerFeeUstx: '30000',
          previousIntents: [
            { protocolFeeUstx: '11000', minerFeeUstx: '30000' },
            { protocolFeeUstx: '11000', minerFeeUstx: '30000' }
          ]
        }
      }
    };
    expect(committedSpendUstx(cleared)).toBe(3n * 41_000n);
    // And an abandoned position counts its archive once, not twice: the fee
    // fields move into the archive when the intent is cleared.
    expect(
      committedSpendUstx({
        positions: { 5: { status: 'abandoned', previousIntents: [{ protocolFeeUstx: '11000', minerFeeUstx: '30000' }] } }
      })
    ).toBe(41_000n);
  });

  it('refuses the broadcast that would cross the cap, before it happens', () => {
    expect(() =>
      assertRunSpendCap({ committedUstx: 59_000n, plannedSpendUstx: 41_000n, runSpendCapUstx: 90_000n })
    ).toThrow(RunHalt);
    expect(
      assertRunSpendCap({ committedUstx: 59_000n, plannedSpendUstx: 41_000n, runSpendCapUstx: 100_000n })
    ).toMatchObject({ runSpendCapUstx: 100_000n });
  });

  it('has a default that is generous but finite', () => {
    expect(DEFAULT_RUN_SPEND_CAP_USTX).toBeGreaterThan(7n * 41_000n);
    expect(DEFAULT_RUN_SPEND_CAP_USTX).toBeLessThan(10_000_000n);
  });
});

describe('waiting for a transaction', () => {
  const txid = `0x${'b'.repeat(64)}`;
  const respond = (bodies: Array<Record<string, unknown> | 'missing' | 'error'>) => {
    let call = 0;
    return vi.fn(async () => {
      const next = bodies[Math.min(call++, bodies.length - 1)];
      if (next === 'missing') return new Response('no', { status: 404 });
      if (next === 'error') return new Response('down', { status: 500 });
      return Response.json(next);
    });
  };

  it('returns success with the block, the fee and the result', async () => {
    const fetchImpl = respond([{ tx_status: 'success', tx_result: okMint(2926), block_height: 8_700_123, fee_rate: '7000' }]);
    const outcome = await pollTransaction({ fetchImpl: fetchImpl as unknown as typeof fetch, txid });
    expect(outcome.outcome).toBe('success');
    expect(outcome.blockHeight).toBe(8_700_123);
    expect(outcome.feeRate).toBe('7000');
    expect(parseMintResult(outcome.result)).toEqual({ inscriptionId: '2926', existed: false });
  });

  it('treats a 404 as "not visible yet", not as a verdict', async () => {
    const fetchImpl = respond(['missing', 'missing', { tx_status: 'success', tx_result: okMint(1), block_height: 1 }]);
    const outcome = await pollTransaction({ fetchImpl: fetchImpl as unknown as typeof fetch, txid, intervalMs: 0 });
    expect(outcome.outcome).toBe('success');
    expect(outcome.polls).toBe(3);
  });

  it('treats a broken lookup as pending: a read failure is not evidence either way', async () => {
    const fetchImpl = respond(['error', { tx_status: 'success', tx_result: okMint(1), block_height: 1 }]);
    const outcome = await pollTransaction({ fetchImpl: fetchImpl as unknown as typeof fetch, txid, intervalMs: 0 });
    expect(outcome.outcome).toBe('success');
    expect(outcome.polls).toBe(2);
  });

  it('times out without calling it a failure', async () => {
    const fetchImpl = respond([{ tx_status: 'pending' }]);
    let clock = 0;
    const outcome = await pollTransaction({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      txid,
      now: () => (clock += 30_000),
      timeoutMs: 60_000
    });
    expect(outcome.outcome).toBe('timeout');
    expect(outcome.txStatus).toBe('pending');
  });

  it('honours the kill switch between polls, not only before the first', async () => {
    const fetchImpl = respond([{ tx_status: 'pending' }]);
    let polls = 0;
    await expect(
      pollTransaction({
        fetchImpl: fetchImpl as unknown as typeof fetch,
        txid,
        guard: () => {
          if (polls++ >= 2) throw new RunHalt('kill-switch', 'stopped');
        }
      })
    ).rejects.toThrow(RunHalt);
    expect(polls).toBeGreaterThan(1);
  });
});

describe('a full run', () => {
  it('mints the remaining entries and the manifest, and records every one', async () => {
    const world = harness();
    const result = await world.run();

    expect(result.ok).toBe(true);
    expect(result.halted).toBeNull();
    expect(world.submit).toHaveBeenCalledTimes(3);
    expect(world.submitted.map((entry) => entry.wizardId)).toEqual(['skeptic', 'builder', 'archivist']);

    const journal = world.journal() as any;
    expect(journal.version).toBe(RUN_JOURNAL_VERSION);
    expect(journal.positions['5'].status).toBe('confirmed');
    expect(journal.positions['6'].status).toBe('confirmed');
    expect(journal.positions[MANIFEST_KEY].status).toBe('confirmed');
    expect(journal.positions['5'].inscriptionId).toBe('2926');
    expect(journal.positions['6'].inscriptionId).toBe('2927');
    expect(journal.positions[MANIFEST_KEY].inscriptionId).toBe('2928');
    expect(journal.positions['5'].txid).toMatch(/^0x[0-9a-f]{64}$/);
    expect(journal.positions['5'].confirmedBlock).toBe(String(TIP + 1));
    expect(journal.positions['5'].actualMinerFeeUstx).toBe(String(MINER_FEE));

    // Three mints at 11,000 protocol plus the 30,000 the fake chain reports.
    expect(result.committedUstx).toBe(3n * 41_000n);
    expect(result.members.map((member: any) => member.id)).toEqual([...LIVE_IDS, '2926', '2927']);
  });

  it('cites the previous inscription by id, as a core dependency edge', async () => {
    const world = harness();
    await world.run();
    const entryFive = world.submitted[0];
    const entrySix = world.submitted[1];
    expect(entryFive.body).toContain('inscription #2925');
    expect(entrySix.body).toContain('inscription #2926');
  });

  it('closes with a manifest carrying every id, block and cost', async () => {
    const world = harness();
    await world.run();
    const manifest = world.submitted[2].body;

    for (const id of [...LIVE_IDS, '2926', '2927']) expect(manifest).toContain(`**#${id}**`);
    expect(manifest).toContain('member-ids: #2922, #2923, #2924, #2925, #2926, #2927');
    expect(manifest).toContain('members: 6');
    // Six entries at the live one-chunk fee, totalled from the entries' own bytes.
    expect(manifest).toContain('protocol-cost-ustx: 66000');
    expect(manifest).toContain(`block ${TIP.toLocaleString('en-US')}`);
    expect(manifest).toContain('record: thread-manifest');
  });

  it('mints the manifest with all six members as dependencies', async () => {
    const world = harness();
    await world.run();
    const manifestCall = world.submit.mock.calls[2][0] as any;
    expect(manifestCall.plan.call.functionName).toBe('mint-single-tx-recursive');
    expect(manifestCall.plan.call.dependencies).toEqual([...LIVE_IDS, '2926', '2927']);
    expect(manifestCall.plan.call.tokenUri).toBe(`xtrata:wizard/${THREAD}/manifest`);
  });

  it('takes the quote for the next entry from the chain, not from what it just composed', async () => {
    // The chain serves back a claim this process never composed. If the runner
    // quoted its own copy instead of reading the parent, entry 6 would carry the
    // composed claim and this would fail — which is the bug being guarded.
    const world = harness({
      tamperStoredBody: (body) =>
        body.replace(/\n## Claim\n\n[\s\S]*?\n\n/, '\n## Claim\n\nA claim that exists only on chain.\n\n')
    });
    const result = await world.run();

    expect(result.ok).toBe(true);
    const entrySix = world.submitted[1].body;
    expect(entrySix).toContain('> A claim that exists only on chain.');
    expect(entrySix).not.toContain(parseEntry(world.submitted[0].body).claim);
  });

  it('does not touch anything twice when the whole run is repeated', async () => {
    const world = harness();
    await world.run();
    world.submit.mockClear();
    const again = await world.run();
    expect(again.ok).toBe(true);
    expect(world.submit).not.toHaveBeenCalled();
  });
});

describe('failure handling', () => {
  for (const status of [
    'abort_by_response',
    'abort_by_post_condition',
    'dropped_replace_by_fee',
    'dropped_stale_garbage_collect'
  ]) {
    it(`halts on ${status}, records it, and never sends a second transaction`, async () => {
      const world = harness({ txStatus: status });
      const result = await world.run();

      expect(result.ok).toBe(false);
      expect(result.halted.reason).toBe('tx-failed');
      expect(result.halted.message).toContain(status);
      expect(world.submit).toHaveBeenCalledTimes(1);

      const journal = world.journal() as any;
      expect(journal.positions['5'].status).toBe('failed');
      expect(journal.positions['5'].txStatus).toBe(status);
      expect(journal.positions['6']).toBeUndefined();
      expect(formatRunReport(result)).toContain('HALTED (tx-failed)');
    });
  }

  it('will not resume a position that is recorded as failed', async () => {
    const world = harness({ txStatus: 'abort_by_response' });
    await world.run();
    world.submit.mockClear();
    const again = await world.run();
    expect(again.halted.reason).toBe('tx-failed');
    expect(again.halted.message).toMatch(/does not retry/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('halts on a timeout without ever calling it a failure', async () => {
    // A minute of simulated time per lookup against a two-minute window.
    const world = harness({ txStatus: 'pending', clockStepMs: 60_000 });
    const result = await world.run();

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('timeout');
    expect(result.halted.message).toContain('THIS IS NOT A FAILURE');
    expect(result.halted.message).toMatch(/may still confirm/);
    expect(result.halted.message).toMatch(/journal holds its id/);
    expect(result.halted.message).toMatch(/Do not broadcast this entry again/);
    expect(result.halted.message).not.toMatch(/\bfailed\b/);

    const journal = world.journal() as any;
    expect(journal.positions['5'].status).toBe('timeout');
    expect(journal.positions['5'].txid).toMatch(/^0x[0-9a-f]{64}$/);
    expect(formatRunReport(result)).toContain('A timeout is not a failed transaction');
  });

  it('resumes a timed-out position by polling its txid, never by re-sending it', async () => {
    const world = harness({ txStatus: 'pending', clockStepMs: 60_000 });
    const first = await world.run();
    expect(first.halted.reason).toBe('timeout');
    const txid = (world.journal() as any).positions['5'].txid;

    // The transaction lands while nobody is watching.
    world.chain.transactions.set(txid, {
      tx_status: 'success',
      tx_result: okMint(2926),
      block_height: TIP + 2,
      fee_rate: '9000'
    });
    world.setTxStatus('success');
    world.submit.mockClear();

    const second = await world.run();
    expect(second.ok).toBe(true);
    // Two mints, not three: position 5 was already sent by the first run.
    expect(world.submit).toHaveBeenCalledTimes(2);
    expect((world.journal() as any).positions['5'].txid).toBe(txid);
    expect((world.journal() as any).positions['5'].actualMinerFeeUstx).toBe('9000');
  });
});

describe('crash safety', () => {
  it('never re-broadcasts a position that already carries a txid', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal() as any;

    // Simulate the crash: the txid is on record, the outcome is not.
    journal.positions['5'] = { ...journal.positions['5'], status: 'broadcast', inscriptionId: null };
    delete journal.positions['6'];
    delete journal.positions[MANIFEST_KEY];
    world.setJournal(journal);
    world.submit.mockClear();

    const result = await world.run();
    expect(result.ok).toBe(true);
    // Position 5 was polled, not re-sent: two mints, for position 6 and the manifest.
    expect(world.submit).toHaveBeenCalledTimes(2);
    expect(world.submitted.slice(-2).map((entry) => entry.wizardId)).toEqual(['builder', 'archivist']);
    expect((world.journal() as any).positions['5'].inscriptionId).toBe('2926');
  });

  it('resolves a mint whose txid was never recorded, by content hash, without re-sending it', async () => {
    // The dangerous window: the node accepted the transaction and the process
    // died before the txid was written down. Nothing on disk names it.
    const world = harness({ crashAfterMint: true });
    const crashed = await world.run();

    expect(crashed.ok).toBe(false);
    expect(crashed.halted.reason).toBe('unresolved');
    const journal = world.journal() as any;
    expect(journal.positions['5'].status).toBe('broadcasting');
    expect(journal.positions['5'].txid).toBeNull();
    expect(journal.positions['5'].finalHashHex).toMatch(/^0x[0-9a-f]{64}$/);

    // The mint did land. A second run finds it by hash and adopts it.
    const resumed = harness({ journal });
    // Put the crashed run's inscription into the resumed world's chain.
    const minted = world.chain.inscriptions.get('2926');
    resumed.chain.add('2926', minted.body, minted.creator);

    const result = await resumed.run();
    expect(result.ok).toBe(true);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([6, 7]);
    expect((resumed.journal() as any).positions['5'].inscriptionId).toBe('2926');
    expect((resumed.journal() as any).positions['5'].recovered).toBe(true);
  });

  it('halts rather than guessing when the intent cannot be resolved', async () => {
    // Same crash, but nothing with those bytes is on chain. The nonce it was
    // signed with HAS been consumed, which says a transaction was mined and
    // says nothing about which one, so re-broadcasting would risk a second
    // permanent mint.
    const { journal } = await crashedAtFive();

    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 7, possible_next_nonce: 8 } });
    const result = await resumed.run();

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('unresolved');
    expect(result.halted.message).toMatch(/still be in the mempool/);
    expect(result.halted.message).toMatch(/will not broadcast it again/);
    expect(resumed.submit).not.toHaveBeenCalled();
  });

  it('writes the intent before it broadcasts, not after', async () => {
    const seen: string[] = [];
    const world = harness();
    const original = world.ports.writeJournal;
    world.ports.writeJournal = (path: string, journal: any) => {
      if (journal.positions?.['5']) seen.push(journal.positions['5'].status);
      return original(path, journal);
    };
    world.ports.submit = vi.fn(async () => {
      seen.push('submit');
      throw new Error('stop here');
    });

    await world.run();
    // The first thing recorded about position 5 is its intent, and it is
    // recorded before submit is ever called.
    expect(seen[0]).toBe('broadcasting');
    expect(seen.indexOf('submit')).toBeGreaterThan(0);
  });
});

describe('what the nonce knows', () => {
  const seen = (patch: Record<string, unknown> = {}) => ({
    address: ADDRESSES.skeptic,
    available: true,
    lastExecutedNonce: 6,
    nextNonce: 7,
    lastMempoolNonce: null,
    mempoolNonces: [] as number[],
    missingNonces: [] as number[],
    error: null,
    ...patch
  });

  it('reads the five fields the live endpoint returns', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        last_executed_tx_nonce: 1,
        possible_next_nonce: 2,
        last_mempool_tx_nonce: null,
        detected_missing_nonces: [],
        detected_mempool_nonces: []
      })
    );
    const nonces = await fetchSenderNonces({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      address: ADDRESSES.skeptic
    });
    // The shape a live wizard with two confirmed transactions really returns.
    expect(nonces).toMatchObject({ available: true, lastExecutedNonce: 1, nextNonce: 2, lastMempoolNonce: null });
    expect(String(fetchImpl.mock.calls[0][0])).toContain(`/extended/v1/address/${ADDRESSES.skeptic}/nonces`);
  });

  it('never throws: an unreadable nonce is not evidence either way', async () => {
    const down = await fetchSenderNonces({
      fetchImpl: (async () => new Response('nope', { status: 500 })) as unknown as typeof fetch,
      address: ADDRESSES.skeptic
    });
    expect(down.available).toBe(false);
    expect(down.error).toMatch(/HTTP 500/);

    const offline = await fetchSenderNonces({
      fetchImpl: (async () => {
        throw new Error('getaddrinfo ENOTFOUND');
      }) as unknown as typeof fetch,
      address: ADDRESSES.skeptic
    });
    expect(offline.available).toBe(false);
    expect(offline.error).toMatch(/ENOTFOUND/);

    expect((await fetchSenderNonces({ address: null })).available).toBe(false);
  });

  it('calls a nonce below the intended one proof that nothing was mined', () => {
    expect(classifyIntentNonce({ intendedNonce: 7, nonces: seen() }).verdict).toBe('absent');
    // A wallet that has executed nothing at all reads as -1, so nonce 0 is
    // unspent rather than spent.
    expect(
      classifyIntentNonce({ intendedNonce: 0, nonces: seen({ lastExecutedNonce: null, nextNonce: 0 }) }).verdict
    ).toBe('absent');
  });

  it('calls a nonce at or above the intended one proof of nothing at all', () => {
    // THE ASYMMETRY. Something consumed the nonce. Which something is exactly
    // what the nonce cannot say, so this is never a landed verdict.
    for (const lastExecutedNonce of [7, 8, 40]) {
      const verdict = classifyIntentNonce({ intendedNonce: 7, nonces: seen({ lastExecutedNonce }) });
      expect(verdict.verdict).toBe('consumed');
      expect(verdict.verdict).not.toBe('landed');
    }
  });

  it('calls anything in the mempool at or above the intended nonce pending', () => {
    expect(classifyIntentNonce({ intendedNonce: 7, nonces: seen({ mempoolNonces: [7] }) }).verdict).toBe('pending');
    expect(classifyIntentNonce({ intendedNonce: 7, nonces: seen({ lastMempoolNonce: 9 }) }).verdict).toBe('pending');
    // Below the intended nonce is somebody else's transaction, and this one was
    // never sent: the mempool would be holding it if it had been.
    expect(
      classifyIntentNonce({ intendedNonce: 7, nonces: seen({ lastExecutedNonce: 4, mempoolNonces: [5] }) }).verdict
    ).toBe('absent');
  });

  it('knows nothing without an intended nonce or without a reading', () => {
    expect(classifyIntentNonce({ intendedNonce: null, nonces: seen() })).toMatchObject({
      verdict: 'unknown',
      why: expect.stringMatching(/before this runner recorded nonces/)
    });
    expect(
      classifyIntentNonce({ intendedNonce: 7, nonces: { available: false, error: 'HTTP 500' } }).verdict
    ).toBe('unknown');
    expect(classifyIntentNonce({ intendedNonce: 7, nonces: null }).verdict).toBe('unknown');
  });
});

describe('the crash window, decided by nonce', () => {
  it('records the wallet and the nonce it is about to sign with, before it signs', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal() as any;

    expect(journal.positions['5'].senderAddress).toBe(ADDRESSES.skeptic);
    expect(journal.positions['5'].intendedNonce).toBe(7);
    // Each mint spends one, so the next entry is signed with the next nonce.
    expect(journal.positions['6'].intendedNonce).toBe(8);
    expect(journal.positions[MANIFEST_KEY].intendedNonce).toBe(9);
  });

  it('clears the orphan and composes again when the nonce proves nothing was mined', async () => {
    const { journal } = await crashedAtFive();
    expect(journal.positions['5'].intendedNonce).toBe(7);

    // Nonce 7 has never confirmed and nothing is in flight: whatever happened
    // to that transaction, it did not land and it cannot.
    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7 } });
    let sleeps = 0;
    resumed.ports.sleep = async () => {
      sleeps += 1;
    };

    const result = await resumed.run();
    expect(result.ok).toBe(true);
    // It proceeds immediately. Waiting on a transaction that provably does not
    // exist is time spent for nothing.
    expect(sleeps).toBe(0);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([5, 6, 7]);

    // And exactly one position 5 exists on chain afterwards. No double mint.
    const positions = [...resumed.chain.inscriptions.values()].map((entry: any) => {
      try {
        return parseEntry(entry.body).position;
      } catch {
        return null;
      }
    });
    expect(positions.filter((position) => position === 5)).toHaveLength(1);

    const record = (resumed.journal() as any).positions['5'];
    expect(record.status).toBe('confirmed');
    expect(record.inscriptionId).toBe('2926');
    // The cleared attempt is kept as history, and the fresh one does not
    // inherit the verdict that closed it.
    expect(record.previousIntents).toHaveLength(1);
    expect(record.previousIntents[0]).toMatchObject({
      reason: 'nonce-proved-absent',
      intendedNonce: 7,
      finalHashHex: journal.positions['5'].finalHashHex,
      senderAddress: ADDRESSES.skeptic
    });
    expect(record.resolution).toBeNull();
  });

  it('adopts the landed inscription when the nonce was consumed and the bytes are on chain', async () => {
    const { world, journal } = await crashedAtFive();
    const minted = world.chain.inscriptions.get('2926');

    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 7, possible_next_nonce: 8 } });
    resumed.chain.add('2926', minted.body, minted.creator);

    const result = await resumed.run();
    expect(result.ok).toBe(true);
    expect((resumed.journal() as any).positions['5'].inscriptionId).toBe('2926');
    expect((resumed.journal() as any).positions['5'].recovered).toBe(true);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([6, 7]);
  });

  it('does not assume a mint landed because an unrelated transaction advanced the nonce', async () => {
    // The operator moved funds out of the wizard wallet after the crash, so
    // nonces 7 through 11 have all confirmed and not one of them is this mint.
    // A runner that read "nonce consumed" as "mint landed" would now adopt
    // whatever id it found next, or invent one.
    const { journal } = await crashedAtFive();
    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 11, possible_next_nonce: 12 } });

    const result = await resumed.run();
    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('unresolved');
    expect(result.halted.message).toMatch(/nonce 7 has been consumed/);
    expect(resumed.submit).not.toHaveBeenCalled();

    const record = (resumed.journal() as any).positions['5'];
    expect(record.status).toBe('broadcasting');
    expect(record.inscriptionId).toBeNull();
  });

  it('waits on a pending nonce, and carries on when it lands inside the window', async () => {
    const { world, journal } = await crashedAtFive();
    const minted = world.chain.inscriptions.get('2926');

    const resumed = harness({
      journal,
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7, last_mempool_tx_nonce: 7, detected_mempool_nonces: [7] }
    });
    let sleeps = 0;
    resumed.ports.sleep = async () => {
      sleeps += 1;
      // Two looks in, the block carrying it is indexed.
      if (sleeps === 2) resumed.chain.add('2926', minted.body, minted.creator);
    };

    const result = await resumed.run({ mempoolWaitMs: 60_000, mempoolPollMs: 1_000 });
    expect(result.ok).toBe(true);
    expect(sleeps).toBeGreaterThan(1);
    expect((resumed.journal() as any).positions['5'].inscriptionId).toBe('2926');
    expect((resumed.journal() as any).positions['5'].recovered).toBe(true);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([6, 7]);
  });

  it('gives up after the window, naming the nonce, and calls it pending rather than failed', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({
      journal,
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7, last_mempool_tx_nonce: 7, detected_mempool_nonces: [7] }
    });
    let sleeps = 0;
    resumed.ports.sleep = async () => {
      sleeps += 1;
    };

    const result = await resumed.run({ mempoolWaitMs: 10_000, mempoolPollMs: 1_000 });
    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('unresolved');
    expect(sleeps).toBeGreaterThan(0);
    expect(result.halted.message).toMatch(/NONCE 7/);
    expect(result.halted.message).toMatch(/STILL HAS NONCE 7 IN THE MEMPOOL/);
    expect(result.halted.message).toMatch(/will not broadcast it again/);
    expect(result.halted.message).not.toMatch(/\bfailed\b/);
    expect(resumed.submit).not.toHaveBeenCalled();
    // Nothing was decided, so nothing was written over the intent.
    expect((resumed.journal() as any).positions['5'].status).toBe('broadcasting');
  });

  it('honours the kill switch while it is waiting on the mempool', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({
      journal,
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7, detected_mempool_nonces: [7] }
    });
    let waits = 0;
    resumed.ports.sleep = async () => {
      waits += 1;
    };
    resumed.ports.killSwitch = () => (waits > 1 ? 'scripts/wizard/KILL exists' : null);

    const result = await resumed.run({ mempoolWaitMs: 600_000, mempoolPollMs: 1_000 });
    expect(result.halted.reason).toBe('kill-switch');
    expect(resumed.submit).not.toHaveBeenCalled();
  });

  it('loads a journal written before nonces existed, and halts exactly as it always did', async () => {
    const { journal } = await crashedAtFive();
    delete journal.positions['5'].intendedNonce;

    // The wallet reading that WOULD have proved absence, if the field were
    // there. Without it the runner has only the hash, so it halts.
    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7 } });
    const result = await resumed.run();

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('unresolved');
    expect(result.halted.message).toMatch(/before this runner recorded nonces/);
    expect(result.halted.message).toMatch(/will not broadcast it again/);
    expect(resumed.submit).not.toHaveBeenCalled();
  });

  it('falls back to the hash alone when the nonce endpoint is down', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({ journal });
    const answer = resumed.ports.fetchImpl as any;
    resumed.ports.fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('/nonces')) return new Response('down', { status: 503 });
      return answer(input, init);
    }) as unknown as typeof fetch;

    const result = await resumed.run();
    expect(result.halted.reason).toBe('unresolved');
    expect(result.halted.message).toMatch(/could not be read/);
    expect(resumed.submit).not.toHaveBeenCalled();
  });
});

/**
 * `--resolve`, driven through the same core the CLI drives. Every one of these
 * writes at most one journal record and none of them can broadcast: the ports
 * they are given have no submit at all.
 */
const resolveIn = (world: ReturnType<typeof harness>, options: Record<string, unknown>) =>
  resolvePosition({
    ports: {
      fetchImpl: world.ports.fetchImpl,
      readJournal: world.ports.readJournal,
      writeJournal: world.ports.writeJournal,
      now: world.ports.now
    },
    options: { threadId: THREAD, threadLength: 6, subject: SUBJECT, journalDir: JOURNAL_DIR, ...options }
  });

describe('settling a position by hand', () => {
  it('records landed:<id> once the id checks out against its own front matter', async () => {
    const { world, journal } = await crashedAtFive();
    const minted = world.chain.inscriptions.get('2926');
    const resumed = harness({ journal });
    resumed.chain.add('2926', minted.body, minted.creator);

    const result = await resolveIn(resumed, { position: 5, resolution: 'landed', inscriptionId: '2926' });
    expect(result.ok).toBe(true);
    expect(result.record).toMatchObject({
      status: 'confirmed',
      inscriptionId: '2926',
      resolution: 'landed',
      resolvedBy: 'operator'
    });
    expect(result.record.resolvedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.record.note).toMatch(/settled by hand/);
    expect(formatResolution(result)).toContain('resolved as landed');

    // And the run carries on from it, citing the adopted entry.
    const carried = await resumed.run();
    expect(carried.ok).toBe(true);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([6, 7]);
    expect(resumed.submitted[0].body).toContain('inscription #2926');
  });

  it('refuses an id whose front matter is a different position, thread or subject', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({ journal });

    // #2923 is real, on chain, and is position 2 of this very thread.
    await expect(resolveIn(resumed, { position: 5, resolution: 'landed', inscriptionId: '2923' })).rejects.toThrow(
      /is position 2 of its thread/
    );

    // A real entry from a different thread, minted at the same block.
    const other = composeThread({
      threadId: 't-somewhere-else',
      subject: SUBJECT,
      blockHeight: TIP,
      feeMicroStx: FEE,
      ids: ['3001'],
      threadLength: 6
    }) as { entries: Array<{ id: string; body: string; wizard: string }> };
    resumed.chain.add('3001', other.entries[0].body, ADDRESSES.archivist);
    await expect(resolveIn(resumed, { position: 5, resolution: 'landed', inscriptionId: '3001' })).rejects.toThrow(
      /belongs to thread "t-somewhere-else"/
    );

    // The right id, under a subject this thread is not arguing about.
    const minted = (await crashedAtFive()).world.chain.inscriptions.get('2926');
    resumed.chain.add('2926', minted.body, minted.creator);
    await expect(
      resolveIn(resumed, { position: 5, resolution: 'landed', inscriptionId: '2926', subject: 'chunk-size' })
    ).rejects.toThrow(/A thread argues about one subject/);

    // An id that is not on chain at all.
    await expect(resolveIn(resumed, { position: 5, resolution: 'landed', inscriptionId: '9999' })).rejects.toThrow(
      /no chunk u0/
    );

    // Nothing above was written.
    expect((resumed.journal() as any).positions['5'].status).toBe('broadcasting');
  });

  it('takes the subject from the journal when the operator does not name one', async () => {
    const { world, journal } = await crashedAtFive();
    const minted = world.chain.inscriptions.get('2926');
    const resumed = harness({ journal });
    resumed.chain.add('2926', minted.body, minted.creator);

    const result = await resolveIn(resumed, {
      position: 5,
      resolution: 'landed',
      inscriptionId: '2926',
      subject: undefined
    });
    expect(result.record.inscriptionId).toBe('2926');
  });

  it('verifies a manifest by its own front matter, which is not an entry', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal() as any;
    journal.positions[MANIFEST_KEY] = {
      ...journal.positions[MANIFEST_KEY],
      status: 'broadcasting',
      txid: null,
      inscriptionId: null
    };
    world.setJournal(journal);

    // #2926 is an entry, not the manifest.
    await expect(
      resolveIn(world, { position: 'manifest', resolution: 'landed', inscriptionId: '2926' })
    ).rejects.toThrow(/thread-manifest/);

    const result = await resolveIn(world, { position: 'manifest', resolution: 'landed', inscriptionId: '2928' });
    expect(result.record).toMatchObject({ status: 'confirmed', inscriptionId: '2928', resolvedBy: 'operator' });
  });

  it('refuses to abandon a position the chain shows as landed, by content hash', async () => {
    const { world, journal } = await crashedAtFive();
    const minted = world.chain.inscriptions.get('2926');
    const resumed = harness({ journal });
    resumed.chain.add('2926', minted.body, minted.creator);

    await expect(resolveIn(resumed, { position: 5, resolution: 'abandoned' })).rejects.toThrow(/on chain as #2926/);
    expect((resumed.journal() as any).positions['5'].status).toBe('broadcasting');
  });

  it('refuses to abandon a position whose transaction succeeded, or might still', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal() as any;

    // A successful transaction, with the id forgotten and the hash cleared out
    // so only the txid can answer.
    journal.positions['5'] = {
      ...journal.positions['5'],
      status: 'timeout',
      inscriptionId: null,
      finalHashHex: null
    };
    world.setJournal(journal);
    await expect(resolveIn(world, { position: 5, resolution: 'abandoned' })).rejects.toThrow(/succeeded/);

    // A transaction the API has never heard of is pending, not absent.
    journal.positions['5'] = { ...journal.positions['5'], txid: `0x${'c'.repeat(64)}` };
    world.setJournal(journal);
    await expect(resolveIn(world, { position: 5, resolution: 'abandoned' })).rejects.toThrow(/may\s+still confirm/);
  });

  it('refuses to touch a position that is already cleanly resolved', async () => {
    const world = harness();
    await world.run();

    for (const resolution of ['abandoned', 'landed'] as const) {
      await expect(
        resolveIn(world, { position: 5, resolution, inscriptionId: '2926' })
      ).rejects.toThrow(/already resolved as #2926/);
    }
    // Including the ids the operator supplied for entries minted before the run.
    await expect(resolveIn(world, { position: 1, resolution: 'abandoned' })).rejects.toThrow(/already resolved/);
  });

  it('records abandoned when nothing on chain contradicts it, and lets the run compose again', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({ journal, nonces: { last_executed_tx_nonce: 11, possible_next_nonce: 12 } });

    // The state --resolve exists for: the nonce was consumed by something
    // unidentifiable, so the runner itself halts and will keep halting.
    const stuck = await resumed.run();
    expect(stuck.halted.reason).toBe('unresolved');

    const result = await resolveIn(resumed, { position: 5, resolution: 'abandoned' });
    expect(result.record).toMatchObject({
      status: 'abandoned',
      resolution: 'abandoned',
      resolvedBy: 'operator',
      finalHashHex: null,
      intendedNonce: null
    });
    expect(result.record.note).toMatch(/a human established this was never minted/);
    expect(result.record.resolvedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.record.previousIntents).toHaveLength(1);
    expect(result.record.previousIntents[0]).toMatchObject({
      reason: 'operator-abandoned',
      intendedNonce: 7,
      finalHashHex: journal.positions['5'].finalHashHex
    });

    const carried = await resumed.run();
    expect(carried.ok).toBe(true);
    expect(resumed.submitted.map((entry) => entry.position)).toEqual([5, 6, 7]);
  });

  it('parses what the operator typed, and refuses anything else', () => {
    expect(parseResolution('abandoned')).toEqual({ resolution: 'abandoned', inscriptionId: null });
    expect(parseResolution('landed:2926')).toEqual({ resolution: 'landed', inscriptionId: '2926' });
    for (const typed of ['landed', 'landed:', 'landed:abc', 'abandon', '', undefined]) {
      expect(() => parseResolution(typed)).toThrow(/is not a resolution/);
    }
  });

  it('refuses a position, a decision or a journal that does not exist', async () => {
    const { journal } = await crashedAtFive();
    const resumed = harness({ journal });

    await expect(resolveIn(resumed, { position: 5, resolution: 'settled' })).rejects.toThrow(/not a resolution/);
    await expect(resolveIn(resumed, { position: 9, resolution: 'abandoned' })).rejects.toThrow(/not a position/);
    await expect(resolveIn(resumed, { position: 6, resolution: 'abandoned' })).rejects.toThrow(/has no record/);
    await expect(resolveIn(resumed, { position: 5, resolution: 'landed' })).rejects.toThrow(/needs an inscription id/);

    const empty = harness();
    await expect(resolveIn(empty, { position: 5, resolution: 'abandoned' })).rejects.toThrow(/no run journal/);
  });
});

describe('resuming at a position', () => {
  it('refuses when the predecessor is not on chain', async () => {
    // #9999 is named as position 4 but was never inscribed.
    const world = harness();
    const result = await world.run({ knownIds: { 1: '2922', 2: '2923', 3: '2924', 4: '9999' } });

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('predecessor');
    expect(result.halted.message).toMatch(/no chunk u0 on chain/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('refuses when no id is known for an earlier position', async () => {
    const world = harness({ priorIds: [] });
    const result = await world.run({ knownIds: {} });

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('predecessor');
    expect(result.halted.message).toMatch(/--ids/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('refuses an id that is on chain but is a different position', async () => {
    const world = harness({ priorIds: LIVE_IDS });
    const result = await world.run({ knownIds: { 1: '2922', 2: '2923', 3: '2924', 4: '2923' } });

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('predecessor');
    expect(result.halted.message).toMatch(/is position 2 of its thread/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('refuses to carry on a thread with a different subject than the entries already on it', async () => {
    const world = harness();
    const result = await world.run({ subject: 'chunk-size' });

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('predecessor');
    expect(result.halted.message).toMatch(/A thread argues about one subject/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('refuses when --ids contradicts what the journal already recorded', async () => {
    const world = harness();
    await world.run();
    world.submit.mockClear();
    const result = await world.run({ knownIds: { 5: '4242' } });

    expect(result.halted.reason).toBe('journal');
    expect(result.halted.message).toMatch(/will not guess/);
    expect(world.submit).not.toHaveBeenCalled();
  });
});

describe('the kill switch', () => {
  it('stops the run between entries', async () => {
    const world = harness({
      // Engaged the moment position 5 exists.
      killSwitch: () => null
    });
    let minted = false;
    world.ports.killSwitch = () => (minted ? 'WIZARD_KILL_SWITCH is set' : null);
    const submit = world.ports.submit as any;
    world.ports.submit = async (input: any) => {
      const out = await submit(input);
      minted = true;
      return out;
    };

    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('kill-switch');
    expect(world.submit).toHaveBeenCalledTimes(1);
    expect((world.journal() as any).positions['6']).toBeUndefined();
  });

  it('says the broadcast may still confirm when it is engaged mid-flight', async () => {
    const world = harness();
    let sent = false;
    world.ports.killSwitch = () => (sent ? 'scripts/wizard/KILL exists' : null);
    const submit = world.ports.submit as any;
    world.ports.submit = async (input: any) => {
      const out = await submit(input);
      sent = true;
      return out;
    };

    const result = await world.run();
    expect(result.halted.reason).toBe('kill-switch');
    expect(result.halted.message).toMatch(/may still confirm/);
    expect(result.halted.message).toMatch(/nothing was re-sent/);
    expect((world.journal() as any).positions['5'].txid).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it('stops before anything is planned when it is already engaged', async () => {
    const world = harness({ killSwitch: () => 'WIZARD_KILL_SWITCH is set' });
    const result = await world.run();
    expect(result.halted.reason).toBe('kill-switch');
    expect(world.submit).not.toHaveBeenCalled();
    expect(world.fetchImpl).not.toHaveBeenCalled();
  });
});

describe('the run cap', () => {
  it('refuses the broadcast that would exceed it, and lets the ones before it through', async () => {
    // Enough for exactly one mint of 11,000 + 30,000.
    const world = harness();
    const result = await world.run({ runSpendCapUstx: 41_000n });

    expect(result.ok).toBe(false);
    expect(result.halted.reason).toBe('spend-cap');
    expect(result.halted.message).toMatch(/position 6/);
    expect(world.submit).toHaveBeenCalledTimes(1);
    expect((world.journal() as any).positions['6']).toBeUndefined();
  });

  it('refuses before the first broadcast when the cap cannot cover even one', async () => {
    const world = harness();
    const result = await world.run({ runSpendCapUstx: 40_999n });

    expect(result.halted.reason).toBe('spend-cap');
    expect(world.submit).not.toHaveBeenCalled();
    expect((world.journal() as any)?.positions?.['5']).toBeUndefined();
  });

  it('counts the whole run, not one entry at a time', async () => {
    const world = harness();
    // Each mint is inside the per-entry cap; only the total is not.
    const result = await world.run({ runSpendCapUstx: 82_000n, spendCapUstx: 500_000n });
    expect(result.halted.reason).toBe('spend-cap');
    expect(world.submit).toHaveBeenCalledTimes(2);
  });
});

describe('a dry run reaches nothing that could spend', () => {
  it('touches no broadcast endpoint anywhere in a full loop', async () => {
    const world = harness();
    await world.run({ broadcast: false });

    expect(world.urls.length).toBeGreaterThan(10);
    for (const url of world.urls) {
      expect(url).not.toMatch(/\/v2\/transactions/);
      expect(url).not.toMatch(/broadcast/i);
      // Everything it does touch is a read: call-read, a block, a balance, a
      // nonce or a transaction lookup.
      expect(url).toMatch(/call-read|\/extended\/v[12]\//);
    }
  });

  it('throws rather than reaching a real endpoint the fake does not know', async () => {
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    await expect(fakeFetch(chain)('https://api.hiro.so/v2/transactions', { method: 'POST' })).rejects.toThrow(
      /talks to nothing/
    );
  });

  it('has a dry submit port that refuses to broadcast even if it is asked to', async () => {
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    const ports = dryPorts({ chain, wallets: WALLETS }) as any;
    await expect(ports.submit({ plan: { body: 'x' }, broadcast: true, wizardId: 'archivist' })).rejects.toThrow(
      /cannot, and it did not/
    );
  });

  it('has a live submit port that refuses without broadcast: true', async () => {
    await expect(
      liveSubmit({ hiroUrl: 'https://api.hiro.so' })({ plan: {}, broadcast: false } as any)
    ).rejects.toThrow(/without broadcast: true/);
  });

  it('refuses to broadcast under the placeholder thread id', async () => {
    const world = harness();
    await expect(world.run({ threadId: 't-demo-0001', broadcast: true })).rejects.toThrow(/placeholder thread id/);
  });
});

describe('status', () => {
  it('reports what is confirmed, what is missing, and what is unresolved', async () => {
    const world = harness({ crashAfterMint: true });
    await world.run();

    const report = await statusReport({
      ports: { fetchImpl: world.ports.fetchImpl, readJournal: world.ports.readJournal },
      options: { threadId: THREAD, threadLength: 6, journalDir: JOURNAL_DIR }
    });

    const row = (key: string) => report.rows.find((entry: any) => entry.key === key) as any;
    expect(row('1').journalStatus).toBe('external');
    expect(row('1').chain).toBe('confirmed');
    expect(row('6').chain).toBe('missing');
    expect(row('5').journalStatus).toBe('broadcasting');
    expect(row('5').chain).toBe('confirmed');
    expect(row('5').note).toMatch(/recovered by content hash/);
    expect(row(MANIFEST_KEY).chain).toBe('missing');

    const table = formatStatusTable(report);
    expect(table).toContain(THREAD);
    expect(table).toContain('recovered by content hash');
  });

  it('says which unresolved positions the nonce has already settled', async () => {
    const { journal } = await crashedAtFive();

    const report = async (world: ReturnType<typeof harness>) =>
      statusReport({
        ports: { fetchImpl: world.ports.fetchImpl, readJournal: world.ports.readJournal },
        options: { threadId: THREAD, threadLength: 6, journalDir: JOURNAL_DIR }
      });
    const row = (result: any) => result.rows.find((entry: any) => entry.key === '5');

    const never = await report(harness({ journal, nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7 } }));
    expect(row(never).chain).toBe('never-sent');
    expect(row(never).note).toMatch(/has never confirmed/);

    const flight = await report(
      harness({ journal, nonces: { last_executed_tx_nonce: 6, detected_mempool_nonces: [7] } })
    );
    expect(row(flight).chain).toBe('pending');
    expect(row(flight).note).toMatch(/Do not broadcast it again/);

    const consumed = await report(
      harness({ journal, nonces: { last_executed_tx_nonce: 9, possible_next_nonce: 10 } })
    );
    expect(row(consumed).chain).toBe('unresolved');
    expect(row(consumed).note).toMatch(/has been consumed/);
  });

  it('shows a position a human abandoned, and who decided it', async () => {
    const { journal } = await crashedAtFive();
    const world = harness({ journal, nonces: { last_executed_tx_nonce: 11, possible_next_nonce: 12 } });
    await resolveIn(world, { position: 5, resolution: 'abandoned' });

    const report = await statusReport({
      ports: { fetchImpl: world.ports.fetchImpl, readJournal: world.ports.readJournal },
      options: { threadId: THREAD, threadLength: 6, journalDir: JOURNAL_DIR }
    });
    const row = report.rows.find((entry: any) => entry.key === '5') as any;
    expect(row.journalStatus).toBe('abandoned');
    expect(row.chain).toBe('abandoned');
    expect(row.note).toMatch(/settled as never minted by a human/);
    expect(formatStatusTable(report)).toContain('abandoned');
  });

  it('works with no journal at all, from ids alone', async () => {
    const world = harness();
    const report = await statusReport({
      ports: { fetchImpl: world.ports.fetchImpl, readJournal: () => null },
      options: {
        threadId: THREAD,
        threadLength: 6,
        journalDir: JOURNAL_DIR,
        knownIds: Object.fromEntries(LIVE_IDS.map((id, index) => [String(index + 1), id]))
      }
    });

    expect(report.journalFound).toBe(false);
    expect(report.rows.slice(0, 4).every((entry: any) => entry.chain === 'confirmed')).toBe(true);
    expect(report.rows[4].chain).toBe('missing');
    expect(formatStatusTable(report)).toContain('#2925');
  });
});
