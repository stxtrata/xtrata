import { createHash } from "crypto";
import { Cl, ClarityType, cvToValue } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const creator = accounts.get("wallet_1")!;
const claimer = accounts.get("wallet_2")!;
const relayer = accounts.get("wallet_3")!;
const stranger = accounts.get("wallet_4")!;

const nftContract = `${deployer}.xtrata-v3-2-3`;
const dropsName = "xtrata-drops-v1-0";
const dropsContract = `${deployer}.${dropsName}`;

const budget = 100_000n; // 0.1 STX
const MIN_BUDGET = 50_000n;
const REFUND_DELAY = 144n;

const ERR_NOT_AUTHORIZED = 100;
const ERR_NOT_FOUND = 101;
const ERR_ALREADY_LISTED = 102;
const ERR_INVALID_BUDGET = 105;
const ERR_ALREADY_CLAIMED = 106;
const ERR_NOT_CLAIMED = 107;
const ERR_CLAIM_TOO_LARGE = 108;
const ERR_REFUND_LOCKED = 109;
const ERR_GROUP_LIMIT = 110;
const ERR_SELF_CLAIM = 111;

function unwrapOk(result: any) {
  expect(result.type).toBe(ClarityType.ResponseOk);
  return result.value;
}

function unwrapUInt(result: any) {
  expect(result.type).toBe(ClarityType.UInt);
  return result.value as bigint;
}

function expectErr(result: any, code: bigint | number) {
  expect(result).toBeErr(Cl.uint(code));
}

function normalizeValue(value: any): any {
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (value && typeof value === "object" && "type" in value && "value" in value) {
    if (value.type === "uint") return BigInt(String(value.value));
    if (value.type === "bool") return Boolean(value.value);
    if (value.type === "principal") return String(value.value);
    return normalizeValue(value.value);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, normalizeValue(nested)])
    );
  }
  return value;
}

function computeFinalHash(chunksHex: string[]) {
  let running = Buffer.alloc(32, 0);
  for (const chunkHex of chunksHex) {
    const chunk = Buffer.from(chunkHex, "hex");
    const digest = createHash("sha256");
    digest.update(Buffer.concat([running, chunk]));
    running = digest.digest();
  }
  return running.toString("hex");
}

function unpauseXtrata() {
  return simnet.callPublicFn(nftContract, "set-paused", [Cl.bool(false)], deployer).result;
}

let mintNonce = 0;
function mintToken(owner: string) {
  const chunkHex = (0x10 + mintNonce++).toString(16).padStart(2, "0");
  const hash = computeFinalHash([chunkHex]);
  unwrapOk(
    simnet.callPublicFn(
      nftContract,
      "begin-inscription",
      [Cl.bufferFromHex(hash), Cl.stringAscii("text/plain"), Cl.uint(chunkHex.length / 2), Cl.uint(1)],
      owner
    ).result
  );
  unwrapOk(
    simnet.callPublicFn(
      nftContract,
      "add-chunk-batch",
      [Cl.bufferFromHex(hash), Cl.list([Cl.bufferFromHex(chunkHex)])],
      owner
    ).result
  );
  const seal = simnet.callPublicFn(
    nftContract,
    "seal-inscription",
    [Cl.bufferFromHex(hash), Cl.stringAscii("data:text/plain,drops")],
    owner
  ).result;
  return unwrapUInt(unwrapOk(seal));
}

function stxBalance(who: string) {
  return simnet.getAssetsMap().get("STX")?.get(who) ?? 0n;
}

function setSponsor(who: string) {
  return unwrapOk(
    simnet.callPublicFn(dropsName, "set-sponsor", [Cl.standardPrincipal(who)], deployer).result
  );
}

function createDrop(owner: string, tokenId: bigint, feeBudget: bigint = budget, groupId: bigint = 0n) {
  return simnet.callPublicFn(
    dropsName,
    "create-drop",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(tokenId), Cl.uint(feeBudget), Cl.uint(groupId)],
    owner
  ).result;
}

function claimDrop(who: string, dropId: bigint) {
  return simnet.callPublicFn(
    dropsName,
    "claim",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(dropId)],
    who
  ).result;
}

