import { createHash } from "crypto";
import {
  Cl,
  ClarityType,
  contractPrincipalCV,
  cvToValue,
  hash160,
  noneCV,
  principalCV,
  privateKeyToPublic,
  serializeCV,
  signMessageHashRsv,
  someCV,
  tupleCV,
  uintCV
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const creator = accounts.get("wallet_1")!;
const claimer = accounts.get("wallet_2")!;
const relayer = accounts.get("wallet_3")!;
const stranger = accounts.get("wallet_4")!;
const operator = accounts.get("wallet_5")!;
const secondClaimer = accounts.get("wallet_6")!;

const nftName = "xtrata-v3-2-3";
const nftContract = `${deployer}.${nftName}`;
const dropsName = "xtrata-drops-v1-1";
const dropsContract = `${deployer}.${dropsName}`;

const budget = 100_000n;
const REFUND_DELAY = 144n;

const ERR_NOT_AUTHORIZED = 100;
const ERR_NOT_FOUND = 101;
const ERR_INVALID_BUDGET = 105;
const ERR_ALREADY_CLAIMED = 106;
const ERR_REFUND_LOCKED = 109;
const ERR_GROUP_LIMIT = 110;
const ERR_SELF_CLAIM = 111;
const ERR_CAMPAIGN_CLAIM_REQUIRED = 112;
const ERR_CAMPAIGN_LIMIT = 113;
const ERR_BNS_REQUIRED = 114;
const ERR_BNS_LIMIT = 115;
const ERR_INVALID_CAMPAIGN = 116;
const ERR_CAMPAIGN_INACTIVE = 117;
const ERR_SIGNATURE_INVALID = 118;
const ERR_ATTESTATION_EXPIRED = 119;
const ERR_ATTESTER_NOT_CONFIGURED = 120;

const attestorPrivateKey =
  "2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01";
const wrongAttestorPrivateKey =
  "1c83f3b0b8fc8af8c7c4e336f4f9cdf4dbc8f6b8e1f3ebec705fca8d98379e4e01";
const SIMNET_CHAIN_ID = 2_147_483_648n;

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
  if (Array.isArray(value)) return value.map(normalizeValue);
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

function unwrapRecord(result: any) {
  return normalizeValue(cvToValue(unwrapOk(result))) as Record<string, any>;
}

function computeFinalHash(chunksHex: string[]) {
  let running = Buffer.alloc(32, 0);
  for (const chunkHex of chunksHex) {
    const digest = createHash("sha256");
    digest.update(Buffer.concat([running, Buffer.from(chunkHex, "hex")]));
    running = digest.digest();
  }
  return running.toString("hex");
}

function bnsKey(name: string) {
  return createHash("sha256").update(name.trim().toLowerCase()).digest("hex");
}

let mintNonce = 0;
function mintToken(owner: string) {
  const chunkHex = (0x1000 + mintNonce++).toString(16).padStart(4, "0");
  const hash = computeFinalHash([chunkHex]);
  unwrapOk(
    simnet.callPublicFn(
      nftContract,
      "begin-inscription",
      [Cl.bufferFromHex(hash), Cl.stringAscii("text/plain"), Cl.uint(2), Cl.uint(1)],
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
  return unwrapUInt(
    unwrapOk(
      simnet.callPublicFn(
        nftContract,
        "seal-inscription",
        [Cl.bufferFromHex(hash), Cl.stringAscii("data:text/plain,drops-v1-1")],
        owner
      ).result
    )
  );
}

function stxBalance(who: string) {
  return simnet.getAssetsMap().get("STX")?.get(who) ?? 0n;
}

function nftOwner(tokenId: bigint) {
  const result = simnet.callReadOnlyFn(
    nftContract,
    "get-owner",
    [Cl.uint(tokenId)],
    deployer
  ).result;
  const inner = unwrapOk(result);
  if (inner.type === ClarityType.OptionalNone) return null;
  return normalizeValue(cvToValue(inner.value));
}

function setSponsor(who: string) {
  return unwrapOk(
    simnet.callPublicFn(dropsName, "set-sponsor", [Cl.standardPrincipal(who)], deployer).result
  );
}

function setAttestor(privateKey: string | null = attestorPrivateKey) {
  const value = privateKey === null
    ? Cl.none()
    : Cl.some(
        Cl.buffer(
          Uint8Array.from(
            hash160(Uint8Array.from(Buffer.from(privateKeyToPublic(privateKey), "hex")))
          )
        )
      );
  return unwrapOk(
    simnet.callPublicFn(
      dropsName,
      "set-bns-attestor-pubkey-hash",
      [value],
      deployer
    ).result
  );
}

function createCampaign(
  owner = creator,
  maxSupply = 1024n,
  onePerWallet = true,
  requireBns = true,
  onePerBns = true
) {
  return simnet.callPublicFn(
    dropsName,
    "create-campaign",
    [
      Cl.uint(77),
      Cl.uint(maxSupply),
      Cl.bool(onePerWallet),
      Cl.bool(requireBns),
      Cl.bool(onePerBns)
    ],
    owner
  ).result;
}

function setOperator(campaignId: bigint, who: string, allowed = true, sender = creator) {
  return simnet.callPublicFn(
    dropsName,
    "set-campaign-operator",
    [Cl.uint(campaignId), Cl.standardPrincipal(who), Cl.bool(allowed)],
    sender
  ).result;
}

function setCampaignActive(campaignId: bigint, active: boolean, sender = creator) {
  return simnet.callPublicFn(
    dropsName,
    "set-campaign-active",
    [Cl.uint(campaignId), Cl.bool(active)],
    sender
  ).result;
}

function createCampaignDrop(
  owner: string,
  tokenId: bigint,
  campaignId: bigint,
  feeBudget = budget
) {
  return simnet.callPublicFn(
    dropsName,
    "create-campaign-drop",
    [
      Cl.contractPrincipal(deployer, nftName),
      Cl.uint(tokenId),
      Cl.uint(feeBudget),
      Cl.uint(campaignId)
    ],
    owner
  ).result;
}

function createLegacyDrop(owner: string, tokenId: bigint, groupId = 0n) {
  return simnet.callPublicFn(
    dropsName,
    "create-drop",
    [Cl.contractPrincipal(deployer, nftName), Cl.uint(tokenId), Cl.uint(budget), Cl.uint(groupId)],
    owner
  ).result;
}

function signClaimAttestation(params: {
  campaignId: bigint;
  dropId: bigint;
  claimer: string;
  name: string | null;
  expiresAt: bigint;
  privateKey?: string;
}) {
  const keyCV = params.name === null
    ? noneCV()
    : someCV(Cl.bufferFromHex(bnsKey(params.name)));
  const payload = tupleCV({
    "bns-key": keyCV,
    "campaign-id": uintCV(params.campaignId),
    "chain-id": uintCV(SIMNET_CHAIN_ID),
    claimer: principalCV(params.claimer),
    contract: contractPrincipalCV(deployer, dropsName),
    "drop-id": uintCV(params.dropId),
    "expires-at": uintCV(params.expiresAt)
  });
  const serialized = serializeCV(payload);
  if (typeof serialized !== "string") {
    throw new Error("serializeCV returned an unexpected payload type");
  }
  const serializedHex = serialized.replace(/^0x/i, "");
  const digest = createHash("sha256").update(Buffer.from(serializedHex, "hex")).digest();
  return signMessageHashRsv({
    messageHash: digest,
    privateKey: params.privateKey ?? attestorPrivateKey
  });
}

function campaignClaim(
  sender: string,
  dropId: bigint,
  name: string | null,
  options: {
    campaignId?: bigint;
    expiresAt?: bigint;
    privateKey?: string;
    signedDropId?: bigint;
    signedClaimer?: string;
    signedName?: string | null;
  } = {}
) {
  const campaignId = options.campaignId ?? (getDrop(dropId)?.["campaign-id"] as bigint);
  const expiresAt = options.expiresAt ?? 10_000n;
  const signature = signClaimAttestation({
    campaignId,
    dropId: options.signedDropId ?? dropId,
    claimer: options.signedClaimer ?? sender,
    name: options.signedName === undefined ? name : options.signedName,
    expiresAt,
    privateKey: options.privateKey
  });
  return simnet.callPublicFn(
    dropsName,
    "claim-campaign",
    [
      Cl.contractPrincipal(deployer, nftName),
      Cl.uint(dropId),
      name === null ? Cl.none() : Cl.some(Cl.bufferFromHex(bnsKey(name))),
      Cl.uint(expiresAt),
      Cl.bufferFromHex(signature)
    ],
    sender
  ).result;
}

function legacyClaim(sender: string, dropId: bigint) {
  return simnet.callPublicFn(
    dropsName,
    "claim",
    [Cl.contractPrincipal(deployer, nftName), Cl.uint(dropId)],
    sender
  ).result;
}

function cancel(sender: string, dropId: bigint) {
  return simnet.callPublicFn(
    dropsName,
    "cancel",
    [Cl.contractPrincipal(deployer, nftName), Cl.uint(dropId)],
    sender
  ).result;
}

function getCampaign(campaignId: bigint) {
  const result = simnet.callReadOnlyFn(
    dropsName,
    "get-campaign",
    [Cl.uint(campaignId)],
    deployer
  ).result;
  if (result.type === ClarityType.OptionalNone) return null;
  expect(result.type).toBe(ClarityType.OptionalSome);
  return normalizeValue(cvToValue(result.value)) as Record<string, any>;
}

function getDrop(dropId: bigint) {
  const result = simnet.callReadOnlyFn(
    dropsName,
    "get-drop",
    [Cl.uint(dropId)],
    deployer
  ).result;
  if (result.type === ClarityType.OptionalNone) return null;
  expect(result.type).toBe(ClarityType.OptionalSome);
  return normalizeValue(cvToValue(result.value)) as Record<string, any>;
}

function setup() {
  unwrapOk(
    simnet.callPublicFn(nftContract, "set-paused", [Cl.bool(false)], deployer).result
  );
  setSponsor(relayer);
  setAttestor();
}

describe("xtrata-drops-v1.1 campaigns", () => {
  it("creates one immutable campaign policy for a 1,024-item collection", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    expect(campaignId).toBe(0n);
    expect(getCampaign(campaignId)).toMatchObject({
      creator,
      "engine-id": 77n,
      "max-supply": 1024n,
      "drops-created": 0n,
      "one-per-wallet": true,
      "require-bns": true,
      "one-per-bns": true,
      active: true
    });
    expectErr(createCampaign(creator, 0n), ERR_INVALID_CAMPAIGN);
    expectErr(createCampaign(creator, 10_001n), ERR_INVALID_CAMPAIGN);
    expectErr(createCampaign(creator, 10n, true, false, true), ERR_INVALID_CAMPAIGN);
  });

  it("allows only the creator to authorise and pause campaign operators", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    expectErr(setOperator(campaignId, operator, true, stranger), ERR_NOT_AUTHORIZED);
    unwrapOk(setOperator(campaignId, operator));
    expect(
      simnet.callReadOnlyFn(
        dropsName,
        "is-campaign-operator",
        [Cl.uint(campaignId), Cl.standardPrincipal(operator)],
        deployer
      ).result
    ).toBeOk(Cl.bool(true));
    expectErr(setCampaignActive(campaignId, false, stranger), ERR_NOT_AUTHORIZED);
    unwrapOk(setCampaignActive(campaignId, false));
    expect(getCampaign(campaignId)!.active).toBe(false);
  });

  it("keeps a permanent creator while an authorised Wizard wallet funds each drop", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    unwrapOk(setOperator(campaignId, operator));
    const tokenId = mintToken(operator);
    const before = stxBalance(operator);
    const created = unwrapRecord(createCampaignDrop(operator, tokenId, campaignId));
    expect(created).toEqual({ "drop-id": 0n, edition: 0n });
    expect(stxBalance(operator)).toBe(before - budget);
    expect(nftOwner(tokenId)).toBe(dropsContract);
    expect(getDrop(0n)).toMatchObject({
      creator,
      funder: operator,
      "campaign-id": campaignId,
      "group-id": campaignId,
      edition: 0n
    });

    const unapprovedToken = mintToken(stranger);
    expectErr(
      createCampaignDrop(stranger, unapprovedToken, campaignId),
      ERR_NOT_AUTHORIZED
    );
    expectErr(
      createCampaignDrop(operator, mintToken(operator), campaignId, 49_999n),
      ERR_INVALID_BUDGET
    );
  });

  it("assigns one campaign and sequential editions across the 32-item batch boundary", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const dropIds: bigint[] = [];
    for (let edition = 0; edition <= 32; edition += 1) {
      const tokenId = mintToken(creator);
      const created = unwrapRecord(createCampaignDrop(creator, tokenId, campaignId));
      expect(created.edition).toBe(BigInt(edition));
      dropIds.push(created["drop-id"]);
    }
    expect(getDrop(dropIds[0])).toMatchObject({ "campaign-id": campaignId, edition: 0n });
    expect(getDrop(dropIds[32])).toMatchObject({ "campaign-id": campaignId, edition: 32n });

    unwrapOk(campaignClaim(claimer, dropIds[0], "alice.btc"));
    expectErr(
      campaignClaim(claimer, dropIds[32], "alice-second.btc"),
      ERR_GROUP_LIMIT
    );
    unwrapOk(campaignClaim(stranger, dropIds[32], "bob.btc"));
  });

  it("rejects legacy bypasses, invalid attestations and missing BNS identities", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const tokenId = mintToken(creator);
    const { "drop-id": dropId } = unwrapRecord(
      createCampaignDrop(creator, tokenId, campaignId)
    );
    expectErr(legacyClaim(claimer, dropId), ERR_CAMPAIGN_CLAIM_REQUIRED);
    expectErr(
      campaignClaim(claimer, dropId, "alice.btc", { privateKey: wrongAttestorPrivateKey }),
      ERR_SIGNATURE_INVALID
    );
    expectErr(campaignClaim(claimer, dropId, null), ERR_BNS_REQUIRED);
    expectErr(
      campaignClaim(claimer, dropId, "alice.btc", { expiresAt: 0n }),
      ERR_ATTESTATION_EXPIRED
    );
    setAttestor(null);
    expectErr(campaignClaim(claimer, dropId, "alice.btc"), ERR_ATTESTER_NOT_CONFIGURED);
    expect(nftOwner(tokenId)).toBe(dropsContract);
  });

  it("binds each BNS attestation to its campaign, drop, claimant and BNS key", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const firstDrop = unwrapRecord(
      createCampaignDrop(creator, mintToken(creator), campaignId)
    )["drop-id"];
    const secondDrop = unwrapRecord(
      createCampaignDrop(creator, mintToken(creator), campaignId)
    )["drop-id"];

    expectErr(
      campaignClaim(claimer, firstDrop, "alice.btc", { signedDropId: secondDrop }),
      ERR_SIGNATURE_INVALID
    );
    expectErr(
      campaignClaim(claimer, firstDrop, "alice.btc", { signedClaimer: stranger }),
      ERR_SIGNATURE_INVALID
    );
    expectErr(
      campaignClaim(claimer, firstDrop, "alice.btc", { signedName: "bob.btc" }),
      ERR_SIGNATURE_INVALID
    );
    expectErr(
      campaignClaim(claimer, firstDrop, "alice.btc", { campaignId: campaignId + 1n }),
      ERR_SIGNATURE_INVALID
    );
    unwrapOk(campaignClaim(claimer, firstDrop, "alice.btc"));
  });

  it("records successful wallet and BNS claims on-chain atomically", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const tokenId = mintToken(creator);
    const { "drop-id": dropId } = unwrapRecord(
      createCampaignDrop(creator, tokenId, campaignId)
    );
    unwrapOk(campaignClaim(claimer, dropId, "Alice.BTC"));
    expect(nftOwner(tokenId)).toBe(claimer);
    expect(getDrop(dropId)).toMatchObject({ claimer, "claimed-at": expect.any(BigInt) });
    expect(
      simnet.callReadOnlyFn(
        dropsName,
        "has-claimed-campaign-wallet",
        [Cl.uint(campaignId), Cl.standardPrincipal(claimer)],
        deployer
      ).result
    ).toBeOk(Cl.bool(true));
    expect(
      simnet.callReadOnlyFn(
        dropsName,
        "has-claimed-campaign-bns",
        [Cl.uint(campaignId), Cl.bufferFromHex(bnsKey("alice.btc"))],
        deployer
      ).result
    ).toBeOk(Cl.bool(true));
  });

  it("enforces one claim per wallet even when a wallet presents another BNS name", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const d1 = unwrapRecord(createCampaignDrop(creator, mintToken(creator), campaignId))["drop-id"];
    const d2 = unwrapRecord(createCampaignDrop(creator, mintToken(creator), campaignId))["drop-id"];
    unwrapOk(campaignClaim(claimer, d1, "alice.btc"));
    expectErr(campaignClaim(claimer, d2, "alice-alt.btc"), ERR_GROUP_LIMIT);
    expect(getDrop(d2)!["claimed-at"]).toBe(null);
  });

  it("enforces one claim per BNS name even after it is presented by another wallet", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const d1 = unwrapRecord(createCampaignDrop(creator, mintToken(creator), campaignId))["drop-id"];
    const d2 = unwrapRecord(createCampaignDrop(creator, mintToken(creator), campaignId))["drop-id"];
    unwrapOk(campaignClaim(claimer, d1, "shared.btc"));
    expectErr(campaignClaim(secondClaimer, d2, "shared.btc"), ERR_BNS_LIMIT);
    expect(getDrop(d2)!["claimed-at"]).toBe(null);
  });

  it("scopes wallet and BNS claim records to one campaign", () => {
    setup();
    const first = unwrapUInt(unwrapOk(createCampaign()));
    const second = unwrapUInt(unwrapOk(createCampaign()));
    const firstDrop = unwrapRecord(createCampaignDrop(creator, mintToken(creator), first))["drop-id"];
    const secondDrop = unwrapRecord(createCampaignDrop(creator, mintToken(creator), second))["drop-id"];
    unwrapOk(campaignClaim(claimer, firstDrop, "alice.btc"));
    unwrapOk(campaignClaim(claimer, secondDrop, "alice.btc"));
  });

  it("enforces campaign supply and active state", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign(creator, 2n)));
    unwrapOk(createCampaignDrop(creator, mintToken(creator), campaignId));
    const second = unwrapRecord(
      createCampaignDrop(creator, mintToken(creator), campaignId)
    )["drop-id"];
    expectErr(
      createCampaignDrop(creator, mintToken(creator), campaignId),
      ERR_CAMPAIGN_LIMIT
    );

    unwrapOk(setCampaignActive(campaignId, false));
    expectErr(campaignClaim(claimer, second, "alice.btc"), ERR_CAMPAIGN_INACTIVE);
    unwrapOk(setCampaignActive(campaignId, true));
    unwrapOk(campaignClaim(claimer, second, "alice.btc"));
  });

  it("returns an operator-funded campaign drop and budget only to the permanent creator", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    unwrapOk(setOperator(campaignId, operator));
    const tokenId = mintToken(operator);
    const { "drop-id": dropId } = unwrapRecord(
      createCampaignDrop(operator, tokenId, campaignId)
    );
    expectErr(cancel(operator, dropId), ERR_NOT_AUTHORIZED);
    const creatorBefore = stxBalance(creator);
    unwrapOk(cancel(creator, dropId));
    expect(stxBalance(creator)).toBe(creatorBefore + budget);
    expect(nftOwner(tokenId)).toBe(creator);
    expect(getDrop(dropId)).toBe(null);
  });

  it("preserves legacy create, claim and relayer listing compatibility", () => {
    setup();
    const tokenId = mintToken(creator);
    const dropId = unwrapUInt(unwrapOk(createLegacyDrop(creator, tokenId, 55n)));
    unwrapOk(legacyClaim(claimer, dropId));
    expect(nftOwner(tokenId)).toBe(claimer);
    const listingResult = simnet.callReadOnlyFn(
      dropsName,
      "get-listing",
      [Cl.uint(dropId)],
      deployer
    ).result;
    expect(listingResult.type).toBe(ClarityType.OptionalSome);
    const listing = normalizeValue(cvToValue(listingResult.value));
    expect(listing).toMatchObject({
      seller: creator,
      "nft-contract": nftContract,
      "token-id": tokenId,
      price: 0n,
      buyer: claimer
    });
  });

  it("retains sponsor settlement and creator escape-hatch semantics", () => {
    setup();
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const firstDrop = unwrapRecord(
      createCampaignDrop(creator, mintToken(creator), campaignId)
    )["drop-id"];
    unwrapOk(campaignClaim(claimer, firstDrop, "alice.btc"));
    unwrapOk(
      simnet.callPublicFn(dropsName, "claim-fee", [Cl.uint(firstDrop), Cl.uint(30_000)], relayer)
        .result
    );
    const before = stxBalance(creator);
    unwrapOk(simnet.callPublicFn(dropsName, "settle-refund", [Cl.uint(firstDrop)], relayer).result);
    expect(stxBalance(creator)).toBe(before + budget - 30_000n);

    const secondCampaign = unwrapUInt(unwrapOk(createCampaign()));
    const secondDrop = unwrapRecord(
      createCampaignDrop(creator, mintToken(creator), secondCampaign)
    )["drop-id"];
    unwrapOk(campaignClaim(secondClaimer, secondDrop, "bob.btc"));
    expectErr(
      simnet.callPublicFn(dropsName, "settle-refund", [Cl.uint(secondDrop)], creator).result,
      ERR_REFUND_LOCKED
    );
    simnet.mineEmptyBlocks(Number(REFUND_DELAY));
    unwrapOk(
      simnet.callPublicFn(dropsName, "settle-refund", [Cl.uint(secondDrop)], creator).result
    );
  });

  it("rejects missing campaigns and creator self-claims", () => {
    setup();
    const tokenId = mintToken(creator);
    expectErr(createCampaignDrop(creator, tokenId, 999n), ERR_NOT_FOUND);
    const campaignId = unwrapUInt(unwrapOk(createCampaign()));
    const dropId = unwrapRecord(createCampaignDrop(creator, tokenId, campaignId))["drop-id"];
    expectErr(campaignClaim(creator, dropId, "creator.btc"), ERR_SELF_CLAIM);
    expect(nftOwner(tokenId)).toBe(dropsContract);
  });
});
