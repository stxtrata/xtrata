// The application entry point.
//
// This is what the build wraps. It picks the chain implementation, wires the
// wallet in, and starts exactly one board.
//
// Configuration arrives on `window.__XCHESS__`, written by the build, so a
// child page can be a few hundred bytes of config plus a dependency rather than
// a whole copy of the application.

import { boot, whenReady } from '../../packages/ui/boot.js';
import { LiveChain } from '../../packages/chain/client.js';
import type { ContractCall, WriteResult } from '../../packages/chain/client.js';
import { guardFor } from '../../packages/wallet/postconditions.js';
import { collectProviders, signingBlockedReason, waitForProvider } from '../../packages/wallet/providers.js';
import { contractCallParams, extractAddress, walletCall } from '../../packages/wallet/requests.js';
import type { ProviderEntry } from '../../packages/wallet/providers.js';
import type { Network } from '../../packages/chain/endpoint.js';

interface Config {
  contract: string;
  network: Network;
  version?: string;
  built?: string;
  hash?: string;
  /** A built board must not be able to talk to a different contract. */
  exact?: boolean;
  api?: string;
}

const CONFIG: Config = ((globalThis as Record<string, unknown>).__XCHESS__ as Config) ?? {
  contract: 'SP000000000000000000002Q6VF78.xchess-core-v1',
  network: 'mainnet'
};

const [contractAddress, contractName] = CONFIG.contract.split('.');

let connected: string | null = null;

/**
 * Sign a call.
 *
 * The provider is resolved HERE, per call, and never captured at startup: under
 * the Xtrata runtime the shim installs after load and again on a schedule, so
 * anything held from startup would be holding nothing.
 */
async function sign(call: ContractCall): Promise<WriteResult> {
  await waitForProvider();

  if (call.sends > 0n && !connected) {
    const error: Error & { code?: string } = new Error(
      'connect a wallet before this: the contract charges for it'
    );
    error.code = 'NO_SIGNER';
    throw error;
  }

  // Both directions. The rebate the CONTRACT sends needs a condition of its own,
  // or a deny-mode transaction aborts on an uncovered transfer.
  const guard = guardFor({
    sender: connected,
    contractId: CONFIG.contract,
    sends: call.sends,
    contractSends: call.contractSends
  });

  const request = {
    contract: CONFIG.contract,
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
  const txid =
    (payload?.txid as string) ?? (payload?.txId as string) ??
    (inner?.txid as string) ?? (inner?.txId as string) ?? null;

  return { ok: true, txid, provider: entry.label, raw: result };
}

const chain = new LiveChain({
  contractAddress,
  contractName,
  network: CONFIG.network,
  override: CONFIG.api ?? null,
  signer: sign
});

// Deferred until the document has a body. The single inlined script block sits
// above it, and under the Xtrata runtime the document is assembled with
// document.write, so script timing is not ordinary page-load timing.
whenReady(document, () => {
  boot({
    chain,
    build: {
      version: CONFIG.version,
      built: CONFIG.built,
      hash: CONFIG.hash,
      contract: CONFIG.contract,
      network: CONFIG.network
    },
    signingBlocked: signingBlockedReason,
    connect: async () => {
      // Method-first, provider-second: a wallet that cannot do one method may
      // still answer another, and a provider that refuses everything must not
      // stop us reaching the one beside it that works.
      // SIX SECONDS, not the signing timeout.
      //
      // This is a probe, not a signature. A signature legitimately takes as long
      // as a person takes to read it; asking a wallet whether it can answer at
      // all should not. Four methods at fifteen seconds is a minute of a board
      // that looks like it did not hear the click - which is exactly how this
      // presented, because Xverse's BitcoinProvider never settles on
      // `wallet_connect` and ranks first.
      for (const method of ['wallet_connect', 'stx_requestAccounts', 'stx_getAddresses', 'getAddresses']) {
        try {
          const { result } = await walletCall(method, {}, { timeoutMs: 6_000 });
          const address = extractAddress(result);
          if (address) {
            connected = address;
            return { address };
          }
        } catch {
          // Try the next method. A provider that cannot do one is not a failure.
        }
      }
      const error: Error & { code?: string } = new Error(
        collectProviders().length
          ? 'a wallet answered but did not give an address'
          : 'no Stacks wallet found'
      );
      error.code = collectProviders().length ? 'NO_ADDRESS' : 'NO_WALLET';
      throw error;
    },
    disconnect: async () => {
      connected = null;
    }
  });
});
