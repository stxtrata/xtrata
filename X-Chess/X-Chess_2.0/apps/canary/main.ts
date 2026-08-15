// The gates canary, wired to a real chain and a real wallet.
//
// Each handler does two things and they are kept apart on purpose: it ACTS, and
// then it READS BACK. A step is only ever marked done by the read.

import { INSCRIBE_STEPS, WALLET_STEPS } from '../../packages/ui/gates.js';
import { Canary } from '../../packages/ui/canary.js';
import type { CanaryContext, StepHandler, StepResult } from '../../packages/ui/canary.js';
import { LiveChain } from '../../packages/chain/client.js';
import type { ContractCall, WriteResult } from '../../packages/chain/client.js';
import { sha256Hex } from '../../packages/protocol/sha256.js';
import { guardFor } from '../../packages/wallet/postconditions.js';
import {
  collectProviders,
  shimInstalled,
  signingBlockedReason,
  usingHostBridge,
  isFramed,
  waitForProvider
} from '../../packages/wallet/providers.js';
import type { ProviderEntry } from '../../packages/wallet/providers.js';
import {
  contractCallParams,
  extractAddress,
  networkFromAddress,
  userCancelled,
  walletCall
} from '../../packages/wallet/requests.js';
import { connectWallet } from '../../packages/wallet/connect.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { replay } from '../../packages/replay/replay.js';
import { checkEligibility } from '../../packages/ratings/eligibility.js';
import type { Network } from '../../packages/chain/endpoint.js';

interface Config {
  contractName: string;
  network: Network;
  version: string;
  built?: string;
  hash?: string;
  /** The Clarity source, inlined by the build. This is what gets deployed. */
  source: string;
  /** The clarity version the contract must be deployed as. */
  clarityVersion: number;
  /** sha256 of dist/xchess.html - what a wallet matrix row is signed against. */
  boardSha256?: string | null;
  /** Where the contract the board is built against already lives. */
  contractAddress?: string | null;
}

const CONFIG: Config = ((globalThis as Record<string, unknown>).__XCHESS_CANARY__ as Config) ?? {
  contractName: 'xchess-core-v1-canary',
  network: 'mainnet',
  version: 'dev',
  source: '',
  clarityVersion: 4
};

const state: Record<string, unknown> = {};

/**
 * Where the contract lives, and who is currently signing. Two different things.
 *
 * They start out the same, because the account that deploys is the account that
 * exercises the first few steps. They stop being the same the moment the
 * sponsored move is tested: that has to be signed BY THE SPONSORED WALLET, and
 * a page that derived the contract's address from whoever happened to be
 * connected would then go looking for the contract at the opponent's address
 * and find nothing.
 */
let deployer: string | null = null;
let signer: string | null = null;
let chain: LiveChain | null = null;

const stx = (micro: bigint): string => `${(Number(micro) / 1_000_000).toFixed(6)} STX`;

/** The contract id, once the deploy address is known. */
const contractId = (): string => `${deployer}.${CONFIG.contractName}`;

function requireChain(): LiveChain {
  if (!chain) throw new Error('connect an account first');
  return chain;
}

async function sign(call: ContractCall): Promise<WriteResult> {
  await waitForProvider();
  const guard = guardFor({
    sender: signer,
    contractId: contractId(),
    sends: call.sends,
    contractSends: call.contractSends
  });
  const request = {
    contract: contractId(),
    functionName: call.functionName,
    functionArgs: call.functionArgs,
    postConditionMode: guard.postConditionMode,
    postConditions: guard.postConditions,
    network: CONFIG.network
  };
  const { result, entry } = await walletCall('stx_callContract', (provider: ProviderEntry) =>
    contractCallParams(provider, request)
  );
  const payload = result as Record<string, unknown> | null;
  const inner = payload?.result as Record<string, unknown> | undefined;
  return {
    ok: true,
    txid: (payload?.txid as string) ?? (inner?.txid as string) ?? null,
    provider: entry.label,
    raw: result
  };
}

/**
 * Deploy, trying each shape a wallet might want.
 *
 * `stx_callContract` has provenance across Xverse and Leather, desktop and
 * mobile. `stx_deployContract` has NONE: nothing in this project has ever
 * deployed through a wallet. That is exactly why it gets fallbacks and why this
 * page exists at all.
 */
async function deployContract(name: string, source: string): Promise<WriteResult> {
  await waitForProvider();
  const shapes: [string, Record<string, unknown>][] = [
    ['name + clarityCode + clarityVersion', {
      name,
      clarityCode: source,
      clarityVersion: CONFIG.clarityVersion,
      network: CONFIG.network
    }],
    ['contractName + codeBody', {
      contractName: name,
      codeBody: source,
      clarityVersion: CONFIG.clarityVersion,
      network: CONFIG.network
    }],
    ['name + codeBody, no version', { name, codeBody: source, network: CONFIG.network }]
  ];

  let lastError: unknown = null;
  for (const [label, params] of shapes) {
    try {
      const { result, entry } = await walletCall('stx_deployContract', params);
      const payload = result as Record<string, unknown> | null;
      const inner = payload?.result as Record<string, unknown> | undefined;
      return {
        ok: true,
        txid: (payload?.txid as string) ?? (inner?.txid as string) ?? null,
        provider: `${entry.label} (${label})`,
        raw: result
      };
    } catch (error) {
      lastError = error;
      // A user cancelling is an answer, not a reason to try three more shapes.
      const message = String((error as Error)?.message ?? '').toLowerCase();
      if (/reject|declin|cancel|denied/.test(message)) throw error;
    }
  }
  throw lastError ?? new Error('no deploy shape was accepted');
}

/**
 * Ask the wallet who it is.
 *
 * `forcePrompt` asks it to put its account chooser up regardless of any session
 * it is holding. Without it, `wallet_connect` answers from its own cache and
 * there is no way to switch to a different account - which is exactly what the
 * sponsored move step needs to do. Wallets that do not know these flags ignore
 * them.
 */
async function connect({ forcePrompt = false } = {}): Promise<string | null> {
  const params = forcePrompt
    ? { forceWalletSelect: true, persistWalletSession: false }
    : {};
  for (const method of ['wallet_connect', 'stx_requestAccounts', 'stx_getAddresses', 'getAddresses']) {
    try {
      const { result } = await walletCall(method, method === 'wallet_connect' ? params : {}, {
        timeoutMs: 20_000
      });
      const found = extractAddress(result);
      if (found) return found;
    } catch {
      // Next method. A provider that cannot do one is not a failure.
    }
  }
  return null;
}

const ok = (detail: string, record?: Record<string, unknown>): StepResult => ({
  ok: true,
  detail,
  ...(record ? { record } : {})
});
const no = (detail: string): StepResult => ({ ok: false, detail });

/** A manual step: the operator types what happened, and it is recorded verbatim. */
function manual(field: string, need: RegExp, what: string): StepHandler {
  return async (ctx: CanaryContext) => {
    const value = ctx.input(field);
    if (!need.test(value)) return no(`${what}\ngot: ${JSON.stringify(value)}`);
    state[field] = value;
    return ok(`recorded: ${value}`, { [field]: value });
  };
}

/** A wallet's STX balance, optionally as it stood at a given block. */
async function balanceOf(
  c: { apiBase: string },
  who: string,
  block?: number
): Promise<bigint> {
  const at = block ? `?until_block=${block}` : '';
  return fetch(`${c.apiBase}/extended/v1/address/${who}/balances${at}`)
    .then((r) => r.json())
    .then((b: { stx?: { balance?: string } }) => BigInt(b.stx?.balance ?? '0'));
}

// ---------------------------------------------------------------------------
// The wallet matrix, run rather than asserted.
//
// Every handler here calls the BOARD'S OWN wallet code - `connectWallet`,
// `walletCall`, `contractCallParams`, `guardFor` - imported, never
// reimplemented. A page that signs through its own copy proves things about the
// copy, which is the one way a runner like this can be worse than no runner.
//
// And every result records WHICH PROVIDER served the call. On a page offering
// three of them "it worked" is not a result: every wallet fault found by hand in
// the last two days was a fault about which provider answered.
// ---------------------------------------------------------------------------

interface RowResult {
  provider: string;
  outcome: 'pass' | 'fail';
  txid: string;
}

const matrix = new Map<number, RowResult>();

const mark = (row: number, provider: string, outcome: 'pass' | 'fail', txid = '-'): void => {
  matrix.set(row, { provider: provider || 'unknown', outcome, txid: txid || '-' });
};

