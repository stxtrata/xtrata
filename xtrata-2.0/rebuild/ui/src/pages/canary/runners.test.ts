import { describe, expect, it, vi } from 'vitest';
import type { DeployParams } from '../../services/deploy';
import { buildDeployables } from './sources';
import {
  runDeployment,
  runOnChainVerification,
  runSourceParity,
  runSourceValidation,
  runSponsoredClaimCanary,
  type CanaryServices
} from './runners';
import { CanaryStore } from './store';
import { parseLocalInterface } from './verify';
import type { CanaryDeployConfig } from './config';

/**
 * The stage runners, driven against fake chain effects.
 *
 * Only the stages whose logic is the canary's own are covered here — source
 * validation, parity, the deploy preflight/gate and the on-chain verification.
 * Stages 7-9 are thin wrappers over the client's own executor and builders,
 * which are tested in the client package against simnet.
 */

const DEPLOYER = 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT';
const CORE = `${DEPLOYER}.xtrata-v3-2-3`;

const config = (patch: Partial<CanaryDeployConfig> = {}): CanaryDeployConfig => ({
  network: 'testnet',
  deployerAddress: DEPLOYER,
  apiBaseUrl: 'https://api.testnet.hiro.so',
  coreContractId: CORE,
  dropsContractName: 'xtrata-drops-v3',
  collectionContractName: 'xtrata-canary-collection',
  relayerBaseUrl: null,
  ...patch
});

const makeStore = (patch: Partial<CanaryDeployConfig> = {}): CanaryStore =>
  new CanaryStore({ config: config(patch) });

interface FakeChain {
  /** contractId → deployed source. */
  sources: Map<string, string>;
  balanceMicroStx: bigint;
  /** Overrides the interface derived from the deployed source. */
  interfaceOverride?: Map<string, { name: string; access: string; args: unknown[] }[]>;
}

const fakeFetch =
  (chain: FakeChain): typeof fetch =>
  async (input: RequestInfo | URL) => {
    const url = String(input);
    const json = (body: unknown, status = 200): Response =>
      ({ ok: status < 400, status, json: async () => body }) as Response;

    const sourceMatch = /\/v2\/contracts\/source\/([^/]+)\/([^?]+)/.exec(url);
    if (sourceMatch) {
      const source = chain.sources.get(`${sourceMatch[1]}.${sourceMatch[2]}`);
      return source === undefined ? json({}, 404) : json({ source });
    }

    const interfaceMatch = /\/v2\/contracts\/interface\/([^/]+)\/([^?]+)/.exec(url);
    if (interfaceMatch) {
      const contractId = `${interfaceMatch[1]}.${interfaceMatch[2]}`;
      const override = chain.interfaceOverride?.get(contractId);
      if (override) return json({ functions: override });
      const source = chain.sources.get(contractId);
      if (source === undefined) return json({}, 404);
      return json({
        functions: parseLocalInterface(source).map((fn) => ({
          name: fn.name,
          access: fn.access,
          args: Array.from({ length: fn.arity }, () => ({}))
        }))
      });
    }

    if (/\/extended\/v1\/address\/[^/]+\/stx/.test(url)) {
      return json({ balance: chain.balanceMicroStx.toString(), locked: '0' });
    }

    throw new Error(`unexpected fetch: ${url}`);
  };

const services = (params: {
  chain: FakeChain;
  walletNetwork?: 'mainnet' | 'testnet' | null;
  appNetwork?: 'mainnet' | 'testnet';
  address?: string;
  deploy?: CanaryServices['deploy'];
  waitConfirmStatus?: 'success' | 'abort_by_response';
}): CanaryServices => ({
  apiBaseUrl: 'https://api.testnet.hiro.so',
  appNetwork: params.appNetwork ?? 'testnet',
  networkName: params.appNetwork ?? 'testnet',
  walletNetwork: params.walletNetwork === undefined ? 'testnet' : params.walletNetwork,
  address: params.address ?? DEPLOYER,
  canSign: true,
  transport: async () => {
    throw new Error('no read-only transport in this test');
  },
  getBlockHeight: async () => 100,
  submit: async () => ({ txid: '0xsubmit' }),
  deploy: params.deploy ?? (async () => ({ txid: '0xdeploy' })),
  waitConfirm: async (txid) => ({ txid, status: params.waitConfirmStatus ?? 'success' }),
  fetchImpl: fakeFetch(params.chain)
});

const emptyChain = (): FakeChain => ({ sources: new Map(), balanceMicroStx: 100_000_000n });

