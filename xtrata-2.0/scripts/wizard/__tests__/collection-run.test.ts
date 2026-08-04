import { describe, expect, it, vi } from 'vitest';
import { TransactionVersion, cvToHex, getAddressFromPrivateKey, responseErrorCV, uintCV } from '@stacks/transactions';

import { COLLECTION_ID, COLLECTION_LENGTH, PIECES, renderPiece } from '../collection-art.mjs';
import {
  COLLECTION_JOURNAL_VERSION,
  MANIFEST_KEY,
  NULL_PORTS,
  RunHalt,
  assertMembersMatch,
  collectionJournalPathFor,
  collectionStatusReport,
  committedCollectionSpendUstx,
  emptyCollectionJournal,
  formatCollectionPlan,
  formatCollectionRunReport,
  formatCollectionStatusTable,
  hydratePiece,
  planCollectionManifest,
  planPiece,
  runCollection,
  tokenUriForCollectionManifest,
  tokenUriForPiece,
  verifyCollectionMembers
} from '../collection-run-core.mjs';
import { fakeFetch, makeFakeChain } from '../run-thread.mjs';
import { dryPorts } from '../collection-run.mjs';

const TIP = 8_700_000;
const FEE = 11_000n;
const MINER_FEE = 30_000n;
const JOURNAL_DIR = '/tmp/wizard-collection-tests';

/**
 * A synthetic Builder wallet, derived from a fixed dummy key so it is valid c32
 * and belongs to nobody. Never funded, never used to sign: the submit port in
 * every test below is a fake.
 */
const KEY = '3'.padStart(64, '0');
const ADDRESS = getAddressFromPrivateKey(KEY, TransactionVersion.Mainnet);
const WALLETS = { builder: { address: ADDRESS, key: KEY } };
const ENV = { WIZARD_ADDRESS_BUILDER: ADDRESS } as NodeJS.ProcessEnv;

type Nonces = {
  last_executed_tx_nonce: number | null;
  possible_next_nonce: number | null;
  last_mempool_tx_nonce: number | null;
  detected_missing_nonces: number[];
  detected_mempool_nonces: number[];
};

type HarnessOptions = {
  /** Pieces already minted, in index order. */
  priorIds?: string[];
  txStatus?: string;
  /** Throw out of submit *after* the mint reached the chain: the crash window. */
  crashAfterMint?: boolean;
  /** Rewrite the bytes the chain serves back, to prove hydration is a byte check. */
  tamperStoredBody?: (body: string) => string;
  killSwitch?: (env: NodeJS.ProcessEnv) => string | null;
  journal?: unknown;
  nonces?: Partial<Nonces>;
};

/**
 * A whole runnable world: the same fake chain and fake fetch `--dry` uses,
 * imported rather than re-implemented, a submit that mints into it, and a
 * journal that round-trips through JSON exactly as a file would.
 */