/** What the board would try first, which is the thing a result is true within. */
const providerNames = (): string => {
  const found = collectProviders();
  return found.length ? found.map((entry) => entry.label).join(', ') : 'none';
};

/**
 * A row a person has to ARRANGE but not judge.
 *
 * These four need a browser in a particular state before the page can say
 * anything - extensions off, wallet locked, wallet on testnet. That part cannot
 * be automated and is not pretended to be.
 *
 * What was wrong with the first version is that it then asked the operator to
 * TYPE the answer. Nobody knows better than the page whether connect returned an
 * address, whether it took four seconds or forty, or which provider served it -
 * and a row whose evidence is a person typing "pass" is exactly the checklist
 * this runner exists to replace. So: you arrange it, you press Run, and the page
 * decides.
 */

const walletHandlers: Record<string, StepHandler> = {
  'w-survey': async () => {
    const found = collectProviders();
    const lines = [
      `providers      ${providerNames()}`,
      `board picks    ${found[0]?.label ?? 'nothing'}`,
      `xtrata shim    ${shimInstalled()}`,
      `framed         ${isFramed()}`,
      `host bridge    ${usingHostBridge()}`,
      `can sign       ${signingBlockedReason() === null}`,
      `board sha256   ${CONFIG.boardSha256 ?? 'MISSING - rebuild'}`
    ];
    if (!CONFIG.boardSha256) {
      return no(
        `${lines.join('\n')}\n\nThis canary was built without the board's hash, so no row it ` +
          'records can be signed against an artefact. Rebuild with `npm run build`.'
      );
    }
    return ok(lines.join('\n'));
  },

  'w-connect': async (ctx) => {
    // Row 1. The board's own connect, so what is proven is the board's.
    const before = Date.now();
    try {
      const session = await connectWallet();
      signer = session.address;
      const took = Math.round((Date.now() - before) / 100) / 10;

      // AND THE CHAIN, pointed at the contract that already exists rather than
      // at whoever just connected. The launch track derives the address from
      // the connected account because that track DEPLOYS it; here the contract
      // is a fact and the wallet is the variable. Without this every signing
      // row refused with `connect an account first` - which is exactly what the
      // first real run reported.
      const at = CONFIG.contractAddress;
      if (!at) {
        return no(
          'This canary was built without the contract address, so the signing rows have nothing ' +
            'to sign against. Rebuild with `npm run build`.'
        );
      }
      deployer = at;
      chain = new LiveChain({
        contractAddress: at,
        contractName: CONFIG.contractName,
        network: CONFIG.network,
        signer: sign
      });
      mark(1, providerNames(), 'pass');
      ctx.state.walletAddress = session.address;
      return ok(`row 1: pass\naddress   ${session.address}\ntook      ${took}s`, {
        row: 1,
        address: session.address
      });
    } catch (error) {
      mark(1, providerNames(), 'fail');
      return no(`row 1 FAILED: ${(error as Error).message}`);
    }
  },

  'w-no-wallet': async () => {
    // Row 10. Judged, not reported: the page can see whether any provider is
    // here and whether connect refuses quickly.
    const found = collectProviders();
    if (found.length) {
      return no(
        `${found.length} provider(s) are still here: ${providerNames()}.

` +
          'Disable every wallet extension, reload this page, and run it again. This row is the ' +
          'only one that is meaningless with a wallet present.'
      );
    }
    const started = Date.now();
    try {
      await connectWallet();
      mark(10, 'none', 'fail');
      return no('row 10 FAILED: it returned an address with no wallet installed.');
    } catch (error) {
      const took = Date.now() - started;
      const code = (error as { code?: string }).code;
      const said = String((error as Error).message || '');
      // Fast AND specific. "It eventually gave up" is not the same as "it said
      // there is no wallet", and only one of them is a good experience.
      const passed = code === 'NO_WALLET' && took < 10_000;
      mark(10, 'none', passed ? 'pass' : 'fail');
      return passed
        ? ok(`row 10: pass - said so in ${Math.round(took / 100) / 10}s.
${said}`, { row: 10 })
        : no(`row 10 FAILED after ${Math.round(took / 100) / 10}s with code ${String(code)}: ${said}`);
    }
  },

  'w-locked': async () => {
    // Row 11. The wallet puts its own unlock screen up; what is being judged is
    // that the board WAITS for it rather than reporting no wallet.
    if (!collectProviders().length) {
      return no('No provider is here at all, so a locked one cannot be told from an absent one.');
    }
    const started = Date.now();
    try {
      const session = await connectWallet();
      const took = Math.round((Date.now() - started) / 100) / 10;
      mark(11, providerNames(), 'pass');
      return ok(
        `row 11: pass - waited ${took}s through the unlock and connected.
${session.address}`,
        { row: 11 }
      );
    } catch (error) {
      const said = String((error as Error).message || '');
      mark(11, providerNames(), 'fail');
      return no(
        `row 11 FAILED: ${said}

If this says there is no wallet, the board mistook a LOCKED ` +
          'wallet for an absent one, which is the fault this row exists to catch.'
      );
    }
  },

  'w-late': async () => {
    // Row 14, simulated exactly rather than raced by hand. `waitForProvider` is
    // the code under test, so the providers are hidden, the wait is started, and
    // they are put back while it is still waiting. Nothing about reload timing
    // is involved, and the thing being proven is the same.
    const w = globalThis as unknown as Record<string, unknown>;
    const hidden: [string, unknown][] = [];
    for (const key of ['XverseProviders', 'xverseProviders', 'LeatherProvider', 'StacksProvider', 'btc']) {
      if (w[key] !== undefined) {
        hidden.push([key, w[key]]);
        delete w[key];
      }
    }
    if (!hidden.length) {
      return no('No provider is here to hide, so a late one cannot be simulated.');
    }
    try {
      if (collectProviders().length) {
        return no('Hiding the providers did not work, so this would prove nothing.');
      }
      const waiting = waitForProvider({ timeoutMs: 8_000 });
      setTimeout(() => {
        for (const [key, value] of hidden) w[key] = value;
      }, 1_200);
      const found = await waiting;
      const passed = found !== null;
      mark(14, found?.label ?? 'none', passed ? 'pass' : 'fail');
      return passed
        ? ok(`row 14: pass - found ${found!.label} after it appeared.`, { row: 14 })
        : no('row 14 FAILED: a provider that appeared late was never picked up.');
    } finally {
      for (const [key, value] of hidden) w[key] = value;
    }
  },

  'w-network': async () => {
    // Row 13. Connect, work out the network from the address, and see whether
    // anything refuses.
    let address: string;
    try {
      address = (await connectWallet()).address;
    } catch (error) {
      mark(13, providerNames(), 'fail');
      return no(`row 13: could not connect at all: ${(error as Error).message}`);
    }
    const on = networkFromAddress(address);
    if (on === CONFIG.network) {
      return no(
        `Connected on ${on}, which is what this build is for - so there is nothing to refuse.
` +
          `${address}

Switch the wallet to the other network and run this again.`
      );
    }
    // The board does not read the network anywhere. `networkFromAddress` is
    // exported and called by nothing, so a testnet wallet on a mainnet build is
    // simply used. That is the row failing, and it is a real finding rather than
    // a box to tick.
    mark(13, providerNames(), 'fail');
    return no(
      `row 13 FAILED: connected on ${String(on)} against a ${CONFIG.network} build and NOTHING ` +
        `refused.
${address}

The board never reads the network: networkFromAddress is ` +
        'exported and called by nothing. Until something does, this row cannot pass.'
    );
  },

  'w-bridge': async () => {
    // Rows 8 and 9 are one question asked from two places, and this page can
    // only ever be standing in one of them. So it records the half it is in and
    // says plainly that the other needs the other page.
    const framed = isFramed();
    const bridged = usingHostBridge();
    const blocked = signingBlockedReason();

    if (bridged) {
      mark(8, providerNames(), 'pass');
      return ok(
        `row 8: pass - framed with a host bridge, so signing goes through the host.\n` +
          `framed ${framed}, bridge ${bridged}\n\n` +
          'Row 9 needs this page opened OFF the runtime, or on it without a walletBridgeToken.',
        { row: 8 }
      );
    }

    // Unframed. The board must refuse UP FRONT rather than produce a failed
    // transaction, and that is what costs a fee when it is wrong.
    if (shimInstalled() && blocked === 'no-bridge') {
      mark(9, providerNames(), 'pass');
      return ok(
        `row 9: pass - the shim is installed with no bridge, and signing is refused up front ` +
          `rather than attempted.\nframed ${framed}, bridge ${bridged}\n\n` +
          'Row 8 needs this page opened through the Xtrata site.',
        { row: 9 }
      );
    }
    return no(
      `Neither row can be judged here: framed ${framed}, shim ${shimInstalled()}, bridge ` +
        `${bridged}, blocked ${String(blocked)}. Row 8 wants the Xtrata site; row 9 wants the ` +
        'runtime with no bridge token.'
    );
  },

  'w-open': async (ctx) => {
    // Row 2. One prompt, one transaction, 1.00 STX capped by a post condition.
    const chain = requireChain();
    const rules = normaliseRules({ ...DEFAULT_RULES });
    try {
      const sent = await chain.openGame(rulesHash(rules), false);
      const outcome = await ctx.confirm(sent.txid ?? '', 'the game to open');
      const passed = outcome.status === 'success';
      mark(2, sent.provider ?? providerNames(), passed ? 'pass' : 'fail', sent.txid ?? '-');
      if (!passed) return no(`row 2 FAILED: ${outcome.status}`);
      const count = await chain.getGameCount();
      ctx.state.walletGame = count;
      return ok(
        `row 2: pass\ngame      ${count}\nprovider  ${sent.provider}\ntxid      ${sent.txid}`,
        { row: 2, game: count, txid: sent.txid }
      );
    } catch (error) {
      mark(2, providerNames(), 'fail');
      return no(`row 2 FAILED: ${(error as Error).message}`);
    }
  },

  'w-move': async (ctx) => {
    // Row 3. One prompt, one transaction, and NOTHING sent - the wallet should
    // now say nothing whatever about a transfer, because with no sponsorship the
    // call declares that no money moves.
    const chain = requireChain();
    const game = Number(ctx.state.walletGame);
    if (!game) return no('Row 2 has to open a game first.');
    try {
      const sent = await chain.submit(game, 'e2e4', { expectRebate: false });
      const outcome = await ctx.confirm(sent.txid ?? '', 'the move to land');
      const passed = outcome.status === 'success';
      mark(3, sent.provider ?? providerNames(), passed ? 'pass' : 'fail', sent.txid ?? '-');
      return passed
        ? ok(
            `row 3: pass\nprovider  ${sent.provider}\ntxid      ${sent.txid}\n\n` +
              'Check what the wallet SAID: with no sponsorship it should have mentioned no ' +
              'transfer at all.',
            { row: 3, txid: sent.txid }
          )
        : no(`row 3 FAILED: ${outcome.status}`);
    } catch (error) {
      mark(3, providerNames(), 'fail');
      return no(`row 3 FAILED: ${(error as Error).message}`);
    }
  },

  'w-cancel': async (ctx) => {
    // Row 12. Cancelling is an ANSWER, so the board must report it and must not
    // go round the provider list asking the same question again.
    const chain = requireChain();
    const game = Number(ctx.state.walletGame) || 1;
    try {
      await chain.submit(game, 'a2a3', { expectRebate: false });
      mark(12, providerNames(), 'fail');
      return no('row 12 FAILED: the request was not cancelled. Press Cancel in the wallet.');
    } catch (error) {
      const message = String((error as Error).message || '');
      const cancelled = userCancelled(error);
      mark(12, providerNames(), cancelled ? 'pass' : 'fail');
      return cancelled
        ? ok(`row 12: pass - reported as a cancellation.\n${message}`, { row: 12 })
        : no(`row 12 FAILED: the refusal was not read as a cancellation.\n${message}`);
    }
  },

  'w-sponsored': async (ctx) => {
    // Row 4. The one that has never run anywhere.
    const chain = requireChain();
    const game = Number(ctx.state.walletGame);
    if (!game) return no('Row 2 has to open a game first.');
    if (!signer) return no('Connect first.');
    try {
      const before = await chain.getSponsorship(game, signer);
      if (!before) {
        return no(
          `No sponsorship exists for ${signer} on game ${game}. Fund one from the launch track ` +
            'first - this row proves the post condition is ACCEPTED, which needs a rebate to be ' +
            'possible at all.'
        );
      }
      const sent = await chain.submit(game, 'e7e5');
      const outcome = await ctx.confirm(sent.txid ?? '', 'the sponsored move to land');
      const after = await chain.getSponsorship(game, signer);
      const spent = after && before.rebatesLeft > after.rebatesLeft;
      const passed = outcome.status === 'success' && Boolean(spent);
      mark(4, sent.provider ?? providerNames(), passed ? 'pass' : 'fail', sent.txid ?? '-');
      if (outcome.status !== 'success') {
        return no(
          `row 4 FAILED: ${outcome.status}\n\nIf this aborted, the ` +
            'contract-principal post condition was rejected - which is exactly what this row ' +
            'exists to find out.'
        );
      }
      return passed
        ? ok(
            `row 4: pass - the post condition was accepted and the rebate arrived.\n` +
              `rebates   ${before.rebatesLeft} -> ${after?.rebatesLeft}\n` +
              `provider  ${sent.provider}\ntxid      ${sent.txid}`,
            { row: 4, txid: sent.txid }
          )
        : no('row 4 FAILED: the transaction succeeded but no rebate was spent.');
    } catch (error) {
      mark(4, providerNames(), 'fail');
      return no(`row 4 FAILED: ${(error as Error).message}`);
    }
  },

  'w-record': async (ctx) => {
    // Rows 5 to 7 are this whole track run on another wallet or another device,
    // so they cannot be a step here - they are a second and third run of this
    // page, and what this one can do is carry their outcome across.
    const elsewhere: [number, string][] = [
      [5, 'xverse-mobile'],
      [6, 'leather-desktop'],
      [7, 'leather-mobile']
    ];
    for (const [row, field] of elsewhere) {
      const said = ctx.input(field).trim();
      if (said) mark(row, field, said.toLowerCase() === 'pass' ? 'pass' : 'fail', '-');
    }

    const build = CONFIG.boardSha256 ?? 'UNKNOWN';
    const lines: string[] = [];
    const missing: number[] = [];
    for (let row = 1; row <= 14; row++) {
      const found = matrix.get(row);
      if (!found) {
        missing.push(row);
        continue;
      }
      lines.push(
        `RESULT row=${row} build=${build} provider=${found.provider} outcome=${found.outcome} ` +
          `txid=${found.txid}`
      );
    }

    const block = lines.join('\n');
    const note = missing.length
      ? `\n\nStill missing: ${missing.join(', ')}. The release gate wants all fourteen.`
      : '\n\nAll fourteen. Paste this into the Results block in harness/wallets/MATRIX.md.';
    return ok(`${block}${note}`, { rows: lines.length, missing });
  }
};

