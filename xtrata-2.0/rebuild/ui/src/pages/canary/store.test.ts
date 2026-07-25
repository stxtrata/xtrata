import { describe, expect, it, vi } from 'vitest';
import { PRODUCTION_APPROVAL_PHRASE } from './arming';
import { STAGE_IDS, gateFor, stageDefinition, type StageId, type StageStatus } from './stages';
import { CanaryStore, type StageRunner } from './store';
import type { CanaryDeployConfig } from './config';

/**
 * The gate is the process. These tests hold it to the property that matters:
 * no stage can start over an unsettled predecessor, and the store — not a
 * disabled button — is what refuses.
 */

const config: CanaryDeployConfig = {
  network: 'testnet',
  deployerAddress: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT',
  apiBaseUrl: 'https://api.testnet.hiro.so',
  coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3',
  dropsContractName: 'xtrata-drops-v3',
  collectionContractName: 'xtrata-canary-collection',
  relayerBaseUrl: null
};

let clock = 0;
const makeStore = (): CanaryStore => {
  clock = 0;
  return new CanaryStore({
    config,
    now: () => new Date(1_700_000_000_000 + (clock += 1_000))
  });
};

const pass: StageRunner = async (api) => {
  api.evidence({ label: 'ok', value: 'done' });
};
const fail: StageRunner = async () => {
  throw new Error('the stage blew up');
};

const attestation = {
  commands: ['cd rebuild/contracts && clarinet check && npm test'],
  output: 'ok 124 passed',
  outcome: 'passed' as const,
  attestedBy: 'operator'
};

/** Settle every stage up to (not including) `target` so it becomes reachable. */
const advanceTo = async (store: CanaryStore, target: StageId): Promise<void> => {
  for (const id of STAGE_IDS) {
    if (id === target) return;
    const definition = stageDefinition(id);
    if (definition.verification === 'attested') {
      store.attest(id, attestation);
    } else if (id === 'production-approval') {
      store.approveProduction({
        phrase: PRODUCTION_APPROVAL_PHRASE,
        expectedPhrase: PRODUCTION_APPROVAL_PHRASE,
        acknowledgedImmutability: true,
        approvedBy: 'operator'
      });
    } else {
      await store.runStage(id, pass);
    }
  }
};

describe('gateFor', () => {
  const allPending = Object.fromEntries(STAGE_IDS.map((id) => [id, 'pending' as StageStatus])) as Record<
    StageId,
    StageStatus
  >;

  it('opens the first stage unconditionally', () => {
    expect(gateFor('sources', allPending).open).toBe(true);
  });

  it('blocks a later stage and names the first offender', () => {
    const gate = gateFor('source-parity', { ...allPending, sources: 'passed' });
    expect(gate.open).toBe(false);
    expect(gate.blockedBy).toBe('contract-tests');
  });

  it('treats a skipped predecessor as settled', () => {
    const statuses = { ...allPending, sources: 'passed' as StageStatus };
    expect(gateFor('source-parity', { ...statuses, 'contract-tests': 'skipped' }).open).toBe(true);
  });

  it('treats a failed predecessor as blocking, with a failure reason', () => {
    const gate = gateFor('source-parity', { ...allPending, sources: 'failed' });
    expect(gate.open).toBe(false);
    expect(gate.reason).toMatch(/failed/);
  });

  it('treats a still-running predecessor as blocking', () => {
    const gate = gateFor('source-parity', { ...allPending, sources: 'running' });
    expect(gate.open).toBe(false);
    expect(gate.reason).toMatch(/still running/);
  });
});

