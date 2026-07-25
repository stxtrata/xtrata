/**
 * Attestation parity: the relayer's digest must be byte-identical to the one
 * the Clarity contract recomputes. The reference construction below is copied
 * from rebuild/contracts/tests/xtrata-drops-v3.test.ts (node:crypto sha256 over
 * serializeCV of the tuple) and from the client's drops/attestation.ts (Cl.*
 * builders); all three must agree or claim-signed breaks on chain.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  Cl,
  contractPrincipalCV,
  getAddressFromPrivateKey,
  hash160,
  principalCV,
  privateKeyToPublic,
  serializeCV,
  signMessageHashRsv,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import {
  attestationDigest,
  attestorPubkeyHash,
  signAttestation,
  verifyAttestation,
  type AttestationParams
} from '../src/attest.js';
import { createRouter } from '../src/http.js';
import { InMemoryJobStore } from '../src/jobs.js';
import { InMemoryNonceAuthority } from '../src/nonce.js';
import { SponsorRelayer } from '../src/sponsor.js';
import type { RelayerConfig } from '../src/types.js';
import {
  ATTESTOR_KEY,
  COLLECTION_ID,
  DEPLOYER,
  DROPS_ID,
  FakeChain,
  SPONSOR_KEY,
  claimerKey,
  makeDrop,
  testConfig
} from './helpers.js';
import type { FakeDrop } from './helpers.js';

const SIMNET_CHAIN_ID = 2_147_483_648n;
const CLAIMER = getAddressFromPrivateKey(claimerKey(0), 'mainnet');
const OTHER_CLAIMER = getAddressFromPrivateKey(claimerKey(1), 'mainnet');
const WRONG_KEY = SPONSOR_KEY;

const params = (overrides: Partial<AttestationParams> = {}): AttestationParams => ({
  chainId: SIMNET_CHAIN_ID,
  claimer: CLAIMER,
  collectionId: COLLECTION_ID,
  dropsContractId: DROPS_ID,
  dropId: 7n,
  expiresAt: 900n,
  ...overrides
});

/** Byte-for-byte reproduction of the contract test's signing helper. */
const contractTestDigest = (p: AttestationParams): string => {
  const payload = tupleCV({
    'chain-id': uintCV(p.chainId),
    claimer: principalCV(p.claimer),
    collection: contractPrincipalCV(DEPLOYER, p.collectionId.split('.')[1]!),
    contract: contractPrincipalCV(DEPLOYER, p.dropsContractId.split('.')[1]!),
    'drop-id': uintCV(p.dropId),
    'expires-at': uintCV(p.expiresAt)
  });
  const serialized = serializeCV(payload) as string;
  return createHash('sha256')
    .update(Buffer.from(serialized.replace(/^0x/i, ''), 'hex'))
    .digest('hex');
};

/** The client module's construction (Cl.* builders over the same tuple). */
const clientDigest = (p: AttestationParams): string => {
  const payload = Cl.tuple({
    'chain-id': Cl.uint(p.chainId),
    claimer: Cl.principal(p.claimer),
    collection: Cl.principal(p.collectionId),
    contract: Cl.principal(p.dropsContractId),
    'drop-id': Cl.uint(p.dropId),
    'expires-at': Cl.uint(p.expiresAt)
  });
  return createHash('sha256')
    .update(Buffer.from((serializeCV(payload) as string).replace(/^0x/i, ''), 'hex'))
    .digest('hex');
};

describe('attestation digest: byte parity with the contract', () => {
  it('matches the contract test and the client module byte-for-byte', () => {
    const p = params();
    const digest = attestationDigest(p);
    expect(digest).toHaveLength(64);
    expect(digest).toBe(contractTestDigest(p));
    expect(digest).toBe(clientDigest(p));
  });

  it('binds every field: any change moves the digest', () => {
    const base = attestationDigest(params());
    const variants: Array<[string, Partial<AttestationParams>]> = [
      ['drop-id', { dropId: 8n }],
      ['claimer', { claimer: OTHER_CLAIMER }],
      ['contract', { dropsContractId: `${DEPLOYER}.xtrata-drops-v3-other` }],
      ['collection', { collectionId: `${DEPLOYER}.xtrata-collection-v3-other` }],
      ['chain-id', { chainId: 1n }],
      ['expires-at', { expiresAt: 901n }]
    ];
    const digests = new Set([base]);
    for (const [label, override] of variants) {
      const d = attestationDigest(params(override));
      expect(d, `${label} must change the digest`).not.toBe(base);
      expect(d).toBe(contractTestDigest(params(override)));
      digests.add(d);
    }
    expect(digests.size).toBe(variants.length + 1);
  });

  it('is stable across calls (no nondeterminism in serialization)', () => {
    expect(attestationDigest(params())).toBe(attestationDigest(params()));
  });
});

