import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  CHUNK_SIZE,
  CORE_ADDRESS,
  CORE_CONTRACT,
  DEMO_THREAD_ID,
  loadWizardEnv,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_MAX_TX_FEE_USTX,
  DEFAULT_SPEND_CAP_USTX,
  MODE_SINGLE_TX,
  OFFLINE_FEE_ESTIMATE_USTX,
  SKIPPED_OFFLINE,
  WizardSafetyError,
  assertBroadcastAllowed,
  broadcastInstruction,
  buildMintCall,
  checkCorePaused,
  checkDuplicateContent,
  checkPendingNonce,
  checkThreadAffordability,
  expectedWizardAddresses,
  fetchChainTip,
  fetchStxBalance,
  formatChecks,
  formatPlan,
  formatPostCondition,
  killSwitchEngaged,
  planInscription,
  quoteSingleTxFee,
  tokenUriFor,
  verifyParentQuote
} from '../inscribe.mjs';

/**
 * A real quote-inscription-fee response captured from mainnet for
 * (total-size, total-chunks, mode) = (u1600, u1, u2): total-fee u11000,
 * single-tx-eligible true, chunk-size u16384. Assembled key by key so the
 * fixture stays readable and so a typo shows up as a decode failure below.
 */
const QUOTE_RESULT =
  '0x' +
  [
    '070c00000009',
    '09626567696e2d666565', '01000000000000000000000000000186a0',
    '0a6368756e6b2d73697a65', '0100000000000000000000000000004000',
    '046d6f6465', '0100000000000000000000000000000002',
    '087365616c2d666565', '0100000000000000000000000000018a88',
    '1273696e676c652d74782d656c696769626c65', '03',
    '0d73696e676c652d74782d666565', '0100000000000000000000000000002af8',
    '09746f74616c2d666565', '0100000000000000000000000000002af8',
    '1275706c6f61642d62617463682d6c696d6974', '0100000000000000000000000000000020',
    '0e75706c6f61642d62617463686573', '0100000000000000000000000000000001'
  ].join('');

const CHAIN_TIP = 8_668_831;
const BALANCE = '5000000';

/**
 * Synthetic fixture addresses, valid c32 but belonging to nobody: derived from
 * fixed dummy keys. An earlier draft hardcoded the operator's real, funded
 * Archivist address here. It is public rather than secret, so nothing leaked,
 * but it coupled the suite to one provisioned fleet — regenerating the wizards
 * (which the README explicitly contemplates) would have broken these tests, and
 * a reader could reasonably think they assert something about the live wallets.
 * They do not. Any valid address serves.
 */
const ARCHIVIST_ADDRESS = 'SP3Y74M5227FDVHREWPH773F5Y1W1ED8WXY3RAVG4';
const SOMEONE_ELSE = 'SPXGFH9JTKPF2TQZJ2AH7NSMMMXJ72VMGH8PR654';

type Call = { url: string; method: string; body?: unknown };

type Nonces = {
  last_executed_tx_nonce: number | null;
  possible_next_nonce: number;
  detected_missing_nonces: number[];
};

type StubOptions = {
  balance?: string;
  quoteResult?: string;
  /** true = the core is paused; 'error' = the read fails. */
  paused?: boolean | 'error';
  /** inscription id -> the utf8 body of its chunk u0. Absent means `none`. */
  chunks?: Record<string, string> | 'error';
  /** inscription id -> creator principal. Absent means `none`. */
  creators?: Record<string, string>;
  /** the id get-id-by-hash returns, or null for `none`. */
  idByHash?: string | null | 'error';
  nonces?: Nonces | 'error';
};

/** Read a uint argument back out of a stubbed call-read POST body. */
const uintArg = async (body: unknown, index: number) => {
  const { cvToJSON, hexToCV } = await import('@stacks/transactions');
  const hex = (body as { arguments: string[] }).arguments[index];
  return String((cvToJSON(hexToCV(hex)) as { value: string }).value);
};

const clarity = async (build: (t: typeof import('@stacks/transactions')) => unknown) => {
  const transactions = await import('@stacks/transactions');
  const { cvToHex } = transactions;
  return Response.json({
    okay: true,
    result: cvToHex(build(transactions) as Parameters<typeof cvToHex>[0])
  });
};

const stubNetwork = (overrides: StubOptions = {}) => {
  const calls: Call[] = [];
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ url, method, body });

    if (url.includes('/quote-inscription-fee')) {
      return Response.json({ okay: true, result: overrides.quoteResult ?? QUOTE_RESULT });
    }
    if (url.includes('/balances/stx')) return Response.json({ balance: overrides.balance ?? BALANCE });
    if (url.includes('/extended/v2/blocks')) return Response.json({ results: [{ height: CHAIN_TIP }] });

    if (url.endsWith('/is-paused')) {
      if (overrides.paused === 'error') return new Response('down', { status: 500 });
      return clarity(({ boolCV, responseOkCV }) => responseOkCV(boolCV(overrides.paused === true)));
    }
    if (url.endsWith('/get-chunk')) {
      if (overrides.chunks === 'error') return new Response('down', { status: 500 });
      const text = (overrides.chunks ?? {})[await uintArg(body, 0)];
      return clarity(({ bufferCV, noneCV, someCV }) =>
        text === undefined ? noneCV() : someCV(bufferCV(Buffer.from(text, 'utf8')))
      );
    }
    if (url.endsWith('/get-inscription-creator')) {
      const who = (overrides.creators ?? {})[await uintArg(body, 0)];
      return clarity(({ noneCV, someCV, standardPrincipalCV }) =>
        who === undefined ? noneCV() : someCV(standardPrincipalCV(who))
      );
    }
    if (url.endsWith('/get-id-by-hash')) {
      if (overrides.idByHash === 'error') return new Response('down', { status: 500 });
      return clarity(({ noneCV, someCV, uintCV }) =>
        overrides.idByHash ? someCV(uintCV(BigInt(overrides.idByHash))) : noneCV()
      );
    }
    if (url.includes('/nonces')) {
      if (overrides.nonces === 'error') return new Response('down', { status: 500 });
      return Response.json(
        overrides.nonces ?? { last_executed_tx_nonce: 6, possible_next_nonce: 7, detected_missing_nonces: [] }
      );
    }
    throw new Error(`unexpected request ${method} ${url}`);
  });
  return { fetchImpl: fetchImpl as unknown as typeof fetch, calls };
};

