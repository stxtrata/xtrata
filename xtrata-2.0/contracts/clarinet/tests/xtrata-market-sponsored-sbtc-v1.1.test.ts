import { createHash } from "crypto";
import { Cl, ClarityType, cvToValue } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const seller = accounts.get("wallet_1")!;
const buyer = accounts.get("wallet_2")!;
const relayer = accounts.get("wallet_3")!;
const stranger = accounts.get("wallet_4")!;

const nftContract = `${deployer}.xtrata-v3-2-3`;
const marketName = "xtrata-market-sponsored-sbtc-v1-1";
const marketContract = `${deployer}.${marketName}`;
const sbtcContract = `${deployer}.mock-sbtc`;

const price = 250n;
const budget = 100_000n; // 0.1 STX
const MIN_BUDGET = 50_000n;
const REFUND_DELAY = 144n;

// error codes
const ERR_NOT_AUTHORIZED = 100;
const ERR_NOT_FOUND = 101;
const ERR_ALREADY_LISTED = 102;
const ERR_INVALID_BUDGET = 105;
const ERR_ALREADY_SOLD = 106;
const ERR_NOT_SOLD = 107;
const ERR_CLAIM_TOO_LARGE = 108;
const ERR_REFUND_LOCKED = 109;

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
    if (value.type === "uint") {
      return BigInt(String(value.value));
    }
    if (value.type === "bool") {
      return Boolean(value.value);
    }
    if (value.type === "principal") {
      return String(value.value);
    }
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
    [Cl.bufferFromHex(hash), Cl.stringAscii("data:text/plain,sponsored-market")],
    owner
  ).result;
  return unwrapUInt(unwrapOk(seal));
}

function mintSbtc(recipient: string, amount: bigint) {
  return unwrapOk(
    simnet.callPublicFn(
      sbtcContract,
      "mint",
      [Cl.uint(amount), Cl.standardPrincipal(recipient)],
      deployer
    ).result
  );
}

function stxBalance(who: string) {
  return simnet.getAssetsMap().get("STX")?.get(who) ?? 0n;
}

function setSponsor(who: string) {
  return unwrapOk(
    simnet.callPublicFn(marketName, "set-sponsor", [Cl.standardPrincipal(who)], deployer).result
  );
}

function listToken(owner: string, tokenId: bigint, feeBudget: bigint = budget) {
  const result = simnet.callPublicFn(
    marketName,
    "list-token",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(tokenId), Cl.uint(price), Cl.uint(feeBudget)],
    owner
  ).result;
  return result;
}

function buyToken(who: string, listingId: bigint) {
  return simnet.callPublicFn(
    marketName,
    "buy",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(listingId)],
    who
  ).result;
}

function getListing(listingId: bigint) {
  const result = simnet.callReadOnlyFn(marketName, "get-listing", [Cl.uint(listingId)], deployer).result;
  if (result.type === ClarityType.OptionalNone) return null;
  expect(result.type).toBe(ClarityType.OptionalSome);
  return normalizeValue(cvToValue(result.value)) as Record<string, any>;
}

function setup() {
  unwrapOk(unpauseXtrata());
  setSponsor(relayer);
  const tokenId = mintToken(seller);
  mintSbtc(buyer, 10_000n);
  return tokenId;
}