/** Run stage 1 then 3, which every later stage depends on. */
const prepare = async (store: CanaryStore): Promise<void> => {
  await store.runStage('sources', runSourceValidation());
  store.attest('contract-tests', {
    commands: ['x'],
    output: 'ok',
    outcome: 'passed',
    attestedBy: 'operator'
  });
  await store.runStage('source-parity', runSourceParity());
  store.attest('client-tests', {
    commands: ['x'],
    output: 'ok',
    outcome: 'passed',
    attestedBy: 'operator'
  });
};

/** Auto-confirm the next N typed confirmations as they appear. */
const autoConfirm = (store: CanaryStore, count: number): void => {
  let remaining = count;
  const unsubscribe = store.subscribe(() => {
    const pending = store.getState().pendingConfirmation;
    if (pending && remaining > 0) {
      remaining -= 1;
      store.confirmPending(pending.id);
    }
  });
  void unsubscribe;
};

describe('stage 1 — source and configuration validation', () => {
  it('passes and publishes both deployables in dependency order', async () => {
    const store = makeStore();
    expect(await store.runStage('sources', runSourceValidation())).toBe('passed');
    expect(store.getState().deployables.map((entry) => entry.id)).toEqual(['drops', 'collection']);
  });

  it('fails with per-field evidence when the configuration is wrong', async () => {
    const store = makeStore({ deployerAddress: '', coreContractId: 'nope' });
    expect(await store.runStage('sources', runSourceValidation())).toBe('failed');
    const evidence = store.getState().stages['sources'].evidence;
    expect(evidence.some((entry) => entry.label.includes('deployerAddress'))).toBe(true);
    expect(evidence.some((entry) => entry.label.includes('coreContractId'))).toBe(true);
  });

  it('fails when the configured core is on the other network', async () => {
    const store = makeStore({
      coreContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3'
    });
    expect(await store.runStage('sources', runSourceValidation())).toBe('failed');
  });
});