describe('attestation signing', () => {
  it('signs and verifies a round trip against the attestor pubkey hash', () => {
    const p = params();
    const signature = signAttestation(p, ATTESTOR_KEY);
    expect(signature).toHaveLength(130); // 65 bytes RSV
    expect(verifyAttestation(p, signature, attestorPubkeyHash(ATTESTOR_KEY))).toBe(true);
  });

  it('attestorPubkeyHash equals the value the contract is configured with', () => {
    // set-attestor-pubkey-hash takes (buff 20) = hash160(compressed pubkey).
    const pub = privateKeyToPublic(ATTESTOR_KEY);
    const pubBytes = typeof pub === 'string' ? Uint8Array.from(Buffer.from(pub, 'hex')) : pub;
    const onChain = Buffer.from(hash160(pubBytes)).toString('hex');
    expect(attestorPubkeyHash(ATTESTOR_KEY)).toBe(onChain);
    expect(attestorPubkeyHash(ATTESTOR_KEY)).toHaveLength(40);
    expect(attestorPubkeyHash(WRONG_KEY)).not.toBe(onChain);
  });

  it('rejects a signature from the wrong attestor key', () => {
    const p = params();
    const signature = signAttestation(p, WRONG_KEY);
    expect(verifyAttestation(p, signature, attestorPubkeyHash(ATTESTOR_KEY))).toBe(false);
  });

  it('rejects every tampered field (drop, claimer, contract, chain, expiry)', () => {
    const p = params();
    const signature = signAttestation(p, ATTESTOR_KEY);
    const hash = attestorPubkeyHash(ATTESTOR_KEY);
    const tampered: Array<Partial<AttestationParams>> = [
      { dropId: 8n },
      { claimer: OTHER_CLAIMER },
      { dropsContractId: `${DEPLOYER}.xtrata-drops-v3-other` },
      { collectionId: `${DEPLOYER}.xtrata-collection-v3-other` },
      { chainId: 1n },
      { expiresAt: 901n } // an attestation cannot be extended past its expiry
    ];
    for (const override of tampered) {
      expect(verifyAttestation(params(override), signature, hash)).toBe(false);
    }
  });

  it('rejects malformed signatures without throwing', () => {
    const p = params();
    const hash = attestorPubkeyHash(ATTESTOR_KEY);
    expect(verifyAttestation(p, '', hash)).toBe(false);
    expect(verifyAttestation(p, 'zz'.repeat(65), hash)).toBe(false);
    expect(verifyAttestation(p, 'ab'.repeat(64), hash)).toBe(false);
  });

  it('a signature is worthless for a different claimer even with the same drop', () => {
    const forAlice = signAttestation(params({ claimer: CLAIMER }), ATTESTOR_KEY);
    expect(
      verifyAttestation(params({ claimer: OTHER_CLAIMER }), forAlice, attestorPubkeyHash(ATTESTOR_KEY))
    ).toBe(false);
  });

  it('signMessageHashRsv over the shared digest reproduces signAttestation', () => {
    const p = params();
    expect(signAttestation(p, ATTESTOR_KEY)).toBe(
      signMessageHashRsv({ messageHash: contractTestDigest(p), privateKey: ATTESTOR_KEY })
    );
  });
});

// ---------------------------------------------------------------- endpoint policy

const attestHarness = (
  overrides: Partial<RelayerConfig> = {},
  drops: Record<string, Partial<FakeDrop>> = { '1': { eligibility: 3n } }
) => {
  const cfg = testConfig(overrides);
  const chain = new FakeChain();
  for (const [id, drop] of Object.entries(drops)) chain.drops.set(id, makeDrop(drop));
  const jobs = new InMemoryJobStore();
  const relayer = new SponsorRelayer(
    cfg,
    chain,
    new InMemoryNonceAuthority(chain, getAddressFromPrivateKey(SPONSOR_KEY, 'mainnet')),
    jobs
  );
  return { cfg, chain, router: createRouter(relayer, cfg, chain) };
};