describe("xtrata-market-sponsored-sbtc-v1.1", () => {
  it("lists into escrow taking NFT and exact fee budget", () => {
    const tokenId = setup();
    const sellerStxBefore = stxBalance(seller);
    const contractStxBefore = stxBalance(marketContract);

    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));

    expect(stxBalance(seller)).toBe(sellerStxBefore - budget);
    expect(stxBalance(marketContract)).toBe(contractStxBefore + budget);
    expect(
      simnet.callReadOnlyFn(nftContract, "get-owner", [Cl.uint(tokenId)], deployer).result
    ).toBeOk(Cl.some(Cl.contractPrincipal(deployer, marketName)));

    const listing = getListing(listingId)!;
    expect(listing.seller).toBe(seller);
    expect(listing.price).toBe(price);
    expect(listing["fee-budget"]).toBe(budget);
    expect(listing["budget-remaining"]).toBe(budget);
    expect(listing.claimed).toBe(0n);
    expect(listing["sold-at"]).toBeNull();
  });

  it("rejects listing below the minimum budget", () => {
    const tokenId = setup();
    expectErr(listToken(seller, tokenId, MIN_BUDGET - 1n), ERR_INVALID_BUDGET);
    // exact minimum is accepted
    unwrapOk(listToken(seller, tokenId, MIN_BUDGET));
  });

  it("blocks re-listing while listed", () => {
    const tokenId = setup();
    unwrapOk(listToken(seller, tokenId));
    expectErr(listToken(seller, tokenId), ERR_ALREADY_LISTED);
  });

  it("buy transfers NFT and sBTC, marks sold, keeps budget escrowed", () => {
    const tokenId = setup();
    unwrapOk(simnet.callPublicFn(marketName, "set-fee-bps", [Cl.uint(200)], deployer).result); // 2%
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    const contractStx = stxBalance(marketContract);

    unwrapOk(buyToken(buyer, listingId));

    expect(
      simnet.callReadOnlyFn(nftContract, "get-owner", [Cl.uint(tokenId)], deployer).result
    ).toBeOk(Cl.some(Cl.standardPrincipal(buyer)));

    const sellerSbtc = unwrapUInt(
      unwrapOk(
        simnet.callReadOnlyFn(sbtcContract, "get-balance", [Cl.standardPrincipal(seller)], deployer).result
      )
    );
    const ownerSbtc = unwrapUInt(
      unwrapOk(
        simnet.callReadOnlyFn(sbtcContract, "get-balance", [Cl.standardPrincipal(deployer)], deployer).result
      )
    );
    const fee = (price * 200n) / 10_000n;
    expect(sellerSbtc).toBe(price - fee);
    expect(ownerSbtc).toBe(fee);

    // budget untouched by buy; listing retained and marked sold
    expect(stxBalance(marketContract)).toBe(contractStx);
    const listing = getListing(listingId)!;
    expect(listing.buyer).toBe(buyer);
    expect(listing["sold-at"]).not.toBeNull();

    // double-buy rejected
    expectErr(buyToken(stranger, listingId), ERR_ALREADY_SOLD);
  });

  it("claim-fee: sponsor-only, sold-only, capped by budget and claim-cap", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));

    // unsold: claim rejected
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(1000)], relayer).result,
      ERR_NOT_SOLD
    );

    unwrapOk(buyToken(buyer, listingId));

    // non-sponsor rejected
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(1000)], stranger).result,
      ERR_NOT_AUTHORIZED
    );
    // zero and over-budget rejected
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(0)], relayer).result,
      ERR_CLAIM_TOO_LARGE
    );
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(budget + 1n)], relayer).result,
      ERR_CLAIM_TOO_LARGE
    );

    // happy claim
    const relayerStx = stxBalance(relayer);
    unwrapOk(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(30_000)], relayer).result
    );
    expect(stxBalance(relayer)).toBe(relayerStx + 30_000n);
    const listing = getListing(listingId)!;
    expect(listing["budget-remaining"]).toBe(budget - 30_000n);
    expect(listing.claimed).toBe(30_000n);

    // cumulative cap: lower cap below already-claimed, further claims rejected
    unwrapOk(simnet.callPublicFn(marketName, "set-claim-cap", [Cl.uint(30_000)], deployer).result);
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(1)], relayer).result,
      ERR_CLAIM_TOO_LARGE
    );
  });

  it("settle-refund by sponsor returns exact dust to seller and closes listing", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    unwrapOk(buyToken(buyer, listingId));
    unwrapOk(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(40_000)], relayer).result
    );

    const sellerStx = stxBalance(seller);
    unwrapOk(simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], relayer).result);
    expect(stxBalance(seller)).toBe(sellerStx + (budget - 40_000n));
    expect(getListing(listingId)).toBeNull();

    // idempotence: second settle errs
    expectErr(
      simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], relayer).result,
      ERR_NOT_FOUND
    );
  });

  it("seller can self-refund after REFUND-DELAY when sponsor never claims", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    unwrapOk(buyToken(buyer, listingId));

    // locked during the sponsor window
    expectErr(
      simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], seller).result,
      ERR_REFUND_LOCKED
    );
    // stranger never allowed
    expectErr(
      simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], stranger).result,
      ERR_NOT_AUTHORIZED
    );

    simnet.mineEmptyBlocks(Number(REFUND_DELAY));
    const sellerStx = stxBalance(seller);
    unwrapOk(simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], seller).result);
    expect(stxBalance(seller)).toBe(sellerStx + budget);
    expect(getListing(listingId)).toBeNull();
  });

  it("settle-refund on an unsold listing is rejected (cancel is the path)", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    expectErr(
      simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], relayer).result,
      ERR_NOT_SOLD
    );
  });

  it("cancel returns NFT and full budget; cancel after sale rejected; only seller may cancel", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));

    expectErr(
      simnet.callPublicFn(
        marketName,
        "cancel",
        [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(listingId)],
        stranger
      ).result,
      ERR_NOT_AUTHORIZED
    );

    const sellerStx = stxBalance(seller);
    unwrapOk(
      simnet.callPublicFn(
        marketName,
        "cancel",
        [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(listingId)],
        seller
      ).result
    );
    expect(stxBalance(seller)).toBe(sellerStx + budget);
    expect(
      simnet.callReadOnlyFn(nftContract, "get-owner", [Cl.uint(tokenId)], deployer).result
    ).toBeOk(Cl.some(Cl.standardPrincipal(seller)));
    expect(getListing(listingId)).toBeNull();

    // relist then sell, then cancel must be rejected
    const listingId2 = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    unwrapOk(buyToken(buyer, listingId2));
    expectErr(
      simnet.callPublicFn(
        marketName,
        "cancel",
        [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.uint(listingId2)],
        seller
      ).result,
      ERR_ALREADY_SOLD
    );
  });

  it("owner powers are limited: cannot claim, cannot take budgets; only sponsor/cap/fee setters", () => {
    const tokenId = setup();
    const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId)));
    unwrapOk(buyToken(buyer, listingId));

    // deployer (owner) is not the sponsor after setup(); claim must fail
    expectErr(
      simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(1000)], deployer).result,
      ERR_NOT_AUTHORIZED
    );
    // non-owner cannot rotate sponsor or cap
    expectErr(
      simnet.callPublicFn(marketName, "set-sponsor", [Cl.standardPrincipal(stranger)], stranger).result,
      ERR_NOT_AUTHORIZED
    );
    expectErr(
      simnet.callPublicFn(marketName, "set-claim-cap", [Cl.uint(1)], stranger).result,
      ERR_NOT_AUTHORIZED
    );
  });

  it("conservation fuzz: random claim/refund orderings never mint or lose µSTX", () => {
    unwrapOk(unpauseXtrata());
    setSponsor(relayer);
    mintSbtc(buyer, 100_000n);

    // simple deterministic PRNG
    let s = 42;
    const rnd = (n: number) => {
      s = (s * 1103515245 + 12345) % 2 ** 31;
      return s % n;
    };

    for (let round = 0; round < 5; round++) {
      const tokenId = mintToken(seller);
      const b = budget + BigInt(rnd(50_000));
      const before =
        stxBalance(seller) + stxBalance(relayer) + stxBalance(marketContract);
      const listingId = unwrapUInt(unwrapOk(listToken(seller, tokenId, b)));
      unwrapOk(buyToken(buyer, listingId));

      let remaining = b;
      const claims = rnd(3);
      for (let c = 0; c < claims && remaining > 0n; c++) {
        const amt = BigInt(1 + rnd(Number(remaining)));
        unwrapOk(
          simnet.callPublicFn(marketName, "claim-fee", [Cl.uint(listingId), Cl.uint(amt)], relayer).result
        );
        remaining -= amt;
      }
      unwrapOk(simnet.callPublicFn(marketName, "settle-refund", [Cl.uint(listingId)], relayer).result);

      const after =
        stxBalance(seller) + stxBalance(relayer) + stxBalance(marketContract);
      expect(after).toBe(before); // µSTX conserved across the trio
      expect(getListing(listingId)).toBeNull();
    }
  });
});