describe('stage 3 — source parity snapshot', () => {
  it('records a stable sha256 per contract', async () => {
    const store = makeStore();
    await store.runStage('sources', runSourceValidation());
    store.attest('contract-tests', {
      commands: ['x'],
      output: 'ok',
      outcome: 'passed',
      attestedBy: 'operator'
    });
    expect(await store.runStage('source-parity', runSourceParity())).toBe('passed');
    const hashes = store
      .getState()
      .stages['source-parity'].evidence.filter((entry) => entry.label.startsWith('sha256'));
    expect(hashes).toHaveLength(2);
    for (const entry of hashes) expect(entry.value).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('stage 5 — testnet deployment', () => {
  const deployRunner = () =>
    runDeployment(services({ chain: emptyChain() }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

  it('refuses to run while a mainnet account is connected', async () => {
    const store = makeStore();
    await prepare(store);
    const runner = runDeployment(
      services({ chain: emptyChain(), walletNetwork: 'mainnet', appNetwork: 'testnet' }),
      { stage: 'testnet-deploy', requiredNetwork: 'testnet' }
    );
    expect(await store.runStage('testnet-deploy', runner)).toBe('failed');
    expect(store.getState().stages['testnet-deploy'].error).toMatch(/requires a testnet account/);
  });

  it('refuses when the connected account is not the configured deployer', async () => {
    const store = makeStore();
    await prepare(store);
    const runner = runDeployment(
      services({ chain: emptyChain(), address: 'ST000000000000000000002AMW42H' }),
      { stage: 'testnet-deploy', requiredNetwork: 'testnet' }
    );
    expect(await store.runStage('testnet-deploy', runner)).toBe('failed');
    expect(store.getState().stages['testnet-deploy'].error).toMatch(/is not the configured deployer/);
  });

  it('refuses when the deployer cannot cover the estimated cost', async () => {
    const store = makeStore();
    await prepare(store);
    const runner = runDeployment(
      services({ chain: { sources: new Map(), balanceMicroStx: 10n } }),
      { stage: 'testnet-deploy', requiredNetwork: 'testnet' }
    );
    expect(await store.runStage('testnet-deploy', runner)).toBe('failed');
    expect(store.getState().stages['testnet-deploy'].error).toMatch(/below the estimated/);
  });

  it('blocks before any wallet opens when the contract name is already taken', async () => {
    const store = makeStore();
    await prepare(store);
    const chain: FakeChain = {
      sources: new Map([[`${DEPLOYER}.xtrata-drops-v3`, ';; something else entirely']]),
      balanceMicroStx: 100_000_000n
    };
    const deploy = vi.fn(async (_params: DeployParams) => ({ txid: '0xdeploy' }));
    const runner = runDeployment(services({ chain, deploy }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

    expect(await store.runStage('testnet-deploy', runner)).toBe('failed');
    expect(deploy).not.toHaveBeenCalled();
    expect(store.getState().stages['testnet-deploy'].error).toMatch(/cannot be overwritten/);
    expect(store.getState().nameConflicts[0]!.status).toBe('occupied');
  });

  it('never deploys without an explicit typed confirmation', async () => {
    const store = makeStore();
    await prepare(store);
    const deploy = vi.fn(async (_params: DeployParams) => ({ txid: '0xdeploy' }));
    const runner = runDeployment(services({ chain: emptyChain(), deploy }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

    const running = store.runStage('testnet-deploy', runner);
    await vi.waitFor(() => expect(store.getState().pendingConfirmation).not.toBeNull());
    expect(deploy).not.toHaveBeenCalled();

    // The panel names the contract and its Clarity version before arming.
    const pending = store.getState().pendingConfirmation!;
    expect(pending.phrase).toBe('xtrata-drops-v3');
    expect(pending.irreversible).toBe(true);
    expect(pending.details.some((entry) => entry.value === '4')).toBe(true);

    store.cancelPending(pending.id);
    expect(await running).toBe('failed');
    expect(deploy).not.toHaveBeenCalled();
  });

  it('deploys in dependency order, pinning each contract to its Clarity version', async () => {
    const store = makeStore();
    await prepare(store);
    const deploy = vi.fn(async (_params: DeployParams) => ({ txid: '0xdeploy' }));
    const runner = runDeployment(services({ chain: emptyChain(), deploy }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

    autoConfirm(store, 2);
    expect(await store.runStage('testnet-deploy', runner)).toBe('passed');

    expect(deploy.mock.calls.map((call) => (call[0] as { contractName: string }).contractName)).toEqual([
      'xtrata-drops-v3',
      'xtrata-canary-collection'
    ]);
    expect(deploy.mock.calls.map((call) => (call[0] as { clarityVersion: number }).clarityVersion)).toEqual(
      [4, 3]
    );
    expect(store.getState().deploys['testnet-deploy'].every((r) => r.status === 'confirmed')).toBe(true);
  });

  it('skips the wallet for a name already holding an identical source', async () => {
    const store = makeStore();
    await prepare(store);
    const { deployables } = buildDeployables(config());
    const drops = deployables.find((entry) => entry.id === 'drops')!;
    const chain: FakeChain = {
      sources: new Map([[drops.contractId, drops.source]]),
      balanceMicroStx: 100_000_000n
    };
    const deploy = vi.fn(async (_params: DeployParams) => ({ txid: '0xdeploy' }));
    const runner = runDeployment(services({ chain, deploy }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

    autoConfirm(store, 1);
    expect(await store.runStage('testnet-deploy', runner)).toBe('passed');
    expect(deploy).toHaveBeenCalledTimes(1);
    expect((deploy.mock.calls[0]![0] as { contractName: string }).contractName).toBe(
      'xtrata-canary-collection'
    );
  });

  it('fails the stage when a deploy does not confirm', async () => {
    const store = makeStore();
    await prepare(store);
    const runner = runDeployment(
      services({ chain: emptyChain(), waitConfirmStatus: 'abort_by_response' }),
      { stage: 'testnet-deploy', requiredNetwork: 'testnet' }
    );
    autoConfirm(store, 2);
    expect(await store.runStage('testnet-deploy', runner)).toBe('failed');
    expect(store.getState().deploys['testnet-deploy'][0]!.status).toBe('failed');
  });

  it('is unreachable before stage 4 settles', async () => {
    const store = makeStore();
    await store.runStage('sources', runSourceValidation());
    await expect(store.runStage('testnet-deploy', deployRunner())).rejects.toThrow(/gated/);
  });
});

describe('stage 13 — production deployment', () => {
  it('refuses to run while a testnet account is connected', async () => {
    const store = makeStore({ network: 'mainnet' });
    // Force the gate open without touching mainnet: this test is about the
    // network guard inside the runner, not about the gate.
    const runner = runDeployment(
      services({ chain: emptyChain(), walletNetwork: 'testnet', appNetwork: 'mainnet' }),
      { stage: 'production-deploy', requiredNetwork: 'mainnet' }
    );
    const status = await store.runStage('sources', runner);
    expect(status).toBe('failed');
    expect(store.getState().stages['sources'].error).toMatch(/requires a mainnet account/);
  });
});

describe('stage 6 — on-chain verification', () => {
  const deployBoth = async (store: CanaryStore, chain: FakeChain): Promise<void> => {
    await prepare(store);
    const runner = runDeployment(services({ chain }), {
      stage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });
    autoConfirm(store, 2);
    await store.runStage('testnet-deploy', runner);
    // The fake chain now holds what was "deployed".
    for (const deployable of store.getState().deployables) {
      chain.sources.set(deployable.contractId, deployable.source);
    }
  };

  const verifyRunner = (chain: FakeChain) =>
    runOnChainVerification(services({ chain }), {
      stage: 'testnet-verify',
      deployStage: 'testnet-deploy',
      requiredNetwork: 'testnet'
    });

  it('passes when source, interface and dependencies all agree', async () => {
    const store = makeStore();
    const chain = emptyChain();
    await deployBoth(store, chain);

    expect(await store.runStage('testnet-verify', verifyRunner(chain))).toBe('passed');
    const records = store.getState().verifications['testnet-verify'];
    expect(records).toHaveLength(2);
    expect(records.every((record) => record.parity?.match === 'exact')).toBe(true);
    expect(records.every((record) => record.interfaceProbe?.ok)).toBe(true);
    expect(records.every((record) => record.dependencies?.ok)).toBe(true);
  });

  it('fails on a source-hash mismatch', async () => {
    const store = makeStore();
    const chain = emptyChain();
    await deployBoth(store, chain);
    const drops = store.getState().deployables[0]!;
    chain.sources.set(drops.contractId, `${drops.source}\n(define-public (surprise) (ok true))\n`);

    expect(await store.runStage('testnet-verify', verifyRunner(chain))).toBe('failed');
    expect(store.getState().stages['testnet-verify'].error).toMatch(/verification check/);
    expect(
      store.getState().stages['testnet-verify'].evidence.some((entry) => entry.value.includes('MISMATCH'))
    ).toBe(true);
  });

  it('fails when a function is missing from the deployed interface', async () => {
    const store = makeStore();
    const chain = emptyChain();
    await deployBoth(store, chain);
    const drops = store.getState().deployables[0]!;
    chain.interfaceOverride = new Map([
      [
        drops.contractId,
        parseLocalInterface(drops.source)
          .filter((fn) => fn.name !== 'claim')
          .map((fn) => ({
            name: fn.name,
            access: fn.access,
            args: Array.from({ length: fn.arity }, () => ({}))
          }))
      ]
    ]);

    expect(await store.runStage('testnet-verify', verifyRunner(chain))).toBe('failed');
    expect(
      store
        .getState()
        .stages['testnet-verify'].evidence.some((entry) => entry.value.includes('missing [claim]'))
    ).toBe(true);
  });

  it('fails when the deployed source references a dependency we did not intend', async () => {
    const store = makeStore();
    const chain = emptyChain();
    await deployBoth(store, chain);
    const drops = store.getState().deployables[0]!;
    chain.sources.set(
      drops.contractId,
      drops.source.replace(
        `'${CORE}`,
        `'ST000000000000000000002AMW42H.xtrata-v3-2-3`
      )
    );

    expect(await store.runStage('testnet-verify', verifyRunner(chain))).toBe('failed');
    expect(
      store
        .getState()
        .stages['testnet-verify'].evidence.some((entry) => entry.label.startsWith('Dependencies'))
    ).toBe(true);
  });

  it('fails when nothing was deployed', async () => {
    const store = makeStore();
    await prepare(store);
    await store.runStage('testnet-deploy', async () => undefined);
    expect(await store.runStage('testnet-verify', verifyRunner(emptyChain()))).toBe('failed');
    expect(store.getState().stages['testnet-verify'].error).toMatch(/no confirmed deployments/);
  });
});

describe('stage 10 — sponsored-claim canary', () => {
  it('skips with a recorded reason when no relayer is configured', async () => {
    const store = makeStore();
    // Reach the stage through the gate.
    await prepare(store);
    const chain = emptyChain();
    autoConfirm(store, 2);
    await store.runStage(
      'testnet-deploy',
      runDeployment(services({ chain }), { stage: 'testnet-deploy', requiredNetwork: 'testnet' })
    );
    for (const deployable of store.getState().deployables) {
      chain.sources.set(deployable.contractId, deployable.source);
    }
    await store.runStage(
      'testnet-verify',
      runOnChainVerification(services({ chain }), {
        stage: 'testnet-verify',
        deployStage: 'testnet-deploy',
        requiredNetwork: 'testnet'
      })
    );
    await store.runStage('collection-canary', async () => undefined);
    await store.runStage('inscription-canary', async () => undefined);
    await store.runStage('drop-canary', async () => undefined);

    const status = await store.runStage(
      'sponsored-claim-canary',
      runSponsoredClaimCanary(services({ chain }))
    );
    expect(status).toBe('skipped');
    expect(store.getState().stages['sponsored-claim-canary'].skipReason).toMatch(
      /VITE_XTRATA_RELAYER_URL/
    );
    // A skip settles the gate: stage 11 becomes reachable.
    expect(store.canStart('review')).toBe(true);
  });
});