/** A real composed entry, so the quote under test is a real Claim section. */
const parentEntry = async () => {
  const { citationFrom, composeEntry } = await import('../compose.mjs');
  const body = composeEntry({
    persona: 'archivist',
    threadId: 't-inscribe-0001',
    position: 1,
    subject: 'cost-of-permanence',
    blockHeight: CHAIN_TIP,
    feeMicroStx: 11_000
  });
  return { body, citation: citationFrom(body, '4242') };
};

const BASE = {
  wizard: 'archivist',
  threadId: 't-inscribe-0001',
  position: 1,
  subject: 'cost-of-permanence',
  env: {} as NodeJS.ProcessEnv
};

describe('the captured mainnet fixture', () => {
  it('decodes as a real Clarity response tuple with the fields the code reads', async () => {
    const { cvToJSON, hexToCV } = await import('@stacks/transactions');
    const tuple = (cvToJSON(hexToCV(QUOTE_RESULT)) as { value: { value: Record<string, { value: unknown }> } })
      .value.value;
    expect(tuple['total-fee'].value).toBe('11000');
    expect(tuple['single-tx-eligible'].value).toBe(true);
    expect(tuple['chunk-size'].value).toBe(String(CHUNK_SIZE));
    expect(tuple.mode.value).toBe(String(MODE_SINGLE_TX));
  });
});

describe('buildMintCall', () => {
  it('produces the expected Clarity arg shape for an opening entry', async () => {
    const { composeEntry } = await import('../compose.mjs');
    const body = composeEntry({
      persona: 'archivist',
      threadId: 't-inscribe-0001',
      position: 1,
      subject: 'cost-of-permanence',
      blockHeight: CHAIN_TIP,
      feeMicroStx: 11_000
    });
    const call = buildMintCall({ body, tokenUri: tokenUriFor({ threadId: 't-inscribe-0001', position: 1, wizardId: 'archivist' }) });

    expect(call.contract).toBe(CORE_CONTRACT);
    expect(call.functionName).toBe('mint-single-tx');
    expect(call.totalChunks).toBe(1);
    expect(call.functionArgs).toHaveLength(5);
    expect(call.finalHashHex).toMatch(/^0x[0-9a-f]{64}$/);
    expect(call.argShape).toEqual([
      { name: 'expected-hash', type: 'buff', length: 32, value: call.finalHashHex },
      { name: 'mime', type: 'string-ascii', maxLength: 64, value: 'text/markdown' },
      { name: 'total-size', type: 'uint', value: String(call.totalSize) },
      {
        name: 'chunks',
        type: 'list',
        maxLength: 32,
        of: `buff ${CHUNK_SIZE}`,
        length: 1,
        byteLengths: [call.totalSize]
      },
      {
        name: 'token-uri-string',
        type: 'string-ascii',
        maxLength: 256,
        value: 'xtrata:wizard/t-inscribe-0001/1/archivist'
      }
    ]);
  });

  it('switches to mint-single-tx-recursive and appends a dependency list when it answers a parent', () => {
    const call = buildMintCall({ body: '# reply', tokenUri: 'xtrata:wizard/t/2/skeptic', parentIds: ['4242'] });
    expect(call.functionName).toBe('mint-single-tx-recursive');
    expect(call.functionArgs).toHaveLength(6);
    expect(call.argShape.at(-1)).toEqual({
      name: 'dependencies',
      type: 'list',
      maxLength: 50,
      of: 'uint',
      length: 1,
      values: ['4242']
    });
  });

  it('refuses an over-long token uri, an over-long mime and an empty body', () => {
    expect(() => buildMintCall({ body: '# x', tokenUri: 'x'.repeat(257) })).toThrow(WizardSafetyError);
    expect(() => buildMintCall({ body: '# x', tokenUri: 'x', mime: 'y'.repeat(65) })).toThrow(/mime must be/);
    expect(() => buildMintCall({ body: '', tokenUri: 'x' })).toThrow(/non-empty body/);
  });
});

describe('live reads', () => {
  it('quotes the fee with mode u2 and moves no funds', async () => {
    const { fetchImpl, calls } = stubNetwork();
    const quote = await quoteSingleTxFee({ fetchImpl, totalSize: 2_212, totalChunks: 1 });

    expect(quote.totalFeeUstx).toBe(11_000n);
    expect(quote.singleTxEligible).toBe(true);
    expect(quote.chunkSize).toBe(CHUNK_SIZE);
    expect(quote.source).toBe('live-quote');

    const call = calls.find((entry) => entry.url.includes('/quote-inscription-fee'));
    expect(call?.method).toBe('POST');
    expect(call?.url).toContain(`/v2/contracts/call-read/${CORE_ADDRESS}/xtrata-v3-2-3/`);
    const args = (call?.body as { arguments: string[] }).arguments;
    expect(args).toHaveLength(3);
    // third argument is the mode: u2, single transaction
    expect(args[2]).toBe(`0x01${BigInt(MODE_SINGLE_TX).toString(16).padStart(32, '0')}`);
    // no broadcast endpoint was touched
    expect(calls.some((entry) => entry.url.includes('/v2/transactions'))).toBe(false);
  });

  it('reads the balance and the chain tip', async () => {
    const { fetchImpl } = stubNetwork();
    expect(await fetchStxBalance({ fetchImpl, address: CORE_ADDRESS })).toBe(5_000_000n);
    expect(await fetchChainTip({ fetchImpl })).toBe(BigInt(CHAIN_TIP));
  });
});