describe('CanaryStore gating', () => {
  it('starts with every stage pending and only stage 1 startable', async () => {
    const store = makeStore();
    expect(store.canStart('sources')).toBe(true);
    expect(store.canStart('source-parity')).toBe(false);
    expect(store.currentStage).toBe('sources');
  });

  it('refuses to run a gated stage even when asked directly', async () => {
    const store = makeStore();
    await expect(store.runStage('testnet-deploy', pass)).rejects.toThrow(/gated/);
    expect(store.getState().stages['testnet-deploy'].status).toBe('pending');
  });

  it('opens the next stage only after the previous one passes', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    expect(store.getState().stages['sources'].status).toBe('passed');
    expect(store.canStart('contract-tests')).toBe(true);
    expect(store.canStart('source-parity')).toBe(false);
  });

  it('blocks everything after a failed stage', async () => {
    const store = makeStore();
    const status = await store.runStage('sources', fail);
    expect(status).toBe('failed');
    expect(store.getState().stages['sources'].error).toMatch(/blew up/);
    expect(store.canStart('contract-tests')).toBe(false);
    // The failure itself is recorded as evidence, not only as a message.
    expect(store.getState().stages['sources'].evidence.at(-1)?.tone).toBe('bad');
  });

  it('records start and finish timestamps', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    const stage = store.getState().stages['sources'];
    expect(stage.startedAt).toBeDefined();
    expect(stage.finishedAt).toBeDefined();
    expect(Date.parse(stage.finishedAt!)).toBeGreaterThan(Date.parse(stage.startedAt!));
  });

  it('runs one stage at a time', async () => {
    const store = makeStore();
    let release = (): void => undefined;
    const blocked = store.runStage('sources', () => new Promise<void>((resolve) => (release = resolve)));
    expect(store.canStart('sources')).toBe(false);
    release();
    await blocked;
  });
});

describe('skipping', () => {
  it('records a reason and settles the stage', async () => {
    const store = makeStore();
    await advanceTo(store, 'sponsored-claim-canary');
    store.skipStage('sponsored-claim-canary', 'no relayer configured');
    const stage = store.getState().stages['sponsored-claim-canary'];
    expect(stage.status).toBe('skipped');
    expect(stage.skipReason).toBe('no relayer configured');
    expect(store.canStart('review')).toBe(true);
  });

  it('refuses a skip without a reason', async () => {
    const store = makeStore();
    await advanceTo(store, 'sponsored-claim-canary');
    expect(() => store.skipStage('sponsored-claim-canary', '   ')).toThrow(/why it was skipped/);
  });

  it('refuses to skip a stage that is not skippable', async () => {
    const store = makeStore();
    expect(() => store.skipStage('sources', 'I would rather not')).toThrow(/may not be skipped/);
  });

  it('refuses to skip a gated stage', () => {
    const store = makeStore();
    expect(() => store.skipStage('sponsored-claim-canary', 'later')).toThrow(/gated/);
  });

  it('lets a runner skip itself with a reason', async () => {
    const store = makeStore();
    await advanceTo(store, 'sponsored-claim-canary');
    const status = await store.runStage('sponsored-claim-canary', async (api) => {
      api.skip('no relayer base URL is configured');
    });
    expect(status).toBe('skipped');
    expect(store.getState().stages['sponsored-claim-canary'].skipReason).toMatch(/no relayer/);
  });
});

describe('operator attestation', () => {
  it('passes an attested stage and labels it as not machine-verified', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', attestation);
    const stage = store.getState().stages['contract-tests'];
    expect(stage.status).toBe('passed');
    expect(stage.attestation?.attestedBy).toBe('operator');
    expect(stage.evidence[0]!.value).toMatch(/NOT machine-verified/);
  });

  it('fails the stage when the operator attests a failure', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', { ...attestation, outcome: 'failed' });
    expect(store.getState().stages['contract-tests'].status).toBe('failed');
    expect(store.canStart('source-parity')).toBe(false);
  });

  it('refuses an empty attestation', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    expect(() => store.attest('contract-tests', { ...attestation, output: '  ' })).toThrow(
      /paste the command output/
    );
    expect(() => store.attest('contract-tests', { ...attestation, attestedBy: '' })).toThrow(
      /name the operator/
    );
  });

  it('refuses to attest a machine-verified stage', () => {
    const store = makeStore();
    expect(() => store.attest('sources', attestation)).toThrow(/not an attested stage/);
  });

  it('refuses to attest a gated stage', () => {
    const store = makeStore();
    expect(() => store.attest('contract-tests', attestation)).toThrow(/gated/);
  });
});