function cancelDrop(who: string, dropId: bigint) {
  return simnet.callPublicFn(
    dropsName,
    "cancel",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(dropId)],
    who
  ).result;
}

function claimFee(who: string, dropId: bigint, amount: bigint) {
  return simnet.callPublicFn(dropsName, "claim-fee", [Cl.uint(dropId), Cl.uint(amount)], who).result;
}

function settleRefund(who: string, dropId: bigint) {
  return simnet.callPublicFn(dropsName, "settle-refund", [Cl.uint(dropId)], who).result;
}

function getDrop(dropId: bigint) {
  const result = simnet.callReadOnlyFn(dropsName, "get-drop", [Cl.uint(dropId)], deployer).result;
  if (result.type === ClarityType.OptionalNone) return null;
  expect(result.type).toBe(ClarityType.OptionalSome);
  return normalizeValue(cvToValue(result.value)) as Record<string, any>;
}

function getListing(dropId: bigint) {
  const result = simnet.callReadOnlyFn(dropsName, "get-listing", [Cl.uint(dropId)], deployer).result;
  if (result.type === ClarityType.OptionalNone) return null;
  expect(result.type).toBe(ClarityType.OptionalSome);
  return normalizeValue(cvToValue(result.value)) as Record<string, any>;
}

function nftOwner(tokenId: bigint) {
  const result = simnet.callReadOnlyFn(nftContract, "get-owner", [Cl.uint(tokenId)], deployer).result;
  const inner = unwrapOk(result);
  if (inner.type === ClarityType.OptionalNone) return null;
  return normalizeValue(cvToValue(inner.value));
}

function setup() {
  unwrapOk(unpauseXtrata());
  setSponsor(relayer);
}