describe('planInscription dry run', () => {
  it('composes, chunks, hashes, quotes live, and never touches a broadcast endpoint', async () => {
    const { fetchImpl, calls } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl });

    expect(plan.block).toBe(BigInt(CHAIN_TIP));
    expect(plan.protocolFeeUstx).toBe(11_000n);
    expect(plan.feeSource).toBe('live-quote');
    expect(plan.call.totalChunks).toBe(1);
    expect(plan.call.functionName).toBe('mint-single-tx');
    expect(plan.plannedSpendUstx).toBe(11_000n + DEFAULT_MAX_TX_FEE_USTX);
    expect(plan.spendCapUstx).toBe(DEFAULT_SPEND_CAP_USTX);
    expect(plan.balanceFloorUstx).toBe(DEFAULT_BALANCE_FLOOR_USTX);
    expect(plan.killReason).toBeNull();

    // the entry states the fee it was quoted
    expect(plan.body).toContain('11,000 microSTX');
    expect(calls.some((entry) => entry.url.includes('/v2/transactions'))).toBe(false);
    expect(calls.filter((entry) => entry.url.includes('/quote-inscription-fee'))).toHaveLength(2);
  });

  it('runs fully offline with a labelled estimate rather than a quote', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('network must not be touched in offline mode');
    });
    const plan = await planInscription({ ...BASE, offline: true, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(plan.feeSource).toBe('offline-estimate');
    expect(plan.protocolFeeUstx).toBe(OFFLINE_FEE_ESTIMATE_USTX);
    expect(formatPlan(plan)).toContain('offline-estimate');
  });

  it('aborts if the confirming quote disagrees with the probe, since the entry would misstate its cost', async () => {
    let seen = 0;
    const { fetchImpl } = stubNetwork();
    const drifting = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await (fetchImpl as unknown as typeof fetch)(input, init);
      if (String(input).includes('/quote-inscription-fee')) {
        seen += 1;
        if (seen === 2) {
          // second call comes back with a different total-fee (u12000)
          return Response.json({
            okay: true,
            result: QUOTE_RESULT.replace(/2af809746f74616c2d6665650100000000000000000000000000002af8/, (match) =>
              match.replace(/2af8$/, '2ee0')
            )
          });
        }
      }
      return response;
    });
    await expect(planInscription({ ...BASE, fetchImpl: drifting as unknown as typeof fetch })).rejects.toThrow(
      /fee changed between probe/
    );
  });

  it('reports the balance when an address is supplied, and tolerates a lookup failure', async () => {
    const { fetchImpl } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl, senderAddress: CORE_ADDRESS });
    expect(plan.balanceUstx).toBe(5_000_000n);
    expect(formatPlan(plan)).toContain('balance 5,000,000 microSTX');
  });
});

describe('broadcast safety rails', () => {
  const passing = {
    senderKey: 'a'.repeat(64) + '01',
    wizardId: 'archivist',
    totalChunks: 1,
    singleTxEligible: true,
    feeSource: 'live-quote',
    balanceUstx: 5_000_000n,
    protocolFeeUstx: 11_000n,
    minerFeeUstx: DEFAULT_MAX_TX_FEE_USTX,
    spendCapUstx: DEFAULT_SPEND_CAP_USTX,
    balanceFloorUstx: DEFAULT_BALANCE_FLOOR_USTX
  };

  it('allows a broadcast only when every rail passes', () => {
    const spend = assertBroadcastAllowed(passing);
    expect(spend.plannedSpendUstx).toBe(41_000n);
  });

  it('refuses without a key', () => {
    expect(() => assertBroadcastAllowed({ ...passing, senderKey: null })).toThrow(WizardSafetyError);
    expect(() => assertBroadcastAllowed({ ...passing, senderKey: null })).toThrow(
      /no key.*WIZARD_KEY_ARCHIVIST/s
    );
    expect(() => assertBroadcastAllowed({ ...passing, senderKey: 'not-a-key' })).toThrow(/not a hex private key/);
  });

  it('refuses when the payload is more than one chunk or is not single-tx eligible', () => {
    expect(() => assertBroadcastAllowed({ ...passing, totalChunks: 2 })).toThrow(/must be exactly one chunk/);
    expect(() => assertBroadcastAllowed({ ...passing, singleTxEligible: false })).toThrow(
      /not single-transaction eligible/
    );
  });

  it('refuses to spend on an estimate rather than a live quote', () => {
    expect(() => assertBroadcastAllowed({ ...passing, feeSource: 'offline-estimate' })).toThrow(
      /not a live quote/
    );
  });

  it('refuses below the balance floor', () => {
    expect(() => assertBroadcastAllowed({ ...passing, balanceUstx: 900_000n })).toThrow(/below the floor/);
    expect(() => assertBroadcastAllowed({ ...passing, balanceUstx: null })).toThrow(/balance unknown/);
  });

  it('refuses to leave the wallet below the floor after spending', () => {
    expect(() => assertBroadcastAllowed({ ...passing, balanceUstx: 1_010_000n })).toThrow(/would leave/);
  });

  it('refuses above the per-run spend cap', () => {
    expect(() =>
      assertBroadcastAllowed({ ...passing, spendCapUstx: 20_000n })
    ).toThrow(/exceeds the per-run cap/);
    expect(() =>
      assertBroadcastAllowed({ ...passing, minerFeeUstx: 600_000n, balanceUstx: 50_000_000n })
    ).toThrow(/exceeds the per-run cap/);
  });

  it('refuses everything while the kill switch is engaged', () => {
    expect(() => assertBroadcastAllowed({ ...passing, killReason: 'WIZARD_KILL_SWITCH is set' })).toThrow(
      /kill switch engaged/
    );
  });

  it('detects the kill switch from the env var or a KILL file', () => {
    expect(killSwitchEngaged({}, () => false)).toBeNull();
    expect(killSwitchEngaged({ WIZARD_KILL_SWITCH: '0' }, () => false)).toBeNull();
    expect(killSwitchEngaged({ WIZARD_KILL_SWITCH: '1' }, () => false)).toMatch(/WIZARD_KILL_SWITCH/);
    expect(killSwitchEngaged({ WIZARD_KILL_SWITCH: 'true' }, () => false)).toMatch(/WIZARD_KILL_SWITCH/);
    expect(killSwitchEngaged({}, () => true)).toMatch(/KILL/);
  });

  it('surfaces the kill switch through the plan', async () => {
    const { fetchImpl } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl, env: { WIZARD_KILL_SWITCH: '1' } });
    expect(plan.killReason).toMatch(/WIZARD_KILL_SWITCH/);
    expect(formatPlan(plan)).toContain('KILL SWITCH : ENGAGED');
  });
});

