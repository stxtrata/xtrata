/**
 * Thin Stacks helpers shared by the Xtrata client. Uses @stacks/transactions v6
 * (the version proven in the Xtrata stack). FlowVault calls go through
 * flowvault-sdk instead (see flowvault.ts).
 */
import {
  broadcastTransaction,
  callReadOnlyFunction,
  cvToJSON,
  type ClarityValue,
  type StacksTransaction,
} from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";

export async function callReadOnly(opts: {
  network: StacksNetwork;
  senderAddress: string;
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
}): Promise<any> {
  const cv = await callReadOnlyFunction({
    network: opts.network,
    senderAddress: opts.senderAddress,
    contractAddress: opts.contractAddress,
    contractName: opts.contractName,
    functionName: opts.functionName,
    functionArgs: opts.functionArgs,
  });
  return cvToJSON(cv);
}

export async function broadcast(tx: StacksTransaction, network: StacksNetwork): Promise<string> {
  const result = await broadcastTransaction(tx, network);
  // v6 returns { txid } on success, or { error, reason } on failure.
  const anyResult = result as any;
  if (anyResult.error) {
    throw new Error(`Broadcast failed: ${anyResult.error} — ${anyResult.reason ?? ""}`);
  }
  return anyResult.txid ?? String(result);
}

/** Poll the extended API until a tx succeeds or aborts. */
export async function waitForConfirmation(
  txid: string,
  network: StacksNetwork,
  { tries = 60, intervalMs = 10_000 } = {}
): Promise<any> {
  const base = (network as any).coreApiUrl ?? (network as any).client?.baseUrl;
  const url = `${base}/extended/v1/tx/${txid.replace(/^0x/, "")}`;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url);
    if (res.ok) {
      const data: any = await res.json();
      if (data.tx_status === "success") return data;
      if (data.tx_status?.startsWith("abort")) {
        throw new Error(`Tx ${txid} failed: ${data.tx_status}`);
      }
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Tx ${txid} not confirmed within ${tries * intervalMs}ms`);
}

/** Unwrap a Clarity (optional T) parsed by cvToJSON into T | null. */
export function unwrapOptional(parsed: any): any | null {
  if (parsed == null) return null;
  // cvToJSON shapes optionals as { type: "(optional ...)", value: <inner> | null }
  if (parsed.value === null || parsed.value === undefined) return null;
  return parsed.value;
}

/** Unwrap a Clarity (response ok err) parsed by cvToJSON, throwing on err. */
export function unwrapResponse(parsed: any): any {
  if (parsed?.success === false || parsed?.type?.startsWith?.("(response")) {
    if (parsed.success === false) throw new Error(`Clarity error: ${JSON.stringify(parsed.value)}`);
  }
  return parsed.value;
}