const attest = (
  router: ReturnType<typeof createRouter>,
  body: Record<string, unknown>
) => router({ method: 'POST', path: '/sponsor/v3/attest', body });

describe('POST /sponsor/v3/attest policy', () => {
  it('issues an attestation for an active signed-eligibility drop', async () => {
    const h = attestHarness();
    h.chain.tip = 500n;
    const res = await attest(h.router, { dropId: '1', claimer: CLAIMER });
    expect(res.status).toBe(200);
    const body = res.body as { ok: boolean; expiresAt: string; signature: string; claimer: string };
    expect(body.ok).toBe(true);
    expect(body.claimer).toBe(CLAIMER);
    expect(body.expiresAt).toBe(String(500n + h.cfg.attestationTtlBlocks));
    expect(
      verifyAttestation(
        {
          chainId: h.cfg.chainId,
          claimer: CLAIMER,
          collectionId: COLLECTION_ID,
          dropsContractId: DROPS_ID,
          dropId: 1n,
          expiresAt: BigInt(body.expiresAt)
        },
        body.signature,
        attestorPubkeyHash(ATTESTOR_KEY)
      )
    ).toBe(true);
  });

  it('refuses when no attestor key is configured', async () => {
    const h = attestHarness({ attestorKey: undefined });
    const res = await attest(h.router, { dropId: '1', claimer: CLAIMER });
    expect(res).toMatchObject({ status: 503, body: { ok: false, code: 'ATTESTOR_NOT_CONFIGURED' } });
  });

  it('rejects malformed dropId and claimer inputs', async () => {
    const h = attestHarness();
    for (const body of [
      {},
      { dropId: '1' },
      { claimer: CLAIMER },
      { dropId: '-1', claimer: CLAIMER },
      { dropId: '1.5', claimer: CLAIMER },
      { dropId: '1', claimer: 'not-a-principal' },
      { dropId: '1', claimer: `${CLAIMER}.contract` },
      { dropId: '1', claimer: 42 }
    ]) {
      expect(await attest(h.router, body), JSON.stringify(body)).toMatchObject({
        status: 400,
        body: { ok: false, code: 'BAD_REQUEST' }
      });
    }
  });

  it('refuses a testnet principal on a mainnet relayer (threat 13)', async () => {
    const h = attestHarness();
    const res = await attest(h.router, { dropId: '1', claimer: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' });
    expect(res).toMatchObject({ status: 400, body: { code: 'WRONG_NETWORK' } });
  });

  it('refuses unknown drops, non-signed eligibility and inactive drops', async () => {
    const h = attestHarness({}, { '1': { eligibility: 3n }, '2': { eligibility: 1n }, '3': { eligibility: 3n, status: 3n } });
    expect(await attest(h.router, { dropId: '9', claimer: CLAIMER })).toMatchObject({
      status: 404,
      body: { code: 'DROP_NOT_FOUND' }
    });
    expect(await attest(h.router, { dropId: '2', claimer: CLAIMER })).toMatchObject({
      status: 400,
      body: { code: 'WRONG_ELIGIBILITY' }
    });
    expect(await attest(h.router, { dropId: '3', claimer: CLAIMER })).toMatchObject({
      status: 400,
      body: { code: 'DROP_NOT_ACTIVE' }
    });
  });

  it('issues a fresh expiry as the tip advances (no reusable long-lived grant)', async () => {
    const h = attestHarness();
    h.chain.tip = 1_000n;
    const first = (await attest(h.router, { dropId: '1', claimer: CLAIMER })).body as { expiresAt: string; signature: string };
    h.chain.tip = 1_050n;
    const second = (await attest(h.router, { dropId: '1', claimer: CLAIMER })).body as { expiresAt: string; signature: string };
    expect(BigInt(second.expiresAt) - BigInt(first.expiresAt)).toBe(50n);
    expect(second.signature).not.toBe(first.signature);
  });
});