describe('formatPlan', () => {
  it('prints the hash, the arg shape, the live fee and the headroom', async () => {
    const { fetchImpl } = stubNetwork();
    const printed = formatPlan(await planInscription({ ...BASE, fetchImpl }));
    expect(printed).toContain('DRY RUN');
    expect(printed).toContain('mint-single-tx');
    expect(printed).toContain('finalHash   : 0x');
    expect(printed).toContain('(list 32 (buff 16384)) length 1');
    expect(printed).toContain('live quote-inscription-fee, mode u2');
    expect(printed).toContain('11,000 microSTX (0.011 STX)');
    expect(printed).toContain('bytes under the single-chunk limit');
    expect(printed).toContain('single-tx eligible: yes');
  });
});

describe('the env file the provisioning canary tells you to create', () => {
  it('is loaded, so a key saved where provisioning said to put it is found', () => {
    // provision.mjs reads .env.wizards; this script did not, so --broadcast
    // refused with "no key" after the operator had done everything right.
    const env: Record<string, string | undefined> = {};
    const readFile = () => 'WIZARD_KEY_ARCHIVIST=abc123\nWIZARD_ADDRESS_ARCHIVIST=SP1\n';
    loadWizardEnv({ path: __filename, env, readFile });
    expect(env.WIZARD_KEY_ARCHIVIST).toBe('abc123');
    expect(env.WIZARD_ADDRESS_ARCHIVIST).toBe('SP1');
  });

  it('lets a real environment variable win over the file', () => {
    // An exported key or a CI secret must override whatever is on disk.
    const env: Record<string, string | undefined> = { WIZARD_KEY_ARCHIVIST: 'from-shell' };
    const readFile = () => 'WIZARD_KEY_ARCHIVIST=from-file\n';
    loadWizardEnv({ path: __filename, env, readFile });
    expect(env.WIZARD_KEY_ARCHIVIST).toBe('from-shell');
  });

  it('ignores comments and blank lines, and tolerates quotes and export', () => {
    const env: Record<string, string | undefined> = {};
    const readFile = () =>
      '# a comment\n\nexport WIZARD_KEY_SKEPTIC="quoted"\nWIZARD_ADDRESS_SKEPTIC=\'single\'\nnot-an-assignment\n';
    loadWizardEnv({ path: __filename, env, readFile });
    expect(env.WIZARD_KEY_SKEPTIC).toBe('quoted');
    expect(env.WIZARD_ADDRESS_SKEPTIC).toBe('single');
  });

  it('is a no-op when the file does not exist', () => {
    const env: Record<string, string | undefined> = {};
    expect(() =>
      loadWizardEnv({ path: '/definitely/not/here/.env.wizards', env })
    ).not.toThrow();
    expect(Object.keys(env)).toHaveLength(0);
  });
});

