import { describe, expect, it } from 'vitest';
import livingGatewaySource from '../../../../contracts/live/xtrata-v3-2-3-gateway.clar?raw';
import livingRegistrySource from '../../../../contracts/live/proof-of-free-living-synth-v1.clar?raw';
import {
  deriveLivingSynthGates,
  inspectLivingSynthGatewaySource,
  inspectLivingSynthRegistrySource,
  parseRecordingFeeStx,
  parseInscriptionMime,
  parseLivingSynthInscriptionMeta,
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
  count = '2',
  fee = '100000',
  recipient = DEPLOYER,
  engineHash = '11'.repeat(32)
}: { core?: string | null; engine?: string | null; paused?: boolean; count?: string; fee?: string; recipient?: string; engineHash?: string | null } = {}) =>
  cv('(tuple ...)', {
    'core-contract': cv('(optional principal)', core ? cv('principal', core) : null),
    'engine-id': cv('(optional uint)', engine ? cv('uint', engine) : null),
    'engine-hash': cv('(optional (buff 32))', engineHash ? cv('(buff 32)', `0x${engineHash}`) : null),
    'contract-owner': cv('principal', DEPLOYER),
    'pending-owner': cv('(optional principal)', null),
    paused: cv('bool', paused),
    'registered-editions': cv('uint', count),
    'global-revision': cv('uint', '4'),
    'recording-fee': cv('uint', fee),
    'fee-recipient': cv('principal', recipient)
  });

describe('Living Synth deploy gates', () => {
  it('accepts the exact bundled production contract sources', () => {
    expect(inspectLivingSynthGatewaySource(livingGatewaySource, DEPLOYER)).toEqual([]);
    expect(inspectLivingSynthRegistrySource(livingRegistrySource)).toEqual([]);
  });

  it('checks the gateway and registry invariants used before signing', () => {
    const gateway = `(define-constant XTRATA-CORE\n  '${DEPLOYER}.xtrata-v3-2-3\n)\n(define-read-only (get-owner (id uint)) (contract-call? '${DEPLOYER}.xtrata-v3-2-3 get-owner id))\n(define-read-only (get-parents (id uint)) (contract-call? '${DEPLOYER}.xtrata-v3-2-3 get-parents id))\n(define-read-only (get-inscription-meta (id uint)) (contract-call? '${DEPLOYER}.xtrata-v3-2-3 get-inscription-meta id))`;
    expect(inspectLivingSynthGatewaySource(gateway, DEPLOYER)).toEqual([]);
    expect(inspectLivingSynthGatewaySource(gateway.replace('xtrata-v3-2-3', 'mock-core'), DEPLOYER))
      .toContain(`XTRATA-CORE must target '${DEPLOYER}.xtrata-v3-2-3'`);

    const functions = [
      'lock-core-contract', 'set-engine', 'register-edition', 'register-edition-batch', 'register-recording',
      'initiate-contract-ownership-transfer', 'cancel-contract-ownership-transfer', 'accept-contract-ownership',
      'set-recording-fee', 'set-fee-recipient', 'get-system-state',
      'get-recording-fee', 'get-fee-recipient', 'get-recording-count',
      'get-recording-id', 'get-mosaic-page'
    ].map((name) => `(${name}`).join('\n');
    const fees = `(define-constant MIN-RECORDING-FEE u1000)\n(define-constant MAX-RECORDING-FEE u1000000)\n(define-constant DEFAULT-RECORDING-FEE u100000)`;
    const limits = `(define-constant ENGINE-MIME "text/javascript")\n(define-constant MAX-RECORDING-BYTES u262144)\n(define-constant MAX-ENGINE-BYTES u131072)\n(define-constant MAX-EDITION-BATCH u25)`;
    const registry = `(define-constant MAX-EDITIONS u1024)\n(define-constant RECORDING-MIME "application/json")\n${limits}\n${fees}\n(define-data-var engine-hash (optional (buff 32)) none)\n${functions}\n(define-public (register-recording (core principal) (nft-id uint) (recording-id uint) (expected-fee uint)) (ok true))`;
    expect(inspectLivingSynthRegistrySource(registry)).toEqual([]);
    expect(inspectLivingSynthRegistrySource(registry.replace('u1024', 'u1000')))
      .toContain('MAX-EDITIONS must be locked to u1024');
  });

  it('parses authoritative system state and engine MIME values', () => {
    expect(parseLivingSynthSystemState(systemCv())).toEqual({
      coreContract: GATEWAY,
      engineId: 77n,
      engineHash: '11'.repeat(32),
      contractOwner: DEPLOYER,
      pendingOwner: null,
      paused: true,
      registeredEditions: 2n,
      globalRevision: 4n,
      recordingFee: 100000n,
      feeRecipient: DEPLOYER
    });
    expect(parseLivingSynthSystemState(cv('bool', true))).toBeNull();
    expect(parseInscriptionMime(cv('(optional tuple)', cv('(tuple ...)', {
      'mime-type': cv('(string-ascii 64)', 'application/javascript')
    })))).toBe('application/javascript');
    expect(parseLivingSynthInscriptionMeta(cv('(optional tuple)', cv('(tuple ...)', {
      'mime-type': cv('(string-ascii 64)', 'text/javascript'),
      'total-size': cv('uint', '20667'),
      sealed: cv('bool', true),
      'final-hash': cv('(buff 32)', `0x${'22'.repeat(32)}`)
    })))).toEqual({
      mimeType: 'text/javascript',
      totalSize: 20667n,
      sealed: true,
      finalHash: '22'.repeat(32)
    });
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

  it('parses exact STX fee amounts and enforces the contract range', () => {
    expect(parseRecordingFeeStx('0.001')).toEqual({ ok: true, microStx: 1000n });
    expect(parseRecordingFeeStx('0.1')).toEqual({ ok: true, microStx: 100000n });
    expect(parseRecordingFeeStx('1')).toEqual({ ok: true, microStx: 1000000n });
    expect(parseRecordingFeeStx('0.000999')).toEqual({ ok: false, error: 'Fee must be between 0.001 and 1 STX.' });
    expect(parseRecordingFeeStx('1.000001')).toEqual({ ok: false, error: 'Fee must be between 0.001 and 1 STX.' });
    expect(parseRecordingFeeStx('0.1000001').ok).toBe(false);
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
    expect(deriveLivingSynthGates({ ...base, systemState: parseLivingSynthSystemState(systemCv({ fee: '999' })) }).goLive).toBe(false);
    expect(deriveLivingSynthGates({ ...base, systemState: parseLivingSynthSystemState(systemCv({ engineHash: null })) }).engineSet).toBe(false);
    expect(deriveLivingSynthGates({ ...base, systemState: parseLivingSynthSystemState(systemCv({ count: '2' })), manifestEntries: 2 }).auditMosaic).toBe(true);
  });
});
