import { openContractCall } from "@stacks/connect";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  Pc,
  PostConditionMode,
  contractPrincipalCV,
  fetchCallReadOnlyFunction,
  uintCV
} from "@stacks/transactions";
import { CONFIG } from "./config";
import {
  MAX_RECORDING_BYTES,
  validateLivingRecording,
  type LivingRecording
} from "./recording";
import { validateSeedHtml } from "./seed";

export type MosaicCell = {
  edition: number;
  nftId: number | null;
  recordingCount: number;
  activeRecording: number | null;
  revision: number;
};

export type LivingSynthSystemState = {
  engineId: number | null;
  engineHash: string | null;
  recordingFee: number;
  feeRecipient: string;
  contractOwner: string;
  pendingOwner: string | null;
  paused: boolean;
};

export type InscriptionContent = {
  id: number;
  mimeType: string;
  totalSize: number;
  hash: string;
  bytes: Uint8Array;
  text: string;
};

const walletNetwork = new StacksMainnet({ url: CONFIG.apiUrl });

async function read(contractAddress: string, contractName: string, functionName: string, functionArgs: any[]) {
  return fetchCallReadOnlyFunction({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    senderAddress: CONFIG.registry.address || CONFIG.xtrata.address,
    network: CONFIG.network
  }) as Promise<any>;
}

const unwrapResponse = (cv: any) => cv?.value;
const unwrapOptional = (cv: any) => cv?.value ?? null;
const tupleData = (cv: any) => cv?.data ?? cv?.value?.data ?? cv?.value ?? {};
const asNumber = (cv: any) => Number(cv?.value ?? 0);
const asString = (cv: any) => String(cv?.value ?? "");

function asBuffer(value: any): Uint8Array {
  const candidate = value?.buffer ?? value?.value ?? value;
  if (candidate instanceof Uint8Array) return candidate;
  if (candidate instanceof ArrayBuffer) return new Uint8Array(candidate);
  if (Array.isArray(candidate)) return new Uint8Array(candidate);
  if (typeof candidate === "string") {
    const hex = candidate.replace(/^0x/, "");
    if (/^[0-9a-f]+$/i.test(hex) && hex.length % 2 === 0) {
      return new Uint8Array(hex.match(/.{2}/g)!.map(byte => Number.parseInt(byte, 16)));
    }
  }
  return new Uint8Array();
}

