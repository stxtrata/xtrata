import { describe, expect, it } from 'vitest';
import livingGatewaySource from '../../../../contracts/live/xtrata-v3-2-3-gateway.clar?raw';
import livingRegistrySource from '../../../../contracts/live/proof-of-free-living-synth-v1.clar?raw';
import {
  deriveLivingSynthGates,
  inspectLivingSynthGatewaySource,
  inspectLivingSynthRegistrySource,
  parseInscriptionMime,
  parseLivingSynthEdition,
  parseLivingSynthMosaicPage,
  parseLivingSynthSystemState,
  validateLivingSynthEditionManifest
} from '../living-synth';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const GATEWAY = `${DEPLOYER}.xtrata-v3-2-3-gateway`;

const cv = (type: string, value: unknown) => ({ type, value });
const systemCv = ({
  core = GATEWAY,
  engine = '77',
  paused = true,
  count = '2'
}: { core?: string | null; engine?: string | null; paused?: boolean; count?: string } = {}) =>
  cv('(tuple ...)', {
    'core-contract': cv('(optional principal)', core ? cv('principal', core) : null),
    'engine-id': cv('(optional uint)', engine ? cv('uint', engine) : null),
    paused: cv('bool', paused),
    'registered-editions': cv('uint', count),
    'global-revision': cv('uint', '4')
  });

describe('Living Synth deploy gates', () => {
  it('accepts the exact bundled production contract sources', () => {
    expect(inspectLivingSynthGatewaySource(livingGatewaySource, DEPLOYER)).toEqual([]);
    expect(inspectLivingSynthRegistrySource(livingRegistrySource)).toEqual([]);
  });

  it('checks the gateway and registry invariants used before signing', () => {
    const gateway = `(define-constant XTRATA-CORE\n  '${DEPLOYER}.xtrata-v3-2-3\n)\n(define-read-only (get-owner (id uint)) id)\n(define-read-only (get-parents (id uint)) id)\n(define-read-only (get-inscription-meta (id uint)) id)`;
    expect(inspectLivingSynthGatewaySource(gateway, DEPLOYER)).toEqual([]);
    expect(inspectLivingSynthGatewaySource(gateway.replace('xtrata-v3-2-3', 'mock-core'), DEPLOYER))
      .toContain(`XTRATA-CORE must target '${DEPLOYER}.xtrata-v3-2-3'`);

    const functions = [
      'lock-core-contract', 'set-engine', 'register-edition', 'register-recording',
      'select-recording', 'select-seed', 'get-system-state', 'get-mosaic-page'
    ].map((name) => `(${name}`).join('\n');
    const registry = `(define-constant MAX-EDITIONS u1024)\n(define-constant RECORDING-MIME "application/json")\n${functions}`;
    expect(inspectLivingSynthRegistrySource(registry)).toEqual([]);
    expect(inspectLivingSynthRegistrySource(registry.replace('u1024', 'u1000')))
      .toContain('MAX-EDITIONS must be locked to u1024');
  });

  it('parses authoritative system state and engine MIME values', () => {
    expect(parseLivingSynthSystemState(systemCv())).toEqual({
      coreContract: GATEWAY,
      engineId: 77n,
      paused: true,
      registeredEditions: 2n,
      globalRevision: 4n
    });
    expect(parseLivingSynthSystemState(cv('bool', true))).toBeNull();
    expect(parseInscriptionMime(cv('(optional tuple)', cv('(tuple ...)', {
      'mime-type': cv('(string-ascii 64)', 'application/javascript')
    })))).toBe('application/javascript');
    expect(parseLivingSynthMosaicPage(cv('(response (list ...))', cv('(list ...)', [
      cv('(tuple ...)', {
        edition: cv('uint', '1'),
        'nft-id': cv('(optional uint)', cv('uint', '101'))
      }),
      cv('(tuple ...)', {
        edition: cv('uint', '2'),
        'nft-id': cv('(optional uint)', null)
      })
    ])))).toEqual([{ edition: 1, nftId: 101 }, { edition: 2, nftId: null }]);
    expect(parseLivingSynthEdition(cv('(optional tuple)', cv('(tuple ...)', {
      edition: cv('uint', '7'),
      'nft-id': cv('(optional uint)', cv('uint', '707'))
    })))).toEqual({ edition: 7, nftId: 707 });
  });

  it('validates mapping manifests and rejects duplicate editions or NFT ids', () => {
    expect(validateLivingSynthEditionManifest(JSON.stringify({ editions: [
      { edition: 2, nftId: 102 }, { edition: 1, 'nft-id': 101 }
    ] }))).toEqual({
      ok: true,
      entries: [{ edition: 1, nftId: 101 }, { edition: 2, nftId: 102 }]
    });
    const duplicate = validateLivingSynthEditionManifest(JSON.stringify([
      { edition: 1, nftId: 101 }, { edition: 1, nftId: 101 }
    ]));
    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.problems).toContain('Edition 1 appears more than once.');
      expect(duplicate.problems).toContain('NFT 101 appears more than once.');
    }
  });

  it('fails closed until each tested prerequisite is satisfied', () => {
    const base = {
      gatewaySourceReady: true,
      gatewayDeployed: true,
      registrySourceReady: true,
      registryDeployed: true,
      systemState: parseLivingSynthSystemState(systemCv({ count: '1024' })),
      expectedGatewayId: GATEWAY,
      engineValidated: true,
      manifestEntries: 1024,
      mosaicAuditPassed: true
    };
    expect(deriveLivingSynthGates(base).goLive).toBe(true);
    expect(deriveLivingSynthGates({ ...base, mosaicAuditPassed: false }).goLive).toBe(false);
    expect(deriveLivingSynthGates({ ...base, systemState: parseLivingSynthSystemState(systemCv({ core: null })) }).setEngine).toBe(false);
    expect(deriveLivingSynthGates({ ...base, manifestEntries: 1023 }).auditMosaic).toBe(false);
  });
});
