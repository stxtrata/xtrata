import { describe, expect, it, vi } from 'vitest';
import { COLLECTION_CLARITY_VERSION, createDeployService } from '../../services/deploy';
import { sourceHash } from '../studio/template';
import {
  buildDeployables,
  buildDropsSource,
  DROPS_CLARITY_VERSION,
  DROPS_TEMPLATE_SOURCE,
  EXPECTED_DROPS_CORE_CALL_SITES,
  MOCK_CORE_REFERENCE,
  orderDeployables
} from './sources';
import type { CanaryDeployConfig } from './config';

/**
 * The bundled sources ship with `.mock-xtrata-core` in the core slot because
 * that is what the contract test-suite runs against. Everything here is about
 * the one substitution step between that and a real deployment — and about the
 * Clarity version each contract is pinned to, which a wallet must never choose.
 */

const CORE = 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3';
const DEPLOYER = 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT';

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

describe('bundled drops template', () => {
  it('ships with the simnet placeholder, exactly where the templater expects it', () => {
    expect(DROPS_TEMPLATE_SOURCE).toContain('(define-constant ALLOWED-NFT-CONTRACT .mock-xtrata-core)');
    expect(
      (DROPS_TEMPLATE_SOURCE.match(/\(contract-call\? \.mock-xtrata-core\b/g) ?? []).length
    ).toBe(EXPECTED_DROPS_CORE_CALL_SITES);
  });

  it('is Clarity 4 — it uses constructs that do not exist in Clarity 3', () => {
    expect(DROPS_CLARITY_VERSION).toBe(4);
    expect(DROPS_TEMPLATE_SOURCE).toContain('current-contract');
    expect(DROPS_TEMPLATE_SOURCE).toContain('as-contract?');
  });
});

describe('buildDropsSource', () => {
  it('substitutes the constant and every direct call site, leaving no placeholder', () => {
    const result = buildDropsSource({ coreContractId: CORE });
    expect(result.errors).toEqual([]);
    expect(result.source).toContain(`(define-constant ALLOWED-NFT-CONTRACT '${CORE})`);
    expect(result.source).toContain(`(contract-call? '${CORE} transfer`);
    expect(result.source).not.toContain(MOCK_CORE_REFERENCE);
  });

  it('reports how many sites each marker rewrote', () => {
    const result = buildDropsSource({ coreContractId: CORE });
    expect(result.substitutions).toEqual([
      { marker: 'ALLOWED-NFT-CONTRACT', count: 1 },
      { marker: 'contract-call? <core>', count: EXPECTED_DROPS_CORE_CALL_SITES }
    ]);
  });

  it('errors rather than silently under-substituting when the marker moved', () => {
    const moved = DROPS_TEMPLATE_SOURCE.replace(
      '(define-constant ALLOWED-NFT-CONTRACT .mock-xtrata-core)',
      '(define-constant RENAMED-NFT-CONTRACT .mock-xtrata-core)'
    );
    const result = buildDropsSource({ coreContractId: CORE }, moved);
    expect(result.errors.join(' ')).toMatch(/Template marker missing/);
  });

  it('errors when a new core call site appears without the templater being updated', () => {
    const extra = DROPS_TEMPLATE_SOURCE.replace(
      '(define-constant ITER-25 (list',
      '(define-private (extra) (contract-call? .mock-xtrata-core ping))\n(define-constant ITER-25 (list'
    );
    const result = buildDropsSource({ coreContractId: CORE }, extra);
    expect(result.errors.join(' ')).toMatch(/Expected 2 direct core call sites .* found 3/);
  });

  it('rejects a core that is not a full contract id', () => {
    expect(buildDropsSource({ coreContractId: DEPLOYER }).errors.join(' ')).toMatch(
      /full contract id/
    );
  });
});

describe('buildDeployables', () => {
  it('produces both contracts, each pinned to its own Clarity version', () => {
    const { deployables, errors } = buildDeployables(config());
    expect(errors).toEqual([]);

    const drops = deployables.find((entry) => entry.id === 'drops')!;
    const collection = deployables.find((entry) => entry.id === 'collection')!;
    expect(drops.clarityVersion).toBe(4);
    expect(collection.clarityVersion).toBe(3);
    expect(collection.clarityVersion).toBe(COLLECTION_CLARITY_VERSION);
  });

  it('bakes the deployed drops principal into the collection as its drops authority', () => {
    const { deployables } = buildDeployables(config());
    const collection = deployables.find((entry) => entry.id === 'collection')!;
    expect(collection.source).toContain(
      `(define-data-var drops-authority (optional principal) (some '${DEPLOYER}.xtrata-drops-v3))`
    );
    expect(collection.dependencies).toEqual([CORE, `${DEPLOYER}.xtrata-drops-v3`]);
  });

  it('leaves no simnet placeholder in either source', () => {
    const { deployables } = buildDeployables(config());
    for (const deployable of deployables) {
      expect(deployable.source).not.toContain(MOCK_CORE_REFERENCE);
    }
  });

  it('hashes the exact bytes it will deploy', () => {
    const { deployables } = buildDeployables(config());
    for (const deployable of deployables) {
      expect(deployable.sourceHash).toBe(sourceHash(deployable.source));
      expect(deployable.sourceHash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it('orders deployment by dependency: the singleton before the template instance', () => {
    const { deployables } = buildDeployables(config());
    const ordered = orderDeployables([...deployables].reverse());
    expect(ordered.map((entry) => entry.id)).toEqual(['drops', 'collection']);
  });

  it('surfaces a bad core rather than emitting a half-substituted source', () => {
    const { deployables, errors } = buildDeployables(config({ coreContractId: 'not-a-contract' }));
    expect(deployables).toEqual([]);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('deploy descriptor', () => {
  const descriptorFor = async (params: {
    contractName: string;
    codeBody: string;
    clarityVersion?: number;
  }) => {
    const showContractDeploy = vi.fn((options: Record<string, unknown>) => {
      (options['onFinish'] as (payload: { txId: string }) => void)({ txId: 'abc' });
    });
    const deploy = createDeployService({
      showContractDeployImpl: showContractDeploy as never
    });
    await deploy({
      contractName: params.contractName,
      codeBody: params.codeBody,
      network: 'testnet',
      ...(params.clarityVersion !== undefined ? { clarityVersion: params.clarityVersion } : {})
    });
    return showContractDeploy.mock.calls[0]![0] as Record<string, unknown>;
  };

  it('pins Clarity 4 for the drops singleton and Clarity 3 for the collection', async () => {
    const { deployables } = buildDeployables(config());
    for (const deployable of deployables) {
      const descriptor = await descriptorFor({
        contractName: deployable.contractName,
        codeBody: deployable.source,
        clarityVersion: deployable.clarityVersion
      });
      expect(descriptor['clarityVersion']).toBe(deployable.id === 'drops' ? 4 : 3);
      expect(descriptor['contractName']).toBe(deployable.contractName);
      expect(descriptor['codeBody']).toBe(deployable.source);
    }
  });

  it('defaults to the collection version when a caller omits it, never to the wallet default', async () => {
    const descriptor = await descriptorFor({ contractName: 'c', codeBody: '(ok true)' });
    expect(descriptor['clarityVersion']).toBe(COLLECTION_CLARITY_VERSION);
  });
});
