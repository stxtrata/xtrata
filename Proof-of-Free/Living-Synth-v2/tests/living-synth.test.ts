import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const REGISTRY = "proof-of-free-living-synth-v2";
const CORE = "mock-xtrata-core";
const GATEWAY = "test-xtrata-gateway";
const HASH = Cl.bufferFromHex("11".repeat(32));
const DEFAULT_FEE = 100_000;
const ENGINE_ID = 1;

function accounts() {
  const all = simnet.getAccounts();
  return {
    deployer: all.get("deployer")!,
    owner: all.get("wallet_1")!,
    nextOwner: all.get("wallet_2")!
  };
}

function gatewayPrincipal() {
  return Cl.contractPrincipal(accounts().deployer, GATEWAY);
}

function call(contract: string, method: string, args: any[], sender: string) {
  return simnet.callPublicFn(contract, method, args, sender);
}

function read(method: string, args: any[] = [], sender = accounts().deployer) {
  return simnet.callReadOnlyFn(REGISTRY, method, args, sender).result;
}

function mint(
  id: number,
  owner: string,
  mime: string,
  parents: number[] = [],
  dependencies: number[] = []
) {
  return call(CORE, "mint-test-inscription", [
    Cl.uint(id),
    Cl.standardPrincipal(owner),
    Cl.stringAscii(mime),
    Cl.list(dependencies.map(Cl.uint)),
    Cl.list(parents.map(Cl.uint)),
    HASH
  ], accounts().deployer);
}

function setShape(id: number, totalSize: number, sealed: boolean) {
  return call(CORE, "set-test-inscription-shape", [Cl.uint(id), Cl.uint(totalSize), Cl.bool(sealed)], accounts().deployer);
}

function lockCore() {
  const { deployer } = accounts();
  expect(call(REGISTRY, "lock-core-contract", [gatewayPrincipal()], deployer).result).toBeOk(Cl.bool(true));
}

function initialize() {
  const { deployer } = accounts();
  lockCore();
  mint(ENGINE_ID, deployer, "text/javascript");
  expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(ENGINE_ID)], deployer).result)
    .toBeOk(Cl.uint(ENGINE_ID));
}

function goLive() {
  const { deployer } = accounts();
  expect(call(REGISTRY, "set-paused", [Cl.bool(false)], deployer).result).toBeOk(Cl.bool(false));
}

function registerEdition(edition = 1, nftId = 100, sender = accounts().deployer) {
  return call(REGISTRY, "register-edition", [gatewayPrincipal(), Cl.uint(edition), Cl.uint(nftId)], sender);
}

function registerRecording(nftId: number, recordingId: number, sender: string, fee = DEFAULT_FEE) {
  return call(REGISTRY, "register-recording", [
    gatewayPrincipal(), Cl.uint(nftId), Cl.uint(recordingId), Cl.uint(fee)
  ], sender);
}

function stxBalance(principal: string) {
  return simnet.getAssetsMap().get("STX")?.get(principal) ?? 0n;
}

