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
  WizardSafetyError,
  assertBroadcastAllowed,
  buildMintCall,
  fetchChainTip,
  fetchStxBalance,
  formatPlan,
  killSwitchEngaged,
  planInscription,
  quoteSingleTxFee,
  tokenUriFor
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

type Call = { url: string; method: string; body?: unknown };

const stubNetwork = (overrides: { balance?: string; quoteResult?: string } = {}) => {
  const calls: Call[] = [];
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    calls.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    if (url.includes('/quote-inscription-fee')) {
      return Response.json({ okay: true, result: overrides.quoteResult ?? QUOTE_RESULT });
    }
    if (url.includes('/balances/stx')) return Response.json({ balance: overrides.balance ?? BALANCE });
    if (url.includes('/extended/v2/blocks')) return Response.json({ results: [{ height: CHAIN_TIP }] });
    throw new Error(`unexpected request ${method} ${url}`);
  });
  return { fetchImpl: fetchImpl as unknown as typeof fetch, calls };
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

describe('the placeholder thread id', () => {
  it('is still the documented demo value', () => {
    expect(DEMO_THREAD_ID).toBe('t-demo-0001');
  });

  it('is what a dry run uses, so the preview needs no arguments', () => {
    // The refusal below only makes sense because the default is the demo id.
    expect(DEMO_THREAD_ID.startsWith('t-demo')).toBe(true);
  });
});