const handlers: Record<string, StepHandler> = {
  ...walletHandlers,
  wallet: async () => {
    const providers = collectProviders();
    const blocked = signingBlockedReason();
    const lines = [
      `providers      ${providers.length ? providers.map((p) => p.label).join(', ') : 'none'}`,
      `xtrata shim    ${shimInstalled()}`,
      `framed         ${isFramed()}`,
      `host bridge    ${usingHostBridge()}`,
      `can sign       ${blocked === null}`
    ];
    if (blocked === 'no-wallet') return no(`${lines.join('\n')}\n\nInstall and unlock a wallet.`);
    if (blocked === 'no-bridge') {
      return no(
        `${lines.join('\n')}\n\nThis page is under the Xtrata shim with no host bridge, so ` +
          'stx_callContract will be refused with -32601. Open it through the Xtrata site, or off ' +
          'the runtime entirely.'
      );
    }
    return ok(lines.join('\n'));
  },

  account: async (ctx) => {
    const found = await connect();
    if (!found) return no('no wallet returned an address');
    deployer = found;
    signer = found;
    const address = found;

    const network = address.startsWith('SP') || address.startsWith('SM') ? 'mainnet' : 'testnet';
    if (network !== CONFIG.network) {
      return no(`connected on ${network} but this page is built for ${CONFIG.network}`);
    }

    chain = new LiveChain({
      contractAddress: deployer,
      contractName: CONFIG.contractName,
      network: CONFIG.network,
      signer: sign
    });

    // Read the balance from the chain rather than asking the wallet, so the
    // number shown is the one the contract will see.
    const response = await fetch(`${chain.apiBase}/extended/v1/address/${address}/balances`);
    const body = (await response.json()) as { stx?: { balance?: string } };
    const balance = BigInt(body.stx?.balance ?? '0');
    state.address = address;
    ctx.log('ok', `connected as ${address}`);

    if (balance < 5_000_000n) {
      return no(`${address}\nbalance ${stx(balance)} — too little to deploy and exercise`);
    }
    return ok(`address   ${address}\nnetwork   ${network}\nbalance   ${stx(balance)}`, {
      address,
      balance: String(balance)
    });
  },

  'name-free': async () => {
    const target = `${deployer}.${CONFIG.contractName}`;
    const base = requireChain().apiBase;
    const response = await fetch(
      `${base}/v2/contracts/interface/${deployer}/${CONFIG.contractName}`
    );
    if (response.ok) {
      // Already there. That is a RESUME, not a failure: a run gets interrupted,
      // a tab gets closed, a page gets rebuilt. Treating it as an error would
      // leave the only way forward being to deploy a second contract, which is
      // the exact mistake worth preventing.
      //
      // Nothing is taken on trust here. The deploy step will refuse to send
      // anything, and the step after it reads the contract back and checks it
      // is the one this page means.
      state.alreadyDeployed = true;
      return ok(
        `${target} ALREADY EXISTS.\n\nResuming against it. The deploy step will send nothing, ` +
          'and the step after it verifies this is the right contract.'
      );
    }
    state.alreadyDeployed = false;
    if (response.status !== 404) {
      // A 404 is the chain answering "no such contract". Anything else is the
      // endpoint failing, and treating that as "free" would be a deploy into
      // the dark.
      return no(`could not tell: the endpoint answered ${response.status}, which is not a 404`);
    }
    return ok(`${target} is free`);
  },

  source: async () => {
    if (!CONFIG.source) return no('no contract source was inlined into this page');
    const hash = sha256Hex(CONFIG.source);
    state.contractHash = hash;
    return ok(
      `bytes     ${CONFIG.source.length.toLocaleString()}\n` +
        `sha256    ${hash}\n` +
        `clarity   ${CONFIG.clarityVersion}\n\n` +
        'This must equal contractHash in dist/manifest.json.',
      { contractHash: hash, bytes: CONFIG.source.length }
    );
  },

  deploy: async (ctx) => {
    if (state.alreadyDeployed) {
      // A name can only be used once per address, so deploying again cannot
      // replace anything - it would only fail after taking a fee, or succeed
      // under a different name and leave two contracts where one was meant.
      ctx.log('warn', 'the contract is already deployed; nothing was sent');
      return ok(
        `${contractId()} was already deployed.\n\nNOTHING WAS SENT. Read it back next to ` +
          'confirm it is the contract this page means.'
      );
    }
    const result = await deployContract(CONFIG.contractName, CONFIG.source);
    state.deployTxid = result.txid;
    ctx.log('ok', `deploy submitted via ${result.provider}`, result.txid);
    return ok(
      `txid      ${result.txid}\nprovider  ${result.provider}\n\n` +
        'Submitted, NOT verified. Wait for it to confirm, then run the next step: a confirmed ' +
        'transaction is not the same as a contract that says what you meant.',
      { deployTxid: result.txid, provider: result.provider }
    );
  },

  deployed: async () => {
    const c = requireChain();
    const [version, protocol, self, solvent] = await Promise.all([
      c.getFormatVersion(),
      c.callReadOnly('get-protocol'),
      c.callReadOnly('get-self'),
      c.isSolvent()
    ]);
    const expectedSelf = contractId();
    if (String(self) !== expectedSelf) {
      return no(`the contract reports itself as ${String(self)}, not ${expectedSelf}`);
    }
    if (String(protocol) !== 'xchess-core-v1') {
      return no(`the contract reports protocol ${String(protocol)}`);
    }
    return ok(
      `contract  ${expectedSelf}\nprotocol  ${String(protocol)}\nformat    ${version}\n` +
        `solvent   ${solvent}`,
      { contract: expectedSelf, formatVersion: version }
    );
  },

  configure: async (ctx) => {
    const c = requireChain();

    // Already set? A second set-sponsorship writes the same numbers for another
    // network fee and proves nothing.
    const current = await c.getSponsorPrice();
    const wanted = BigInt(ctx.input('rebate-count') || '45');
    if (
      current.bootstrap === 60_000n &&
      current.liability === 10_000n * wanted &&
      current.margin === 50_000n
    ) {
      ctx.log('warn', 'the launch constants are already set; nothing was sent');
      return ok('Already at the launch values. NOTHING WAS SENT. Read them back next.');
    }

    // The launch values from ADR-0004, measured rather than guessed.
    //
    // The count is the one that is worth overriding. At 45 the allowance takes
    // 45 signatures to spend, which makes the exhaustion step impractical to
    // reach - and it CANNOT be reached by draining the wallet instead, because
    // the rebate is larger than the median fee and the balance climbs. Setting
    // a small count and opening a fresh sponsored game exhausts one in three.
    // Existing rows keep the count they were funded with, so this is safe.
    const count = BigInt(ctx.input('rebate-count') || '45');
    const result = await c.setSponsorship(60_000n, 10_000n, count, 50_000n);
    ctx.log('ok', 'set-sponsorship submitted', result.txid);
    return ok(
      `txid ${result.txid}\n\nbootstrap 0.060  rebate 0.010  count ${count}  margin 0.050\n\n` +
        'Submitted, NOT verified. Read it back next.',
      { configureTxid: result.txid }
    );
  },

  configured: async () => {
    const c = requireChain();
    const price = await c.getSponsorPrice();
    const fee = await c.getOpenFee();
    const expected = { bootstrap: 60_000n, rebate: 10_000n, liability: 450_000n, margin: 50_000n };
    const problems: string[] = [];
    if (price.bootstrap !== expected.bootstrap) problems.push(`bootstrap is ${price.bootstrap}`);
    if (price.liability !== expected.liability) problems.push(`liability is ${price.liability}`);
    if (price.margin !== expected.margin) problems.push(`margin is ${price.margin}`);
    const detail =
      `open fee    ${stx(fee)}\nbootstrap   ${stx(price.bootstrap)}\n` +
      `liability   ${stx(price.liability)}\nmargin      ${stx(price.margin)}\n` +
      `sponsor     ${stx(price.total)} per player`;
    return problems.length ? no(`${detail}\n\nnot the launch values: ${problems.join(', ')}`) : ok(detail, { price: detail });
  },

  standard: async (ctx) => {
    const c = requireChain();
    const count = await c.getGameCount();

    // Already opened one? Adopt it rather than paying the fee twice.
    //
    // Opening a game costs the full X Chess fee, and a run that was
    // interrupted after paying it should not have to pay again to carry on.
    // This is a read, it costs nothing, and it is honest: the game it adopts
    // is one this account actually opened on this contract.
    for (let id = count; id >= Math.max(1, count - 50); id--) {
      const row = await c.getGame(id);
      if (row && row.openedBy === signer) {
        state.standardGame = id;
        ctx.log('warn', `game ${id} was already opened by this account; nothing was sent`);
        return ok(
          `game ${id} was already opened by ${signer}.\n\nNOTHING WAS SENT and no fee was paid. ` +
            `opened at height ${row.openedAt}, ${row.nextSeq} entr${row.nextSeq === 1 ? 'y' : 'ies'}.`,
          { standardGame: id, adopted: true }
        );
      }
    }

    const rules = normaliseRules({ ...DEFAULT_RULES, white: signer!, black: 'anyone-else' });
    const result = await c.openGame(rulesHash(rules), false);
    state.standardRules = rules;
    return ok(
      `txid ${result.txid}\ngames before ${count}\n\nWait for it to confirm, then Redo this ` +
        'step to re-read, or continue: the next step reads the log.',
      { standardTxid: result.txid }
    );
  },

  submit: async (ctx) => {
    const c = requireChain();
    const game = Number(state.standardGame ?? (await c.getGameCount()));
    const before = await c.getAllEntries(game);
    const mine = before.filter((e) => e.sender === signer);

    // Already submitted to this game? Say what is there rather than adding to
    // it. This step exists to prove ONE click makes ONE entry, and re-running
    // it would only pay another network fee to learn the same thing.
    if (mine.length) {
      ctx.log('warn', `this account already has ${mine.length} entr(y/ies) in game ${game}`);
      return ok(
        `game ${game}\nentries ${before.length}, of which ${mine.length} from this account\n` +
          `values ${mine.map((e) => e.value).join(' ')}\n\nNOTHING WAS SENT. If exactly one ` +
          'entry appeared per click, the page is booting once, which is what this step checks.',
        { standardGame: game, entries: before.length, adopted: true }
      );
    }

    await c.submit(game, 'e2e4');
    state.standardGame = game;
    return ok(
      `game ${game}\nentries before ${before.length}\n\nOnce confirmed, there must be EXACTLY ONE ` +
        'more entry. Two would mean the page booted twice and every move costs double.',
      { standardGame: game }
    );
  },

  /**
   * The zero-STX open, or the proof that it already happened.
   *
   * This step used to demand a wallet holding exactly zero AT THE MOMENT IT
   * RAN, which meant that once the flow had worked, running the page again
   * needed a brand new empty wallet - every time. The named wallet has by then
   * been bootstrapped, played, and earned rebates, so it can never satisfy the
   * check again. The gate was failing on its own success.
   *
   * The claim was never about a balance now. It is that a wallet holding
   * NOTHING was funded by the contract, in one transaction, with no server. So
   * the step looks for that having happened, in chain history, where it is true
   * permanently:
   *
   *   balance at (openedAt - 1) == 0        it really did hold nothing
   *   balance at  openedAt      == bootstrap the contract really did fund it
   *
   * That is stronger than the live check it replaces, not weaker. A nearly
   * empty wallet could pass "holds zero right now" by rounding; nothing passes
   * "held exactly zero in the block before the contract paid it". A fresh
   * contract has no such history, so the production run still has to do it for
   * real.
   */
  sponsored: async (ctx) => {
    const c = requireChain();
    const opponent = ctx.input('opponent').toUpperCase();
    if (!/^S[PM][0-9A-HJKMNP-TV-Z]{20,}$/.test(opponent)) {
      return no('type the address of a wallet holding exactly zero STX');
    }

    const balanceAt = async (who: string, block?: number): Promise<bigint> =>
      fetch(
        `${c.apiBase}/extended/v1/address/${who}/balances${block ? `?until_block=${block}` : ''}`
      )
        .then((r) => r.json())
        .then((b: { stx?: { balance?: string } }) => BigInt(b.stx?.balance ?? '0'));

    // Has this contract already done it, for this wallet? Bounded scan: the
    // canary contract has a handful of games, and the answer is usually the one
    // this page opened earlier in the session.
    const count = await c.getGameCount();
    const candidates = state.sponsoredGame
      ? [Number(state.sponsoredGame), ...Array.from({ length: count }, (_, i) => i + 1)]
      : Array.from({ length: count }, (_, i) => i + 1);

    for (const id of [...new Set(candidates)].filter((n) => n >= 1 && n <= count)) {
      const row = await c.getSponsorship(id, opponent);
      if (!row) continue;
      const game = await c.getGame(id);
      if (!game) continue;

      const before = await balanceAt(opponent, game.openedAt - 1);
      const after = await balanceAt(opponent, game.openedAt);
      if (before !== 0n) {
        ctx.log(
          'warn',
          `game ${id} sponsors this wallet, but it held ${stx(before)} beforehand, so it does ` +
            'not prove the zero-STX claim'
        );
        continue;
      }

      state.opponent = opponent;
      state.sponsoredGame = id;
      state.sponsoredRules = normaliseRules({
        ...DEFAULT_RULES,
        white: String(game.openedBy),
        black: opponent
      });
      return ok(
        `ALREADY PROVEN ON THIS CONTRACT. Nothing was sent.\n\n` +
          `game        ${id}, opened by ${game.openedBy} at block ${game.openedAt}\n` +
          `beneficiary ${opponent}\n` +
          `held        ${stx(before)} at block ${game.openedAt - 1}\n` +
          `received    ${stx(after)} at block ${game.openedAt}\n` +
          `funded by   ${row.fundedBy}\n\n` +
          'A wallet holding exactly nothing was funded by the contract in one transaction, with ' +
          'no server involved. That is the claim, and the chain still says so - which is why ' +
          'this does not need a fresh empty wallet every time the page is opened.',
        { opponent, sponsoredGame: id, sponsoredProvenAt: String(game.openedAt) }
      );
    }

    // Not done yet on this contract: do it for real, and insist on a true zero.
    const balance = await balanceAt(opponent);
    if (balance !== 0n) {
      return no(
        `${opponent} holds ${stx(balance)}, and this contract has no sponsored game for it ` +
          'that started from zero. Use a wallet holding EXACTLY zero: a nearly-empty one would ' +
          'prove something weaker and would pass for the wrong reason.'
      );
    }
    const rules = normaliseRules({ ...DEFAULT_RULES, white: signer!, black: opponent });
    const result = await c.openSponsoredGame(rulesHash(rules), false, opponent);
    state.opponent = opponent;
    state.sponsoredRules = rules;
    return ok(`txid ${result.txid}\nopponent ${opponent} held ${stx(balance)} before this`, {
      opponent,
      sponsoredTxid: result.txid
    });
  },

  bootstrapped: async () => {
    const c = requireChain();
    const opponent = String(state.opponent);
    const count = await c.getGameCount();

    // Find the game the sponsorship is actually on, rather than assuming it is
    // the newest. If the sponsored open aborted, the newest game is somebody
    // else's and pointing at it says something confusing and untrue.
    let game = 0;
    let row = null;
    for (let id = count; id >= Math.max(1, count - 25); id--) {
      const found = await c.getSponsorship(id, opponent);
      if (found) {
        game = id;
        row = found;
        break;
      }
    }

    if (!row) {
      return no(
        `No sponsorship for ${opponent} exists on any recent game.\n\n` +
          'The sponsored open did not land. If the wallet showed it as failing, check the ' +
          'transaction in an explorer: a status of abort_by_post_condition means the CONTRACT ' +
          'succeeded and the post conditions rejected the result, which still costs the network ' +
          'fee. Redo the previous step once the cause is fixed.'
      );
    }

    const at = async (block?: number): Promise<bigint> =>
      fetch(
        `${c.apiBase}/extended/v1/address/${opponent}/balances${
          block ? `?until_block=${block}` : ''
        }`
      )
        .then((r) => r.json())
        .then((b: { stx?: { balance?: string } }) => BigInt(b.stx?.balance ?? '0'));

    const gameRow = await c.getGame(game);
    if (!gameRow) return no(`game ${game} does not exist`);

    // Asked of the BLOCK THE GAME WAS OPENED IN, not of today.
    //
    // A live balance greater than zero proves only that the wallet has money,
    // which a manual transfer would also produce - and it stops being true the
    // moment the wallet spends. The arrival is a fact about two blocks, and it
    // stays a fact.
    const before = await at(gameRow.openedAt - 1);
    const arrived = await at(gameRow.openedAt);
    const now = await at();

    if (arrived <= before) {
      return no(
        `${opponent} held ${stx(before)} before block ${gameRow.openedAt} and ${stx(arrived)} ` +
          'after it, so the bootstrap did not arrive in the sponsored open.'
      );
    }
    state.sponsoredGame = game;
    return ok(
      `game        ${game}, opened at block ${gameRow.openedAt}\n` +
        `opponent    ${opponent}\n` +
        `held        ${stx(before)} the block before\n` +
        `received    ${stx(arrived - before)} in the sponsored open\n` +
        `holds now   ${stx(now)}\n` +
        `reserved    ${stx(row.reserved)}\nrebates     ${row.rebatesLeft} at ${stx(row.rebate)}\n\n` +
        'Read from the two blocks either side of the open, so it stays true however much the ' +
        'wallet spends afterwards.',
      { sponsoredGame: game, bootstrapArrived: String(arrived - before) }
    );
  },

  /**
   * The sponsored move, signed BY THE SPONSORED WALLET.
   *
   * This is the step the whole page exists for, so it is driven here rather
   * than pasted in afterwards: the point is to exercise the real path - the
   * guard, the contract-principal post condition, the wallet, the bridge - not
   * to record that somebody once did.
   *
   * Two passes. The first switches accounts and submits; the second reads the
   * balance back and confirms the rebate landed. A step is done when it has
   * been read, and a broadcast transaction has not been read.
   */
  rebate: async (ctx) => {
    const c = requireChain();
    const opponent = String(state.opponent);
    const game = Number(state.sponsoredGame);
    if (!opponent || !game) return no('run the sponsored steps first');

    const row = await c.getSponsorship(game, opponent);
    if (!row) return no(`no sponsorship for ${opponent} on game ${game}`);

    const balance = async (who: string): Promise<bigint> =>
      fetch(`${c.apiBase}/extended/v1/address/${who}/balances`)
        .then((r) => r.json())
        .then((b: { stx?: { balance?: string } }) => BigInt(b.stx?.balance ?? '0'));

    // Second pass: a rebate has already been spent, so read the result.
    const spent = Number(state.rebateSubmittedAt);
    if (spent && row.rebatesLeft < BigInt(spent)) {
      const entries = await c.getAllEntries(game);
      const theirs = entries.filter((e) => e.sender === opponent);
      const now = await balance(opponent);
      return ok(
        `SPONSORED MOVE CONFIRMED.\n\n` +
          `game        ${game}\n` +
          `submitted   ${theirs.map((e) => e.value).join(' ')}\n` +
          `allowance   ${spent} -> ${row.rebatesLeft}\n` +
          `reserved    ${stx(row.reserved)}\n` +
          `balance     ${stx(now)}\n\n` +
          'The contract paid a rebate to the wallet that submitted, in the same transaction, ' +
          'and the post condition covering it was accepted. That is risk R1 closed.\n\n' +
          'Switch the wallet back to the deploying account before the next step.',
        {
          rebateGame: game,
          rebatePaid: String(row.rebate),
          allowanceAfter: String(row.rebatesLeft),
          beneficiaryBalance: String(now)
        }
      );
    }

    // First pass: make sure the SPONSORED wallet is the one signing.
    if (signer !== opponent) {
      const found = await connect({ forcePrompt: true });
      if (!found) return no('the wallet did not answer');
      if (found !== opponent) {
        return no(
          `Connected as ${found}, but this step must be signed by ${opponent} - the wallet that ` +
            'was bootstrapped.\n\nSwitch account inside the wallet extension, then run this ' +
            'again. If the chooser did not appear, disconnect this site in the wallet first.'
        );
      }
      signer = found;
      ctx.log('ok', `now signing as the sponsored wallet ${found}`);
    }

    const before = await balance(opponent);
    if (before === 0n) {
      return no(`${opponent} holds nothing; it cannot pay a network fee. Check the bootstrap.`);
    }

    // The rebate is declared so the guard writes a condition for it. Without
    // that the contract's payout is uncovered and deny mode discards the whole
    // transaction after it has already succeeded.
    await c.submit(game, 'e7e5');
    state.rebateSubmittedAt = Number(row.rebatesLeft);

    return no(
      `Submitted as ${opponent}.\n\n` +
        `balance before  ${stx(before)}\n` +
        `rebate due      ${stx(row.rebate)}\n` +
        `allowance now   ${row.rebatesLeft}\n\n` +
        'NOT VERIFIED YET. Wait for it to confirm, then run this step again and it will read ' +
        'the result back. If the wallet reported failure, check the transaction: ' +
        'abort_by_post_condition means the contract succeeded and a transfer went uncovered.'
    );
  },

  /**
   * Spend the allowance, then prove a submission still lands without one.
   *
   * DRIVEN END TO END. Earlier versions of this step asked for a written
   * description, then asked the operator to go and arrange the state by hand
   * across three other steps. Neither is a decision anybody is making - it is
   * just work - so the step does it.
   *
   * IT NEEDS NO CHESS. The contract filters on LENGTH and nothing else; it
   * never learns the game. A four-character submission earns its rebate whether
   * or not it is a legal move, and every reader skips it afterwards. Draining
   * an allowance is a run of signatures, not a run of moves.
   *
   * What is left for a person: approving each transaction in the wallet, and
   * switching to the sponsored account when asked. Those are the two things
   * that must never be automated, and everything around them now is.
   */
  exhaustion: async (ctx) => {
    const c = requireChain();
    const who = String(state.opponent);
    if (!who) return no('run the sponsored steps first');

    // A submission that is deliberately not a move. Length is all the contract
    // checks, so this is stored, charged and rebated exactly like a real move,
    // and every reader skips it. Said out loud so that nobody reading the log
    // later thinks the canary played nonsense chess by accident.
    const JUNK = 'zzzz';

    const asSponsored = async (): Promise<string | null> => {
      if (signer === who) return null;
      const found = await connect({ forcePrompt: true });
      if (!found) return 'the wallet did not answer';
      if (found !== who) {
        return `this must be signed by ${who}, but the wallet offered ${found}. Switch account.`;
      }
      return null;
    };

    // Which game is being drained? A small one made for the purpose if there is
    // one, otherwise whatever the sponsored steps used.
    let game = Number(state.exhaustGame || state.sponsoredGame);
    let row = game ? await c.getSponsorship(game, who) : null;

    // Too big to spend by hand, and it cannot be reached by draining the wallet
    // either - the rebate is larger than the median fee, so the balance climbs.
    // Build a small one instead, in this step, rather than sending somebody
    // away to do it.
    if (!row || row.rebatesLeft > 6n) {
      const price = await c.getSponsorPrice();
      if (price.liability > 20_000n) {
        ctx.log('info', 'setting the rebate count to 2 so an allowance can be spent by hand');
        const set = await c.setSponsorship(60_000n, 10_000n, 2n, 50_000n);
        const done = await ctx.confirm(set.txid ?? '', 'set-sponsorship');
        if (!done.ok) return no(`set-sponsorship ended as ${done.status}`);
      }

      ctx.log('info', `opening a small sponsored game for ${who}`);
      const rules = normaliseRules({ ...DEFAULT_RULES, white: signer!, black: who });
      const opened = await c.openSponsoredGame(rulesHash(rules), false, who);
      const done = await ctx.confirm(opened.txid ?? '', 'the sponsored open');
      if (!done.ok) return no(`the sponsored open ended as ${done.status}`);

      game = await c.getGameCount();
      row = await c.getSponsorship(game, who);
      if (!row) return no(`opened game ${game} but it carries no sponsorship for ${who}`);
      state.exhaustGame = game;
      ctx.log('ok', `game ${game} has ${row.rebatesLeft} rebates to spend`);
    }

    // Spend whatever is left, one signature each, waiting between so the
    // allowance read is never stale.
    while (row && row.rebatesLeft > 0n) {
      const wrong = await asSponsored();
      if (wrong) return no(wrong);
      ctx.log('info', `spending a rebate: ${row.rebatesLeft} left`);
      const sent = await c.submit(game, JUNK);
      const done = await ctx.confirm(sent.txid ?? '', `submission of ${JUNK}`);
      if (!done.ok) return no(`the submission ended as ${done.status}`);
      row = await c.getSponsorship(game, who);
    }

    // The assertion this step exists for: with no allowance left, a submission
    // must still land, paying its own gas.
    const before = await balanceOf(c, who);
    const wrong = await asSponsored();
    if (wrong) return no(wrong);
    ctx.log('info', 'allowance is gone; submitting once more with no rebate behind it');
    const last = await c.submit(game, JUNK);
    const settled = await ctx.confirm(last.txid ?? '', 'the unsponsored submission');
    if (!settled.ok) return no(`the last submission ended as ${settled.status}`);

    const after = await balanceOf(c, who);
    const entries = await c.getAllEntries(game);
    const stored = entries.filter((e) => e.sender === who).length;
    const finalRow = await c.getSponsorship(game, who);

    return ok(
      `RUNNING OUT DID NOT END THE GAME.\n\n` +
        `game        ${game}\n` +
        `allowance   ${finalRow?.rebatesLeft ?? 0n} rebates left\n` +
        `submissions ${stored} stored from ${who}\n` +
        `balance     ${stx(before)} -> ${stx(after)}\n` +
        `last txid   ${settled.txid}\n\n` +
        'The final submission carried no rebate. It was stored anyway and the wallet paid its ' +
        'own gas, which is the whole claim: a sponsorship running out is an ordinary economic ' +
        'state, not the end of a game.\n\n' +
        'The submissions are four characters that are not legal moves. The contract checks ' +
        'length and nothing else, so they were stored and charged exactly like moves, and every ' +
        'reader skips them.',
      {
        exhaustedGame: String(game),
        exhaustedSubmissions: String(stored),
        balanceAfterExhaustion: String(after)
      }
    );
  },

  /**
   * The three things that only go wrong once the bytes are permanent.
   *
   * All of them are invisible in ordinary local development, and all of them
   * have happened: a bundle that boots TWICE so every click signs two
   * transactions and every move costs double; a page that reads and replays
   * perfectly and cannot sign at all because there is no host bridge; and an
   * API that is unreachable because the runtime rewrites HTML only, so a script
   * that did not choose the proxy for itself burns the public rate limit from
   * every viewer's address.
   *
   * Reported rather than measured, because the thing being tested is a page
   * OTHER than this one. Run `npm run serve:runtime`, open the board on 4331,
   * and say what happened - the wording asked for is specific so that a run
   * that did not really happen is hard to describe.
   */
  rehearsal: manual(
    'rehearsal-note',
    /boot|once|sign|bridge|read|game/i,
    'Run `npm run serve:runtime` and open the address it prints (NOT xchess.html - the ' +
      'runtime addresses the artefact as an inscription, so a filename there is a 404). Say: whether ' +
      'the version line appears ONCE or twice, whether a wallet could be connected, and which ' +
      'game number you loaded from the chain. If the version line appears twice, STOP - every ' +
      'move from that build would cost two transactions.'
  ),

  topup: async (ctx) => {
    const c = requireChain();
    const game = Number(state.sponsoredGame);
    const opponent = String(state.opponent);
    const before = await c.getSponsorship(game, opponent);
    if (!before) return no(`no sponsorship for ${opponent} on game ${game}`);

    const sent = await c.topUpSponsorship(game, opponent);
    const done = await ctx.confirm(sent.txid ?? '', 'the top-up');
    if (!done.ok) return no(`the top-up ended as ${done.status}`);

    const after = await c.getSponsorship(game, opponent);
    if (!after) return no('the sponsorship vanished, which should not be possible');
    if (after.rebatesLeft <= before.rebatesLeft) {
      return no(
        `the allowance did not grow: ${before.rebatesLeft} before, ${after.rebatesLeft} after`
      );
    }
    return ok(
      `TOPPED UP BY A THIRD ACCOUNT.\n\n` +
        `game        ${game}\n` +
        `allowance   ${before.rebatesLeft} -> ${after.rebatesLeft}\n` +
        `reserved    ${stx(before.reserved)} -> ${stx(after.reserved)}\n` +
        `expiry      ${before.expiry} -> ${after.expiry}\n\n` +
        'Anyone may pay. There is no billing and no account: the payment is the transaction.',
      {
        topUpFrom: String(before.rebatesLeft),
        topUpTo: String(after.rebatesLeft),
        topUpTxid: done.txid
      }
    );
  },

  /**
   * The solvency invariant, on chain rather than in a test.
   *
   * Driven, in both halves. It was a written description, which asks somebody
   * to be their own witness for the single most important safety property the
   * contract has: that the treasury cannot be drained out from under a
   * sponsorship somebody has already paid for.
   *
   * The over-draw is MEANT to fail, and it costs a network fee to prove it.
   * That is the price of the assertion and it is worth paying once.
   */
  treasury: async (ctx) => {
    const c = requireChain();
    const me = signer;
    if (!me) return no('connect the owning wallet first');

    const reservedBefore = await c.getTotalReserved();
    const free = await c.getWithdrawable();
    const contractHeld = await balanceOf(c, c.contractId);

    // Half one: ask for one microSTX more than is free. It must be refused.
    ctx.log('info', `asking for ${stx(free + 1n)}, which is one uSTX more than is free`);
    const over = await c.withdraw(free + 1n, me);
    const overDone = await ctx.confirm(over.txid ?? '', 'the deliberate over-draw');
    if (overDone.ok) {
      return no(
        `THE OVER-DRAW SUCCEEDED. It asked for ${stx(free + 1n)} against ${stx(free)} free and ` +
          'the contract allowed it. The solvency invariant is broken and this contract must not ' +
          'be used. Do not continue.'
      );
    }
    ctx.log('ok', `refused, as it must be: ${overDone.status}`);

    // Half two: take every microSTX that IS free.
    if (free === 0n) {
      return no(
        'nothing is free to withdraw, so the second half cannot be exercised. Open a game or ' +
          'let a sponsorship settle first, then run this again.'
      );
    }
    ctx.log('info', `withdrawing the ${stx(free)} that is genuinely free`);
    const take = await c.withdraw(free, me);
    const takeDone = await ctx.confirm(take.txid ?? '', 'the withdrawal');
    if (!takeDone.ok) return no(`the withdrawal ended as ${takeDone.status}`);

    // And the reserve must be exactly as it was.
    const reservedAfter = await c.getTotalReserved();
    const heldAfter = await balanceOf(c, c.contractId);
    const solvent = await c.isSolvent();
    if (reservedAfter !== reservedBefore) {
      return no(
        `the reserve moved during a withdrawal: ${reservedBefore} -> ${reservedAfter}. It must ` +
          'not. Every microSTX of it is owed to a sponsorship somebody has already paid for.'
      );
    }
    if (!solvent) {
      return no('the contract is no longer solvent after taking only what it said was free');
    }

    return ok(
      `THE OVER-DRAW WAS REFUSED AND THE FREE BALANCE CAME OUT.\n\n` +
        `asked for   ${stx(free + 1n)}  ->  ${overDone.status}\n` +
        `withdrew    ${stx(free)}  ->  success\n` +
        `contract    ${stx(contractHeld)} -> ${stx(heldAfter)}\n` +
        `reserved    ${stx(reservedBefore)}, unchanged\n` +
        `solvent     ${solvent}\n\n` +
        'Every microSTX that was free came out and not one that was owed. A sponsorship already ' +
        'paid for can still pay its rebates, which is the invariant.',
      {
        overDrawStatus: overDone.status,
        withdrew: String(free),
        reservedThroughout: String(reservedBefore)
      }
    );
  },

  /**
   * Anyone may release an expired reserve. No keeper, no cron.
   *
   * The one step here with an irreducible wait: a sponsorship expires 4320
   * blocks after it was funded, which post-Nakamoto is around fifteen hours,
   * and nothing can hurry it. What CAN be removed is having to work out whether
   * the wait is over, and having to describe the result afterwards.
   */
  settle: async (ctx) => {
    const c = requireChain();
    const who = String(state.opponent);
    const count = await c.getGameCount();
    const height = await c.getHeight();

    // Any expired, unsettled sponsorship will do. It is deliberately not
    // restricted to this session's games: the claim is that ANYONE may settle
    // ANY expired reserve.
    let found: { game: number; row: Awaited<ReturnType<typeof c.getSponsorship>> } | null = null;
    let soonest: { game: number; blocks: number } | null = null;

    for (let game = count; game >= Math.max(1, count - 25); game--) {
      const row = who ? await c.getSponsorship(game, who) : null;
      if (!row || row.settled) continue;
      if (height >= row.expiry) {
        found = { game, row };
        break;
      }
      const blocks = row.expiry - height;
      if (!soonest || blocks < soonest.blocks) soonest = { game, blocks };
    }

    if (!found) {
      if (!soonest) return no('no unsettled sponsorship was found to settle');
      const hours = ((soonest.blocks * 12) / 3600).toFixed(1);
      return no(
        `nothing has expired yet. Game ${soonest.game} expires in ${soonest.blocks} blocks, ` +
          `which is roughly ${hours} hours at current block times.\n\n` +
          'There is nothing to do until then, and nothing to arrange - a sponsorship expires ' +
          '4320 blocks after it is funded and no transaction can bring that forward. Come back ' +
          'and press Run; every other step can be finished in the meantime.'
      );
    }

    const reservedBefore = await c.getTotalReserved();
    const releasing = found.row!.reserved;
    ctx.log('info', `settling game ${found.game}, releasing ${stx(releasing)}`);

    const sent = await c.settleSponsorship(found.game, who);
    const done = await ctx.confirm(sent.txid ?? '', 'the settlement');
    if (!done.ok) return no(`the settlement ended as ${done.status}`);

    const after = await c.getSponsorship(found.game, who);
    const reservedAfter = await c.getTotalReserved();
    if (!after?.settled) return no('the settlement confirmed but the row is not marked settled');

    return ok(
      `AN EXPIRED RESERVE WAS RELEASED.\n\n` +
        `game        ${found.game}\n` +
        `expired at  block ${found.row!.expiry}, now ${height}\n` +
        `released    ${stx(releasing)}\n` +
        `reserved    ${stx(reservedBefore)} -> ${stx(reservedAfter)}\n` +
        `settled by  ${signer}\n\n` +
        'No money moved. Releasing the reservation is what turns a liability into treasury, and ' +
        'anyone could have sent this transaction - there is no keeper and no cron, so a ' +
        'renounced contract can never strand a reserve.',
      { settledGame: String(found.game), released: String(releasing) }
    );
  },

  ranked: async () => {
    const c = requireChain();
    const rankedCount = await c.getRankedCount();
    if (rankedCount === 0) return no('no ranked game has been opened on this contract yet');
    const id = await c.getRankedGame(rankedCount - 1);
    if (id === null) return no('the ranked index has a hole in it');
    const game = await c.getGame(id);
    if (!game) return no(`ranked index points at game ${id}, which does not exist`);
    const entries = await c.getAllEntries(id);
    const rules = normaliseRules({ ...DEFAULT_RULES, ranked: true });
    const state_ = replay(
      entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
      { rules }
    );
    const eligibility = checkEligibility(game, state_.rules, state_);
    return ok(
      `ranked games ${rankedCount}\nnewest       ${id}\nentries      ${entries.length}\n` +
        `eligible     ${eligibility.eligible}\nreasons      ${eligibility.reasons.join(', ') || 'none'}`,
      { rankedGame: id, eligible: eligibility.eligible }
    );
  },

  build: async (ctx) => {
    // A reloaded page remembers which steps PASSED but not the address that
    // made them pass - the step statuses are stored and the connection is not.
    // Without this the comparison is against "null.xchess-core-v1-canary" and
    // the failure reads as a bad manifest, which is the one thing it is not.
    if (!deployer) {
      return no(
        'this page has been reloaded, so it no longer knows which account it is connected as. ' +
          'Re-run "Connect, and check the account" above, then run this again. Nothing is lost: ' +
          'the steps that passed are still passed.'
      );
    }
    const raw = ctx.input('manifest');
    let manifest: Record<string, unknown>;
    try {
      manifest = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return no('paste the contents of dist/manifest.json');
    }
    const problems: string[] = [];
    if (manifest.contract !== contractId()) {
      problems.push(`names ${String(manifest.contract)}, not ${contractId()}`);
    }
    // Hashed here if no earlier step did it.
    //
    // The question is whether the manifest describes the contract source THIS
    // PAGE carries, and the page always carries it - so depending on a preflight
    // step to have run was incidental, and on the short track, where that step
    // does not exist, it turned a passing check into a failing one about a hash
    // that was never computed.
    const sourceHash = state.contractHash ?? (CONFIG.source ? sha256Hex(CONFIG.source) : null);
    if (!sourceHash) {
      problems.push('no contract source is inlined in this page, so the manifest cannot be checked against it');
    } else if (manifest.contractHash !== sourceHash) {
      problems.push(
        `contractHash ${String(manifest.contractHash)} does not match the source this page ` +
          `carries (${sourceHash})`
      );
    }
    if (manifest.exact !== true) problems.push('the build is not bound exactly to one contract');
    state.manifest = manifest;
    const detail = `build ${String(manifest.build)}\nhtml  ${String(manifest.htmlSha256)}`;
    return problems.length ? no(`${detail}\n\n${problems.join('\n')}`) : ok(detail, { manifest });
  },

  matrix: manual(
    'matrix-sign',
    /^[0-9a-f]{64}$/i,
    'Run every row of harness/wallets/MATRIX.md against THIS build, write the build hash into the ' +
      'sign-off block, and paste that hash here.'
  ),

  'inscribe-canary': manual(
    'canary-inscription',
    /^\d+$|^[0-9a-f]{64}i\d+$/i,
    'Inscribe dist/xchess.html through Xtrata and paste the inscription id.'
  ),

  // The short track's own three. Separate from the launch sequence's versions
  // because the WORDING is the whole value: reusing those ids meant a page
  // asking for a "canary inscription id" when it wanted the board's, and
  // quoting section numbers from a brief this track is not running.
  'inscribe-board': manual(
    'board-inscription',
    /^\d+$|^[0-9a-f]{64}i\d+$/i,
    'Inscribe dist/xchess.html with your own Xtrata tooling, then paste the inscription id it ' +
      'gives back. This page does not inscribe anything.'
  ),

  'inscription-live': manual(
    'inscription-note',
    /.{30,}/,
    'Open the INSCRIPTION, not the local build. Say which version and build hash it reports, ' +
      'and which game you loaded from the chain.'
  ),

  'first-move': manual(
    'first-move-note',
    /.{30,}/,
    'Sign a submission from the inscribed page itself and say what happened: the game, the move, ' +
      'and whether it landed in the log. Reading proves the bytes; this proves the bridge.'
  ),

  'canary-live': manual(
    'canary-live-note',
    /.{40,}/,
    'Open the INSCRIPTION and run the whole matrix against it, not against the local build. ' +
      'Describe what you found, including anything that differed from local.'
  ),

  'prod-contract': async (ctx) => {
    const name = ctx.input('prod-name');
    if (!/^[a-z][a-z0-9-]{2,39}$/.test(name)) return no('type the production contract name');
    const result = await deployContract(name, CONFIG.source);
    state.prodName = name;
    return ok(`name ${name}\ntxid ${result.txid}\nprovider ${result.provider}`, {
      prodName: name,
      prodTxid: result.txid
    });
  },

  'prod-verified': manual(
    'prod-note',
    /.{40,}/,
    'Read the production contract back and record its identifier, source hash, deploy transaction ' +
      'and configuration into ops/RELEASES.md. Paste a summary here.'
  ),

  'prod-inscribe': manual(
    'prod-inscription',
    /^\d+$|^[0-9a-f]{64}i\d+$/i,
    'Inscribe the production artefact and paste its inscription id. There is no second one.'
  ),

  'launch-verified': manual(
    'launch-note',
    /.{60,}/,
    'Run the two acceptance tests from sections 78 and 79 against the permanent inscription. ' +
      'Describe both outcomes in full.'
  )
};

