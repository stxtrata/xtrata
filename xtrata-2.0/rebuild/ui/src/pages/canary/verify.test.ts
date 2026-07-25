import { describe, expect, it } from 'vitest';
import { sourceHash } from '../studio/template';
import {
  detectNameConflict,
  extractContractReferences,
  guardStageNetwork,
  parseInterfaceResponse,
  parseLocalInterface,
  probeInterface,
  stripClarityComments,
  verifyDependencies,
  verifyDeployedSource,
  type ContractFunction
} from './verify';

/**
 * The failure modes the test plan names explicitly — bad dependency address,
 * name conflict, source mismatch — plus the network guard, all exercised
 * without a chain.
 */

const SOURCE = `
;; a small contract
(define-constant ALLOWED-XTRATA-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)

(define-public (reserve (hash (buff 32)) (item-uri (optional (string-ascii 256))))
  (ok true)
)

(define-public (finalize)
  (ok true)
)

(define-read-only (get-item (index uint))
  (ok index)
)

(define-private (helper (x uint))
  x
)
`;

describe('parseLocalInterface', () => {
  it('reads public and read-only functions with their arity, skipping private ones', () => {
    expect(parseLocalInterface(SOURCE)).toEqual([
      { name: 'reserve', access: 'public', arity: 2 },
      { name: 'finalize', access: 'public', arity: 0 },
      { name: 'get-item', access: 'read_only', arity: 1 }
    ]);
  });

  it('counts nested argument types as one argument each', () => {
    const nested = `(define-public (escrow-batch (drop-id uint) (entries (list 25 { index: uint, token-id: uint }))) (ok true))`;
    expect(parseLocalInterface(nested)).toEqual([
      { name: 'escrow-batch', access: 'public', arity: 2 }
    ]);
  });
});

describe('parseInterfaceResponse', () => {
  it('normalizes the API shape and drops private functions', () => {
    expect(
      parseInterfaceResponse({
        functions: [
          { name: 'reserve', access: 'public', args: [{}, {}] },
          { name: 'get-item', access: 'read_only', args: [{}] },
          { name: 'helper', access: 'private', args: [{}] }
        ]
      })
    ).toEqual([
      { name: 'reserve', access: 'public', arity: 2 },
      { name: 'get-item', access: 'read_only', arity: 1 }
    ]);
  });
});

describe('probeInterface', () => {
  const onChain: ContractFunction[] = [
    { name: 'reserve', access: 'public', arity: 2 },
    { name: 'finalize', access: 'public', arity: 0 },
    { name: 'get-item', access: 'read_only', arity: 1 }
  ];

  it('passes when the deployed surface matches the local source', () => {
    const probe = probeInterface({ localSource: SOURCE, onChain });
    expect(probe.ok).toBe(true);
    expect(probe.localCount).toBe(3);
    expect(probe.onChainCount).toBe(3);
  });

  it('detects a function missing on chain', () => {
    const probe = probeInterface({
      localSource: SOURCE,
      onChain: onChain.filter((fn) => fn.name !== 'finalize')
    });
    expect(probe.ok).toBe(false);
    expect(probe.missing.map((fn) => fn.name)).toEqual(['finalize']);
  });

  it('detects a renamed function as both missing and unexpected', () => {
    const probe = probeInterface({
      localSource: SOURCE,
      onChain: onChain.map((fn) => (fn.name === 'finalize' ? { ...fn, name: 'freeze' } : fn))
    });
    expect(probe.ok).toBe(false);
    expect(probe.missing.map((fn) => fn.name)).toEqual(['finalize']);
    expect(probe.unexpected.map((fn) => fn.name)).toEqual(['freeze']);
  });

  it('detects an arity change on a same-named function', () => {
    const probe = probeInterface({
      localSource: SOURCE,
      onChain: onChain.map((fn) => (fn.name === 'reserve' ? { ...fn, arity: 1 } : fn))
    });
    expect(probe.ok).toBe(false);
    expect(probe.mismatched).toHaveLength(1);
    expect(probe.mismatched[0]!.name).toBe('reserve');
    expect(probe.mismatched[0]!.onChain.arity).toBe(1);
  });

  it('detects an access change (public demoted to read-only)', () => {
    const probe = probeInterface({
      localSource: SOURCE,
      onChain: onChain.map((fn) => (fn.name === 'finalize' ? { ...fn, access: 'read_only' as const } : fn))
    });
    expect(probe.ok).toBe(false);
    expect(probe.mismatched.map((entry) => entry.name)).toEqual(['finalize']);
  });
});

describe('source parity', () => {
  it('reports an exact match and the hash both sides agree on', () => {
    const verification = verifyDeployedSource({ expected: SOURCE, actual: SOURCE });
    expect(verification.match).toBe('exact');
    expect(verification.expectedHash).toBe(sourceHash(SOURCE));
    expect(verification.actualHash).toBe(verification.expectedHash);
  });

  it('reports a whitespace difference as normalized, not as a mismatch', () => {
    const verification = verifyDeployedSource({
      expected: SOURCE,
      actual: SOURCE.replace(/\n/g, '\r\n')
    });
    expect(verification.match).toBe('normalized');
    expect(verification.actualHash).not.toBe(verification.expectedHash);
  });

  it('detects a real mismatch and names both hashes', () => {
    const tampered = SOURCE.replace('xtrata-v3-2-3', 'xtrata-v3-2-2');
    const verification = verifyDeployedSource({ expected: SOURCE, actual: tampered });
    expect(verification.match).toBe('none');
    expect(verification.expectedHash).toBe(sourceHash(SOURCE));
    expect(verification.actualHash).toBe(sourceHash(tampered));
  });
});

