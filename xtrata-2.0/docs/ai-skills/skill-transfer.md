---
name: xtrata-transfer
description: >
  Teach any AI agent to transfer Xtrata inscriptions (SIP-009 NFTs) between
  Stacks wallets, including ownership verification, escrowed Forever Twin
  detection, and post-transfer confirmation. Single-item minting is
  `skill-inscribe.md`; reading state is `skill-query.md`.
version: "1.0"
contract: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
---

> ## ⚠️ Contract version: read this before following anything below
>
> **The live core is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.**
>
> This document still carries `xtrata-v2-1-0` in its header, examples and API
> tables. **Those references are stale. Ignore them.** They are not a second
> supported option and not a "legacy but still fine" path — v2-1-0 is
> superseded. Mint, seal, transfer and query against `xtrata-v3-2-3`.
>
> **The only legitimate use of an old core is migration.** To move an
> inscription you already own from v2 to v3, call `migrate-from-v2-1-0` (or
> `migrate-from-v1`) **on `xtrata-v3-2-3`**. You never send a transaction to
> the old contract yourself; the new core pulls the token across. Anything
> else that asks you to target v2-1-0 or v1-1-1 directly is wrong.
>
> **Why this matters beyond tidiness.** An inscription minted into v2-1-0 today
> lands in a superseded contract. The marketplace contracts that accept v2-1-0
> (`xtrata-market-{stx,sbtc,usdc}-v1-0`) weld that core in at deploy time and
> cannot be changed, and the markets that accept v3 will not take a v2 token.
> Picking the wrong core strands the asset on the wrong side of that line.
>
> The shapes below (chunking, hashing, post-conditions, the staged
> begin/upload/seal flow) are still correct. Only the contract name is wrong.
> v3-2-3 additionally offers `mint-single-tx` for anything up to 32 chunks,
> which is the preferred route for most single files.


# Xtrata Transfer Skill

## 1. Scope

This skill moves an existing, sealed inscription from one wallet to another.
It does not mint (see [`skill-inscribe.md`](skill-inscribe.md)) and does not
cover market listings — a listed token is escrowed by the market contract and
must be cancelled or bought, not transferred.

## 2. Contract Reference

| Key | Value |
|-----|-------|
| Contract | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0` |
| Function | `transfer (id uint) (sender principal) (recipient principal)` |
| Returns | `(response bool uint)` |
| Fee | No protocol fee; only the miner fee |
| Paused behaviour | `transfer` keeps working while the contract is paused |

Network endpoints:
- Mainnet: `https://stacks-node-api.mainnet.stacks.co`
- Fallback: `https://api.mainnet.hiro.so`

## 3. Preconditions (check ALL before signing)

1. **Token exists and is sealed** — `inscription-exists(id)` and
   `is-inscription-sealed(id)` must both be true.
2. **Sender owns the token** — `get-owner(id)` must equal the sender
   principal. `tx-sender` must be the sender; you cannot transfer on
   someone else's behalf.
3. **Not escrowed** — if `get-owner(id)` is a *contract* principal (market
   escrow, or a Forever Twin helper such as
   `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`), the token
   cannot be transferred by the apparent holder. For twins, the real owner is
   the holder of the source NFT; the twin must be released via the helper's
   swap function first.
4. **Valid recipient** — a standard Stacks address on the same network.
   Warn the user before sending to a contract principal.

## 4. Transaction Construction

```javascript
import {
  AnchorMode, PostConditionMode, makeContractCall,
  uintCV, principalCV,
  makeStandardNonFungiblePostCondition, NonFungibleConditionCode,
  createAssetInfo, tupleCV
} from '@stacks/transactions';

async function buildTransferTx({ tokenId, sender, recipient, senderKey, network }) {
  return makeContractCall({
    contractAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xtrata-v2-1-0',
    functionName: 'transfer',
    functionArgs: [uintCV(tokenId), principalCV(sender), principalCV(recipient)],
    senderKey,
    network,
    postConditions: [
      makeStandardNonFungiblePostCondition(
        sender,
        NonFungibleConditionCode.Sends,
        createAssetInfo(
          'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
          'xtrata-v2-1-0',
          'xtrata-inscription'
        ),
        uintCV(tokenId)
      )
    ],
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any
  });
}
```

Deny mode + the NFT `Sends` post condition guarantees exactly this token
leaves the sender's wallet and nothing else.

## 5. Confirmation Gate

Before broadcasting, show the user and require explicit confirmation:

```
Transfer inscription #<id> (<mime>, <size> bytes)
From:  <sender>
To:    <recipient>
Network fee: ~<fee> STX (no protocol fee)
```

## 6. Post-Transfer Verification

Poll the tx until `success`, then re-read `get-owner(id)` and confirm it now
returns the recipient. Report the txid and the explorer link.

## 7. Common Errors

| Error | Meaning | Action |
|---|---|---|
| `u100 ERR_NOT_AUTHORIZED` | `tx-sender` is not the owner/sender | Re-check `get-owner`; token may be escrowed |
| `u101 ERR_NOT_FOUND` | Token id does not exist | Verify the id with `get-last-token-id` |
| Post-condition failure | Wallet blocked an unexpected asset move | Rebuild with the exact token id and sender |