describe('production approval gate', () => {
  const approve = (store: CanaryStore, patch: Partial<Parameters<CanaryStore['approveProduction']>[0]> = {}) =>
    store.approveProduction({
      phrase: PRODUCTION_APPROVAL_PHRASE,
      expectedPhrase: PRODUCTION_APPROVAL_PHRASE,
      acknowledgedImmutability: true,
      approvedBy: 'operator',
      ...patch
    });

  it('refuses a wrong phrase, a missing acknowledgment or an anonymous approver', async () => {
    const store = makeStore();
    await advanceTo(store, 'production-approval');
    expect(() => approve(store, { phrase: 'deploy to mainnet' })).toThrow(/does not match/);
    expect(() => approve(store, { acknowledgedImmutability: false })).toThrow(/cannot be overwritten/);
    expect(() => approve(store, { approvedBy: '  ' })).toThrow(/name the operator/);
    expect(store.getState().stages['production-approval'].status).toBe('pending');
  });

  it('unlocks the mainnet deploy stage once granted', async () => {
    const store = makeStore();
    await advanceTo(store, 'production-approval');
    expect(store.canStart('production-deploy')).toBe(false);
    approve(store);
    expect(store.getState().stages['production-approval'].status).toBe('passed');
    expect(store.canStart('production-deploy')).toBe(true);
    expect(
      store.getState().stages['production-approval'].evidence.some((entry) =>
        entry.value.includes('CANNOT be overwritten')
      )
    ).toBe(true);
  });

  it('cannot be granted while the review stage is unsettled', async () => {
    const store = makeStore();
    await advanceTo(store, 'review');
    expect(() => approve(store)).toThrow(/gated/);
  });
});

describe('typed confirmation handshake', () => {
  it('blocks the runner until the operator confirms', async () => {
    const store = makeStore();
    let resumed = false;
    const running = store.runStage('sources', async (api) => {
      await api.requestConfirmation({
        title: 'Deploy x',
        phrase: 'x',
        details: [],
        irreversible: true
      });
      resumed = true;
    });

    await vi.waitFor(() => expect(store.getState().pendingConfirmation).not.toBeNull());
    expect(resumed).toBe(false);

    store.confirmPending(store.getState().pendingConfirmation!.id);
    expect(await running).toBe('passed');
    expect(resumed).toBe(true);
    expect(store.getState().pendingConfirmation).toBeNull();
  });

  it('fails the stage when the operator declines', async () => {
    const store = makeStore();
    const running = store.runStage('sources', async (api) => {
      await api.requestConfirmation({ title: 'Deploy x', phrase: 'x', details: [], irreversible: true });
    });
    await vi.waitFor(() => expect(store.getState().pendingConfirmation).not.toBeNull());
    store.cancelPending(store.getState().pendingConfirmation!.id, 'operator said no');

    expect(await running).toBe('failed');
    expect(store.getState().stages['sources'].error).toMatch(/operator said no/);
    expect(store.getState().pendingConfirmation).toBeNull();
  });

  it('ignores a confirmation for a stale request id', async () => {
    const store = makeStore();
    const running = store.runStage('sources', async (api) => {
      await api.requestConfirmation({ title: 'Deploy x', phrase: 'x', details: [], irreversible: true });
    });
    await vi.waitFor(() => expect(store.getState().pendingConfirmation).not.toBeNull());
    store.confirmPending('confirm-999');
    expect(store.getState().pendingConfirmation).not.toBeNull();
    store.confirmPending(store.getState().pendingConfirmation!.id);
    await running;
  });
});

describe('resetFrom', () => {
  it('clears the named stage and everything gated on it', async () => {
    const store = makeStore();
    await store.runStage('sources', pass);
    store.attest('contract-tests', attestation);
    await store.runStage('source-parity', pass);

    store.resetFrom('contract-tests');
    expect(store.getState().stages['sources'].status).toBe('passed');
    expect(store.getState().stages['contract-tests'].status).toBe('pending');
    expect(store.getState().stages['source-parity'].status).toBe('pending');
    expect(store.getState().stages['source-parity'].evidence).toEqual([]);
  });
});

describe('observable plumbing', () => {
  it('notifies subscribers on every state change and stops after unsubscribe', async () => {
    const store = makeStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    await store.runStage('sources', pass);
    expect(listener.mock.calls.length).toBeGreaterThan(0);

    unsubscribe();
    const before = listener.mock.calls.length;
    store.setReviewNotes('after unsubscribe');
    expect(listener.mock.calls.length).toBe(before);
  });
});