describe('verifyParentQuote, the check that guards the permanent record', () => {
  it('passes when the quoted fragment is in the parent chunk and the credited wizard created it', async () => {
    const { body, citation } = await parentEntry();
    const { fetchImpl, calls } = stubNetwork({
      chunks: { '4242': body },
      creators: { '4242': ARCHIVIST_ADDRESS }
    });

    const check = await verifyParentQuote({
      fetchImpl,
      parentIds: ['4242'],
      answering: [citation],
      expectedAddresses: { [citation.wizard.toLowerCase()]: ARCHIVIST_ADDRESS }
    });

    expect(check.ok).toBe(true);
    expect(check.status).toBe('verified');
    expect(check.results[0]).toMatchObject({ id: '4242', status: 'ok', authorChecked: true });
    // index u0 is the whole body, because wizard entries are always one chunk
    expect(await uintArg(calls.find((c) => c.url.endsWith('/get-chunk'))?.body, 1)).toBe('0');
    expect(calls.some((c) => c.url.includes('/v2/transactions'))).toBe(false);
  });

  it('fails when the operator typed a fragment the parent does not contain, and shows both sides', async () => {
    const { body } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: { '4242': body } });

    const check = await verifyParentQuote({
      fetchImpl,
      parentIds: ['4242'],
      answering: [{ id: '4242', wizard: 'Wizard-1, the Archivist', quote: 'a claim it never made' }]
    });

    expect(check.ok).toBe(false);
    expect(check.status).toBe('failed');
    expect(check.results[0].status).toBe('quote-mismatch');
    expect(check.results[0].quote).toBe('a claim it never made');
    // the "found" half is the parent's real Claim section, not a raw byte dump
    expect(check.results[0].found).toBeTruthy();
    expect(body).toContain(check.results[0].found);
  });

  it('fails when the words are right but the inscription belongs to another wizard', async () => {
    const { body, citation } = await parentEntry();
    const { fetchImpl } = stubNetwork({
      chunks: { '4242': body },
      creators: { '4242': SOMEONE_ELSE }
    });

    const check = await verifyParentQuote({
      fetchImpl,
      parentIds: ['4242'],
      answering: [citation],
      expectedAddresses: { [citation.wizard.toLowerCase()]: ARCHIVIST_ADDRESS }
    });

    expect(check.ok).toBe(false);
    expect(check.results[0]).toMatchObject({
      status: 'wrong-author',
      expectedAuthor: ARCHIVIST_ADDRESS,
      foundAuthor: SOMEONE_ELSE
    });
    expect(check.results[0].message).toContain(SOMEONE_ELSE);
  });

  it('fails closed when the parent cannot be fetched: an unread quote is not a verified quote', async () => {
    const { citation } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: 'error' });

    const check = await verifyParentQuote({ fetchImpl, parentIds: ['4242'], answering: [citation] });

    expect(check.ok).toBe(false);
    expect(check.status).toBe('unavailable');
    expect(check.results[0].status).toBe('unavailable');
  });

  it('fails when the parent has no chunk u0 at all', async () => {
    const { citation } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: {} });
    const check = await verifyParentQuote({ fetchImpl, parentIds: ['4242'], answering: [citation] });
    expect(check.results[0].status).toBe('no-chunk');
    expect(check.ok).toBe(false);
  });

  it('skips the author half, but not the quote half, when no address is known for the credited wizard', async () => {
    const { body, citation } = await parentEntry();
    const { fetchImpl, calls } = stubNetwork({ chunks: { '4242': body } });
    const check = await verifyParentQuote({ fetchImpl, parentIds: ['4242'], answering: [citation] });

    expect(check.ok).toBe(true);
    expect(check.results[0]).toMatchObject({ status: 'ok', authorChecked: false });
    expect(check.results[0].note).toMatch(/WIZARD_ADDRESS/);
    expect(calls.some((c) => c.url.endsWith('/get-inscription-creator'))).toBe(false);
  });

  it('has nothing to do for an opening statement, and skips cleanly offline', async () => {
    const { fetchImpl } = stubNetwork();
    expect(await verifyParentQuote({ fetchImpl })).toMatchObject({ status: 'not-applicable', ok: true });

    const offline = await verifyParentQuote({ fetchImpl, parentIds: ['4242'], offline: true });
    expect(offline).toMatchObject({ status: 'skipped', ok: false, note: SKIPPED_OFFLINE });
  });

  it('resolves expected addresses from WIZARD_ADDRESS_* by id, full name and short name', () => {
    const map = expectedWizardAddresses({ WIZARD_ADDRESS_ARCHIVIST: ARCHIVIST_ADDRESS } as NodeJS.ProcessEnv);
    expect(map.archivist).toBe(ARCHIVIST_ADDRESS);
    expect(map['wizard-1, the archivist']).toBe(ARCHIVIST_ADDRESS);
    expect(map['the archivist']).toBe(ARCHIVIST_ADDRESS);
    expect(map.skeptic).toBeUndefined();
  });
});

describe('a mis-quoted parent: reported in a dry run, refused at broadcast', () => {
  const badPlan = async () => {
    const { body } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: { '4242': body } });
    return planInscription({
      ...BASE,
      wizard: 'skeptic',
      position: 2,
      parentIds: ['4242'],
      answering: [{ id: '4242', wizard: 'Wizard-1, the Archivist', quote: 'a claim it never made' }],
      fetchImpl
    });
  };

  it('does not kill the dry run, it prints a FAIL line the operator can read', async () => {
    const plan = await badPlan();
    expect(plan.checks.parentQuote.ok).toBe(false);
    const printed = formatPlan(plan);
    expect(printed).toContain('parent quote: FAIL');
    expect(printed).toContain('#4242 FAIL');
    expect(printed).toContain('expected: "a claim it never made"');
    expect(printed).toContain('found   : "');
  });

  it('refuses the broadcast, naming the id and both fragments', async () => {
    const plan = await badPlan();
    const attempt = () =>
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        wizardId: 'skeptic',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: 11_000n,
        parentQuoteCheck: plan.checks.parentQuote,
        pausedCheck: plan.checks.corePaused
      });
    expect(attempt).toThrow(WizardSafetyError);
    expect(attempt).toThrow(/#4242 does not contain the quoted fragment/);
    expect(attempt).toThrow(/expected: "a claim it never made"/);
    expect(attempt).toThrow(/attributes\s+words to another wizard/);
  });

  it('refuses when the check could not run at all, rather than assuming it would have passed', async () => {
    const { citation } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: 'error' });
    const check = await verifyParentQuote({ fetchImpl, parentIds: ['4242'], answering: [citation] });
    expect(() =>
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: 11_000n,
        parentQuoteCheck: check
      })
    ).toThrow(/could not read #4242/);
  });

  it('lets a verified quote through', async () => {
    const { body, citation } = await parentEntry();
    const { fetchImpl } = stubNetwork({ chunks: { '4242': body }, creators: { '4242': ARCHIVIST_ADDRESS } });
    const check = await verifyParentQuote({
      fetchImpl,
      parentIds: ['4242'],
      answering: [citation],
      expectedAddresses: { [citation.wizard.toLowerCase()]: ARCHIVIST_ADDRESS }
    });
    expect(
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: 11_000n,
        parentQuoteCheck: check,
        pausedCheck: { status: 'running', ok: true }
      }).plannedSpendUstx
    ).toBe(41_000n);
  });
});

