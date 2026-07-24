import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const REGISTRY = "proof-of-free-living-synth-v1";
const CORE = "mock-xtrata-core";
const GATEWAY = "test-xtrata-gateway";
const COLLECTION_SIZE = 1_024;
const PAGE_SIZE = 32;
const BATCH_SIZE = 25;
const ENGINE_ID = 1;
const FIRST_NFT_ID = 10_000;
const FIRST_RECORDING_ID = 50_000;
const RECORDING_FEE = 100_000;
const HASH = Cl.bufferFromHex("33".repeat(32));

type Cv = { type?: string; value?: any; data?: Record<string, Cv> };

const accounts = () => {
  const all = simnet.getAccounts();
  return {
    deployer: all.get("deployer")!,
    ownerA: all.get("wallet_1")!,
    ownerB: all.get("wallet_2")!
  };
};

const call = (contract: string, method: string, args: any[], sender: string) =>
  simnet.callPublicFn(contract, method, args, sender);

const read = (contract: string, method: string, args: any[] = [], sender = accounts().deployer) =>
  simnet.callReadOnlyFn(contract, method, args, sender).result as Cv;

const gatewayPrincipal = () => Cl.contractPrincipal(accounts().deployer, GATEWAY);

const mint = (id: number, owner: string, mime: string, parents: number[] = []) =>
  call(CORE, "mint-test-inscription", [
    Cl.uint(id),
    Cl.standardPrincipal(owner),
    Cl.stringAscii(mime),
    Cl.list(parents.map(Cl.uint)),
    HASH
  ], accounts().deployer);

const unwrap = (cv: Cv): Cv => {
  let current = cv;
  while (current && ["ok", "some"].includes(String(current.type))) current = current.value as Cv;
  return current;
};

const list = (cv: Cv): Cv[] => {
  const current = unwrap(cv);
  return Array.isArray(current.value) ? current.value : [];
};

const tuple = (cv: Cv): Record<string, Cv> => {
  const current = unwrap(cv);
  return current.value ?? current.data ?? {};
};

const uint = (cv: Cv) => Number(unwrap(cv).value);

const optionalUint = (cv: Cv) => cv?.type === "none" ? null : uint(cv);

describe("full collection mint simulation", () => {
  it("mints, registers, records, transfers, and audits all 1,024 editions", { timeout: 120_000 }, () => {
    const { deployer, ownerA, ownerB } = accounts();
    const ownerForEdition = (edition: number) => edition % 2 === 0 ? ownerB : ownerA;
    const nftForEdition = (edition: number) => FIRST_NFT_ID + edition - 1;

    expect(call(REGISTRY, "lock-core-contract", [gatewayPrincipal()], deployer).result)
      .toBeOk(Cl.bool(true));
    expect(mint(ENGINE_ID, deployer, "text/javascript").result).toBeOk(Cl.uint(ENGINE_ID));
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(ENGINE_ID)], deployer).result)
      .toBeOk(Cl.uint(ENGINE_ID));

    for (let edition = 1; edition <= COLLECTION_SIZE; edition += 1) {
      const nftId = nftForEdition(edition);
      const owner = ownerForEdition(edition);
      expect(mint(nftId, owner, "text/html").result).toBeOk(Cl.uint(nftId));
      expect(read(GATEWAY, "get-owner", [Cl.uint(nftId)], owner))
        .toBeOk(Cl.some(Cl.standardPrincipal(owner)));
    }

    let registrationBatches = 0;
    for (let start = 1; start <= COLLECTION_SIZE; start += BATCH_SIZE) {
      const entries = Array.from(
        { length: Math.min(BATCH_SIZE, COLLECTION_SIZE - start + 1) },
        (_, offset) => {
          const edition = start + offset;
          return Cl.tuple({ edition: Cl.uint(edition), "nft-id": Cl.uint(nftForEdition(edition)) });
        }
      );
      expect(call(REGISTRY, "register-edition-batch", [Cl.list(entries)], deployer).result)
        .toBeOk(Cl.uint(entries.length));
      registrationBatches += 1;
    }

    expect(call(REGISTRY, "set-paused", [Cl.bool(false)], deployer).result).toBeOk(Cl.bool(false));

    const registerChild = (edition: number, recordingId: number, owner: string) => {
      const nftId = nftForEdition(edition);
      expect(mint(recordingId, owner, "application/json", [nftId]).result).toBeOk(Cl.uint(recordingId));
      expect(call(REGISTRY, "register-recording", [
        gatewayPrincipal(), Cl.uint(nftId), Cl.uint(recordingId), Cl.uint(RECORDING_FEE)
      ], owner).result).toBeOk(Cl.uint(recordingId));
    };

    registerChild(1, FIRST_RECORDING_ID, ownerA);
    registerChild(512, FIRST_RECORDING_ID + 1, ownerB);
    registerChild(512, FIRST_RECORDING_ID + 2, ownerB);

    const transferredEdition = 1_024;
    const transferredNft = nftForEdition(transferredEdition);
    expect(call(CORE, "transfer-test-inscription", [Cl.uint(transferredNft), Cl.standardPrincipal(ownerA)], deployer).result)
      .toBeOk(Cl.bool(true));
    expect(mint(FIRST_RECORDING_ID + 3, ownerB, "application/json", [transferredNft]).result)
      .toBeOk(Cl.uint(FIRST_RECORDING_ID + 3));
    expect(call(REGISTRY, "register-recording", [
      gatewayPrincipal(), Cl.uint(transferredNft), Cl.uint(FIRST_RECORDING_ID + 3), Cl.uint(RECORDING_FEE)
    ], ownerB).result).toBeErr(Cl.uint(105));
    registerChild(transferredEdition, FIRST_RECORDING_ID + 4, ownerA);

    let auditedCells = 0;
    for (let page = 0; page < COLLECTION_SIZE / PAGE_SIZE; page += 1) {
      const cells = list(read(REGISTRY, "get-mosaic-page", [Cl.uint(page)]));
      expect(cells).toHaveLength(PAGE_SIZE);
      cells.forEach((cell, offset) => {
        const data = tuple(cell);
        const edition = page * PAGE_SIZE + offset + 1;
        expect(uint(data.edition)).toBe(edition);
        expect(optionalUint(data["nft-id"])).toBe(nftForEdition(edition));
      });
      auditedCells += cells.length;
    }

    const edition512 = tuple(read(REGISTRY, "get-edition", [Cl.uint(512)]));
    expect(optionalUint(edition512["active-recording"])).toBe(FIRST_RECORDING_ID + 2);
    expect(uint(edition512["recording-count"])).toBe(2);
    const state = tuple(read(REGISTRY, "get-system-state"));
    expect(uint(state["registered-editions"])).toBe(COLLECTION_SIZE);
    expect(auditedCells).toBe(COLLECTION_SIZE);

    const report = {
      protocol: "proof-of-free/mint-simulation-report",
      version: 1,
      collectionSize: COLLECTION_SIZE,
      seededHtmlMints: COLLECTION_SIZE,
      engineMints: 1,
      recordingMints: 5,
      recognizedRecordings: 4,
      rejectedFormerOwnerRecordings: 1,
      ownershipTransfers: 1,
      registrationBatches,
      mosaicPages: COLLECTION_SIZE / PAGE_SIZE,
      auditedCells,
      latestRecordingChecks: 1,
      broadcasts: 0,
      network: "simnet"
    };
    console.log(`MINT_SIMULATION_REPORT=${JSON.stringify(report)}`);
  });
});