const toHex = (bytes: Uint8Array) => [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");

async function sha256(bytes: Uint8Array) {
  const copy = Uint8Array.from(bytes);
  return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", copy.buffer)));
}

export async function getMosaicPage(page: number): Promise<MosaicCell[]> {
  const result = unwrapResponse(await read(
    CONFIG.registry.address,
    CONFIG.registry.name,
    "get-mosaic-page",
    [uintCV(page)]
  ));
  const list = result?.list ?? result?.value ?? [];
  return list.map((entry: any) => {
    const data = tupleData(entry);
    return {
      edition: asNumber(data.edition),
      nftId: unwrapOptional(data["nft-id"]) ? asNumber(unwrapOptional(data["nft-id"])) : null,
      recordingCount: asNumber(data["recording-count"]),
      activeRecording: unwrapOptional(data["active-recording"])
        ? asNumber(unwrapOptional(data["active-recording"]))
        : null,
      revision: asNumber(data.revision)
    };
  });
}

export async function loadAllMosaicPages(onPage?: (cells: MosaicCell[]) => void) {
  const pages = Array.from({ length: CONFIG.collectionSize / CONFIG.pageSize }, (_, index) => index);
  const all: MosaicCell[] = [];
  for (let start = 0; start < pages.length; start += 4) {
    const batch = await Promise.all(pages.slice(start, start + 4).map(getMosaicPage));
    batch.forEach(cells => {
      all.push(...cells);
      onPage?.(cells);
    });
  }
  return all.sort((a, b) => a.edition - b.edition);
}

function contractCall(functionName: string, functionArgs: any[], postConditions: any[] = []) {
  if (!CONFIG.registry.address || !CONFIG.gateway.address) throw new Error("Contract addresses are not configured.");
  return new Promise<void>((resolve, reject) => {
    openContractCall({
      contractAddress: CONFIG.registry.address,
      contractName: CONFIG.registry.name,
      functionName,
      functionArgs,
      network: walletNetwork,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions,
      onFinish: () => resolve(),
      onCancel: () => reject(new Error("Wallet request cancelled."))
    });
  });
}

const gatewayCV = () => contractPrincipalCV(CONFIG.gateway.address, CONFIG.gateway.name);

export const registerRecording = (
  nftId: number,
  recordingId: number,
  expectedFee: number,
  sender: string,
  feeRecipient: string
) => contractCall(
  "register-recording",
  [gatewayCV(), uintCV(nftId), uintCV(recordingId), uintCV(expectedFee)],
  recordingPostConditions(sender, feeRecipient, expectedFee)
);

export const recordingPostConditions = (sender: string, feeRecipient: string, expectedFee: number) => [
  Pc.principal(sender).willSendEq(sender === feeRecipient ? 0n : BigInt(expectedFee)).ustx()
];

export async function getLivingSynthSystemState(): Promise<LivingSynthSystemState> {
  const data = tupleData(await read(CONFIG.registry.address, CONFIG.registry.name, "get-system-state", []));
  const engine = unwrapOptional(data["engine-id"]);
  const engineHash = unwrapOptional(data["engine-hash"]);
  const pendingOwner = unwrapOptional(data["pending-owner"]);
  return {
    engineId: engine ? asNumber(engine) : null,
    engineHash: engineHash ? toHex(asBuffer(engineHash)) : null,
    recordingFee: asNumber(data["recording-fee"]),
    feeRecipient: asString(data["fee-recipient"]),
    contractOwner: asString(data["contract-owner"]),
    pendingOwner: pendingOwner ? asString(pendingOwner) : null,
    paused: Boolean(data.paused?.value)
  };
}

export async function getRecordingPolicy() {
  const state = await getLivingSynthSystemState();
  return { microStx: state.recordingFee, recipient: state.feeRecipient };
}

export async function getRecordingHistory(nftId: number): Promise<number[]> {
  const count = asNumber(await read(
    CONFIG.registry.address,
    CONFIG.registry.name,
    "get-recording-count",
    [uintCV(nftId)]
  ));
  const ids: number[] = [];
  for (let end = count; end > 0; end -= 4) {
    const sequences = Array.from({ length: Math.min(4, end) }, (_, index) => end - index);
    const results = await Promise.all(sequences.map(sequence => read(
      CONFIG.registry.address,
      CONFIG.registry.name,
      "get-recording-id",
      [uintCV(nftId), uintCV(sequence)]
    )));
    results.forEach(result => {
      const value = unwrapOptional(result);
      if (value) ids.push(asNumber(value));
    });
  }
  return ids;
}

export async function getDependencies(inscriptionId: number): Promise<number[]> {
  const result = await read(
    CONFIG.xtrata.address,
    CONFIG.xtrata.name,
    "get-dependencies",
    [uintCV(inscriptionId)]
  );
  const value = unwrapResponse(result);
  const entries = value?.list ?? value?.value ?? result?.list ?? result?.value ?? [];
  return entries.map(asNumber);
}

export async function getEditionContentHash(edition: number): Promise<string | null> {
  const result = await read(
    CONFIG.registry.address,
    CONFIG.registry.name,
    "get-edition-content-hash",
    [uintCV(edition)]
  );
  const value = unwrapOptional(result);
  return value ? toHex(asBuffer(value)) : null;
}

const inscriptionCache = new Map<string, Promise<InscriptionContent>>();

async function fetchInscription(
  inscriptionId: number,
  allowedMimes: readonly string[],
  maxBytes: number
): Promise<InscriptionContent> {
  const metaOptional = await read(
    CONFIG.xtrata.address,
    CONFIG.xtrata.name,
    "get-inscription-meta",
    [uintCV(inscriptionId)]
  );
  const meta = tupleData(unwrapOptional(metaOptional));
  if (!meta || !Object.keys(meta).length) throw new Error(`Inscription #${inscriptionId} metadata was not found.`);
  const mimeType = asString(meta["mime-type"]);
  const totalChunks = asNumber(meta["total-chunks"]);
  const totalSize = asNumber(meta["total-size"]);
  const expectedHash = toHex(asBuffer(meta["final-hash"]));
  if (!allowedMimes.includes(mimeType)) throw new Error(`Inscription #${inscriptionId} has unsupported MIME ${mimeType || "none"}.`);
  if (!Number.isSafeInteger(totalSize) || totalSize < 1 || totalSize > maxBytes) {
    throw new Error(`Inscription #${inscriptionId} exceeds the ${maxBytes}-byte safety limit.`);
  }
  if (!Number.isSafeInteger(totalChunks) || totalChunks < 1 || totalChunks > Math.ceil(maxBytes / 16_384)) {
    throw new Error(`Inscription #${inscriptionId} has an invalid chunk count.`);
  }
  const chunks: Uint8Array[] = [];
  for (let start = 0; start < totalChunks; start += 4) {
    const results = await Promise.all(
      Array.from({ length: Math.min(4, totalChunks - start) }, (_, offset) => read(
        CONFIG.xtrata.address,
        CONFIG.xtrata.name,
        "get-chunk",
        [uintCV(inscriptionId), uintCV(start + offset)]
      ))
    );
    results.forEach((result, offset) => {
      const chunk = asBuffer(unwrapOptional(result));
      if (chunk.length === 0) throw new Error(`Inscription #${inscriptionId} chunk ${start + offset} is missing.`);
      chunks.push(chunk);
    });
  }
  const bytes = new Uint8Array(totalSize);
  let cursor = 0;
  chunks.forEach(chunk => {
    const remaining = totalSize - cursor;
    bytes.set(chunk.slice(0, remaining), cursor);
    cursor += Math.min(chunk.length, remaining);
  });
  if (cursor !== totalSize) throw new Error(`Inscription #${inscriptionId} is incomplete.`);
  const actualHash = await sha256(bytes);
  if (!expectedHash || actualHash !== expectedHash) throw new Error(`Inscription #${inscriptionId} failed its on-chain content-hash check.`);
  return {
    id: inscriptionId,
    mimeType,
    totalSize,
    hash: actualHash,
    bytes,
    text: new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  };
}

export function loadInscription(
  inscriptionId: number,
  allowedMimes: readonly string[],
  maxBytes: number
): Promise<InscriptionContent> {
  const cacheKey = `${inscriptionId}:${maxBytes}:${[...allowedMimes].sort().join(",")}`;
  const cached = inscriptionCache.get(cacheKey);
  if (cached) return cached;
  const request = fetchInscription(inscriptionId, allowedMimes, maxBytes).catch(error => {
    inscriptionCache.delete(cacheKey);
    throw error;
  });
  inscriptionCache.set(cacheKey, request);
  return request;
}

export async function loadRecording(
  inscriptionId: number,
  expected?: { nftId: number; edition: number }
): Promise<LivingRecording> {
  const content = await loadInscription(inscriptionId, ["application/json"], MAX_RECORDING_BYTES);
  let parsed: unknown;
  try {
    parsed = JSON.parse(content.text);
  } catch {
    throw new Error(`Recording inscription #${inscriptionId} is not valid JSON.`);
  }
  return validateLivingRecording(parsed, expected ? {
    ...expected,
    xtrataContract: `${CONFIG.xtrata.address}.${CONFIG.xtrata.name}`
  } : undefined);
}

export async function loadEngineBundle(nftId: number, editionNumber: number) {
  const state = await getLivingSynthSystemState();
  if (state.engineId === null || !state.engineHash) throw new Error("The Living Synth engine is not configured on-chain.");
  const [engine, edition, dependencies, registeredHash] = await Promise.all([
    loadInscription(state.engineId, ["text/javascript"], 131_072),
    loadInscription(nftId, ["text/html"], 65_536),
    getDependencies(nftId),
    getEditionContentHash(editionNumber)
  ]);
  if (engine.hash !== state.engineHash) throw new Error("The loaded engine does not match the registry's pinned content hash.");
  if (!dependencies.includes(state.engineId)) {
    throw new Error(`Seed inscription #${nftId} does not depend on locked engine #${state.engineId}.`);
  }
  if (!registeredHash || registeredHash !== edition.hash) {
    throw new Error(`Seed inscription #${nftId} does not match the registry's edition hash.`);
  }
  validateSeedHtml(edition.text, { edition: editionNumber, engineId: state.engineId });
  return { engine, edition, state };
}