import { it as itA, expect as expectA } from "vitest";
itA("nft allowlist: both cores seeded, owner can toggle, stranger cannot", () => {
  const allowed = (c: string) =>
    simnet.callReadOnlyFn(marketName, "is-nft-allowed", [Cl.contractPrincipal(deployer, c)], deployer).result;
  expectA(allowed("xtrata-v2-1-0")).toBeOk(Cl.bool(false)); // v2 must migrate
  expectA(allowed("xtrata-v3-2-3")).toBeOk(Cl.bool(true));
  expectA(allowed("mock-ipfs-collection")).toBeOk(Cl.bool(false));
  // non-owner cannot toggle
  expectErr(
    simnet.callPublicFn(marketName, "set-nft-allowed",
      [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.bool(false)], stranger).result,
    ERR_NOT_AUTHORIZED
  );
  // owner disables then re-enables
  unwrapOk(simnet.callPublicFn(marketName, "set-nft-allowed",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.bool(false)], deployer).result);
  expectA(allowed("xtrata-v2-1-0")).toBeOk(Cl.bool(false));
  unwrapOk(simnet.callPublicFn(marketName, "set-nft-allowed",
    [Cl.contractPrincipal(deployer, "xtrata-v3-2-3"), Cl.bool(true)], deployer).result);
});