const harness = (options: HarnessOptions = {}) => {
  const priorIds = options.priorIds ?? [];
  const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
  if (options.nonces) Object.assign(chain.nonces, options.nonces);
  for (const [index, id] of priorIds.entries()) chain.add(id, renderPiece(index + 1), ADDRESS);

  const calls: Array<{ url: string; method: string }> = [];
  const answer = fakeFetch(chain);
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), method: String(init?.method ?? 'GET') });
    return answer(input, init);
  });

  const submitted: Array<{ index: number | null; body: string; broadcast: boolean }> = [];
  let txStatus = options.txStatus ?? 'success';
  const submit = vi.fn(async ({ plan, broadcast }: { plan: any; broadcast: boolean }) => {
    submitted.push({ index: plan.index, body: plan.body, broadcast });
    const minted = chain.mint(plan.body, ADDRESS, MINER_FEE);
    if (options.tamperStoredBody) {
      chain.inscriptions.set(minted.id, { body: options.tamperStoredBody(plan.body), creator: ADDRESS });
    }
    if (txStatus !== 'success') {
      chain.transactions.set(minted.txid.toLowerCase(), {
        tx_status: txStatus,
        tx_result: { hex: cvToHex(responseErrorCV(uintCV(103n))), repr: '(err u103)' },
        block_height: null,
        fee_rate: String(MINER_FEE)
      });
    }
    if (options.crashAfterMint) throw new Error('socket hang up');
    return { txid: minted.txid };
  });

  let disk: string | null = options.journal ? JSON.stringify(options.journal) : null;
  let clock = Date.UTC(2026, 6, 31, 12, 0, 0);
  const said: string[] = [];

  const ports = {
    fetchImpl: fetchImpl as unknown as typeof fetch,
    submit,
    readJournal: () => (disk === null ? null : JSON.parse(disk)),
    writeJournal: (_path: string, journal: unknown) => {
      disk = JSON.stringify(journal);
    },
    killSwitch: options.killSwitch ?? (() => null),
    now: () => (clock += 1_000),
    sleep: async () => {},
    say: (line: string) => said.push(String(line)),
    presentPlan: () => {}
  };

  const run = (overrides: Record<string, unknown> = {}) =>
    runCollection({
      ports,
      options: {
        collectionId: COLLECTION_ID,
        from: 1,
        to: COLLECTION_LENGTH,
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
    calls,
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

/** The journal an interrupted run leaves behind: intent written, txid never was. */
const crashedAtOne = async () => {
  const world = harness({ crashAfterMint: true });
  const crashed = await world.run();
  return { world, crashed, journal: world.journal() as any };
};

/* ------------------------------------------------------------------ */

describe('the journal file', () => {
  it('names one file per collection and keeps dry runs out of the real one', () => {
    expect(collectionJournalPathFor({ dir: '/tmp', collectionId: COLLECTION_ID })).toBe(
      `/tmp/.collection-${COLLECTION_ID}.json`
    );
    expect(collectionJournalPathFor({ dir: '/tmp', collectionId: COLLECTION_ID, mode: 'dry' })).toBe(
      `/tmp/.collection-${COLLECTION_ID}.dry.json`
    );
  });

  it('uses a different prefix from the thread and market journals', () => {
    // A file loaded by the wrong runner would be read as records with no ids
    // and treated as work still to do, by a process holding a key.
    const path = collectionJournalPathFor({ dir: '/tmp', collectionId: 'x' });
    expect(path).not.toContain('/.run-');
    expect(path).not.toContain('/.market-');
  });

  it('refuses a collection id that would write outside the directory', () => {
    expect(() => collectionJournalPathFor({ dir: '/tmp', collectionId: '../../etc/passwd' })).toThrow(
      /not a usable collection id/
    );
    expect(() => collectionJournalPathFor({ dir: '/tmp', collectionId: '' })).toThrow(/not a usable collection id/);
  });

  it('starts empty at the current version', () => {
    const journal = emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' });
    expect(journal.version).toBe(COLLECTION_JOURNAL_VERSION);
    expect(journal.pieces).toEqual({});
    expect(committedCollectionSpendUstx(journal)).toBe(0n);
  });

  it('counts committed spend the way the thread runner does', () => {
    expect(
      committedCollectionSpendUstx({
        pieces: {
          1: { status: 'external', protocolFeeUstx: '11000', minerFeeUstx: '30000' },
          2: { status: 'confirmed', protocolFeeUstx: '11000', minerFeeUstx: '30000', actualMinerFeeUstx: '7000' },
          3: { status: 'broadcast', protocolFeeUstx: '11000', minerFeeUstx: '30000' }
        }
      })
    ).toBe(59_000n);
  });
});

describe('token uris', () => {
  it('separate a plate from the manifest and stay inside the 256 ascii bound', () => {
    for (const piece of PIECES) {
      const uri = tokenUriForPiece({ collectionId: COLLECTION_ID, index: piece.index });
      expect(uri).toBe(`xtrata:wizard/collection/${COLLECTION_ID}/${piece.index}`);
      expect(uri.length).toBeLessThanOrEqual(256);
    }
    expect(tokenUriForCollectionManifest({ collectionId: COLLECTION_ID })).toMatch(/\/manifest$/);
  });
});

describe('a whole run', () => {
  it('mints every plate and then the manifest, once each', async () => {
    const world = harness();
    const result = await world.run();

    expect(result.ok).toBe(true);
    expect(result.halted).toBeNull();
    expect(result.members).toHaveLength(COLLECTION_LENGTH);
    expect(world.submitted).toHaveLength(COLLECTION_LENGTH + 1);
    expect(world.submitted.map((entry) => entry.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null]);

    const journal = world.journal();
    for (const piece of PIECES) expect(journal.pieces[String(piece.index)].status).toBe('confirmed');
    expect(journal.pieces[MANIFEST_KEY].status).toBe('confirmed');
    expect(result.committedUstx).toBe((FEE + MINER_FEE) * BigInt(COLLECTION_LENGTH + 1));
  });

  it('mints the plates with no dependencies and the manifest with all of them', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal();
    for (const piece of PIECES) expect(journal.pieces[String(piece.index)].parentIds).toEqual([]);
    expect(journal.pieces[MANIFEST_KEY].parentIds).toHaveLength(COLLECTION_LENGTH);
  });

  it('mints the plates as image/svg+xml and the manifest as markdown', async () => {
    const world = harness();
    await world.run();
    const journal = world.journal();
    expect(journal.pieces['1'].mime).toBe('image/svg+xml');
    expect(journal.pieces[MANIFEST_KEY].mime).toBe('text/markdown');
  });

  it('records the nonce it is about to sign with, before it signs', async () => {
    const world = harness();
    await world.run();
    expect(world.journal().pieces['1'].intendedNonce).toBe(7);
  });

  it('writes a journal with no key material in it', async () => {
    const world = harness();
    await world.run();
    expect(JSON.stringify(world.journal())).not.toContain(KEY);
  });

  it('refuses to write a journal that has picked up key material', async () => {
    const world = harness();
    // The check runs on every save, so a port that smuggles the key into the
    // record has to be refused at the first write and not at the last.
    const poisoned = {
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: { 1: { senderKey: KEY } }
    };
    world.setJournal(poisoned);
    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.message).toMatch(/private key/);
    expect(world.submit).not.toHaveBeenCalled();
  });
});

describe('the journal prevents a double mint', () => {
  it('skips a piece already recorded as confirmed', async () => {
    const world = harness();
    await world.run();
    const first = world.submitted.length;

    const second = await world.run();
    expect(second.ok).toBe(true);
    expect(world.submitted).toHaveLength(first);
    expect(world.said.filter((line) => line.includes('nothing to broadcast')).length).toBeGreaterThan(0);
  });

  it('never re-broadcasts an intent whose transaction id was lost, and recovers it by hash', async () => {
    const { world, crashed, journal } = await crashedAtOne();
    expect(crashed.ok).toBe(false);
    expect(crashed.halted?.reason).toBe('unresolved');
    expect(journal.pieces['1'].status).toBe('broadcasting');
    expect(journal.pieces['1'].txid).toBeNull();
    expect(journal.pieces['1'].finalHashHex).toBeTruthy();

    // Resume in the same world: the bytes are on chain, found by content hash.
    const resumed = harness({ journal });
    resumed.chain.add('1', renderPiece(1), ADDRESS);
    const result = await resumed.run();

    expect(result.ok).toBe(true);
    expect(resumed.submitted.map((entry) => entry.index)).toEqual([2, 3, 4, 5, 6, 7, 8, null]);
    expect(resumed.journal().pieces['1']).toMatchObject({ status: 'confirmed', inscriptionId: '1', recovered: true });
    expect(world.submitted).toHaveLength(1);
  });

  it('recomposes the same bytes on a resume, which is why the hash still finds them', async () => {
    // The corpus cannot do this: an entry quotes the block it was written at,
    // so a retry hashes to something else and the orphan can never be matched.
    const { journal } = await crashedAtOne();
    const resumed = harness({ journal });
    resumed.chain.add('1', renderPiece(1), ADDRESS);
    await resumed.run();
    expect(resumed.journal().pieces['1'].inscriptionId).toBe('1');
    expect(resumed.chain.inscriptions.get('1').body).toBe(renderPiece(1));
  });
});

describe('the nonce asymmetry', () => {
  it('clears an intent the nonce proves was never mined, and generates the plate again', async () => {
    const world = harness();
    world.setJournal({
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: {
        1: {
          index: 1,
          status: 'broadcasting',
          txid: null,
          finalHashHex: `0x${'ab'.repeat(32)}`,
          intendedNonce: 99,
          senderAddress: ADDRESS,
          protocolFeeUstx: '11000',
          minerFeeUstx: '30000'
        }
      }
    });

    const result = await world.run();
    expect(result.ok).toBe(true);
    // Nonce 99 has never confirmed on a wallet whose last executed is 6, so
    // nothing landed and nothing can. Only there is a second broadcast safe.
    expect(world.submitted.map((entry) => entry.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null]);
    expect(world.journal().pieces['1'].previousIntents).toHaveLength(1);
    expect(world.journal().pieces['1'].previousIntents[0].reason).toBe('nonce-proved-absent');
  });

  it('halts rather than guessing when the nonce was consumed by something unidentifiable', async () => {
    const world = harness();
    world.setJournal({
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: {
        1: {
          index: 1,
          status: 'broadcasting',
          txid: null,
          finalHashHex: `0x${'ab'.repeat(32)}`,
          intendedNonce: 3,
          senderAddress: ADDRESS
        }
      }
    });

    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('unresolved');
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('tells the operator to ask again later rather than to make a ruling', async () => {
    // There is no --resolve here on purpose: a plate's bytes never change, so
    // the content-hash probe stays decisive for as long as the chain exists.
    const world = harness();
    world.setJournal({
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: {
        1: { index: 1, status: 'broadcasting', txid: null, finalHashHex: `0x${'ab'.repeat(32)}`, intendedNonce: 3, senderAddress: ADDRESS }
      }
    });
    const result = await world.run();
    expect(result.halted?.message).toMatch(/will not broadcast it again/);
    expect(result.halted?.message).toMatch(/content hash never changes/);
    expect(result.halted?.message).not.toMatch(/--resolve/);
  });
});

describe('membership is checked by byte equality', () => {
  it('refuses to hydrate a piece whose stored bytes are not that plate', async () => {
    const world = harness({ tamperStoredBody: (body) => body.replace('</svg>', '<!-- edited --></svg>') });
    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.message).toMatch(/are not piece 1/);
    // The tampered piece is never followed by another mint.
    expect(world.submitted).toHaveLength(1);
  });

  it('verifies every member against its own on-chain bytes before the manifest is signed', async () => {
    const world = harness();
    await world.run();
    const check = await verifyCollectionMembers({
      fetchImpl: world.ports.fetchImpl,
      members: PIECES.map((piece: { index: number }) => ({ index: piece.index, id: String(piece.index) })),
      expectedAddress: ADDRESS
    });
    expect(check.ok).toBe(true);
    expect(check.status).toBe('verified');
    expect(check.results.every((result: { authorChecked: boolean }) => result.authorChecked)).toBe(true);
  });

  it('fails closed on an id that is absent, altered, or by the wrong creator', async () => {
    const world = harness();
    world.chain.add('500', renderPiece(1), ADDRESS);
    world.chain.add('501', `${renderPiece(2)}<!-- not the plate -->`, ADDRESS);
    world.chain.add('502', renderPiece(3), 'SP000000000000000000002Q6VF78');

    const check = await verifyCollectionMembers({
      fetchImpl: world.ports.fetchImpl,
      members: [
        { index: 1, id: '500' },
        { index: 2, id: '501' },
        { index: 3, id: '502' },
        { index: 4, id: '9999' }
      ],
      expectedAddress: ADDRESS
    });
    expect(check.ok).toBe(false);
    expect(check.results.map((result: { status: string }) => result.status)).toEqual([
      'ok',
      'bytes-differ',
      'wrong-author',
      'no-chunk'
    ]);
    expect(() => assertMembersMatch(check)).toThrow(/not the piece it is listed as/);
    expect(assertMembersMatch({ ok: true })).toEqual({ ok: true });
  });

  it('hydratePiece throws for a missing id and for the wrong bytes', async () => {
    const world = harness();
    world.chain.add('600', renderPiece(5), ADDRESS);
    await expect(hydratePiece({ fetchImpl: world.ports.fetchImpl, id: '600', index: 5 })).resolves.toMatchObject({
      index: 5,
      id: '600'
    });
    await expect(hydratePiece({ fetchImpl: world.ports.fetchImpl, id: '600', index: 6 })).rejects.toThrow(
      /not piece 6/
    );
    await expect(hydratePiece({ fetchImpl: world.ports.fetchImpl, id: '777', index: 1 })).rejects.toThrow(
      /no chunk u0/
    );
  });
});

describe('the run-level spend cap', () => {
  it('stops before the broadcast that would cross it, having sent nothing more', async () => {
    const world = harness();
    const result = await world.run({ runSpendCapUstx: 100_000n });
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('spend-cap');
    // 41,000 per mint: two fit under 100,000 and the third does not.
    expect(world.submitted).toHaveLength(2);
    expect(result.halted?.message).toMatch(/Nothing was sent/);
  });

  it('counts cleared attempts too, so a re-composing loop still reaches the cap', async () => {
    expect(
      committedCollectionSpendUstx({
        pieces: {
          1: {
            status: 'broadcasting',
            protocolFeeUstx: '11000',
            minerFeeUstx: '30000',
            previousIntents: [
              { protocolFeeUstx: '11000', minerFeeUstx: '30000' },
              { protocolFeeUstx: '11000', minerFeeUstx: '30000' }
            ]
          }
        }
      })
    ).toBe(123_000n);
  });
});

describe('the kill switch', () => {
  it('stops the run before anything is signed', async () => {
    const world = harness({ killSwitch: () => 'KILL exists' });
    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('kill-switch');
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('is checked between every piece, not only at the start', async () => {
    const world = harness();
    await world.run({ to: 2 });
    const sent = world.submitted.length;

    // Engaged after the pieces already on chain have been read back, so the
    // guard that catches it is the one between two pieces rather than the one
    // at the top of the run.
    let engaged = false;
    world.ports.killSwitch = () => (engaged ? 'KILL exists' : null);
    const originalSay = world.ports.say;
    world.ports.say = (line: string) => {
      originalSay(line);
      if (line.includes('piece 2: already')) engaged = true;
    };

    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('kill-switch');
    expect(result.halted?.message).toMatch(/before piece 3/);
    expect(world.submitted).toHaveLength(sent);
    expect(world.journal().pieces['3']).toBeUndefined();
  });

  it('is checked while waiting too, and says the transaction may still confirm', async () => {
    // A run takes an hour and the decision to stop it will not arrive at a
    // convenient moment. Stopping mid-poll must not read as "nothing happened".
    let engaged = false;
    const world = harness({ killSwitch: () => (engaged ? 'KILL exists' : null) });
    const original = world.ports.submit;
    world.ports.submit = vi.fn(async (input: any) => {
      const outcome = await original(input);
      engaged = true;
      return outcome;
    }) as typeof original;

    const result = await world.run();
    expect(result.halted?.reason).toBe('kill-switch');
    expect(result.halted?.message).toMatch(/may still confirm/);
    expect(result.halted?.message).toMatch(/nothing was re-sent/);
    expect(world.submitted).toHaveLength(1);
    expect(world.journal().pieces['1'].txid).toBeTruthy();
  });
});

describe('failure semantics', () => {
  it('halts on the first failed transaction and never retries it', async () => {
    const world = harness({ txStatus: 'abort_by_response' });
    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('tx-failed');
    expect(world.submitted).toHaveLength(1);
    expect(result.halted?.message).toMatch(/An abort still pays the miner fee/);
    expect(world.journal().pieces['1'].status).toBe('failed');
  });

  it('refuses to move past a piece already recorded as failed', async () => {
    const world = harness({ txStatus: 'abort_by_response' });
    await world.run();
    world.setTxStatus('success');
    const again = await world.run();
    expect(again.halted?.reason).toBe('tx-failed');
    expect(again.halted?.message).toMatch(/does not retry a broadcast/);
    expect(world.submitted).toHaveLength(1);
  });

  it('says a timeout is not a failure, and keeps the txid', async () => {
    const world = harness({ txStatus: 'pending' });
    const result = await world.run({ confirmTimeoutMs: 0 });
    expect(result.halted?.reason).toBe('timeout');
    expect(result.halted?.message).toMatch(/THIS IS NOT A FAILURE/);
    expect(world.journal().pieces['1'].txid).toBeTruthy();
    expect(formatCollectionRunReport(result)).toMatch(/should be re-broadcast/);
  });

  it('halts on a journal written for another collection or another mode', async () => {
    const world = harness({
      journal: { ...emptyCollectionJournal({ collectionId: 'c-something-else', startedAt: 'now' }) }
    });
    const result = await world.run();
    expect(result.halted?.reason).toBe('journal');
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('halts on a journal from a future version rather than reading it optimistically', async () => {
    const world = harness({
      journal: { ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }), version: 99 }
    });
    expect((await world.run()).halted?.reason).toBe('journal');
  });

  it('refuses --ids that disagrees with what the journal already records', async () => {
    const world = harness();
    await world.run();
    const result = await world.run({ knownIds: { 1: '4242' } });
    expect(result.halted?.reason).toBe('journal');
    expect(result.halted?.message).toMatch(/will not guess which/);
  });

  it('refuses a piece range outside the collection', async () => {
    const world = harness();
    await expect(world.run({ from: 0 })).rejects.toThrow(/not a piece in a collection/);
    await expect(world.run({ from: 3, to: 2 })).rejects.toThrow(/not a piece at or after/);
  });
});

describe('resuming part way through', () => {
  it('refuses to start at a piece whose predecessors are not on chain', async () => {
    const world = harness();
    const result = await world.run({ from: 3, knownIds: {} });
    expect(result.halted?.reason).toBe('predecessor');
    expect(result.halted?.message).toMatch(/no inscription id is known for piece 1/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('adopts earlier pieces supplied with --ids, after checking their bytes', async () => {
    const world = harness({ priorIds: ['3001', '3002'] });
    const result = await world.run({ from: 3 });
    expect(result.ok).toBe(true);
    expect(world.submitted.map((entry) => entry.index)).toEqual([3, 4, 5, 6, 7, 8, null]);
    expect(result.members[0]).toMatchObject({ index: 1, id: '3001' });
  });

  it('refuses an --ids entry whose bytes are the wrong plate', async () => {
    const world = harness();
    world.chain.add('3001', renderPiece(4), ADDRESS);
    const result = await world.run({ from: 2, knownIds: { 1: '3001' } });
    expect(result.halted?.reason).toBe('predecessor');
    expect(result.halted?.message).toMatch(/are not piece 1/);
    expect(world.submit).not.toHaveBeenCalled();
  });

  it('does not close the collection when only part of it was run', async () => {
    const world = harness();
    const result = await world.run({ to: 4 });
    expect(result.ok).toBe(true);
    expect(world.submitted.map((entry) => entry.index)).toEqual([1, 2, 3, 4]);
    expect(world.journal().pieces[MANIFEST_KEY]).toBeUndefined();
  });

  it('honours --no-manifest', async () => {
    const world = harness();
    await world.run({ manifest: false });
    expect(world.journal().pieces[MANIFEST_KEY]).toBeUndefined();
  });
});

describe('a dry run reaches no broadcast endpoint', () => {
  const dryWorld = () => {
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    const wallets = { builder: { address: ADDRESS, key: '1'.padStart(64, '0') } };
    // The real fetch, submit and journal ports are the point of these tests.
    // The terminal is not, so `out` swallows what would otherwise be a whole
    // plan printed per mint.
    const ports = dryPorts({ chain, wallets, out: () => {} });
    const calls: Array<{ url: string; method: string }> = [];
    const inner = ports.fetchImpl;
    ports.fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), method: String(init?.method ?? 'GET') });
      return inner(input, init);
    }) as typeof inner;
    return { chain, ports, wallets, calls };
  };

  it('completes the whole collection without touching a transaction endpoint', async () => {
    const { ports, wallets, calls } = dryWorld();
    const result = await runCollection({
      ports,
      options: {
        collectionId: COLLECTION_ID,
        broadcast: false,
        env: ENV,
        wallets,
        journalDir: JOURNAL_DIR,
        confirmPollMs: 0
      }
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe('dry');
    expect(result.members).toHaveLength(COLLECTION_LENGTH);
    // The Stacks broadcast endpoint is POST /v2/transactions. Nothing else can
    // spend, and nothing here goes near it.
    expect(calls.some((call) => call.url.includes('/v2/transactions'))).toBe(false);
    expect(calls.every((call) => call.url.startsWith('https://api.hiro.so/'))).toBe(true);
    for (const call of calls) {
      expect(call.url).toMatch(/call-read|\/extended\/|\/nonces/);
    }
  });

  it('refuses if the dry submit port is ever asked to broadcast', async () => {
    const { ports } = dryWorld();
    await expect(ports.submit({ plan: { body: 'x' }, broadcast: true, wizardId: 'builder' })).rejects.toThrow(
      /cannot, and it did not/
    );
  });

  it('spends nothing when no ports are supplied at all', async () => {
    // NULL_PORTS refuses to fetch and refuses to submit, so a caller that
    // forgets its ports gets a halt rather than a quiet mainnet run.
    const result = await runCollection({
      options: { collectionId: COLLECTION_ID, broadcast: false, journalDir: JOURNAL_DIR }
    });
    expect(result.ok).toBe(false);
    expect(result.members).toHaveLength(0);
    await expect(NULL_PORTS.submit()).rejects.toThrow(/nothing was signed and nothing was sent/);
  });
});

describe('plans', () => {
  it('prints a plate plan that names what it will mint and what it will cost', async () => {
    const world = harness();
    const plan = await planPiece({
      index: 1,
      fetchImpl: world.ports.fetchImpl,
      senderAddress: ADDRESS,
      env: ENV,
      remainingMints: COLLECTION_LENGTH + 1
    });
    expect(plan.call.mime).toBe('image/svg+xml');
    expect(plan.call.functionName).toBe('mint-single-tx');
    expect(plan.call.totalChunks).toBe(1);
    expect(plan.protocolFeeUstx).toBe(FEE);

    const text = formatCollectionPlan(plan, { broadcast: false });
    expect(text).toContain('(DRY RUN)');
    expect(text).toContain('piece       : 1 of 8  (chunk)');
    expect(text).toContain('image/svg+xml');
    expect(text).toContain('post-conditions: deny mode');
    expect(text).toMatch(/members: not applicable/);
  });

  it('says BROADCAST at the top of a plan that is going to spend', async () => {
    // The thread runner shipped with DRY RUN hardcoded into this header, on a
    // real broadcast, with the only contradiction one line at the very bottom.
    const world = harness();
    const plan = await planPiece({ index: 2, fetchImpl: world.ports.fetchImpl, senderAddress: ADDRESS, env: ENV });
    expect(formatCollectionPlan(plan, { broadcast: true })).toContain('BROADCAST');
    expect(formatCollectionPlan(plan, { broadcast: true })).not.toContain('(DRY RUN)');
  });

  it('plans a manifest that depends on every member and verifies each of them', async () => {
    const world = harness();
    await world.run();
    const plan = await planCollectionManifest({
      members: PIECES.map((piece: { index: number }) => ({ index: piece.index, id: String(piece.index) })),
      fetchImpl: world.ports.fetchImpl,
      senderAddress: ADDRESS,
      expectedAddress: ADDRESS,
      env: ENV
    });
    expect(plan.call.functionName).toBe('mint-single-tx-recursive');
    expect(plan.parentIds).toHaveLength(COLLECTION_LENGTH);
    expect(plan.checks.members.ok).toBe(true);
    expect(formatCollectionPlan(plan, { broadcast: false })).toMatch(/8 of 8 read back off chain/);
  });

  it('refuses to broadcast a manifest whose members did not check out', async () => {
    const world = harness({ tamperStoredBody: (body) => `${body}<!-- edited -->` });
    // Mint the plates into a chain that serves back something else, then let
    // the run reach the manifest with the byte check unable to pass.
    const seeded = harness();
    await seeded.run({ to: COLLECTION_LENGTH });

    const journal = seeded.journal();
    const resumed = harness({ journal });
    for (const piece of PIECES) {
      resumed.chain.add(String(piece.index), `${renderPiece(piece.index)} `, ADDRESS);
    }
    const result = await resumed.run();
    expect(result.ok).toBe(false);
    expect(result.halted?.message).toMatch(/are not piece 1/);
    expect(world.submit).not.toHaveBeenCalled();
  });
});

describe('status', () => {
  it('compares every on-chain plate to its generated bytes', async () => {
    const world = harness();
    await world.run();
    const report = await collectionStatusReport({
      ports: { ...world.ports, readJournal: () => world.journal() },
      options: { collectionId: COLLECTION_ID, journalDir: JOURNAL_DIR }
    });
    expect(report.rows).toHaveLength(COLLECTION_LENGTH + 1);
    for (const row of report.rows.slice(0, COLLECTION_LENGTH)) {
      expect(row.chain).toBe('confirmed');
      expect(row.note).toBe('byte-identical to the plate');
    }
    expect(report.rows.at(-1)?.chain).toBe('confirmed');
    expect(formatCollectionStatusTable(report)).toContain(COLLECTION_ID);
  });

  it('reports a mismatch when the id on chain is not the plate it is recorded as', async () => {
    const world = harness();
    world.chain.add('700', renderPiece(2), ADDRESS);
    const report = await collectionStatusReport({
      ports: { ...world.ports, readJournal: () => null },
      options: { collectionId: COLLECTION_ID, journalDir: JOURNAL_DIR, knownIds: { 1: '700' } }
    });
    expect(report.rows[0].chain).toBe('mismatch');
    expect(report.journalFound).toBe(false);
  });

  it('resolves a lost transaction id by content hash without ever waiting', async () => {
    const world = harness();
    world.chain.add('42', renderPiece(1), ADDRESS);
    const journal = {
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: {
        1: {
          index: 1,
          status: 'broadcasting',
          txid: null,
          finalHashHex: world.chain.byHash.keys().next().value,
          senderAddress: ADDRESS
        }
      }
    };
    const report = await collectionStatusReport({
      ports: { ...world.ports, readJournal: () => journal },
      options: { collectionId: COLLECTION_ID, journalDir: JOURNAL_DIR }
    });
    expect(report.rows[0].chain).toBe('confirmed');
    expect(report.rows[0].inscriptionId).toBe('42');
    expect(report.rows[0].note).toMatch(/recovered by content hash/);
  });

  it('says a never-sent intent is safe to compose again, and why', async () => {
    const world = harness();
    const journal = {
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: {
        1: {
          index: 1,
          status: 'broadcasting',
          txid: null,
          finalHashHex: `0x${'cd'.repeat(32)}`,
          intendedNonce: 99,
          senderAddress: ADDRESS
        }
      }
    };
    const report = await collectionStatusReport({
      ports: { ...world.ports, readJournal: () => journal },
      options: { collectionId: COLLECTION_ID, journalDir: JOURNAL_DIR }
    });
    expect(report.rows[0].chain).toBe('never-sent');
    expect(report.rows[0].note).toMatch(/never confirmed/);
  });
});

describe('halts are reported, never thrown out of the middle', () => {
  it('returns every expected refusal as a halt with the state that produced it', async () => {
    const world = harness({ killSwitch: () => 'KILL exists' });
    const result = await world.run();
    expect(result.ok).toBe(false);
    expect(result.journalPath).toContain(`.collection-${COLLECTION_ID}.json`);
    expect(result.journal).toBeTruthy();
    expect(formatCollectionRunReport(result)).toMatch(/HALTED \(kill-switch\)/);
  });

  it('validates halt reasons, so a typo cannot invent one', () => {
    expect(() => new RunHalt('not-a-reason', 'x')).toThrow(/not a known halt reason/);
    expect(new RunHalt('spend-cap', 'x').reason).toBe('spend-cap');
  });

  it('refuses an unknown piece status rather than writing it', async () => {
    const world = harness();
    world.setJournal({
      ...emptyCollectionJournal({ collectionId: COLLECTION_ID, startedAt: 'now' }),
      pieces: { 1: { index: 1, status: 'nearly', inscriptionId: null } }
    });
    // 'nearly' is not a status the loop knows, so the piece reads as unminted
    // and the run proceeds; what must not happen is a write of that string.
    const result = await world.run();
    expect(result.ok).toBe(true);
    for (const record of Object.values(world.journal().pieces as Record<string, { status: string }>)) {
      expect(record.status).not.toBe('nearly');
    }
  });
});