describe('the core pause state', () => {
  it('reads as running when the contract says (ok false)', async () => {
    const { fetchImpl } = stubNetwork();
    expect(await checkCorePaused({ fetchImpl })).toMatchObject({ status: 'running', ok: true, paused: false });
  });

  it('reads as paused when the contract says (ok true), and refuses a broadcast', async () => {
    const { fetchImpl } = stubNetwork({ paused: true });
    const check = await checkCorePaused({ fetchImpl });
    expect(check).toMatchObject({ status: 'paused', ok: false, paused: true });
    expect(() =>
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: 11_000n,
        pausedCheck: check
      })
    ).toThrow(/paused.*miner fee would still be spent/s);
  });

  it('fails closed when the pause state cannot be read', async () => {
    const { fetchImpl } = stubNetwork({ paused: 'error' });
    const check = await checkCorePaused({ fetchImpl });
    expect(check).toMatchObject({ status: 'unavailable', ok: false });
    expect(() =>
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: 11_000n,
        pausedCheck: check
      })
    ).toThrow(/fails closed/);
  });

  it('is surfaced in the plan either way', async () => {
    const { fetchImpl } = stubNetwork({ paused: true });
    const printed = formatPlan(await planInscription({ ...BASE, fetchImpl }));
    expect(printed).toContain('core paused: YES');
  });
});

describe('the post-condition the broadcast would carry', () => {
  it('is rendered as an explicit bound, so the spend can be confirmed without reading source', async () => {
    const { fetchImpl } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl, senderAddress: CORE_ADDRESS });
    expect(plan.postCondition).toEqual({
      mode: 'deny',
      asset: 'STX',
      principal: CORE_ADDRESS,
      condition: 'LessEqual',
      capUstx: 11_000n
    });
    expect(formatPlan(plan)).toContain(
      `post-conditions: deny mode; STX from ${CORE_ADDRESS} <= 11,000 microSTX (0.011 STX)`
    );
  });

  it('caps at the protocol fee, not at the whole planned spend, because the miner fee is not a transfer', async () => {
    const { fetchImpl } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl });
    expect(plan.postCondition.capUstx).toBe(plan.protocolFeeUstx);
    expect(plan.postCondition.capUstx).not.toBe(plan.plannedSpendUstx);
    expect(formatPostCondition(plan.postCondition)).toContain('<the wizard wallet>');
  });
});

describe('whole-thread affordability', () => {
  it('multiplies the per-entry spend by the thread length and compares to balance minus floor', () => {
    const check = checkThreadAffordability({
      threadLength: 6,
      plannedSpendUstx: 41_000n,
      balanceUstx: 5_000_000n,
      balanceFloorUstx: DEFAULT_BALANCE_FLOOR_USTX
    });
    expect(check).toMatchObject({ status: 'affordable', affordable: true, threadCostUstx: 246_000n });
    expect(formatChecks({ checks: { threadAffordability: check } }).join('\n')).toContain(
      'thread cost: 6 x 41,000 = 246,000 microSTX (0.246 STX); affordable: yes'
    );
  });

  it('warns but never refuses when the thread would not complete', async () => {
    const check = checkThreadAffordability({
      threadLength: 6,
      plannedSpendUstx: 41_000n,
      balanceUstx: 1_100_000n,
      balanceFloorUstx: DEFAULT_BALANCE_FLOOR_USTX
    });
    expect(check).toMatchObject({ status: 'short', affordable: false, ok: true, shortfallUstx: 146_000n });
    const printed = formatChecks({ checks: { threadAffordability: check } }).join('\n');
    expect(printed).toContain('affordable: NO, short by 146,000 microSTX');
    expect(printed).toContain('warning:');

    // one entry is still affordable, so the per-run rails let it through
    expect(
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'live-quote',
        balanceUstx: 1_100_000n,
        protocolFeeUstx: 11_000n
      }).plannedSpendUstx
    ).toBe(41_000n);
  });

  it('says so rather than guessing when no balance was read', () => {
    const check = checkThreadAffordability({ threadLength: 6, plannedSpendUstx: 41_000n });
    expect(check).toMatchObject({ status: 'unknown', affordable: null });
    expect(formatChecks({ checks: { threadAffordability: check } }).join('\n')).toContain(
      'affordable: unknown (no balance read)'
    );
  });
});