describe("living synth child registry", () => {
  it("exercises the gateway against the raw Xtrata v3.2.3 reader shape", () => {
    const { owner } = accounts();
    mint(100, owner, "text/html", [7, 8], [9]);
    expect(simnet.callReadOnlyFn(GATEWAY, "get-owner", [Cl.uint(100)], owner).result)
      .toBeOk(Cl.some(Cl.standardPrincipal(owner)));
    expect(simnet.callReadOnlyFn(GATEWAY, "get-parents", [Cl.uint(100)], owner).result)
      .toBeOk(Cl.list([Cl.uint(7), Cl.uint(8)]));
    expect(simnet.callReadOnlyFn(GATEWAY, "get-dependencies", [Cl.uint(100)], owner).result)
      .toBeOk(Cl.list([Cl.uint(9)]));
    expect(JSON.stringify(simnet.callReadOnlyFn(GATEWAY, "get-inscription-meta", [Cl.uint(100)], owner).result))
      .toContain("text/html");
  });

  it("locks the gateway once and enforces pause and admin permissions", () => {
    const { deployer, owner } = accounts();
    initialize();
    expect(call(REGISTRY, "lock-core-contract", [gatewayPrincipal()], deployer).result).toBeErr(Cl.uint(113));
    expect(call(REGISTRY, "set-paused", [Cl.bool(false)], owner).result).toBeErr(Cl.uint(100));
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(200, owner, "application/json", [100]);
    registerEdition();
    expect(registerRecording(100, 200, owner).result).toBeErr(Cl.uint(112));
    expect(read("get-recording-count", [Cl.uint(100)], owner)).toBeUint(0);
  });

  it("validates the shared engine MIME, sealed state, size, and content hash", () => {
    const { deployer, owner } = accounts();
    lockCore();
    mint(10, owner, "text/plain");
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(10)], deployer).result)
      .toBeErr(Cl.uint(110));
    mint(11, owner, "text/javascript");
    setShape(11, 131_073, true);
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(11)], deployer).result)
      .toBeErr(Cl.uint(110));
    setShape(11, 20_000, false);
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(11)], deployer).result)
      .toBeErr(Cl.uint(110));
    setShape(11, 20_000, true);
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(11)], deployer).result)
      .toBeOk(Cl.uint(11));
    expect(call(REGISTRY, "set-engine", [gatewayPrincipal(), Cl.uint(11)], deployer).result)
      .toBeErr(Cl.uint(120));
    expect(JSON.stringify(read("get-system-state"))).toContain("11".repeat(32));
  });

  it("supports recoverable two-step administration", () => {
    const { deployer, owner, nextOwner } = accounts();
    expect(call(REGISTRY, "accept-contract-ownership", [], owner).result).toBeErr(Cl.uint(119));
    expect(call(REGISTRY, "initiate-contract-ownership-transfer", [Cl.standardPrincipal(nextOwner)], owner).result)
      .toBeErr(Cl.uint(100));
    expect(call(REGISTRY, "initiate-contract-ownership-transfer", [Cl.standardPrincipal(nextOwner)], deployer).result)
      .toBeOk(Cl.standardPrincipal(nextOwner));
    expect(call(REGISTRY, "accept-contract-ownership", [], owner).result).toBeErr(Cl.uint(100));
    expect(call(REGISTRY, "accept-contract-ownership", [], nextOwner).result)
      .toBeOk(Cl.standardPrincipal(nextOwner));
    expect(call(REGISTRY, "set-recording-fee", [Cl.uint(1_000)], deployer).result).toBeErr(Cl.uint(100));
    expect(call(REGISTRY, "set-recording-fee", [Cl.uint(1_000)], nextOwner).result).toBeOk(Cl.uint(1_000));
  });

  it("registers incremental edition batches atomically and rejects collisions", () => {
    const { deployer, owner } = accounts();
    initialize();
    const duplicate = Cl.list([
      Cl.tuple({ edition: Cl.uint(1), "nft-id": Cl.uint(100), "content-hash": HASH }),
      Cl.tuple({ edition: Cl.uint(1), "nft-id": Cl.uint(101), "content-hash": HASH })
    ]);
    expect(call(REGISTRY, "register-edition-batch", [duplicate], deployer).result).toBeErr(Cl.uint(102));
    expect(JSON.stringify(read("get-edition", [Cl.uint(1)]))).toContain('"nft-id":{"type":"none"}');
    expect(JSON.stringify(read("get-system-state"))).toContain('"registered-editions":{"type":"uint","value":"0"}');
    const valid = Cl.list([
      Cl.tuple({ edition: Cl.uint(1), "nft-id": Cl.uint(100), "content-hash": HASH }),
      Cl.tuple({ edition: Cl.uint(2), "nft-id": Cl.uint(101), "content-hash": HASH })
    ]);
    expect(call(REGISTRY, "register-edition-batch", [valid], owner).result).toBeErr(Cl.uint(100));
    expect(call(REGISTRY, "register-edition-batch", [valid], deployer).result).toBeOk(Cl.uint(2));
    expect(JSON.stringify(read("get-edition", [Cl.uint(2)]))).toContain('"101"');
    expect(read("get-edition-content-hash", [Cl.uint(2)])).toBeSome(HASH);
  });

  it("rejects invalid, duplicate, nonexistent, and unauthorized single mappings", () => {
    const { owner } = accounts();
    initialize();
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(101, owner, "text/html", [], [ENGINE_ID]);
    mint(102, owner, "text/html");
    mint(103, owner, "text/plain", [], [ENGINE_ID]);
    mint(104, owner, "text/html", [], [ENGINE_ID]);
    setShape(104, 65_537, true);
    expect(registerEdition(0, 100).result).toBeErr(Cl.uint(101));
    expect(registerEdition(1025, 100).result).toBeErr(Cl.uint(101));
    expect(registerEdition(1, 999).result).toBeErr(Cl.uint(104));
    expect(registerEdition(1, 100, owner).result).toBeErr(Cl.uint(100));
    expect(registerEdition(3, 102).result).toBeErr(Cl.uint(122));
    expect(registerEdition(3, 103).result).toBeErr(Cl.uint(121));
    expect(registerEdition(3, 104).result).toBeErr(Cl.uint(121));
    expect(registerEdition().result).toBeOk(Cl.uint(100));
    expect(registerEdition(1, 101).result).toBeErr(Cl.uint(102));
    expect(registerEdition(2, 100).result).toBeErr(Cl.uint(103));
  });

  it("accepts a strict owned JSON child, preserves history, and keeps newest active", () => {
    const { deployer, owner, nextOwner } = accounts();
    initialize();
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(200, owner, "application/json", [100]);
    expect(registerEdition().result).toBeOk(Cl.uint(100));
    goLive();
    expect(registerRecording(100, 200, owner).result).toBeOk(Cl.uint(200));

    call(CORE, "transfer-test-inscription", [Cl.uint(100), Cl.standardPrincipal(nextOwner)], deployer);
    mint(201, nextOwner, "application/json", [100]);
    expect(registerRecording(100, 201, nextOwner).result).toBeOk(Cl.uint(201));
    expect(read("get-recording-count", [Cl.uint(100)], nextOwner)).toBeUint(2);
    expect(read("get-recording-id", [Cl.uint(100), Cl.uint(1)], nextOwner)).toBeSome(Cl.uint(200));
    expect(read("get-recording-id", [Cl.uint(100), Cl.uint(2)], nextOwner)).toBeSome(Cl.uint(201));
    expect(JSON.stringify(read("get-edition", [Cl.uint(1)], nextOwner))).toContain('"201"');
  });

  it("rejects wrong owners, parentage, MIME, shape, duplicate ids, and stale fees", () => {
    const { owner, nextOwner } = accounts();
    initialize();
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(200, nextOwner, "application/json", [100]);
    mint(201, owner, "application/json", []);
    mint(202, owner, "text/plain", [100]);
    mint(203, owner, "application/json", [100]);
    registerEdition();
    goLive();
    expect(registerRecording(100, 200, owner).result).toBeErr(Cl.uint(106));
    expect(registerRecording(100, 201, owner).result).toBeErr(Cl.uint(107));
    expect(registerRecording(100, 202, owner).result).toBeErr(Cl.uint(108));
    setShape(203, 262_145, true);
    expect(registerRecording(100, 203, owner).result).toBeErr(Cl.uint(117));
    setShape(203, 128, true);
    expect(registerRecording(100, 203, owner, 99_999).result).toBeErr(Cl.uint(116));
    expect(registerRecording(100, 203, owner).result).toBeOk(Cl.uint(203));
    expect(registerRecording(100, 203, owner).result).toBeErr(Cl.uint(109));
  });

  it("charges exact bounded fees, supports a new recipient, and rolls back on insufficient STX", () => {
    const { deployer, owner, nextOwner } = accounts();
    initialize();
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(200, owner, "application/json", [100]);
    registerEdition();
    goLive();
    expect(call(REGISTRY, "set-recording-fee", [Cl.uint(999)], deployer).result).toBeErr(Cl.uint(115));
    expect(call(REGISTRY, "set-recording-fee", [Cl.uint(1_000_001)], deployer).result).toBeErr(Cl.uint(115));
    expect(call(REGISTRY, "set-recording-fee", [Cl.uint(1_000_000)], deployer).result).toBeOk(Cl.uint(1_000_000));
    expect(call(REGISTRY, "set-fee-recipient", [Cl.standardPrincipal(nextOwner)], deployer).result)
      .toBeOk(Cl.standardPrincipal(nextOwner));
    const ownerBalance = stxBalance(owner);
    simnet.transferSTX(ownerBalance - 500_000n, deployer, owner);
    expect(registerRecording(100, 200, owner, 1_000_000).result).toBeErr(Cl.uint(1));
    expect(read("get-recording-count", [Cl.uint(100)], owner)).toBeUint(0);
    expect(read("is-recognized-recording", [Cl.uint(100), Cl.uint(200)], owner)).toBeBool(false);
  });

  it("skips self-payment and returns exact fixed mosaic pages", () => {
    const { deployer, owner } = accounts();
    initialize();
    mint(100, owner, "text/html", [], [ENGINE_ID]);
    mint(200, owner, "application/json", [100]);
    registerEdition();
    goLive();
    expect(call(REGISTRY, "set-fee-recipient", [Cl.standardPrincipal(owner)], deployer).result)
      .toBeOk(Cl.standardPrincipal(owner));
    const before = stxBalance(owner);
    expect(registerRecording(100, 200, owner).result).toBeOk(Cl.uint(200));
    expect(stxBalance(owner)).toBe(before);
    const page = read("get-mosaic-page", [Cl.uint(0)], owner);
    expect(JSON.stringify(page)).toContain('"list"');
    expect(JSON.stringify(read("get-mosaic-page", [Cl.uint(31)], owner))).toContain('"type":"ok"');
    expect(read("get-mosaic-page", [Cl.uint(32)], owner)).toBeErr(Cl.uint(114));
  });
});