const inputs = {
  'w-record': [
    { name: 'xverse-mobile', label: 'Row 5 - this track on Xverse mobile', placeholder: 'pass' },
    { name: 'leather-desktop', label: 'Row 6 - this track on Leather desktop', placeholder: 'pass' },
    { name: 'leather-mobile', label: 'Row 7 - this track on Leather mobile', placeholder: 'pass' }
  ],
  configure: [
    {
      name: 'rebate-count',
      label: 'Rebates per sponsorship (45 for launch; 2 to make exhaustion reachable)',
      placeholder: '45'
    }
  ],
  sponsored: [
    { name: 'opponent', label: 'A wallet holding exactly zero STX', placeholder: 'SP...' }
  ],
  build: [{ name: 'manifest', label: 'dist/manifest.json' }],
  rehearsal: [{ name: 'rehearsal-note', label: 'What the runtime harness did' }],
  matrix: [{ name: 'matrix-sign', label: 'The build hash written into MATRIX.md' }],
  'inscribe-canary': [{ name: 'canary-inscription', label: 'Canary inscription id' }],
  'inscribe-board': [{ name: 'board-inscription', label: 'Inscription id for dist/xchess.html' }],
  'inscription-live': [{ name: 'inscription-note', label: 'What the inscription reported' }],
  'first-move': [{ name: 'first-move-note', label: 'The move you played from the inscription' }],
  'canary-live': [{ name: 'canary-live-note', label: 'What the inscription did' }],
  'prod-contract': [{ name: 'prod-name', label: 'Production contract name', placeholder: 'xchess-core-v1' }],
  'prod-verified': [{ name: 'prod-note', label: 'Recorded in RELEASES.md' }],
  'prod-inscribe': [{ name: 'prod-inscription', label: 'Production inscription id' }],
  'launch-verified': [{ name: 'launch-note', label: 'Sections 78 and 79, in full' }]
};

if (document.readyState === 'loading' && !document.body) {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}

function start(): void {
  // Two tracks on one page. `?track=inscribe` runs the short sequence that
  // gets one board on chain against a contract already proven; anything else
  // runs the full launch gate. Same handlers either way - the difference is
  // which questions get asked, not how they are answered.
  const track = new URLSearchParams(location.search).get('track');
  new Canary({
    handlers,
    inputs,
    steps:
      track === 'inscribe' ? INSCRIBE_STEPS : track === 'wallet' ? WALLET_STEPS : undefined,
    build: {
      version: CONFIG.version,
      built: CONFIG.built,
      hash: CONFIG.hash,
      contract: CONFIG.contractName,
      network: CONFIG.network
    }
  });
}