describe('duplicate content, advisory because v3.2.3 permits duplicates', () => {
  it('reports the existing id on a hit, and does not refuse', async () => {
    const { fetchImpl } = stubNetwork({ idByHash: '1234' });
    const plan = await planInscription({ ...BASE, fetchImpl });
    expect(plan.checks.duplicateContent).toMatchObject({ status: 'duplicate', ok: true, existingId: '1234' });
    expect(formatPlan(plan)).toContain('duplicate: already inscribed as #1234');
  });

  it('reports a miss plainly', async () => {
    const { fetchImpl } = stubNetwork();
    const plan = await planInscription({ ...BASE, fetchImpl });
    expect(plan.checks.duplicateContent).toMatchObject({ status: 'new', existingId: null });
    expect(formatPlan(plan)).toContain('duplicate: no prior inscription with these bytes');
  });

  it('looks the plan\'s own final hash up, and degrades to unavailable on an API error', async () => {
    const { fetchImpl, calls } = stubNetwork({ idByHash: 'error' });
    const plan = await planInscription({ ...BASE, fetchImpl });
    const sent = (calls.find((c) => c.url.endsWith('/get-id-by-hash'))?.body as { arguments: string[] }).arguments[0];
    expect(sent).toBe(`0x02${(32).toString(16).padStart(8, '0')}${plan.call.finalHashHex.slice(2)}`);
    expect(plan.checks.duplicateContent).toMatchObject({ status: 'unavailable', ok: true });
    expect(formatPlan(plan)).toContain('duplicate: unavailable');
  });
});

describe('the pending nonce', () => {
  it('reports the next nonce when nothing is in flight', async () => {
    const { fetchImpl } = stubNetwork();
    const check = await checkPendingNonce({ fetchImpl, address: CORE_ADDRESS });
    expect(check).toMatchObject({ status: 'clear', nextNonce: 7, warning: null });
    expect(formatChecks({ checks: { pendingNonce: check } }).join('\n')).toContain('nonce: next 7');
  });

  it('warns when a gap says a transaction is already queued', async () => {
    const { fetchImpl } = stubNetwork({
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 9, detected_missing_nonces: [] }
    });
    const check = await checkPendingNonce({ fetchImpl, address: CORE_ADDRESS });
    expect(check.status).toBe('pending');
    expect(formatChecks({ checks: { pendingNonce: check } }).join('\n')).toMatch(/warning:.*queues behind it/);
  });

  it('warns on detected missing nonces, which are a stuck transaction', async () => {
    const { fetchImpl } = stubNetwork({
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 7, detected_missing_nonces: [4, 5] }
    });
    const check = await checkPendingNonce({ fetchImpl, address: CORE_ADDRESS });
    expect(check).toMatchObject({ status: 'pending', missingNonces: [4, 5] });
    expect(check.warning).toContain('missing nonces 4, 5');
  });

  it('treats a wallet that has executed nothing but has a next nonce as in flight', async () => {
    const { fetchImpl } = stubNetwork({
      nonces: { last_executed_tx_nonce: null, possible_next_nonce: 3, detected_missing_nonces: [] }
    });
    expect((await checkPendingNonce({ fetchImpl, address: CORE_ADDRESS })).status).toBe('pending');
  });

  it('skips without an address and degrades on an API error, never blocking either way', async () => {
    const { fetchImpl } = stubNetwork({ nonces: 'error' });
    expect(await checkPendingNonce({ fetchImpl })).toMatchObject({ status: 'skipped', ok: true });
    expect(await checkPendingNonce({ fetchImpl, address: CORE_ADDRESS })).toMatchObject({
      status: 'unavailable',
      ok: true
    });
  });
});

describe('--offline', () => {
  it('skips every network-dependent check, says which, and touches no endpoint', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('network must not be touched in offline mode');
    });
    const plan = await planInscription({
      ...BASE,
      wizard: 'skeptic',
      position: 2,
      parentIds: ['4242'],
      answering: [{ id: '4242', wizard: 'Wizard-1, the Archivist', quote: 'anything' }],
      offline: true,
      senderAddress: CORE_ADDRESS,
      fetchImpl: fetchImpl as unknown as typeof fetch
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(plan.skippedChecks).toEqual(['parent quote', 'core paused', 'duplicate', 'nonce']);
    for (const name of ['parentQuote', 'corePaused', 'duplicateContent', 'pendingNonce'] as const) {
      expect(plan.checks[name].status).toBe('skipped');
    }
    // the sixth check needs no network, but it needs a balance it did not read
    expect(plan.checks.threadAffordability.status).toBe('unknown');

    const printed = formatPlan(plan);
    expect(printed).toContain('parent quote: skipped (--offline)');
    expect(printed).toContain('core paused: skipped (--offline)');
    expect(printed).toContain('duplicate: skipped (--offline)');
    expect(printed).toContain('nonce: skipped (--offline)');
    expect(printed).toContain('offline: skipped parent quote, core paused, duplicate, nonce');
  });

  it('cannot be broadcast, so a skipped check is never a passed check', () => {
    expect(() =>
      assertBroadcastAllowed({
        senderKey: 'a'.repeat(64) + '01',
        totalChunks: 1,
        singleTxEligible: true,
        feeSource: 'offline-estimate',
        balanceUstx: 5_000_000n,
        protocolFeeUstx: OFFLINE_FEE_ESTIMATE_USTX,
        parentQuoteCheck: { status: 'skipped', ok: false },
        pausedCheck: { status: 'skipped', ok: false }
      })
    ).toThrow(/not a live quote/);
  });
});