describe('dependency principals', () => {
  const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

  it('passes when exactly the intended dependency is referenced', () => {
    const check = verifyDependencies({ source: SOURCE, expected: [CORE] });
    expect(check.ok).toBe(true);
    expect(check.found).toEqual([CORE]);
  });

  it('flags a wrong core principal as unexpected AND the intended one as missing', () => {
    const wrong = SOURCE.replace(
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
    );
    const check = verifyDependencies({ source: wrong, expected: [CORE] });
    expect(check.ok).toBe(false);
    expect(check.missing).toEqual([CORE]);
    expect(check.unexpected).toEqual(['SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.xtrata-v3-2-3']);
  });

  it('resolves the `.name` sugar against the deployer, so a simnet leftover is caught', () => {
    const leftover = `${SOURCE}\n(contract-call? .mock-xtrata-core transfer u1)\n`;
    const check = verifyDependencies({
      source: leftover,
      expected: [CORE],
      deployerAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
    });
    expect(check.ok).toBe(false);
    expect(check.unexpected).toContain(
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.mock-xtrata-core'
    );
  });

  it('does not count a self-reference as a dependency', () => {
    const selfRef = `${SOURCE}\n(contract-call? .my-collection ping)\n`;
    const check = verifyDependencies({
      source: selfRef,
      expected: [CORE],
      deployerAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      selfContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.my-collection'
    });
    expect(check.ok).toBe(true);
  });

  it('extracts every fully-qualified reference once', () => {
    expect(extractContractReferences(`${SOURCE}\n'${CORE}\n`)).toEqual([CORE]);
  });

  it('ignores principals that only appear in comments', () => {
    // Both contracts ship a commented-out mainnet variant of their core
    // constant; counting it would report a mainnet principal inside every
    // testnet deployment.
    const commented = `
;; Mainnet: (define-constant ALLOWED-NFT-CONTRACT 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)
(define-constant ALLOWED-NFT-CONTRACT 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3)
`;
    expect(extractContractReferences(commented)).toEqual([
      'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3'
    ]);
  });

  it('does not treat a semicolon inside a string literal as a comment', () => {
    const withString = `(define-data-var base-uri (string-ascii 256) "https://x/?a=1;b=2")\n(contract-call? '${CORE} ping)`;
    expect(extractContractReferences(withString)).toEqual([CORE]);
  });
});

describe('stripClarityComments', () => {
  it('removes comment text but keeps line structure', () => {
    expect(stripClarityComments('(ok true) ;; a comment\n(ok false)')).toBe(
      '(ok true) \n(ok false)'
    );
  });

  it('never strips inside a string, including escaped quotes', () => {
    const source = '(var-set uri "a \\" ;; not a comment") ;; real comment';
    expect(stripClarityComments(source)).toBe('(var-set uri "a \\" ;; not a comment") \n');
  });

  it('hides a commented-out definition from the interface parser', () => {
    expect(parseLocalInterface(';; (define-public (ghost) (ok true))\n(define-public (real) (ok true))')).toEqual(
      [{ name: 'real', access: 'public', arity: 0 }]
    );
  });
});

describe('name-conflict detection', () => {
  const contractId = 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3';

  it('reports a free name as available', () => {
    const conflict = detectNameConflict({ contractId, existingSource: null, intendedSource: SOURCE });
    expect(conflict.status).toBe('available');
    expect(conflict.identical).toBeUndefined();
  });

  it('reports an occupied name with different source as a hard conflict', () => {
    const conflict = detectNameConflict({
      contractId,
      existingSource: SOURCE.replace('finalize', 'freeze'),
      intendedSource: SOURCE
    });
    expect(conflict.status).toBe('occupied');
    expect(conflict.identical).toBe(false);
    expect(conflict.detail).toMatch(/cannot be overwritten/);
  });

  it('recognises an identical redeploy so a resumed run is not blocked', () => {
    const conflict = detectNameConflict({
      contractId,
      existingSource: SOURCE,
      intendedSource: SOURCE
    });
    expect(conflict.status).toBe('occupied');
    expect(conflict.identical).toBe(true);
    expect(conflict.detail).toMatch(/nothing to deploy/);
  });
});

describe('network guard', () => {
  it('lets a testnet stage run on a testnet session and build', () => {
    expect(
      guardStageNetwork({ requiredNetwork: 'testnet', walletNetwork: 'testnet', appNetwork: 'testnet' })
    ).toEqual({ ok: true });
  });

  it('refuses a mainnet stage while a testnet account is connected', () => {
    const result = guardStageNetwork({
      requiredNetwork: 'mainnet',
      walletNetwork: 'testnet',
      appNetwork: 'mainnet'
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/requires a mainnet account/);
  });

  it('refuses a testnet stage while a mainnet account is connected', () => {
    const result = guardStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: 'mainnet',
      appNetwork: 'testnet'
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/requires a testnet account/);
  });

  it('refuses when the build targets another network than the stage', () => {
    const result = guardStageNetwork({
      requiredNetwork: 'mainnet',
      walletNetwork: 'mainnet',
      appNetwork: 'testnet'
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/requires a mainnet build/);
  });

  it('refuses when nothing is connected', () => {
    const result = guardStageNetwork({
      requiredNetwork: 'testnet',
      walletNetwork: null,
      appNetwork: 'testnet'
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/no wallet/);
  });
});