describe("xtrata-drops-v1.0", () => {
  it("creates a drop: escrows NFT and budget", () => {
    setup();
    const tokenId = mintToken(creator);
    const before = stxBalance(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    expect(stxBalance(creator)).toBe(before - budget);
    expect(nftOwner(tokenId)).toBe(dropsContract);
    const drop = getDrop(dropId)!;
    expect(drop.creator).toBe(creator);
    expect(drop["budget-remaining"]).toBe(budget);
    expect(drop["claimed-at"]).toBe(null);
  });

  it("rejects budgets below the minimum", () => {
    setup();
    const tokenId = mintToken(creator);
    expectErr(createDrop(creator, tokenId, MIN_BUDGET - 1n), ERR_INVALID_BUDGET);
  });

  it("rejects double-listing the same token", () => {
    setup();
    const tokenId = mintToken(creator);
    unwrapOk(createDrop(creator, tokenId));
    expectErr(createDrop(creator, tokenId), ERR_ALREADY_LISTED);
  });

  it("claim transfers the NFT for free and marks the drop claimed", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    const claimerStx = stxBalance(claimer);
    unwrapOk(claimDrop(claimer, dropId));
    expect(nftOwner(tokenId)).toBe(claimer);
    expect(stxBalance(claimer)).toBe(claimerStx); // paid nothing
    const drop = getDrop(dropId)!;
    expect(drop.claimer).toBe(claimer);
    expect(drop["claimed-at"]).not.toBe(null);
  });

  it("rejects claiming an already claimed drop", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    unwrapOk(claimDrop(claimer, dropId));
    expectErr(claimDrop(stranger, dropId), ERR_ALREADY_CLAIMED);
  });

  it("rejects the creator claiming their own drop", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    expectErr(claimDrop(creator, dropId), ERR_SELF_CLAIM);
  });

  it("enforces one claim per (creator, group)", () => {
    setup();
    const t1 = mintToken(creator);
    const t2 = mintToken(creator);
    const t3 = mintToken(creator);
    const d1 = unwrapUInt(unwrapOk(createDrop(creator, t1, budget, 7n)));
    const d2 = unwrapUInt(unwrapOk(createDrop(creator, t2, budget, 7n)));
    const d3 = unwrapUInt(unwrapOk(createDrop(creator, t3, budget, 8n)));
    unwrapOk(claimDrop(claimer, d1));
    expectErr(claimDrop(claimer, d2), ERR_GROUP_LIMIT);
    // different group is fine
    unwrapOk(claimDrop(claimer, d3));
    // other claimers unaffected
    unwrapOk(claimDrop(stranger, d2));
  });

  it("cancel returns NFT and budget to the creator; strangers cannot cancel", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    expectErr(cancelDrop(stranger, dropId), ERR_NOT_AUTHORIZED);
    const before = stxBalance(creator);
    unwrapOk(cancelDrop(creator, dropId));
    expect(stxBalance(creator)).toBe(before + budget);
    expect(nftOwner(tokenId)).toBe(creator);
    expect(getDrop(dropId)).toBe(null);
  });

  it("cannot cancel after a claim", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    unwrapOk(claimDrop(claimer, dropId));
    expectErr(cancelDrop(creator, dropId), ERR_ALREADY_CLAIMED);
  });

  it("claim-fee: sponsor only, claimed drops only, capped by budget", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    expectErr(claimFee(relayer, dropId, 1_000n), ERR_NOT_CLAIMED);
    unwrapOk(claimDrop(claimer, dropId));
    expectErr(claimFee(stranger, dropId, 1_000n), ERR_NOT_AUTHORIZED);
    expectErr(claimFee(relayer, dropId, budget + 1n), ERR_CLAIM_TOO_LARGE);
    const relayerStx = stxBalance(relayer);
    unwrapOk(claimFee(relayer, dropId, 30_000n));
    expect(stxBalance(relayer)).toBe(relayerStx + 30_000n);
    expect(getDrop(dropId)!["budget-remaining"]).toBe(budget - 30_000n);
  });

  it("claim-fee respects the cumulative claim cap", () => {
    setup();
    unwrapOk(
      simnet.callPublicFn(dropsName, "set-claim-cap", [Cl.uint(40_000n)], deployer).result
    );
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    unwrapOk(claimDrop(claimer, dropId));
    unwrapOk(claimFee(relayer, dropId, 30_000n));
    expectErr(claimFee(relayer, dropId, 20_000n), ERR_CLAIM_TOO_LARGE);
  });

  it("settle-refund: sponsor immediately; creator locked until delay, then allowed", () => {
    setup();
    const t1 = mintToken(creator);
    const d1 = unwrapUInt(unwrapOk(createDrop(creator, t1)));
    unwrapOk(claimDrop(claimer, d1));
    unwrapOk(claimFee(relayer, d1, 30_000n));
    const before = stxBalance(creator);
    unwrapOk(settleRefund(relayer, d1));
    expect(stxBalance(creator)).toBe(before + budget - 30_000n);
    expect(getDrop(d1)).toBe(null);

    const t2 = mintToken(creator);
    const d2 = unwrapUInt(unwrapOk(createDrop(creator, t2, budget, 99n)));
    unwrapOk(claimDrop(claimer, d2));
    expectErr(settleRefund(creator, d2), ERR_REFUND_LOCKED);
    expectErr(settleRefund(stranger, d2), ERR_NOT_AUTHORIZED);
    simnet.mineEmptyBlocks(Number(REFUND_DELAY));
    const before2 = stxBalance(creator);
    unwrapOk(settleRefund(creator, d2));
    expect(stxBalance(creator)).toBe(before2 + budget);
  });

  it("get-listing alias exposes market-shaped tuple for the relayer", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createDrop(creator, tokenId)));
    const listing = getListing(dropId)!;
    expect(listing.seller).toBe(creator);
    expect(listing.price).toBe(0n);
    expect(listing["budget-remaining"]).toBe(budget);
    expect(listing["sold-at"]).toBe(null);
    unwrapOk(claimDrop(claimer, dropId));
    expect(getListing(dropId)!["sold-at"]).not.toBe(null);
  });

  it("conservation: contract never holds STX after full settlement", () => {
    setup();
    const t1 = mintToken(creator);
    const d1 = unwrapUInt(unwrapOk(createDrop(creator, t1)));
    unwrapOk(claimDrop(claimer, d1));
    unwrapOk(claimFee(relayer, d1, 25_000n));
    unwrapOk(settleRefund(relayer, d1));
    expect(stxBalance(dropsContract)).toBe(0n);
  });
});