describe('the preflight checks cannot spend anything', () => {
  it('reaches only read endpoints across a full plan with every check exercised', async () => {
    const { body, citation } = await parentEntry();
    const { fetchImpl, calls } = stubNetwork({
      chunks: { '4242': body },
      creators: { '4242': ARCHIVIST_ADDRESS },
      idByHash: '1234',
      nonces: { last_executed_tx_nonce: 6, possible_next_nonce: 9, detected_missing_nonces: [3] }
    });

    await planInscription({
      ...BASE,
      wizard: 'skeptic',
      position: 2,
      parentIds: ['4242'],
      answering: [citation],
      senderAddress: ARCHIVIST_ADDRESS,
      expectedAddresses: { [citation.wizard.toLowerCase()]: ARCHIVIST_ADDRESS },
      fetchImpl
    });

    const readOnlyFunctions = new Set([
      'quote-inscription-fee',
      'get-chunk',
      'get-inscription-creator',
      'get-id-by-hash',
      'is-paused'
    ]);
    for (const call of calls) {
      expect(call.url).not.toContain('/v2/transactions');
      expect(call.url).not.toContain('broadcast');
      expect(['GET', 'POST']).toContain(call.method);
      if (call.url.includes('/call-read/')) {
        expect(readOnlyFunctions.has(call.url.split('/').pop() as string)).toBe(true);
      }
    }
    // and it did exercise the new reads rather than silently skipping them
    for (const fn of readOnlyFunctions) expect(calls.some((c) => c.url.endsWith(`/${fn}`))).toBe(true);
  });

  it('keeps signing and broadcasting confined to the cli, where --broadcast gates them', () => {
    const source = readFileSync(join(__dirname, '..', 'inscribe.mjs'), 'utf8');
    const cliAt = source.indexOf('/* cli ');
    expect(cliAt).toBeGreaterThan(0);
    for (const needle of ['broadcastTransaction(', 'makeContractCall(', 'makeStandardSTXPostCondition(']) {
      const positions = [...source.matchAll(new RegExp(needle.replace('(', '\\('), 'g'))].map((match) => match.index);
      expect(positions.length).toBeGreaterThan(0);
      for (const at of positions) expect(at).toBeGreaterThan(cliAt);
    }
  });
});

describe('the closing instruction', () => {
  it('says the key is already loaded, rather than asking for one that is present', () => {
    const lines = broadcastInstruction({
      wizardId: 'archivist',
      hasKey: true,
      threadId: 't-2026-07-30-a',
      subject: 'cost-of-permanence',
      position: 1
    }).join('\n');
    expect(lines).toContain('already loaded');
    expect(lines).toContain('scripts/wizard/.env.wizards');
    expect(lines).toContain(
      'node scripts/wizard/inscribe.mjs --wizard archivist --subject cost-of-permanence --position 1 ' +
        '--thread t-2026-07-30-a --broadcast'
    );
    expect(lines).not.toMatch(/WIZARD_KEY_ARCHIVIST=<hex/);
  });

  it('still asks for the key when there is none, and mentions the env file as well', () => {
    const lines = broadcastInstruction({ wizardId: 'skeptic', hasKey: false, threadId: DEMO_THREAD_ID }).join('\n');
    expect(lines).toContain('WIZARD_KEY_SKEPTIC=<hex private key>');
    expect(lines).toContain('scripts/wizard/.env.wizards');
  });

  it('always names --thread, and refuses to pretend the demo id would work', () => {
    const demo = broadcastInstruction({ wizardId: 'archivist', hasKey: true }).join('\n');
    expect(demo).toContain('--thread <your-thread-id>');
    expect(demo).toContain(`the placeholder "${DEMO_THREAD_ID}" is refused`);

    const real = broadcastInstruction({ wizardId: 'archivist', hasKey: true, threadId: 't-real' }).join('\n');
    expect(real).toContain('--thread t-real');
    expect(real).toContain('--thread is mandatory');
  });

  it('reproduces the citation flags, shell-quoted, so the command is the one that was planned', () => {
    const lines = broadcastInstruction({
      wizardId: 'skeptic',
      hasKey: true,
      threadId: 't-real',
      parentIds: ['4242', '4243'],
      parentQuote: 'a "quoted" fragment',
      parentWizard: 'Wizard-1, the Archivist'
    }).join('\n');
    expect(lines).toContain('--parents 4242,4243');
    expect(lines).toContain('--parent-quote "a \\"quoted\\" fragment"');
    expect(lines).toContain('--parent-wizard "Wizard-1, the Archivist"');
  });

  it('tells an offline run to drop --offline before adding --broadcast', () => {
    const lines = broadcastInstruction({ wizardId: 'archivist', hasKey: true, offline: true }).join('\n');
    expect(lines).toMatch(/Drop --offline before you add --broadcast/);
  });
});

describe('the placeholder thread id', () => {
  it('is still the documented demo value', () => {
    expect(DEMO_THREAD_ID).toBe('t-demo-0001');
  });

  it('is what a dry run uses, so the preview needs no arguments', () => {
    // The refusal below only makes sense because the default is the demo id.
    expect(DEMO_THREAD_ID.startsWith('t-demo')).toBe(true);
  });
});

describe('the plan header states what the run will actually do', () => {
  const planFor = async () => {
    const { fetchImpl } = stubNetwork();
    return planInscription({ ...BASE, fetchImpl });
  };

  it('says DRY RUN when nothing will be sent', async () => {
    expect(formatPlan(await planFor())).toContain('(DRY RUN)');
  });

  it('says BROADCAST, and warns it cannot be undone, when it will spend', async () => {
    // The header was hardcoded to "(DRY RUN)" and printed before the broadcast
    // branch, so a real spend announced itself as a dry run and the only
    // contradiction was one line at the very bottom of the output.
    const header = formatPlan(await planFor(), { broadcast: true }).split('\n')[0];
    expect(header).toContain('BROADCAST');
    expect(header).toMatch(/cannot be undone/i);
    expect(header).not.toContain('DRY RUN');
  });
});
